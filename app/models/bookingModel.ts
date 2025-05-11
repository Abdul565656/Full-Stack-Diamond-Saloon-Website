// app/models/bookingModel.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  date: Date;
  message?: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'requires_action';
  stripePaymentIntentId?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  name: { type: String, required: [true, "Name is required."] },
  email: { type: String, required: [true, "Email is required."] },
  date: { type: Date, required: [true, "Date is required."] },
  message: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'requires_action'],
    default: 'pending',
    required: true,
  },
  stripePaymentIntentId: { type: String, index: true },
  amount: { type: Number, required: [true, "Booking amount is required."] },
}, { timestamps: true });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;