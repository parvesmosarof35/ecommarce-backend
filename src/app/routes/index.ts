import express from "express";
import contactRoutes from "../modules/contact/contact.router";
import AuthRouter from "../modules/auth/auth.routes";
import UserRouters from "../modules/user/user.routes";
import SettingsRoutes from "../modules/settings/settings.routres";
import BlogsRoutes from "../modules/blogs/blogs.routes";
import FaqRoutes from "../modules/faq/faq.routes";
import ProductRoutes from "../modules/products/products.route";
import CollectionRoutes from "../modules/collections/collection.route";
import ReviewRoutes from "../modules/reviews/reviews.route";
import WishlistRoutes from "../modules/wishlists/wishlists.route";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/user",
    route: UserRouters,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/collection",
    route: CollectionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/wishlist",
    route: WishlistRoutes,
  },
  {
    path: "/setting",
    route: SettingsRoutes,
  },
  {
    path: "/blogs",
    route: BlogsRoutes,
  },
  {
    path: "/faq",
    route: FaqRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
