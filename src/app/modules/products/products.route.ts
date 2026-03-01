import express from "express";
import ProductControllers from "./products.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";

const router = express.Router();

// Admin only routes - Create, Update, Delete products
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("images", 8),
  (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        const jsonData = JSON.parse(req.body.data);
        req.body = { ...req.body, ...jsonData };
        delete req.body.data;
      }

      // Parse numeric fields from strings - handling optionality and preventing NaN
      if (req.body.price !== undefined && req.body.price !== "" && req.body.price !== "NaN") {
        const parsedPrice = parseFloat(req.body.price as string);
        if (!isNaN(parsedPrice)) {
          req.body.price = parsedPrice;
        } else {
          delete req.body.price; // Keep old price if invalid
        }
      } else if (req.body.price === "" || req.body.price === "NaN") {
        delete req.body.price;
      }

      if (req.body.stock_quantity !== undefined && req.body.stock_quantity !== "" && req.body.stock_quantity !== "NaN") {
        const parsedStock = parseInt(req.body.stock_quantity as any);
        if (!isNaN(parsedStock)) {
          req.body.stock_quantity = parsedStock;
        } else {
          req.body.stock_quantity = 0; // Default to 0 if invalid
        }
      } else if (req.body.stock_quantity === "" || req.body.stock_quantity === "NaN") {
        req.body.stock_quantity = 0; // Default to 0 if empty
      }

      // Handle optional SKU - Remove if empty to allow it to be optional in the DB
      if (req.body.sku === "" || req.body.sku === "NaN" || req.body.sku === null) {
        delete req.body.sku;
      }

      if (req.body.isFeatured && typeof req.body.isFeatured === "string") {
        req.body.isFeatured =
          req.body.isFeatured === "true" || req.body.isFeatured === "1";
      }

      if (req.body.description && typeof req.body.description === "string") {
        req.body.description = req.body.description.trim();
        if (req.body.description === "") {
          delete req.body.description;
        }
      }

      // product_link handling
      if (req.body.product_link && typeof req.body.product_link === "string") {
        req.body.product_link = req.body.product_link.trim();
      }

      // Handle optional array fields from form data
      if (req.body.categories && typeof req.body.categories === "string") {
        req.body.categories = req.body.categories
          .split(",")
          .map((item: string) => item.trim());
      }
      // skintype is now a single value, case-sensitive (exact match required)
      if (req.body.skintype && typeof req.body.skintype === "string") {
        req.body.skintype = req.body.skintype.trim();
      }
      // ingredients is now an array, case-sensitive (exact match required)
      if (req.body.ingredients && typeof req.body.ingredients === "string") {
        req.body.ingredients = req.body.ingredients
          .split(",")
          .map((item: string) => item.trim());
      }
      // collections is now an array, filter out empty strings
      if (req.body.collections && typeof req.body.collections === "string") {
        req.body.collections = req.body.collections
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (Array.isArray(req.body.collections)) {
        req.body.collections = req.body.collections.filter(
          (item: any) => item !== "" && item !== null && item !== undefined
        );
      }

      // Handle uploaded images - pass file objects to service for Cloudinary upload
      if (req.files && Array.isArray(req.files)) {
        req.body.imageFiles = req.files as Express.Multer.File[];
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  ProductControllers.createProduct
);


router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("images", 8),
  (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        const jsonData = JSON.parse(req.body.data);
        req.body = { ...req.body, ...jsonData };
        delete req.body.data;
      }

      // Parse numeric fields from strings - handling optionality and preventing NaN
      if (req.body.price !== undefined && req.body.price !== "" && req.body.price !== "NaN") {
        const parsedPrice = parseFloat(req.body.price as string);
        if (!isNaN(parsedPrice)) {
          req.body.price = parsedPrice;
        } else {
          delete req.body.price; // Keep old price if invalid
        }
      } else if (req.body.price === "" || req.body.price === "NaN") {
        delete req.body.price;
      }

      if (req.body.stock_quantity !== undefined && req.body.stock_quantity !== "" && req.body.stock_quantity !== "NaN") {
        const parsedStock = parseInt(req.body.stock_quantity as any);
        if (!isNaN(parsedStock)) {
          req.body.stock_quantity = parsedStock;
        } else {
          req.body.stock_quantity = 0; // Update to 0 if invalid
        }
      } else if (req.body.stock_quantity === "" || req.body.stock_quantity === "NaN") {
        req.body.stock_quantity = 0; // Update to 0 if empty
      }

      // Handle optional SKU - Remove if empty to allow it to be optional in the DB
      if (req.body.sku === "" || req.body.sku === "NaN" || req.body.sku === null) {
        delete req.body.sku;
      }

      if (req.body.isFeatured && typeof req.body.isFeatured === "string") {
        req.body.isFeatured =
          req.body.isFeatured === "true" || req.body.isFeatured === "1";
      }

      if (req.body.description && typeof req.body.description === "string") {
        req.body.description = req.body.description.trim();
        if (req.body.description === "") {
          req.body.description = null; // Signal service to clear
        }
      }

      // product_link handling
      if (req.body.product_link && typeof req.body.product_link === "string") {
        req.body.product_link = req.body.product_link.trim();
      }

      // Handle optional array fields from form data
      if (req.body.categories && typeof req.body.categories === "string") {
        req.body.categories = req.body.categories
          .split(",")
          .map((item: string) => item.trim());
      }
      // skintype is now a single value, case-sensitive (exact match required)
      if (req.body.skintype && typeof req.body.skintype === "string") {
        req.body.skintype = req.body.skintype.trim();
      }
      // ingredients is now an array, case-sensitive (exact match required)
      if (req.body.ingredients && typeof req.body.ingredients === "string") {
        req.body.ingredients = req.body.ingredients
          .split(",")
          .map((item: string) => item.trim());
      }
      // collections is now an array, filter out empty strings
      if (req.body.collections && typeof req.body.collections === "string") {
        req.body.collections = req.body.collections
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (Array.isArray(req.body.collections)) {
        req.body.collections = req.body.collections.filter(
          (item: any) => item !== "" && item !== null && item !== undefined
        );
      }

      // Handle uploaded images for update - pass file objects to service for Cloudinary upload
      if (req.files && Array.isArray(req.files)) {
        req.body.imageFiles = req.files as Express.Multer.File[];
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  ProductControllers.updateProduct
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductControllers.deleteProduct
);

// Public routes - Get products
router.get("/", ProductControllers.getAllProducts);

// Fast search endpoint - returns only id, name, and first image
router.get("/search", ProductControllers.searchProducts);

router.get("/getrelatedproducts/:id", ProductControllers.getRelatedProducts);

router.get("/getfeaturedproducts", ProductControllers.getFeaturedProducts);

router.get(
  "/collection/:collectionId",
  ProductControllers.getProductsByCollection
);
router.get("/:id", ProductControllers.getSingleProduct);

export default router;
