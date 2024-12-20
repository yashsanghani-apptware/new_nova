import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import fileUpload from 'express-fileupload';
import path from "path";
import logger from "./logger/logger";
import Listing from "./routers/listingRouters";
import { i18next, initI18n } from "./utils/i18n";
import setLocale from "./middlewares/i18n.middleware";
import cors  from "cors";

// Initialize dotenv to load environment variables
dotenv.config();

import config from "./config/config";

const app = express();

// Allow all origins or specify allowed origins
app.use(cors({
  origin: '*',  // You can replace this with '*'
}));

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
  app.use("/listings",Listing);

});



  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });




export default app;
