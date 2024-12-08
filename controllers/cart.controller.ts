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
import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
import { CartItemModel } from '../models/cartitem.model';
import { Schema } from 'mongoose';

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
 * Add an item to the cart.
 * Adds a new product to the cart and updates the cart's total price, discount, and discounted price.
 * @param req - The request object, which contains cartId (optional), productId, quantity, and purchasePrice in the body.
 * @param res - The response object to send back the updated cart and cart item.
 * @returns A response with the updated cart and the new cart item.
 */
export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { cartId, productId, quantity, purchasePrice } = req.body;

  try {
    // Check if cartId is provided, if not, create a new cart
    let cart;
    if (cartId) {
      cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
    } else {
      cart = new CartModel({
        totalPrice: 0,
        // discount: 0,
        // discountedPrice: 0,
        status: 'active',
        items: [],
      });
      await cart.save();
    }

    // Fetch product by ID
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate total price for the new item
    const itemTotalPrice = purchasePrice * quantity;

    // Create a new cart item and save it
    const newCartItem = new CartItemModel({
      cart: cart._id,
      product: productId,
      quantity,
      purchasePrice,
      totalPrice: itemTotalPrice,
      // discountedPrice: itemTotalPrice * 0.9, // Example: 10% discount on item
    });
    await newCartItem.save();

    // Add the new item to the cart and update the cart's total values
    cart.items.push(newCartItem.id);
    cart.totalPrice += itemTotalPrice;

    // // Calculate updated discount and discounted price for the cart
    // const discount = cart.totalPrice * 0.1; // Example: 10% discount on cart total
    // cart.discount = discount;
    // cart.discountedPrice = cart.totalPrice - discount;

    await cart.save();

    return res.status(201).json({ cart, newCartItem });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

/**
 * Update an item's quantity in the cart.
 * Updates the quantity of an item in the cart, recalculates the cart's total price, discount, and discounted price.
 * @param req - The request object containing cartId, cartItemId, and quantity.
 * @param res - The response object to send the result.
 */
export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartId, cartItemId } = req.params;
    const { quantity } = req.body;

    // Update the cart item's quantity
    const updatedCartItem = await updateCartItemQuantity(
      cartId as string,
      cartItemId,
      quantity
    );

    if (!updatedCartItem) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Cart item not found' });
    }

    // Fetch the cart
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Cart not found' });
    }

    // Recalculate the cart's total price based on all items
    const cartItems = await CartItemModel.find({ cart: cartId });
    const updatedTotalPrice = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // Calculate discount and discounted price
    // const discount = updatedTotalPrice * 0.1; // Example: 10% discount
    // const discountedPrice = updatedTotalPrice - discount;

    // Update and save the cart
    cart.totalPrice = updatedTotalPrice;
    // cart.discount = discount;
    // cart.discountedPrice = discountedPrice;
    await cart.save();

    res.status(HTTP_STATUS_CODE.OK).json({
      success: true,
      data: updatedCartItem,
      cartTotalPrice: cart.totalPrice,
      // cartDiscount: cart.discount,
      // cartDiscountedPrice: cart.discountedPrice,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove an item from the cart.
 * Removes a product from the cart and updates the cart's total price, discount, and discounted price.
 * @param req - The request object containing cartId and cartItemId.
 * @param res - The response object to send the result.
 */
export const removeCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartId, cartItemId } = req.params;

    // Remove the item from the cart
    const result = await removeItemFromCart(cartId, cartItemId);

    if (!result) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Item not found in the cart' });
    }

    // Fetch the cart
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Cart not found' });
    }

    // Recalculate the cart's total price based on remaining items
    const cartItems = await CartItemModel.find({ cart: cartId });
    const updatedTotalPrice = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // Calculate discount and discounted price
    // const discount = updatedTotalPrice * 0.1; // Example: 10% discount
    // const discountedPrice = updatedTotalPrice - discount;

    // Update and save the cart
    cart.totalPrice = updatedTotalPrice;
    // cart.discount = discount;
    // cart.discountedPrice = discountedPrice;
    cart.items = cart.items.filter(
      (itemId: Schema.Types.ObjectId) => itemId.toString() !== cartItemId
    );
    await cart.save();

    res.status(HTTP_STATUS_CODE.OK).json({
      success: true,
      message: 'Item removed from cart',
      cartTotalPrice: cart.totalPrice,
      // cartDiscount: cart.discount,
      // cartDiscountedPrice: cart.discountedPrice,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error.message,
    });
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
    const { discountCode } = req.body;

    // Call the service method to process the checkout
    const result = await checkoutCart(req.params.cartId, discountCode);

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
      return;
    }

    // Call the service to add the product to the cart
    const result = await addProductToCart(
      req.params.cartId,
      productId,
      quantity,
      purchasePrice
    );

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
