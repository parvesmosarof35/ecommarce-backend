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
        req.body = JSON.parse(req.body.data);
      }
      
      // Handle optional array fields from form data
      if (req.body.categories && typeof req.body.categories === 'string') {
        req.body.categories = req.body.categories.split(',').map((item: string) => item.trim());
      }
      if (req.body.skintype && typeof req.body.skintype === 'string') {
        req.body.skintype = req.body.skintype.split(',').map((item: string) => item.trim());
      }
      if (req.body.ingredients && typeof req.body.ingredients === 'string') {
        req.body.ingredients = req.body.ingredients.split(',').map((item: string) => item.trim());
      }
      
      next();
    } catch (error) {
      next(error);
    }
  },
  ProductControllers.createProduct
);
router.put("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ProductControllers.updateProduct);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ProductControllers.deleteProduct);

// Public routes - Get products
router.get("/", ProductControllers.getAllProducts);
router.get("/collection/:collectionId", ProductControllers.getProductsByCollection);
router.get("/:id", ProductControllers.getSingleProduct);

export default router;