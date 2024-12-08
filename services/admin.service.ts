/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Admin Services
 **********************************************************************/

import { OrderModel } from '../models/order.model';

/**
 * Generate a discount code for every nth order
 */
export const generateDiscountCode = async (): Promise<string> => {
  try {
    // Logic for checking the nth order
    const orderCount = await OrderModel.countDocuments(); // Get order count from Order collection
    const nthOrder = 5; // For example, every 5th order gets a discount code

    if (orderCount % nthOrder === 0) {
      const discountCode = `DISCOUNT-${orderCount}`;
      // Add discount code logic here (e.g., save to a collection or return it)
      return discountCode;
    }
    return 'No discount code available';
  } catch (error) {
    throw new Error('Error generating discount code');
  }
};

/**
 * Get admin statistics like item counts, total purchase amount, etc.
 */
export const getAdminStats = async (): Promise<any> => {
  try {
    const totalItemsPurchased = await OrderModel.aggregate([
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } },
    ]);

    const totalPurchaseAmount = await OrderModel.aggregate([
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.totalPrice' } } },
    ]);

    const discountCodes: any[] = []; // Logic to fetch generated discount codes if saved in the database
    const totalDiscountAmount = 0; // Logic to calculate total discount amount if applicable

    return {
      totalItemsPurchased: totalItemsPurchased[0]?.total || 0,
      totalPurchaseAmount: totalPurchaseAmount[0]?.total || 0,
      discountCodes,
      totalDiscountAmount,
    };
  } catch (error) {
    throw new Error('Error fetching admin stats');
  }
};
