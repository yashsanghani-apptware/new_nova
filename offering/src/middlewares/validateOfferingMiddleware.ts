import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import * as offeringSchema from '../schemas/agsiri.schema.v2-5.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validateOffering = ajv.compile(offeringSchema);

export const validateOfferingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validateOffering(req.body);
  if (!isValid) {
    console.error('Validation failed:', validateOffering.errors);
    return res.status(400).json({ error: validateOffering.errors });
  }
  next();
};