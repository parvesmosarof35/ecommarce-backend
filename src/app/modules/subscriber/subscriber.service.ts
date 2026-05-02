import { Subscriber } from './subscriber.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const subscribe = async (payload: { email: string }) => {
  const isExist = await Subscriber.findOne({ email: payload.email });
  if (isExist) {
    if (!isExist.isSubscribed) {
      isExist.isSubscribed = true;
      await isExist.save();
      return isExist;
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already subscribed!', '');
  }

  const result = await Subscriber.create(payload);
  return result;
};

const getAllSubscribers = async () => {
  const result = await Subscriber.find().sort({ createdAt: -1 });
  return result;
};

export const SubscriberServices = {
  subscribe,
  getAllSubscribers,
};
