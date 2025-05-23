// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe'; // Main Stripe import
import { dbConnect } from '@/lib/mongodb'; // Adjust path
import Booking from '@/app/models/bookingModel'; // Adjust path
import sgMail from '@sendgrid/mail';
import { headers } from 'next/headers'; // For reading raw body in App Router

// Define a more specific type for SendGrid errors (can be in a shared types file)
interface SendGridError extends Error {
    response?: {
        body?: {
            errors?: Array<{ message: string; field?: string | null; help?: string | null }>;
        };
    };
}

// Ensure Stripe secret and webhook secret are loaded
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('CRITICAL: Stripe API keys or webhook secret are not set in environment variables.');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // FIX 1: Use the apiVersion string that your installed TypeScript types expect.
    // The error message indicates it expects "2025-04-30.basil".
    // If this is not your intended API version, review your 'stripe' package version.
    // For example, a common stable version is '2024-04-10'.
    apiVersion: '2025-04-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Configure SendGrid (ensure API key, sender, and admin emails are set)
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
    const rawBody = await req.text(); // Read the raw request body
    if (!sigHeader) {
        console.error("Webhook error: Missing Stripe signature header.");
        return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(rawBody, sigHeader, endpointSecret);
    console.log("Webhook event constructed successfully:", event.type, event.id);
  } catch (errCaught: unknown) {
    // FIX 2: Use Stripe.StripeRawError as suggested by the TypeScript error,
    // or Stripe.Error for a more general base Stripe error.
    const err = errCaught as Stripe.StripeRawError;
    console.error(`Webhook signature verification failed: ${err.message}`, err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntentSucceeded.id} was successful! Amount: ${paymentIntentSucceeded.amount}`);
      console.log("Metadata from succeeded PI:", paymentIntentSucceeded.metadata);

      const bookingId = paymentIntentSucceeded.metadata.bookingId;
      if (!bookingId) {
        console.error("Webhook error: bookingId missing from PaymentIntent metadata for PI:", paymentIntentSucceeded.id);
        return NextResponse.json({ error: 'Booking ID missing in metadata' }, { status: 400 });
      }

      try {
        await dbConnect();
        const booking = await Booking.findById(bookingId);

        if (!booking) {
          console.error(`Webhook error: Booking not found with ID: ${bookingId} for PI: ${paymentIntentSucceeded.id}`);
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.paymentStatus === 'succeeded') {
            console.log(`Webhook info: Booking ${bookingId} already marked as succeeded. Ignoring duplicate event for PI: ${paymentIntentSucceeded.id}`);
            return NextResponse.json({ received: true, message: "Already processed." });
        }

        booking.paymentStatus = 'succeeded';
        if (!booking.stripePaymentIntentId) {
            booking.stripePaymentIntentId = paymentIntentSucceeded.id;
        }
        await booking.save();
        console.log(`Booking ${bookingId} updated to paymentStatus: succeeded.`);

        if (!process.env.SENDER_EMAIL || !process.env.ADMIN_EMAIL || !process.env.SENDGRID_API_KEY) {
            console.error("Webhook Critical Error: Email configuration (sender, admin, or SendGrid key) missing. Cannot send confirmation emails for booking:", bookingId);
            return NextResponse.json({ received: true, email_error: "Email config missing, booking confirmed but email not sent." });
        }

        const userEmailMsg = {
            to: booking.email,
            from: { email: process.env.SENDER_EMAIL!, name: 'Diamond Salon Bookings' },
            subject: `Your Booking Confirmation - ${booking.name}`,
            html: `<h1>Booking Confirmed!</h1><p>Hi ${booking.name},</p><p>Thank you for booking your appointment and completing your payment with Diamond Salon.</p><p>Your appointment is scheduled for: <strong>${new Date(booking.date).toLocaleDateString()} at ${new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>${booking.message ? `<p><strong>Your message:</strong> ${booking.message}</p>` : ''}<p>We look forward to seeing you!</p><br/><p>Thanks,<br/>The Diamond Salon Team</p>`,
        };
        const adminEmailMsg = {
            to: process.env.ADMIN_EMAIL!,
            from: { email: process.env.SENDER_EMAIL!, name: 'Diamond Salon System' },
            subject: `[PAID] New Booking Received: ${booking.name}`,
            html: `<h1>New PAID Booking Notification</h1><p>A new booking has been made and paid for:</p><ul><li><strong>Name:</strong> ${booking.name}</li><li><strong>Email:</strong> ${booking.email}</li><li><strong>Date & Time:</strong> ${new Date(booking.date).toLocaleString()}</li>${booking.message ? `<li><strong>Client's Message:</strong> ${booking.message}</li>` : ''}<li><strong>Payment Intent ID:</strong> ${paymentIntentSucceeded.id}</li><li><strong>Booking ID:</strong> ${booking._id.toString()}</li></ul><p>Please check the system for details.</p>`,
        };

        try {
            await Promise.all([
                sgMail.send(userEmailMsg).then(() => console.log(`Webhook: User confirmation email sent to: ${booking.email} for booking ${bookingId}`)),
                sgMail.send(adminEmailMsg).then(() => console.log(`Webhook: Admin notification email sent for booking ${bookingId}`))
            ]);
            console.log("Webhook: Emails dispatched successfully for booking:", bookingId);
        } catch (emailErrorCaught: unknown) {
            const emailError = emailErrorCaught as SendGridError;
            console.error("Webhook: SendGrid API Error while sending confirmation emails for booking " + bookingId + ":", emailError.response?.body?.errors || emailError.message);
            return NextResponse.json({ received: true, email_dispatch_error: "Failed to send emails, but booking confirmed." });
        }

      } catch (dbErrorCaught: unknown) {
        if (dbErrorCaught instanceof Error) {
            console.error(`Webhook dbError processing successful payment for bookingId ${bookingId} (PI: ${paymentIntentSucceeded.id}):`, dbErrorCaught.message, dbErrorCaught.stack);
        } else {
            console.error(`Webhook dbError processing successful payment for bookingId ${bookingId} (PI: ${paymentIntentSucceeded.id}):`, String(dbErrorCaught));
        }
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
                console.log(`Booking ${failedBookingId} not found or PI ID did not match for failed payment.`);
            }
            } catch (dbError: unknown) {
            const errorMessage = dbError instanceof Error ? dbError.message : "Unknown DB error on payment failure";
            console.error(`Webhook dbError updating failed payment for bookingId ${failedBookingId} (PI: ${paymentIntentFailed.id}):`, errorMessage);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type} (ID: ${event.id})`);
  }

  return NextResponse.json({ received: true });
}