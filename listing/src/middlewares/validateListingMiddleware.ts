import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import * as listingSchema from '../schemas/agsiri.schema.v2-5.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validateListing = ajv.compile(listingSchema);

export const validateListingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validateListing(req.body);
  if (!isValid) {
    console.error('Validation failed:', validateListing.errors);
    return res.status(400).json({ error: validateListing.errors });
  }
  next();
};