/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Admin Controllers
 **********************************************************************/
import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import { HTTP_STATUS_CODE } from '../utils/contants';
import { OrderModel } from '../models/order.model';
import { getAdminStats } from '../services/admin.service';

/**
 * Generate a discount code for the nth order.
 * @param req
 * @param res
 */
export const generateDiscountCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const discountCode = await cartService.generateDiscountCode();
    res
      .status(HTTP_STATUS_CODE.CREATED)
      .json({ success: true, data: discountCode });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Get a summary of all orders and discounts.
 * @param req
 * @param res
 */
export const getOrderSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the total order count from the Orders collection
    const totalOrders = await OrderModel.countDocuments({});
    const summary = {
      totalOrders,
      totalDiscounts: 1000, // Example of total discount applied
      itemsPurchased: 500, // Example of total items purchased
    };

    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: summary });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};

/**
 * Get admin statistics like item counts, total purchase amount, etc.
 * @param req
 * @param res
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getAdminStats();
    res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: stats });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: error.message });
  }
};
