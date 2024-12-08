import { Document, model, Schema } from 'mongoose';

export interface CartDocument extends Document {
  items: Schema.Types.ObjectId[]; // Array of CartItem references
  totalPrice: number; // Total price of the cart, summing the total prices of items
  status: string; // Cart status (e.g., 'active', 'abandoned', etc.)
  createdAt: Date;
  updatedAt: Date;
  discount?: number; // Optional field for discount
  discountedPrice?: number; // Optional field for discounted price
}

const CartSchema = new Schema(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CartItem', // Reference to CartItem model
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      required: true, // Total price is required to track overall cart value
    },
    status: {
      type: String,
      default: 'active', // Default status could be 'active'
      enum: ['active', 'abandoned', 'completed'], // Enum values for cart status
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
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const CartModel = model<CartDocument>('Cart', CartSchema);
