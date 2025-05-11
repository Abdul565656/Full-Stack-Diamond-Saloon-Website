// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/app/models/bookingModel';
import sgMail from '@sendgrid/mail';
import { headers } from 'next/headers';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('CRITICAL (Webhook): Stripe API keys or webhook secret are not set.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2023-10-16' as any, // Or '2024-04-10'
  });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("SendGrid API Key configured for webhook.");
} else {
    console.error("CRITICAL (Webhook): SENDGRID_API_KEY is not set. Email sending will fail.");
}
if (!process.env.SENDER_EMAIL || !process.env.ADMIN_EMAIL) {
    console.error("CRITICAL (Webhook): SENDER_EMAIL or ADMIN_EMAIL not set. Email sending will fail.");
}

export async function POST(req: Request) {
  const sigHeader = headers().get('stripe-signature');
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    if (!sigHeader) {
        console.error("Webhook error: Missing Stripe signature header.");
        return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(rawBody, sigHeader, endpointSecret);
    console.log("Webhook event constructed successfully:", event.type, event.id);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`, error);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntentSucceeded.id} was successful! Amount: ${paymentIntentSucceeded.amount}`);
      console.log("Metadata from succeeded PI:", paymentIntentSucceeded.metadata);

      const bookingId = paymentIntentSucceeded.metadata.bookingId;
      if (!bookingId) {
        console.error("Webhook error: bookingId missing from PI metadata:", paymentIntentSucceeded.id);
        return NextResponse.json({ error: 'Booking ID missing in metadata' }, { status: 400 });
      }

      try {
        await dbConnect();
        const booking = await Booking.findById(bookingId);

        if (!booking) {
          console.error(`Webhook error: Booking not found: ${bookingId} for PI: ${paymentIntentSucceeded.id}`);
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.paymentStatus === 'succeeded') {
            console.log(`Webhook info: Booking ${bookingId} already succeeded. PI: ${paymentIntentSucceeded.id}`);
            return NextResponse.json({ received: true, message: "Already processed." });
        }

        booking.paymentStatus = 'succeeded';
        if (!booking.stripePaymentIntentId) {
            booking.stripePaymentIntentId = paymentIntentSucceeded.id;
        }
        await booking.save();
        console.log(`Booking ${bookingId} updated to paymentStatus: succeeded.`);

        if (!process.env.SENDER_EMAIL || !process.env.ADMIN_EMAIL || !process.env.SENDGRID_API_KEY) {
            console.error("Webhook Critical Error: Email config missing for booking:", bookingId);
            return NextResponse.json({ received: true, email_error: "Email config missing, booking confirmed but email not sent." });
        }

        const userEmailMsg = {
            to: booking.email,
            from: { email: process.env.SENDER_EMAIL, name: 'Diamond Salon Bookings' },
            subject: `Your Booking Confirmation - ${booking.name}`,
            html: `<h1>Booking Confirmed!</h1><p>Hi ${booking.name},</p><p>Thank you for your payment. Your appointment is confirmed:</p><p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p><p><strong>Time:</strong> ${new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>${booking.message ? `<p><strong>Your message:</strong> ${booking.message}</p>` : ''}<p>We look forward to seeing you!</p><p>Thanks,<br/>The Diamond Salon Team</p>`,
        };
        const adminEmailMsg = {
            to: process.env.ADMIN_EMAIL,
            from: { email: process.env.SENDER_EMAIL, name: 'Diamond Salon System' },
            subject: `[PAID] New Booking: ${booking.name}`,
            html: `<h1>New PAID Booking</h1><ul><li>Name: ${booking.name}</li><li>Email: ${booking.email}</li><li>Date: ${new Date(booking.date).toLocaleString()}</li>${booking.message ? `<li>Message: ${booking.message}</li>` : ''}<li>PI ID: ${paymentIntentSucceeded.id}</li><li>Booking ID: ${booking._id.toString()}</li></ul>`,
        };

        try {
            await Promise.all([
                sgMail.send(userEmailMsg).then(() => console.log(`Webhook: User email sent: ${booking.email}, booking ${bookingId}`)),
                sgMail.send(adminEmailMsg).then(() => console.log(`Webhook: Admin email sent for booking ${bookingId}`))
            ]);
            console.log("Webhook: Emails dispatched for booking:", bookingId);
        } catch (emailError) {
            const err = emailError as any; // For SendGrid's specific error structure
            const details = err.response?.body?.errors?.map((e: {message: string}) => e.message).join(', ') || (err instanceof Error ? err.message : "Unknown SendGrid error");
            console.error("Webhook: SendGrid Error for booking " + bookingId + ":", details);
            return NextResponse.json({ received: true, email_dispatch_error: "Failed to send emails, booking confirmed." });
        }

      } catch (dbError) {
        const error = dbError as Error;
        console.error(`Webhook dbError for bookingId ${bookingId} (PI: ${paymentIntentSucceeded.id}):`, error.message, error.stack);
        return NextResponse.json({ error: 'Database error processing webhook' }, { status: 500 });
      }
      break;

    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntentFailed.id} failed. Reason: ${paymentIntentFailed.last_payment_error?.message}`);
      const failedBookingId = paymentIntentFailed.metadata.bookingId;
      if (failedBookingId) {
        try {
            await dbConnect();
            const updatedBooking = await Booking.findOneAndUpdate(
                { _id: failedBookingId, stripePaymentIntentId: paymentIntentFailed.id },
                { $set: { paymentStatus: 'failed' }},
                { new: true }
            );
            if (updatedBooking) {
                console.log(`Booking ${failedBookingId} updated to paymentStatus: failed.`);
            } else {
                console.log(`Booking ${failedBookingId} not found or PI ID mismatch for failed payment.`);
            }
        } catch (dbErr) {
            const error = dbErr as Error;
            console.error(`Webhook dbError for failed PI ${paymentIntentFailed.id}, booking ${failedBookingId}:`, error.message);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type} (ID: ${event.id})`);
  }

  return NextResponse.json({ received: true });
}