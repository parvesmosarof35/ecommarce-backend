import express from 'express';
import { AnalyticsControllers } from './analytics.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Tracking endpoints (Publicly accessible for frontend tracking)
router.post('/visit', AnalyticsControllers.recordSiteVisit);
router.post('/product/:id/click', AnalyticsControllers.recordProductClick);
router.post('/product/:id/visit', AnalyticsControllers.recordProductVisit);
router.post('/product/:id/cart', AnalyticsControllers.recordAddToCart);
router.post('/product/:id/wishlist', AnalyticsControllers.recordAddToWishlist);

// Dashboard endpoints (Admin only)
router.get('/overview', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AnalyticsControllers.getAnalyticsOverview);
router.get('/products', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AnalyticsControllers.getProductAnalytics);

export const AnalyticsRoutes = router;
