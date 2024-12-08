/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Cart Item Model
 **********************************************************************
 */
import { Document, model, Schema } from 'mongoose';
import { CART_ITEM_STATUS } from '../utils/contants';

export interface CartItemDocument extends Document {
  cart: Schema.Types.ObjectId; // Reference to the cart it belongs to
  product: Schema.Types.ObjectId; // Reference to the Product model
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  // discountedPrice: number;
  status: string; // Status of the item in the cart
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true, // Ensures the cart item is associated with a valid product
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Minimum quantity of 1
    },
    purchasePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
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

export const CartItemModel = model<CartItemDocument>(
  'CartItem',
  CartItemSchema
);
