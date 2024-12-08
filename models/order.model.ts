/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Orders Model
 **********************************************************************
 */
import { Document, model, Schema } from 'mongoose';

export interface OrderDocument extends Document {
  cart: Schema.Types.ObjectId;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    discountCode: {
      type: String,
    },
    status: {
      type: String,
      default: 'Initiated',
    },
    discount: {
      type: Number,
      default: 0, // Default discount is 0
    },
    discountedPrice: {
      type: Number,
      default: 0, // Default discounted price is 0
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = model<OrderDocument>('Order', OrderSchema);
