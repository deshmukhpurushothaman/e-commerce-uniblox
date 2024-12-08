/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Product Routes
 **********************************************************************/

import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get('/', getProducts);

/**
 * @route GET /api/products/:id
 * @description Get a single product by ID
 * @access Public
 */
router.get('/:id', getProductById);

/**
 * @route POST /api/products
 * @description Add a new product
 * @access Public
 */
router.post('/', addProduct);

/**
 * @route PUT /api/products/:id
 * @description Update an existing product by ID
 * @access Public
 */
router.put('/:id', updateProduct);

/**
 * @route DELETE /api/products/:id
 * @description Delete a product by ID
 * @access Public
 */
router.delete('/:id', deleteProduct);

export default router;
