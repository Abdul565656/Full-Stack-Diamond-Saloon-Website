// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/app/models/bookingModel';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('CRITICAL: STRIPE_SECRET_KEY is not set in environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2023-10-16' as any, // Or '2024-04-10'
  });

const BOOKING_AMOUNT_CENTS = 5000;

export async function POST(req: Request) {
  console.log("API /api/create-payment-intent POST request received.");
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { name, email, date, message: userMessage } = await req.json();

    if (!name || !email || !date) {
      console.warn("API Validation Error (create-payment-intent): Name, email, or date missing.");
      return NextResponse.json({ error: "Name, email, and date are required." }, { status: 400 });
    }

    await dbConnect();
    console.log("Database connected successfully for payment intent.");

    const newBooking = new Booking({
      name,
      email,
      date: new Date(date),
      message: userMessage,
      amount: BOOKING_AMOUNT_CENTS,
      paymentStatus: 'pending',
    });
    await newBooking.save();
    console.log("Pending booking created with ID:", newBooking._id.toString());

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: BOOKING_AMOUNT_CENTS,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
            bookingId: newBooking._id.toString(),
            customerEmail: email,
            customerName: name,
        },
    };
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    newBooking.stripePaymentIntentId = paymentIntent.id;
    await newBooking.save();
    console.log("Payment Intent created:", paymentIntent.id, "for booking:", newBooking._id.toString());

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: newBooking._id.toString(),
    });

  } catch (error) {
    const errAsStripeError = error as Stripe.StripeRawError; // Type assertion for Stripe errors
    const errAsError = error as Error; // General error

    console.error(
        "API Error in POST /api/create-payment-intent:",
        errAsStripeError.message || errAsError.message,
        errAsError.stack
    );

    if (errAsStripeError.type && typeof errAsStripeError.type === 'string' && errAsStripeError.type.startsWith('Stripe')) {
        console.error("Stripe Error (create-payment-intent):", errAsStripeError.message);
        return NextResponse.json(
            { error: "Payment processing error.", details: errAsStripeError.message },
            { status: errAsStripeError.statusCode || 400 }
        );
    }
    return NextResponse.json(
      { error: "Failed to create payment intent.", details: errAsError.message || "Unknown server error" },
      { status: 500 }
    );
  }
}