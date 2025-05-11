// app/models/contactMessageModel.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IContactMessage extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string; // Optional phone number
  message: string;
  isRead: boolean; // To track if the message has been read by an admin
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    // Basic email validation (more robust validation can be added)
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    // Basic phone validation (can be more specific to regions)
    // match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number'] // Example E.164
  },
  message: {
    type: String,
    required: [true, "Message is required."],
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

export default ContactMessage;