/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Order Services
 **********************************************************************/

import { OrderModel } from '../models/order.model';
import { OrderDocument } from '../models/order.model';

/**
 * Fetch all orders
 * Retrieves a list of all orders from the database.
 * @returns {Promise<OrderDocument[]>} An array of order objects.
 */
export const fetchAllOrders = async (): Promise<OrderDocument[]> => {
  try {
    return await OrderModel.find(); // Assuming OrderModel is set up with Mongoose
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Error fetching orders.');
  }
};

/**
 * Fetch order by ID
 * Retrieves a specific order from the database by its unique ID.
 * @param {string} id - The ID of the order.
 * @returns {Promise<OrderDocument | null>} The order object or null if not found.
 */
export const fetchOrderById = async (
  id: string
): Promise<OrderDocument | null> => {
  try {
    return await OrderModel.findById(id);
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw new Error(`Error fetching order with ID ${id}.`);
  }
};

/**
 * Create a new order
 * Adds a new order to the database.
 * @param {Order} orderData - The order data to be saved.
 * @returns {Promise<OrderDocument>} The newly created order object.
 */
export const createOrder = async (
  orderData: OrderDocument
): Promise<OrderDocument> => {
  try {
    const newOrder = new OrderModel(orderData);
    return await newOrder.save();
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Error creating order.');
  }
};

/**
 * Update an order by ID
 * Updates an existing order in the database by its unique ID.
 * @param {string} id - The ID of the order to update.
 * @param {Partial<OrderDocument>} updateData - The updated order data.
 * @returns {Promise<OrderDocument | null>} The updated order object or null if not found.
 */
export const updateOrderById = async (
  id: string,
  updateData: Partial<OrderDocument>
): Promise<OrderDocument | null> => {
  try {
    return await OrderModel.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw new Error(`Error updating order with ID ${id}.`);
  }
};

/**
 * Delete an order by ID
 * Removes an order from the database using its unique ID.
 * @param {string} id - The ID of the order to delete.
 * @returns {Promise<OrderDocument | null>} The deleted order object or null if not found.
 */
export const deleteOrderById = async (
  id: string
): Promise<OrderDocument | null> => {
  try {
    return await OrderModel.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw new Error(`Error deleting order with ID ${id}.`);
  }
};
