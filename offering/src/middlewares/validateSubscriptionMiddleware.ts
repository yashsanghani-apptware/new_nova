import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import * as subscriptionSchema from '../schemas/agsiri.schema.v2-5.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validateSubscription = ajv.compile(subscriptionSchema);

export const validateSubscriptionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validateSubscription(req.body);
  if (!isValid) {
    console.error('Validation failed:', validateSubscription.errors);
    return res.status(400).json({ error: validateSubscription.errors });
  }
  next();
};