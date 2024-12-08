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
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = model<OrderDocument>('Order', OrderSchema);
