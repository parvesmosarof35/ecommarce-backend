import httpStatus from 'http-status';
import catchAsync from '../../utils/asyncCatch';
import sendResponse from '../../utils/sendResponse';
import { AnalyticsServices } from './analytics.service';
import { Request, Response } from 'express';

const recordSiteVisit = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.recordSiteVisit(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site visit recorded',
    data: result,
  });
});

const recordProductClick = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.recordProductClick(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product click recorded',
    data: result,
  });
});

const recordProductVisit = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.recordProductVisit(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product visit recorded',
    data: result,
  });
});

const recordAddToCart = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.recordAddToCart(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add to cart recorded',
    data: result,
  });
});

const recordAddToWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.recordAddToWishlist(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add to wishlist recorded',
    data: result,
  });
});

const getAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAnalyticsOverview();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics overview retrieved successfully',
    data: result,
  });
});

const getProductAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getProductAnalytics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product analytics retrieved successfully',
    data: result,
  });
});

export const AnalyticsControllers = {
  recordSiteVisit,
  recordProductClick,
  recordProductVisit,
  recordAddToCart,
  recordAddToWishlist,
  getAnalyticsOverview,
  getProductAnalytics,
};
