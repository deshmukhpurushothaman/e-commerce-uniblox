/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Discount Model
 **********************************************************************
 */
import { Schema, model, Document } from 'mongoose';

export interface DiscountCodeDocument extends Document {
  code: string;
  used: boolean;
}

const DiscountCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

export const DiscountCodeModel = model<DiscountCodeDocument>(
  'DiscountCode',
  DiscountCodeSchema
);
