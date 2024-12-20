import { Request, Response, NextFunction } from 'express';
import { i18next } from '../utils/i18n';

const setLocale = (req: Request, res: Response, next: NextFunction) => {
  
  // const lang = req.query.lang || req.cookies.lang || 'en'; // Check query parameter, cookie, or default to 'en'
  const lang = req.query.lang  || 'en'; 
  
  i18next.changeLanguage(lang as string); // Change language in i18next
  next();
};

export default setLocale;