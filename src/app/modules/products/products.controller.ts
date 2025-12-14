import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import ProductServices from "./products.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Create a new product
 * Only accessible by admin and superAdmin users
 * Handles HTTP POST requests to /product
 */
const createProduct: RequestHandler = catchAsync(async (req, res) => {
  // Call service layer to create product in database
  const result = await ProductServices.createProductIntoDb(req.body);
  
  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

/**
 * Controller: Get all products with filtering, search, and pagination
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product
 */
const getAllProducts: RequestHandler = catchAsync(async (req, res) => {
  // Extract query parameters for filtering, search, pagination
  const result = await ProductServices.getAllProductsFromDb(req.query);
  
  // Send response with products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get a single product by ID
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/:id
 */
const getSingleProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters
  const result = await ProductServices.getSingleProductFromDb(req.params.id);
  
  // Send response with single product data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

/**
 * Controller: Update a product by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP PUT requests to /product/:id
 */
const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters and update data from request body
  const result = await ProductServices.updateProductIntoDb(req.params.id, req.body);
  
  // Send response with updated product data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

/**
 * Controller: Soft delete a product by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP DELETE requests to /product/:id
 */
const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters for soft deletion
  const result = await ProductServices.deleteProductFromDb(req.params.id);
  
  // Send response confirming deletion
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

/**
 * Controller: Get products filtered by price range
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/price-range?minPrice=X&maxPrice=Y
 */
const getProductsByPriceRange: RequestHandler = catchAsync(async (req, res) => {
  // Extract price range from query parameters
  const { minPrice, maxPrice } = req.query;
  
  // Call service to filter products by price range
  const result = await ProductServices.getProductsByPriceRange(
    Number(minPrice),
    Number(maxPrice),
    req.query
  );
  
  // Send response with filtered products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully by price range",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get products that belong to a specific collection
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/collection/:collectionId
 */
const getProductsByCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters
  const { collectionId } = req.params;
  
  // Call service to filter products by collection
  const result = await ProductServices.getProductsByCollection(collectionId, req.query);
  
  // Send response with filtered products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully by collection",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get newest products sorted by creation date
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/newest
 */
const getNewestProducts: RequestHandler = catchAsync(async (req, res) => {
  // Call service to get newest products (sorted by createdAt descending)
  const result = await ProductServices.getNewestProducts(req.query);
  
  // Send response with newest products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Newest products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get oldest products sorted by creation date
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/oldest
 */
const getOldestProducts: RequestHandler = catchAsync(async (req, res) => {
  // Call service to get oldest products (sorted by createdAt ascending)
  const result = await ProductServices.getOldestProducts(req.query);
  
  // Send response with oldest products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Oldest products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsByPriceRange,
  getProductsByCollection,
  getNewestProducts,
  getOldestProducts,
};

export default ProductControllers;
