// app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Or your preferred hashing library
import { dbConnect } from '@/lib/mongodb'; // Your MongoDB connection utility
import User from '@/lib/userModel'; // Your User Mongoose model

export async function POST(request: Request) {
  try {
    await dbConnect(); // Ensure database is connected

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      // Add other fields as necessary
    });

    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Registration API Error:', error);
    // It's good to check if the error is a known type, e.g., a Mongoose validation error
    if (error instanceof Error) {
        return NextResponse.json({ message: 'An error occurred during registration.', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred during registration.' }, { status: 500 });
  }
}

// You might also want a GET handler for testing or other purposes, but POST is crucial here.
// export async function GET(request: Request) {
//   return NextResponse.json({ message: "This is the register API endpoint (GET)" });
// }