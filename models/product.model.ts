import { model, Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = model('Product', ProductSchema);
