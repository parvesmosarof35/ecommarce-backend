import express from "express";
import ProductControllers from "./products.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin only routes - Create, Update, Delete products
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ProductControllers.createProduct);
router.put("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ProductControllers.updateProduct);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ProductControllers.deleteProduct);

// Public routes - Get products
router.get("/", ProductControllers.getAllProducts);
router.get("/newest", ProductControllers.getNewestProducts);
router.get("/oldest", ProductControllers.getOldestProducts);
router.get("/price-range", ProductControllers.getProductsByPriceRange);
router.get("/collection/:collectionId", ProductControllers.getProductsByCollection);
router.get("/:id", ProductControllers.getSingleProduct);

export default router;