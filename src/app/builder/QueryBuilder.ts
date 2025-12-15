import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      const stringFields = searchableFields.filter((field) => {
        const schemaPath = this.modelQuery.model.schema.path(field);
        return schemaPath && schemaPath.instance === "String";
      });

      this.modelQuery = this.modelQuery.find({
        $or: stringFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    let queryObject = { ...this.query };
    
    // Handle maxPrice range filtering
    if (this.query && this.query.maxPrice) {
      queryObject.price = {
        $gte: Number(this.query.minPrice) || 0,
        $lte: Number(this.query.maxPrice),
      };
    }
    
    // Handle maxpricerange (alternative parameter name)
    if (this.query && this.query.maxpricerange) {
      queryObject.price = {
        $gte: Number(this.query.minPrice) || 0,
        $lte: Number(this.query.maxpricerange),
      };
    }
    
    if (this.query?.releaseDate) {
      queryObject.releaseDate = {
        $gte: this.query?.releaseDate as string,
        $lte: this.query?.releaseDate as string,
      };
    }

    // Handle categories filtering
    if (this.query?.categories) {
      const categories = Array.isArray(this.query.categories) 
        ? this.query.categories 
        : [this.query.categories];
      queryObject.categories = { $in: categories };
    }

    // Handle skintype filtering
    if (this.query?.skintype) {
      const skinTypes = Array.isArray(this.query.skintype) 
        ? this.query.skintype 
        : [this.query.skintype];
      queryObject.skintype = { $in: skinTypes };
    }

    // Handle ingredients filtering
    if (this.query?.ingredients) {
      const ingredients = Array.isArray(this.query.ingredients) 
        ? this.query.ingredients 
        : [this.query.ingredients];
      queryObject.ingredients = { $in: ingredients };
    }

    // Remove only non-filter fields that are not part of the query conditions
    const excludeField = ["searchTerm", "sort", "limit", "page", "fields", "minPrice", "maxPrice", "maxpricerange", "releaseDate"];
    excludeField.forEach((el) => delete queryObject[el]);

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  

  paginate() {
    const limit = Math.max(Number(this.query.limit) || 10, 1);
    const page = Math.max(Number(this.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const field =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(field);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
