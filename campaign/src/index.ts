import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import fileUpload from 'express-fileupload';
import path from "path";
import logger from "./logger/logger";
import Campaign from "./routers/campaignRouters";
import { i18next, initI18n } from "./utils/i18n";
import setLocale from "./middlewares/i18n.middleware";

// Initialize dotenv to load environment variables
dotenv.config();

import config from "./config/config";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(fileUpload());

// Connect to MongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => {
    logger.info("MONGO is connected")
    console.log("MONGO is connected")
  })
  .catch((err: Error) => logger.info("MongoDB connection error:", err));
// Define routes

 // // Initialize i18n before setting locale middleware
initI18n().then(() => {
  app.use(setLocale); // Use the setLocale middleware
  app.use("/api/campaigns", Campaign);

});



  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });




export default app;
