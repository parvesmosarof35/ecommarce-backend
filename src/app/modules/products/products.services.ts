import product from "./products.model";
import { IProduct } from "./products.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import ReviewServices from "../reviews/reviews.services";

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
 * @returns Promise<{result: IProduct[], meta: object}> - Products array with rating data and metadata
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

  // Add rating data to each product
  const productsWithRatings = await Promise.all(
    result.map(async (product: any) => {
      const ratingData = await ReviewServices.getAverageRatingForProduct(product._id.toString());
      return {
        ...product.toObject(),
        averageRating: ratingData.averageRating,
        totalReviews: ratingData.totalReviews,
      };
    })
  );

  return {
    result: productsWithRatings,
    meta,
  };
};

/**
 * Retrieves a single product by ID with populated collections and reviews
 * @param id - Product ID
 * @param query - Query parameters for reviews pagination (limit, page, sort)
 * @returns Promise<IProduct | null> - Single product document with reviews or null if not found
 */
const getSingleProductFromDb = async (id: string, query: any = {}) => {
  // Find product by ID and populate collections array to show collection details
  const productData = await product.findById(id).populate("collections");
  
  if (!productData) {
    return null;
  }

  // Get reviews for this product with pagination support from query parameters
  // Default pagination if not provided: limit 10, page 1, sorted by newest first
  const reviewsQuery = {
    limit: query.limit || "10",
    page: query.page || "1",
    sort: query.sort || "-createdAt"
  };
  
  const reviewsResult = await ReviewServices.getReviewsByProduct(id, reviewsQuery);
  
  // Get rating data
  const ratingData = await ReviewServices.getAverageRatingForProduct(id);

  // Convert product to object and add reviews and rating data
  const productWithReviews = {
    ...productData.toObject(),
    reviews: reviewsResult.result,
    reviewsMeta: reviewsResult.meta,
    averageRating: ratingData.averageRating,
    totalReviews: ratingData.totalReviews,
  };

  return productWithReviews;
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



const ProductServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  updateProductIntoDb,
  deleteProductFromDb,
  getProductsByCollection,
};

export default ProductServices;
