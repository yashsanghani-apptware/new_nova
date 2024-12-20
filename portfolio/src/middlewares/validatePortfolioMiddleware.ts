import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Request, Response, NextFunction } from "express";
import * as portfolioSchema from "../schemas/agsiri.schema.v2-5.json";

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validatePortfolio = ajv.compile(portfolioSchema);

export const validatePortfolioMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = validatePortfolio(req.body);
  if (!isValid) {
    console.error("Validation failed:", validatePortfolio.errors);
    return res.status(400).json({ error: validatePortfolio.errors });
  }
  next();
};
