/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Cart Controllers
 **********************************************************************/

import { Request, Response } from 'express';
import {
  addProductToCart,
  checkoutCart,
  generateDiscountCode,
  getNotProcessedCartItems,
  applyDiscount,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../services/cart.service';
import { HTTP_STATUS_CODE } from '../utils/contants';

/**
 * Get all items in the cart that are not processed
 * Retrieves cart items that have a status of "Not_processed"
 * @param req
 * @param res
 */
export const getCartItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cartItems = await getNotProcessedCartItems();
    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: cartItems });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Add an item to the cart
 * Adds a product to the cart with the given quantity and price details.
 * @param req
 * @param res
 */
export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cartItem = await addProductToCart(
      req.body.productId,
      req.body.quantity,
      req.body.purchasePrice
    );
    res
      .status(HTTP_STATUS_CODE.CREATED)
      .json({ success: true, data: cartItem });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Update an item's quantity in the cart
 * Updates the quantity of an item in the cart.
 * @param req
 * @param res
 */
export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedCartItem = await updateCartItemQuantity(
      req.params.productId,
      req.body.quantity
    );
    if (updatedCartItem) {
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ success: true, data: updatedCartItem });
    } else {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Remove an item from the cart
 * Removes a product from the cart.
 * @param req
 * @param res
 */
export const removeCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await removeItemFromCart(req.params.cartItemId);
    if (result) {
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ success: true, message: 'Item removed from cart' });
    } else {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Item not found' });
    }
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Checkout the cart
 * Finalizes the cart and places an order, updating status to "Processing".
 * @param req
 * @param res
 */
export const checkoutCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItems, discountCode } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ success: false, message: 'Cart is empty' });
    }

    // Call the service method to process the checkout
    const result = await checkoutCart(cartItems, discountCode);

    // Return response with the checkout result
    res.status(HTTP_STATUS_CODE.CREATED).json({ success: true, data: result });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Add a product to the cart
 * @param req - The request object containing product and quantity
 * @param res - The response object
 */
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, purchasePrice } = req.body;

    // Validate input (optional)
    if (!productId || !quantity || !purchasePrice) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Product ID, quantity, and purchase price are required.',
      });
    }

    // Call the service to add the product to the cart
    const result = await addProductToCart(productId, quantity, purchasePrice);

    // Return the result to the client
    res.status(HTTP_STATUS_CODE.CREATED).json({
      success: true,
      message: 'Product added to cart successfully.',
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error.message,
    });
  }
};
