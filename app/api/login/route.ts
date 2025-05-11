// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/mongodb';
import User, { IUser } from '@/lib/userModel';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) { // 'request' is used
  console.log("====== [/api/login] - POST request received ======");

  if (!JWT_SECRET) {
    console.error("[/api/login] - FATAL: JWT_SECRET is not defined.");
    return NextResponse.json({ error: 'Server configuration error: JWT_SECRET missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { email, password } = body;
    console.log(`[/api/login] - Attempting login for email: ${email}`);

    if (!email || !password) {
      console.log("[/api/login] - Validation Error: Email or password missing.");
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await dbConnect();
    console.log("[/api/login] - Database connection established/cached.");

    const user: IUser | null = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`[/api/login] - Auth failed: User not found for email: ${email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log(`[/api/login] - User found: ${user.email}, User ID: ${user._id.toString()}`);

    if (!user.password) {
      console.error(`[/api/login] - Data Error: Password field not found for user: ${email}.`);
      return NextResponse.json({ error: 'Invalid credentials - server data issue' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`[/api/login] - Auth failed: Password mismatch for user: ${email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log(`[/api/login] - Password matched for user: ${email}.`);

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`[/api/login] - JWT token generated for user: ${email}`);

    return NextResponse.json({ message: 'Login successful', token: token }, { status: 200 });

  } catch (e) {
    const error = e as Error;
    console.error('[/api/login] - !!! UNHANDLED LOGIN API ERROR !!!:', error.message, error.stack);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// Corrected: _request is defined but never used.
export async function GET(_request: NextRequest) {
  console.log("====== [/api/login] - GET request received ======");
  return NextResponse.json({ message: "Login API endpoint. Use POST to attempt login." }, { status: 200 });
}