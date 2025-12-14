import collection from "./collection.model";
import { ICollection } from "./collection.interface";
import QueryBuilder from "../../builder/QueryBuilder";

/**
 * Creates a new collection in the database
 * @param payload - Collection data including name, slug, image_url, and optional products
 * @returns Promise<ICollection> - The created collection document
 */
const createCollectionIntoDb = async (payload: ICollection) => {
  const result = await collection.create(payload);
  return result;
};

/**
 * Retrieves all collections with advanced filtering, searching, and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: ICollection[], meta: object}> - Collections array and metadata
 */
const getAllCollectionsFromDb = async (query: any) => {
  // Use QueryBuilder for advanced query operations
  // - Search in name and slug fields
  // - Apply filters, sorting, pagination
  // - Populate products array to show product details
  const collectionQuery = new QueryBuilder(
    collection.find().populate("products"),
    query
  )
    .search(["name", "slug"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await collectionQuery.modelQuery;
  const meta = await collectionQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves a single collection by ID with populated products
 * @param id - Collection ID
 * @returns Promise<ICollection | null> - Single collection document or null if not found
 */
const getSingleCollectionFromDb = async (id: string) => {
  // Find collection by ID and populate products array to show product details
  const result = await collection.findById(id).populate("products");
  return result;
};

/**
 * Updates a collection by ID with validation
 * @param id - Collection ID to update
 * @param payload - Partial collection data to update
 * @returns Promise<ICollection | null> - Updated collection document or null if not found
 */
const updateCollectionIntoDb = async (id: string, payload: Partial<ICollection>) => {
  // Find and update collection with:
  // - new: true returns the updated document
  // - runValidators: true ensures schema validation on update
  // - populate products to show updated product details
  const result = await collection.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("products");
  return result;
};

/**
 * Soft deletes a collection by setting isDelete flag to true
 * @param id - Collection ID to delete
 * @returns Promise<ICollection | null> - Updated collection document or null if not found
 */
const deleteCollectionFromDb = async (id: string) => {
  // Soft delete by setting isDelete flag instead of removing document
  // This preserves data integrity and allows for recovery
  const result = await collection.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );
  return result;
};

/**
 * Adds multiple products to a collection (many-to-many relationship)
 * @param collectionId - Collection ID to add products to
 * @param productIds - Array of product IDs to add
 * @returns Promise<ICollection | null> - Updated collection with populated products
 */
const addProductsToCollection = async (collectionId: string, productIds: string[]) => {
  // $addToSet with $each adds multiple products without duplicates
  // This prevents the same product from being added multiple times
  const result = await collection.findByIdAndUpdate(
    collectionId,
    { $addToSet: { products: { $each: productIds } } },
    { new: true, runValidators: true }
  ).populate("products");
  return result;
};

/**
 * Removes multiple products from a collection
 * @param collectionId - Collection ID to remove products from
 * @param productIds - Array of product IDs to remove
 * @returns Promise<ICollection | null> - Updated collection with populated products
 */
const removeProductsFromCollection = async (collectionId: string, productIds: string[]) => {
  // $pullAll removes all specified product IDs from the products array
  const result = await collection.findByIdAndUpdate(
    collectionId,
    { $pullAll: { products: productIds } },
    { new: true }
  ).populate("products");
  return result;
};

const CollectionServices = {
  createCollectionIntoDb,
  getAllCollectionsFromDb,
  getSingleCollectionFromDb,
  updateCollectionIntoDb,
  deleteCollectionFromDb,
  addProductsToCollection,
  removeProductsFromCollection,
};

export default CollectionServices;
