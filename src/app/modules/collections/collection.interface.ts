import { Document, Model, Schema } from "mongoose";

export interface ICollection extends Document {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  products?: string[];
  isDelete?: boolean;
}

export type CollectionModel = {
  isCollectionCustomId: (id: string) => Promise<ICollection>;
} & Model<ICollection>;
