import express from 'express';
import validationRequest from '../../middlewares/validationRequest';
import { SubscriberValidation } from './subscriber.validation';
import { SubscriberControllers } from './subscriber.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  validationRequest(SubscriberValidation.createSubscriberValidationSchema),
  SubscriberControllers.subscribe
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SubscriberControllers.getAllSubscribers
);

export const SubscriberRoutes = router;
