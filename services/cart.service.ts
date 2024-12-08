import { DiscountCodeModel } from '../models/discount.model';
import { CartModel } from '../models/cart.model';
import { CartItemDocument, CartItemModel } from '../models/cartitem.model'; // Import CartItemModel
import { CartDocument } from '../models/cart.model';
import { CART_ITEM_STATUS } from '../utils/contants';
import { OrderModel } from '../models/order.model';
import { ProductModel } from '../models/product.model';

/**
 * Get all cart items that are not processed.
 * Fetches all items with the status "Not_processed".
 * @returns {Promise<CartDocument[]>} Array of cart items
 */
export const getNotProcessedCartItems = async (): Promise<CartDocument[]> => {
  try {
    return CartItemModel.find({ status: CART_ITEM_STATUS.Not_processed });
  } catch (error) {
    console.error('Error fetching unprocessed cart items:', error);
    throw new Error('Error fetching cart items');
  }
};

/**
 * Add a product to the cart
 * Adds a product to the cart with the specified details (quantity, price, etc.).
 * @param cartId - The ID of the cart
 * @param productId - The ID of the product to add
 * @param quantity - The quantity of the product to add
 * @param purchasePrice - The purchase price of the product
 * @returns {Promise<CartItemDocument>} The added cart item
 */
export const addProductToCart = async (
  cartId: string,
  productId: string,
  quantity: number,
  purchasePrice: number
): Promise<CartItemDocument> => {
  try {
    // Check if the product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate total price and discounted price
    const totalPrice = purchasePrice * quantity;
    const discountedPrice = totalPrice * 0.9; // Apply 10% discount if eligible (adjust based on your business logic)

    // Create a new cart item
    const newCartItem = new CartItemModel({
      cart: cartId,
      product: productId,
      quantity,
      purchasePrice,
      totalPrice,
      discountedPrice,
      status: CART_ITEM_STATUS.Not_processed,
    });

    // Save the cart item to the database
    await newCartItem.save();

    // Update the cart total price
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.items.push(newCartItem.id); // Add the cart item to the cart
    cart.totalPrice += newCartItem.totalPrice;
    await cart.save();

    return newCartItem;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw new Error('Failed to add product to cart');
  }
};

/**
 * Update the quantity of a cart item
 * Updates the quantity for an existing cart item.
 * @param cartId - The ID of the cart
 * @param cartItemId - The ID of the cart item
 * @param quantity - The new quantity
 * @returns {Promise<CartItemDocument | null>} The updated cart item
 */
export const updateCartItemQuantity = async (
  cartId: string,
  cartItemId: string,
  quantity: number
): Promise<CartItemDocument | null> => {
  try {
    const cartItem = await CartItemModel.findById(cartItemId);
    if (!cartItem) throw new Error('Cart item not found');

    const priceDifference =
      cartItem.purchasePrice * (quantity - cartItem.quantity);
    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.purchasePrice * quantity;
    // cartItem.discountedPrice = cartItem.totalPrice * 0.9; // Adjust discounted price

    await cartItem.save();

    // Update the cart's total price
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    cart.totalPrice += priceDifference;
    await cart.save();

    return cartItem;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Error updating cart item');
  }
};

/**
 * Remove an item from the cart
 * Removes a cart item based on its ID.
 * @param cartId - The ID of the cart
 * @param cartItemId - The ID of the cart item to remove
 * @returns {Promise<boolean>} true if the item was removed, false otherwise
 */
export const removeItemFromCart = async (
  cartId: string,
  cartItemId: string
): Promise<boolean> => {
  try {
    const cartItem = await CartItemModel.findById(cartItemId);
    if (!cartItem) throw new Error('Cart item not found');

    // Remove the item from the cart and update the cart's total price
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const removedPrice = cartItem.totalPrice;
    cart.items = cart.items.filter((item) => item.toString() !== cartItemId); // Use array filter to remove item
    cart.totalPrice -= removedPrice; // Recalculate total price
    await cart.save();

    await CartItemModel.deleteOne({ _id: cartItemId }); // Use deleteOne instead of remove()

    return true;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw new Error('Error removing item from cart');
  }
};

/**
 * Apply a discount to the cart.
 * @param cartId - The cart ID to apply the discount to
 * @param discountCode - The discount code
 * @returns Updated cart with the applied discount
 */
export const applyDiscount = async (cartId: string, discountCode: string) => {
  try {
    // Find the cart by cartId
    const cart = await CartModel.findById(cartId).exec();

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Assuming 'discountCode' is valid and you have a method to calculate the discount
    const discount = await getDiscountAmount(discountCode);

    // Apply the discount to the total price
    const updatedTotalPrice =
      cart.totalPrice - cart.totalPrice * (discount / 100);

    // Update the cart with the new total price and discount values
    // cart.discount = discount; // Set the discount field
    // cart.discountedPrice = updatedTotalPrice; // Set the discounted price
    cart.totalPrice = updatedTotalPrice; // Update the total price
    await cart.save();

    return {
      totalPrice: cart.totalPrice,
      discount: discount,
      discountedPrice: updatedTotalPrice,
    };
  } catch (error) {
    throw new Error(`Error applying discount: ${error.message}`);
  }
};

/**
 * Mock method to calculate discount amount from a discount code
 * @param discountCode - Discount code
 * @returns Discount amount
 */
const getDiscountAmount = async (discountCode: string): Promise<number> => {
  try {
    const discountCoupon = await DiscountCodeModel.findOne({
      code: discountCode,
    });
    if (!discountCoupon || discountCoupon.used) {
      return 0;
    }
    return 10;
  } catch (error) {}
  return 0; // No discount for invalid code
};

/**
 * Place an order and increment the order count to check for discount eligibility.
 * @param cartId - The ID of the cart
 * @param discountCode - The discount code to apply (if any)
 * @returns {Promise<any>} Final order with applied discount if eligible
 */
export const checkoutCart = async (cartId: string, discountCode: string) => {
  try {
    const cart = await CartModel.findById(cartId).populate('items');
    if (!cart) throw new Error('Cart not found');

    if (cart.status !== 'active') throw new Error('Invalid cart');

    // Apply discount if applicable
    const { totalPrice, discount, discountedPrice } = await applyDiscount(
      cartId,
      discountCode
    );

    // Create the order from the cart items
    const newOrder = new OrderModel({
      cart: cartId,
      totalPrice,
      discountCode: discount > 0 ? discountCode : null,
      status: 'Completed',
    });

    await newOrder.save();

    cart.status = 'completed';
    await cart.save();

    return {
      totalPrice,
      discount,
      discountedPrice,
      message: 'Order placed successfully',
    };
  } catch (error) {
    console.error('Error during checkout:', error);
    throw new Error(error.message || 'Error during checkout');
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
