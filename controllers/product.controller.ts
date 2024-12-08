/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Product Controllers
 **********************************************************************
 */
import { fetchAllProducts } from '../services/product.service';
import { HTTP_STATUS_CODE } from '../utils/contants';
import { Request, Response } from 'express';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await fetchAllProducts();
    res.status(HTTP_STATUS_CODE.OK).json(allProducts);
  } catch (error) {
    console.log(error);
  }
};
