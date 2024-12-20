import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import * as campaignSchema from '../schemas/campaignSchema.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validateCampaign = ajv.compile(campaignSchema);

export const validateCampaignMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validateCampaign(req.body);
  if (!isValid) {
    console.error('Validation failed:', validateCampaign.errors);
    return res.status(400).json({ error: validateCampaign.errors });
  }
  next();
};