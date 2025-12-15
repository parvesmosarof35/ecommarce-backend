import { Schema, model, Model } from "mongoose";
import { IProduct, ProductModel } from "./products.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const ProductSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock_quantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    images_urls: {
      type: [String],
      validate: {
        validator: function(urls: string[]) {
          return urls.length <= 8;
        },
        message: "Maximum 8 images allowed per product"
      }
    },
    categories: [{
      type: String,
      trim: true,
    }],
    skintype: [{
      type: String,
      trim: true,
    }],
    ingredients: [{
      type: String,
      trim: true,
    }],
    collections: [{
      type: Schema.Types.ObjectId,
      ref: "collections",
    }],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

ProductSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});

ProductSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

ProductSchema.statics.isProductCustomId = async function (id: string) {
  const product = await this.findById(id);
  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found", "");
  }
  return product;
};

const product = model<IProduct, ProductModel>("products", ProductSchema);

export default product;
