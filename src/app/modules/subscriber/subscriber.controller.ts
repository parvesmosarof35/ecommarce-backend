import httpStatus from 'http-status';
import catchAsync from '../../utils/asyncCatch';
import sendResponse from '../../utils/sendResponse';
import { SubscriberServices } from './subscriber.service';
import { Request, Response } from 'express';

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriberServices.subscribe(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscribed successfully!',
    data: result,
  });
});

const getAllSubscribers = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriberServices.getAllSubscribers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscribers retrieved successfully!',
    data: result,
  });
});

export const SubscriberControllers = {
  subscribe,
  getAllSubscribers,
};
