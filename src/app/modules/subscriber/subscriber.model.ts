import { Schema, model } from 'mongoose';
import { ISubscriber } from './subscriber.interface';

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscriber = model<ISubscriber>('Subscriber', SubscriberSchema);
