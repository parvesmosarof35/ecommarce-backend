import product from "./products.model";
import { IProduct } from "./products.interface";
import QueryBuilder from "../../builder/QueryBuilder";

/**
 * Creates a new product in the database
 * @param payload - Product data including name, description, price, stock, images, and optional collections
 * @returns Promise<IProduct> - The created product document
 */
const createProductIntoDb = async (payload: IProduct) => {
  const result = await product.create(payload);
  return result;
};

/**
 * Retrieves all products with advanced filtering, searching, and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Products array and metadata
 */
const getAllProductsFromDb = async (query: any) => {
  // Use QueryBuilder for advanced query operations
  // - Search in name and description fields
  // - Apply filters, sorting, pagination
  // - Populate collections array to show collection details
  const productQuery = new QueryBuilder(
    product.find().populate("collections"),
    query
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves a single product by ID with populated collections
 * @param id - Product ID
 * @returns Promise<IProduct | null> - Single product document or null if not found
 */
const getSingleProductFromDb = async (id: string) => {
  // Find product by ID and populate collections array to show collection details
  const result = await product.findById(id).populate("collections");
  return result;
};

/**
 * Updates a product by ID with validation
 * @param id - Product ID to update
 * @param payload - Partial product data to update
 * @returns Promise<IProduct | null> - Updated product document or null if not found
 */
const updateProductIntoDb = async (id: string, payload: Partial<IProduct>) => {
  // Find and update product with:
  // - new: true returns the updated document
  // - runValidators: true ensures schema validation on update
  // - populate collections to show updated collection details
  const result = await product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("collections");
  return result;
};

/**
 * Soft deletes a product by setting isDelete flag to true
 * @param id - Product ID to delete
 * @returns Promise<IProduct | null> - Updated product document or null if not found
 */
const deleteProductFromDb = async (id: string) => {
  // Soft delete by setting isDelete flag instead of removing document
  // This preserves data integrity and allows for recovery
  const result = await product.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );
  return result;
};

/**
 * Retrieves products within a specified price range
 * @param minPrice - Minimum price filter
 * @param maxPrice - Maximum price filter
 * @param query - Additional query parameters for sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Filtered products array and metadata
 */
const getProductsByPriceRange = async (minPrice: number, maxPrice: number, query: any) => {
  // Find products where price is between minPrice and maxPrice (inclusive)
  // This enables the "Price Filter" functionality you specified
  const productQuery = new QueryBuilder(
    product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).populate("collections"),
    query
  )
    .search(["name", "description"])
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves products that belong to a specific collection
 * @param collectionId - Collection ID to filter products by
 * @param query - Additional query parameters for search, sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Filtered products array and metadata
 */
const getProductsByCollection = async (collectionId: string, query: any) => {
  // Find products where the collections array contains the specified collectionId
  // This enables filtering products by collection for the collection-product relationship
  const productQuery = new QueryBuilder(
    product.find({ collections: collectionId }).populate("collections"),
    query
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves newest products sorted by creation date (most recent first)
 * @param query - Query parameters for pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Newest products array and metadata
 */
const getNewestProducts = async (query: any) => {
  // Sort products by createdAt in descending order (-1) to get newest first
  // This enables the "Newest" filter functionality you specified
  const productQuery = new QueryBuilder(
    product.find().populate("collections").sort({ createdAt: -1 }),
    query
  )
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves oldest products sorted by creation date (oldest first)
 * @param query - Query parameters for pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Oldest products array and metadata
 */
const getOldestProducts = async (query: any) => {
  // Sort products by createdAt in ascending order (1) to get oldest first
  // This enables the "Oldest" filter functionality you specified
  const productQuery = new QueryBuilder(
    product.find().populate("collections").sort({ createdAt: 1 }),
    query
  )
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

const ProductServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  updateProductIntoDb,
  deleteProductFromDb,
  getProductsByPriceRange,
  getProductsByCollection,
  getNewestProducts,
  getOldestProducts,
};

export default ProductServices;
