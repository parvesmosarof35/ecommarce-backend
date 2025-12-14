import express from "express";
import WishlistControllers from "./wishlists.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Authenticated user routes - Add, Remove, Clear wishlist items
router.post("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.addToWishlist);
router.get("/my-wishlist", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.getMyWishlist);
router.get("/check/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.checkIfProductInWishlist);
router.delete("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.removeFromWishlist);
router.delete("/clear", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.clearMyWishlist);
router.get("/count", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.getMyWishlistCount);

// Admin only routes - Get all wishlist items
router.get("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.getAllWishlistItems);

// User and Admin routes - Get specific wishlist items and user wishlists
router.get("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.getSingleWishlistItem);
router.get("/user/:userId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.getWishlistByUser);
router.delete("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), WishlistControllers.deleteWishlistItem);

export default router;
