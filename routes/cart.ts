/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Cart Routes
 **********************************************************************/

import express from 'express';
import {
  checkoutCartHandler,
  addToCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cart.controller';

const router = express.Router();

// Route to get all items in the cart
router.get('/items', getCartItems);

// Route to checkout the cart
router.post('/checkout', checkoutCartHandler);

// POST route to add a product to the cart
router.post('/add', addToCart);

// Route to add an item to the cart with specific details (product ID, quantity, and price)
router.post('/add-item', addItemToCart);

// Route to update the quantity of an item in the cart
router.put('/update/:cartItemId', updateCartItem);

// Route to remove an item from the cart
router.delete('/remove/:cartItemId', removeCartItem);

export default router;
