/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Orders Routes
 **********************************************************************/

import express from 'express';
import {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orders.controllers';

const router = express.Router();

/**
 * Get all orders
 * Fetches a list of all orders.
 */
router.get('/', getOrders);

/**
 * Get an order by ID
 * Fetches a specific order by its unique ID.
 */
router.get('/:id', getOrderById);

/**
 * Create a new order
 * Adds a new order to the database.
 */
router.post('/', addOrder);

/**
 * Update an order by ID
 * Updates an existing order in the database by its unique ID.
 */
router.put('/:id', updateOrder);

/**
 * Delete an order by ID
 * Removes an order from the database using its unique ID.
 */
router.delete('/:id', deleteOrder);

export default router;
