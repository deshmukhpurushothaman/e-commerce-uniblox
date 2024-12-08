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
 **********************************************************************/

import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../services/product.service';
import { Request, Response } from 'express';
import { ProductDocument } from '../models/product.model';
import { HTTP_STATUS_CODE } from '../utils/contants';

/**
 * Get all products
 * Retrieves the list of all products from the database.
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allProducts: ProductDocument[] = await fetchAllProducts();
    res.status(HTTP_STATUS_CODE.OK).json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ error: 'Unable to fetch products.' });
  }
};

/**
 * Get a product by ID
 * Retrieves a specific product from the database by its ID.
 */
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product: ProductDocument | null = await fetchProductById(id);

    if (!product) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ error: 'Product not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.OK).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ error: 'Unable to fetch product.' });
  }
};

/**
 * Create a new product
 * Adds a new product to the database.
 */
export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData: ProductDocument = req.body;
    const newProduct: ProductDocument = await createProduct(productData);

    res.status(HTTP_STATUS_CODE.CREATED).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ error: 'Unable to create product.' });
  }
};

/**
 * Update a product by ID
 * Updates the details of an existing product in the database by its ID.
 */
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<ProductDocument> = req.body;
    const updatedProduct: ProductDocument | null = await updateProductById(
      id,
      updateData
    );

    if (!updatedProduct) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ error: 'Product not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.OK).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ error: 'Unable to update product.' });
  }
};

/**
 * Delete a product by ID
 * Removes a product from the database by its ID.
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct: ProductDocument | null = await deleteProductById(id);

    if (!deletedProduct) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ error: 'Product not found.' });
      return;
    }

    res.status(HTTP_STATUS_CODE.NO_CONTENT).send(); // 204 No Content
  } catch (error) {
    console.error('Error deleting product:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ error: 'Unable to delete product.' });
  }
};
