// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb'; // Adjust path if necessary
import ContactMessage from '@/app/models/contactMessageModel'; // Adjust path
import sgMail from '@sendgrid/mail'; // Optional: if you also want to email admin

// Define a more specific type for SendGrid errors
interface SendGridError extends Error {
    response?: {
        body?: {
            errors?: Array<{ message: string; field?: string | null; help?: string | null }>;
        };
    };
}

// Define a more specific type for Mongoose-like ValidationErrors
interface AppValidationError extends Error {
    errors?: {
        [key: string]: { message: string; /* other properties if needed */ };
    };
}


// Configure SendGrid (Optional - if you want email notifications to admin)
if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL && process.env.SENDER_EMAIL) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("SendGrid API Key configured for contact form notifications.");
} else {
    console.warn("Contact form: SendGrid environment variables not fully set. Admin email notifications might not work.");
}

export async function POST(req: Request) {
    console.log("API /api/contact POST request received.");

    let requestBody;
    try {
        requestBody = await req.json();
    } catch (parseError: unknown) { // Typed as unknown
        const error = parseError as Error; // Assume it's an Error object
        console.error("API Error (/api/contact): Invalid JSON in request body", error.message);
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, phone, message: userMessage } = requestBody;

    if (!name || !email || !userMessage) {
        console.warn("API Validation Error (/api/contact): Name, email, or message missing.");
        return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    try {
        await dbConnect();
        console.log("Database connected successfully for /api/contact.");

        const newContactMessage = new ContactMessage({
            name,
            email,
            phone: phone || undefined, // Store phone if provided, else undefined
            message: userMessage,
            isRead: false,
        });

        await newContactMessage.save();
        console.log("New contact message saved to DB:", newContactMessage._id);

        // --- Optional: Send an email notification to the admin ---
        if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL && process.env.SENDER_EMAIL) {
            const adminNotificationMsg = {
                to: process.env.ADMIN_EMAIL,
                from: {
                    email: process.env.SENDER_EMAIL,
                    name: 'Diamond Salon Contact Form',
                },
                subject: `New Contact Form Submission from ${name}`,
                html: `
                    <h1>New Contact Form Message</h1>
                    <p>You have received a new message through the contact form:</p>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
                        <li><strong>Message:</strong></li>
                    </ul>
                    <p style="white-space: pre-wrap;">${userMessage}</p>
                    <hr>
                    <p>Message ID in database: ${newContactMessage._id}</p>
                `,
            };
            try {
                await sgMail.send(adminNotificationMsg);
                console.log(`Admin notification email sent for contact message: ${newContactMessage._id}`);
            } catch (emailErrorCaught: unknown) { // FIX for 75:43
                const err = emailErrorCaught as SendGridError; // Assert to the defined interface
                console.error("Error sending admin notification for contact message:", err.response?.body?.errors || err.message);
                // Don't fail the whole request if admin email fails, just log it.
            }
        }
        // --- End Optional Admin Email ---

        return NextResponse.json(
            { message: "Thank you for your message! We'll get back to you soon.", messageId: newContactMessage._id },
            { status: 201 }
        );

    } catch (errorCaught: unknown) { // FIX for 88:30
        // It's good practice to check if it's an Error instance before accessing properties
        if (errorCaught instanceof Error) {
            const err = errorCaught as AppValidationError; // Assert to allow access to .errors if name matches
            console.error("API Error in POST /api/contact:", err.message, err.stack);

            if (err.name === 'ValidationError' && err.errors) {
                const validationErrors: { [key: string]: string } = {};
                Object.keys(err.errors).forEach((key) => {
                    validationErrors[key] = err.errors![key].message; // Use non-null assertion if sure
                });
                console.warn("API Mongoose Validation Error (/api/contact):", validationErrors);
                return NextResponse.json({ error: "Validation failed. Please check your input.", details: validationErrors }, { status: 400 });
            }

            return NextResponse.json(
                { error: "Failed to submit your message. Please try again later.", details: err.message || "Unknown server error" },
                { status: 500 }
            );
        } else {
            // Handle cases where something other than an Error was thrown
            console.error("API Error in POST /api/contact: Non-Error object thrown:", errorCaught);
            return NextResponse.json(
                { error: "Failed to submit your message. Please try again later.", details: "Unknown server error" },
                { status: 500 }
            );
        }
    }
}