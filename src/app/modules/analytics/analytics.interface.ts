import { Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: string; // YYYY-MM-DD
  totalVisits: number;
  uniqueVisitors: number;
  cartAdds: number;
  wishlistAdds: number;
}
