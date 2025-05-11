// lib/userModel.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose'; // Import Types

// Define your IUser interface
export interface IUser extends Document {
  _id: Types.ObjectId; // <--- ADD THIS LINE to explicitly type _id
  email: string;
  password?: string;
  name?: string; // Assuming you might have a name field or others
  // other fields...
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Good practice to not select password by default
  name: { type: String },
  // other fields...
}, { timestamps: true });

// When fetching user and needing password (like in login):
// User.findOne({ email }).select('+password');

// Prevent model recompilation in Next.js dev mode
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;