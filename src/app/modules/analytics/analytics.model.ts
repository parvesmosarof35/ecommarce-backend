import { Schema, model } from 'mongoose';
import { IAnalytics } from './analytics.interface';

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: {
      type: String,
      required: true,
      unique: true, // format: YYYY-MM-DD
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    cartAdds: {
      type: Number,
      default: 0,
    },
    wishlistAdds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);
