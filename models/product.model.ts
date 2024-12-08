/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Product Model
 **********************************************************************
 */
import { Document, model, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<ProductDocument>('Product', ProductSchema);
