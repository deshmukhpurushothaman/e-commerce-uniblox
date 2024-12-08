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

import { DiscountCodeModel } from '../models/discount.model';
import { CartModel } from '../models/cart.model';
import { CartDocument } from '../models/cart.model';
import { CART_ITEM_STATUS } from '../utils/contants';
import { OrderModel } from '../models/order.model';

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
 * Apply discount to the cart if the discount code is valid.
 * @param cartItems
 * @param discountCode
 * @returns {Promise<any>} Updated cart with discount applied
 */
export const applyDiscount = async (
  cartItems: CartDocument[],
  discountCode: string
): Promise<any> => {
  try {
    const validDiscountCode = await DiscountCodeModel.findOne({
      code: discountCode,
      used: false,
    });

    if (!validDiscountCode) {
      throw new Error('Invalid or used discount code.');
    }

    // Apply 10% discount to the total price of the cart
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    const discount = totalPrice * 0.1;
    const discountedPrice = totalPrice - discount;

    return { totalPrice, discount, discountedPrice };
  } catch (error) {
    console.error('Error applying discount:', error);
    throw new Error('Error applying discount');
  }
};

/**
 * Place an order and increment the order count to check for discount eligibility.
 * @param cartItems
 * @param discountCode
 * @returns {Promise<any>} Final order with applied discount if eligible
 */
export const checkoutCart = async (
  cartItems: CartDocument[],
  discountCode: string
) => {
  try {
    // Fetch total order count from the Orders collection
    const orderCount = await OrderModel.countDocuments({});

    // Check if the order qualifies for a discount (e.g., every 5th order)
    if ((orderCount + 1) % 5 === 0) {
      // Generate a new discount code if it's the nth order
      const discountCode = await generateDiscountCode();
    }

    // Process the order here (saving to DB, changing item statuses, etc.)
    const { totalPrice, discount, discountedPrice } = await applyDiscount(
      cartItems,
      discountCode
    );

    // Save the order to the database
    const newOrder = new OrderModel({
      product: cartItems[0].product,
      quantity: cartItems[0].quantity,
      totalPrice,
      discountCode: discountCode ? discountCode : null,
      status: 'Completed',
    });

    await newOrder.save();

    return {
      totalPrice,
      discount,
      discountedPrice,
      message: 'Order placed successfully',
    };
  } catch (error) {
    console.error('Error during checkout:', error);
    throw new Error('Error during checkout');
  }
};

/**
 * Generate a discount code after every nth order
 * @returns {Promise<any>} New discount code object
 */
export const generateDiscountCode = async (): Promise<any> => {
  const discountCode = 'DISCOUNT-' + Math.random().toString(36).substring(7);
  const newDiscountCode = new DiscountCodeModel({
    code: discountCode,
    used: false,
  });

  await newDiscountCode.save();
  return newDiscountCode;
};
