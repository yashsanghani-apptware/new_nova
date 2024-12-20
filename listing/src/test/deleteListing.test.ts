import mongoose from "mongoose";
import { Request, Response } from "express";
import Listing from "../models/Listing";
import ListingController from "../controllers/listingController"; // Import the ListingController class
import {translate, initI18n} from '../utils/i18n';

describe("ListingController.deleteListing method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Initialize request and response objects before each test
    req = {
      params: { listing_id: new mongoose.Types.ObjectId().toString() },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it("should delete a listing if the id is valid", async () => {
    const listing = {
      _id: new mongoose.Types.ObjectId().toString(),
      // Add other fields if necessary
    };

    // Mock the findOneAndDelete method to simulate a successful deletion
    jest.spyOn(Listing, "findOneAndDelete").mockResolvedValue(listing as any);

    // Call the deleteListing method from ListingController
    await ListingController.deleteListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("LISTING_DELETED"),
    });
  });

  it("should return 404 if the listing is not found", async () => {
    // Mock the findOneAndDelete method to simulate a listing not found
    jest.spyOn(Listing, "findOneAndDelete").mockResolvedValue(null);

    // Call the deleteListing method from ListingController
    await ListingController.deleteListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("LISTING_NOT_FOUND"),
    });
  });

  it("should return 400 if the listing_id is invalid", async () => {
    // Set an invalid listing_id
    req.params!.listing_id = "invalidId";

    // Call the deleteListing method from ListingController
    await ListingController.deleteListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_LISTING_ID"),
    });
  });
});
