/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Cart Services
 **********************************************************************/

import { CartModel } from '../models/cart.model';
import { CartDocument } from '../models/cart.model';
import { CART_ITEM_STATUS } from '../utils/contants';

/**
 * Get all cart items that are not processed.
 * Fetches all items with the status "Not_processed".
 * @returns {Promise<CartDocument[]>} Array of cart items
 */
export const getNotProcessedCartItems = async (): Promise<CartDocument[]> => {
  try {
    return CartModel.find({ status: CART_ITEM_STATUS.Not_processed });
  } catch (error) {
    console.error('Error fetching unprocessed cart items:', error);
    throw new Error('Error fetching cart items');
  }
};

/**
 * Add a product to the cart
 * Adds a product to the cart with the specified details (quantity, price, etc.).
 * @param item
 * @returns {Promise<CartDocument>} The added cart item
 */
export const addItemToCart = async (item: {
  product: string;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  discountedPrice: number;
}): Promise<CartDocument> => {
  try {
    const cartItem = new CartModel(item);
    return cartItem.save();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw new Error('Error adding item to cart');
  }
};

/**
 * Update the quantity of a cart item
 * Updates the quantity for an existing cart item.
 * @param cartItemId
 * @param quantity
 * @returns {Promise<CartDocument>} The updated cart item
 */
export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<CartDocument | null> => {
  try {
    const updatedCartItem = await CartModel.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    );
    return updatedCartItem;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Error updating cart item');
  }
};

/**
 * Remove an item from the cart
 * Removes a cart item based on its ID.
 * @param cartItemId
 * @returns {Promise<boolean>} true if the item was removed, false otherwise
 */
export const removeItemFromCart = async (
  cartItemId: string
): Promise<boolean> => {
  try {
    const result = await CartModel.findByIdAndDelete(cartItemId);
    return result !== null;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw new Error('Error removing item from cart');
  }
};

/**
 * Checkout the cart
 * Updates the status of all cart items to "Processing".
 * @returns {Promise<any>} Confirmation of the checkout
 */
export const checkoutCart = async (): Promise<any> => {
  try {
    const result = await CartModel.updateMany(
      { status: CART_ITEM_STATUS.Not_processed },
      { status: CART_ITEM_STATUS.Processing }
    );
    return result;
  } catch (error) {
    console.error('Error checking out cart:', error);
    throw new Error('Error checking out cart');
  }
};
