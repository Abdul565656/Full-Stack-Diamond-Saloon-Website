// app/api/book/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/app/models/bookingModel';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("SendGrid API Key configured for /api/book.");
} else {
    console.error("CRITICAL (/api/book): SENDGRID_API_KEY is not set. Email sending will fail.");
}

export async function POST(req: Request) {
    console.log("API /api/book POST request received.");

    if (!process.env.SENDER_EMAIL || !process.env.ADMIN_EMAIL) {
        console.error("API Error (/api/book): SENDER_EMAIL or ADMIN_EMAIL is not set.");
        return NextResponse.json(
            { error: "Server configuration error: Email sender or admin email not configured." },
            { status: 500 }
        );
    }
    if (!process.env.SENDGRID_API_KEY) {
         console.error("API Error (/api/book): SENDGRID_API_KEY is not set.");
        return NextResponse.json(
            { error: "Server configuration error: Email service API key not configured." },
            { status: 500 }
        );
    }

    let requestBody;
    try {
        requestBody = await req.json();
    } catch (parseError) {
        console.error("API Error (/api/book): Invalid JSON in request body", parseError);
        return NextResponse.json({ error: "Invalid request body. Please send valid JSON." }, { status: 400 });
    }

    const { name, email, date, message: userMessage } = requestBody;

    if (!name || !email || !date) {
        console.warn("API Validation Error (/api/book): Name, email, or date missing.");
        return NextResponse.json({ error: "Name, email, and date are required." }, { status: 400 });
    }

    try {
        await dbConnect();
        console.log("Database connected successfully for /api/book.");

        const newBooking = new Booking({ // This assumes bookingModel doesn't require payment fields for this route
            name,
            email,
            date: new Date(date),
            message: userMessage,
            // If your bookingModel NOW STRICTLY requires 'amount' and 'paymentStatus',
            // you'd need to provide defaults here for this non-payment flow, e.g.:
            // amount: 0,
            // paymentStatus: 'succeeded', // Or 'not_applicable' if you add that to enum
        });

        await newBooking.save();
        console.log("New booking (non-payment) saved to DB:", newBooking._id);

        const userEmailMsg = {
            to: email,
            from: { email: process.env.SENDER_EMAIL!, name: 'Diamond Salon Bookings' },
            subject: `Your Booking Confirmation - ${name}`,
            html: `<h1>Booking Confirmed!</h1><p>Hi ${name},</p><p>Thank you for booking your appointment with Diamond Salon.</p><p>Your appointment is scheduled for: <strong>${new Date(date).toLocaleDateString()} at ${new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>${userMessage ? `<p><strong>Your message:</strong> ${userMessage}</p>` : ''}<p>We look forward to seeing you!</p><br/><p>Thanks,<br/>The Diamond Salon Team</p>`,
        };
        const adminEmailMsg = {
            to: process.env.ADMIN_EMAIL!,
            from: { email: process.env.SENDER_EMAIL!, name: 'Diamond Salon System' },
            subject: `New Booking Received (Manual/Non-Paid): ${name}`,
            html: `<h1>New Booking Notification (Manual/Non-Paid)</h1><p>A new booking has been made:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li><li><strong>Date & Time:</strong> ${new Date(date).toLocaleString()}</li>${userMessage ? `<li><strong>Client's Message:</strong> ${userMessage}</li>` : ''}</ul><p>Please check the system for details.</p>`,
        };

        await Promise.all([
            sgMail.send(userEmailMsg).then(() => console.log(`User confirmation email sent to (non-paid booking): ${email}`)),
            sgMail.send(adminEmailMsg).then(() => console.log(`Admin notification email sent for (non-paid booking): ${process.env.ADMIN_EMAIL!}`))
        ]);
        console.log("Emails for non-paid booking dispatched successfully.");

        return NextResponse.json(
            { message: "Booking successful! Confirmation emails have been sent.", bookingId: newBooking._id },
            { status: 201 }
        );

    } catch (error) {
        console.error("API Error in POST /api/book:", error);
        let errorMessage = "An unknown server error occurred";
        let errorDetails: string | { [key: string]: string } | null = null;

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        const errAsAny = error as any;
        if (errAsAny.response && errAsAny.response.body && errAsAny.response.body.errors) {
            const sendGridErrors = errAsAny.response.body.errors;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errorDetails = sendGridErrors.map((e: any) => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(', ');
            console.error("SendGrid API Error (/api/book):", errorDetails);
            return NextResponse.json(
                { error: "Failed to send email notification.", details: errorDetails },
                { status: 500 }
            );
        }
        if (errAsAny.name === 'ValidationError' && errAsAny.errors) {
            const validationErrors: { [key: string]: string } = {}; // Changed from let to const
            Object.keys(errAsAny.errors).forEach((key) => {
                validationErrors[key] = errAsAny.errors[key].message;
            });
            errorDetails = validationErrors;
            console.warn("API Mongoose Validation Error (/api/book):", errorDetails);
            return NextResponse.json({ error: "Validation failed.", details: errorDetails }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Failed to process booking.", details: errorDetails || errorMessage },
            { status: 500 }
        );
    }
}