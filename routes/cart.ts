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
import { checkoutCart } from '../controllers/cart.controller';

const router = express.Router();

// Route to checkout the cart
router.post('/checkout', checkoutCart);

export default router;
