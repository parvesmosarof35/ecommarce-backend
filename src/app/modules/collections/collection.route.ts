import express from "express";
import CollectionControllers from "./collection.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin only routes - Create, Update, Delete collections
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.createCollection);
router.put("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.updateCollection);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.deleteCollection);
router.post("/:collectionId/products", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.addProductsToCollection);
router.delete("/:collectionId/products", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.removeProductsFromCollection);

// Public routes - Get collections
router.get("/", CollectionControllers.getAllCollections);
router.get("/:id", CollectionControllers.getSingleCollection);

export default router;