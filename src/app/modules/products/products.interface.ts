import { Document, Model } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images_urls: string[];
  categories?: string[];
  skintype?: string[];
  ingredients?: string[];
  collections?: string[];
  isDelete?: boolean;
}

export type ProductModel = {
  isProductCustomId: (id: string) => Promise<IProduct>;
} & Model<IProduct>;
