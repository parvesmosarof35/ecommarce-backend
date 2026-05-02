import { z } from 'zod';

const createSubscriberValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
  }),
});

export const SubscriberValidation = {
  createSubscriberValidationSchema,
};
