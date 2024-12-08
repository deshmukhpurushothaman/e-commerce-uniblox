import { ProductModel, ProductDocument } from '../models/product.model';

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
 **********************************************************************/

/**
 * Fetch all products
 * Retrieves a list of all products from the database.
 * @returns {Promise<ProductDocument[]>} An array of product objects.
 */
export const fetchAllProducts = async (): Promise<ProductDocument[]> => {
  try {
    return await ProductModel.find();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch product by ID
 * Retrieves a product from the database using its unique ID.
 * @param {string} id - The ID of the product.
 * @returns {Promise<ProductDocument | null>} The product object or null if not found.
 */
export const fetchProductById = async (
  id: string
): Promise<ProductDocument | null> => {
  try {
    return await ProductModel.findById(id);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 * Adds a new product to the database.
 * @param {ProductDocument} productData - The product data to be saved.
 * @returns {Promise<Product>} The newly created product object.
 */
export const createProduct = async (
  productData: ProductDocument
): Promise<ProductDocument> => {
  try {
    const newProduct = new ProductModel(productData);
    return await newProduct.save();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update a product by ID
 * Updates an existing product in the database by its ID.
 * @param {string} id - The ID of the product to update.
 * @param {Partial<ProductDocument>} updateData - The updated product data.
 * @returns {Promise<ProductDocument | null>} The updated product object or null if not found.
 */
export const updateProductById = async (
  id: string,
  updateData: Partial<ProductDocument>
): Promise<ProductDocument | null> => {
  try {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product by ID
 * Removes a product from the database using its unique ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<ProductDocument | null>} The deleted product object or null if not found.
 */
export const deleteProductById = async (
  id: string
): Promise<ProductDocument | null> => {
  try {
    return await ProductModel.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
