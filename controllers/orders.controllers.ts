/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Orders Controllers
 **********************************************************************/

import { Request, Response } from 'express';
import {
  fetchAllOrders,
  fetchOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
} from '../services/order.service';
import { HTTP_STATUS_CODE } from '../utils/contants';

/**
 * Get all orders
 * Fetches a list of all orders from the database.
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await fetchAllOrders();
    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Get an order by ID
 * Fetches a specific order from the database by its unique ID.
 */
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await fetchOrderById(id);

    if (!order) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: order });
  } catch (error) {
    console.error(`Error fetching order with ID ${req.params.id}:`, error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Create a new order
 * Adds a new order to the database.
 */
export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    const newOrder = await createOrder(orderData);

    res
      .status(HTTP_STATUS_CODE.CREATED)
      .json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Update an order by ID
 * Updates an existing order in the database by its unique ID.
 */
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedOrder = await updateOrderById(id, updateData);

    if (!updatedOrder) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error(`Error updating order with ID ${req.params.id}:`, error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Delete an order by ID
 * Removes an order from the database using its unique ID.
 */
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOrder = await deleteOrderById(id);

    if (!deletedOrder) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.NO_CONTENT).send(); // 204 No Content
  } catch (error) {
    console.error(`Error deleting order with ID ${req.params.id}:`, error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};
