import { ProductModel } from '../models/product.model';

/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Product Services
 **********************************************************************
 */
export const fetchAllProducts = async () => {
  try {
    return ProductModel.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
