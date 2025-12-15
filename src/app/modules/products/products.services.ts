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
  // Handle custom sorting options
  const originalSort = query.sort;
  let modifiedQuery = { ...query };

  if (query.sort) {
    switch (query.sort) {
      case 'bestSelling':
        // Sort by stock_quantity (assuming higher stock means more sales)
        modifiedQuery.sort = 'stock_quantity';
        break;
      case 'bestRating':
        // Use aggregation pipeline for real rating sort
        return getProductsSortedByRating(query);
      case 'priceLowToHigh':
        modifiedQuery.sort = 'price';
        break;
      case 'priceHighToLow':
        modifiedQuery.sort = '-price';
        break;
      case 'newest':
        modifiedQuery.sort = '-createdAt';
        break;
      case 'oldest':
        modifiedQuery.sort = 'createdAt';
        break;
      default:
        // Use the original sort parameter
        modifiedQuery.sort = originalSort;
        break;
    }
  }

  // Use QueryBuilder for advanced query operations
  // - Search in name and description fields
  // - Apply filters, sorting, pagination
  // - Populate collections array to show collection details
  const productQuery = new QueryBuilder(
    product.find().populate("collections"),
    modifiedQuery
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
 * Helper function to get products sorted by rating using aggregation
 */
const getProductsSortedByRating = async (query: any) => {
  // Build aggregation pipeline with rating data
  const pipeline: any[] = [
    // Add rating data from reviews collection
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews'
      }
    },
    // Calculate average rating and total reviews
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: '$reviews' }, 0] },
            then: {
              $divide: [
                { $sum: '$reviews.rating' },
                { $size: '$reviews' }
              ]
            },
            else: 0
          }
        },
        totalReviews: { $size: '$reviews' }
      }
    },
    // Remove the reviews array to clean up the output
    {
      $project: {
        reviews: 0
      }
    }
  ];

  // Add search stage if searchTerm exists
  if (query.searchTerm) {
    pipeline.unshift({
      $match: {
        $or: [
          { name: { $regex: query.searchTerm, $options: 'i' } },
          { description: { $regex: query.searchTerm, $options: 'i' } }
        ]
      }
    });
  }

  // Add filter stages for other query parameters
  if (query.categories) {
    const categories = Array.isArray(query.categories) ? query.categories : [query.categories];
    pipeline.push({
      $match: { categories: { $in: categories } }
    });
  }

  if (query.skintype) {
    pipeline.push({
      $match: { skintype: query.skintype }
    });
  }

  if (query.ingredients) {
    const ingredients = Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients];
    pipeline.push({
      $match: { ingredients: { $in: ingredients } }
    });
  }

  if (query.isFeatured) {
    pipeline.push({
      $match: { isFeatured: query.isFeatured === 'true' }
    });
  }

  // Add collections lookup
  pipeline.push({
    $lookup: {
      from: 'collections',
      localField: 'collections',
      foreignField: '_id',
      as: 'collections'
    }
  });

  // Sort by rating (descending)
  pipeline.push({
    $sort: { averageRating: -1, totalReviews: -1 }
  });

  // Add pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  pipeline.push(
    { $skip: skip },
    { $limit: limit }
  );

  // Execute aggregation
  const result = await product.aggregate(pipeline);

  // Get total count for pagination metadata
  const countPipeline = [...pipeline];
  // Remove pagination stages for count
  countPipeline.splice(-2, 2);
  // Remove sort stage for count
  const sortIndex = countPipeline.findIndex(stage => stage.$sort);
  if (sortIndex !== -1) {
    countPipeline.splice(sortIndex, 1);
  }

  const countResult = await product.aggregate([
    ...countPipeline,
    { $count: 'total' }
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
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
 * Hard deletes a product by ID
 * @param id - Product ID to delete
 * @returns Promise<IProduct | null> - Deleted product document or null if not found
 */
const deleteProductFromDb = async (id: string) => {
  // Hard delete by removing the document from database
  const result = await product.findByIdAndDelete(id);
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
