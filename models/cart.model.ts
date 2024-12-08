/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Cart Model
 **********************************************************************
 */
import { Document, model, Schema } from 'mongoose';
import { CART_ITEM_STATUS } from '../utils/contants';

export interface CartDocument extends Document {
  product: Schema.Types.ObjectId;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  discountedPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    purchasePrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: CART_ITEM_STATUS.Not_processed,
      enum: [
        CART_ITEM_STATUS.Not_processed,
        CART_ITEM_STATUS.Processing,
        CART_ITEM_STATUS.Shipped,
        CART_ITEM_STATUS.Delivered,
        CART_ITEM_STATUS.Cancelled,
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const CartModel = model<CartDocument>('Cart', CartSchema);
