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
 * Get admin statistics like item counts, total purchase amount, discounts applied, and discounted price.
 * @returns {Promise<any>} An object containing admin statistics.
 */
export const getAdminStats = async (): Promise<any> => {
  try {
    // Calculate the total items purchased (based on cart item quantities from all carts in orders)
    const totalItemsPurchased = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'carts', // Collection name for Cart
          localField: 'cart',
          foreignField: '_id',
          as: 'cartDetails',
        },
      },
      { $unwind: '$cartDetails' },
      { $unwind: '$cartDetails.items' },
      {
        $lookup: {
          from: 'cartitems', // Collection name for CartItems
          localField: 'cartDetails.items',
          foreignField: '_id',
          as: 'cartItemsDetails',
        },
      },
      { $unwind: '$cartItemsDetails' },
      {
        $group: {
          _id: null,
          total: { $sum: '$cartItemsDetails.quantity' },
        },
      },
    ]);

    // Calculate the total purchase amount across all orders
    const totalPurchaseAmount = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Calculate the total discounted price across all orders
    const totalDiscountedPrice = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$discountedPrice' },
        },
      },
    ]);

    // Fetch unique discount codes used in orders
    const discountCodes = await OrderModel.distinct('discountCode', {
      discountCode: { $ne: null },
    });

    return {
      totalItemsPurchased: totalItemsPurchased[0]?.total || 0,
      totalPurchaseAmount: totalPurchaseAmount[0]?.total || 0,
      totalDiscountAmount:
        totalPurchaseAmount[0]?.total - totalDiscountedPrice[0]?.total || 0,
      totalDiscountedPrice: totalDiscountedPrice[0]?.total || 0,
      discountCodes,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw new Error('Error fetching admin stats');
  }
};
