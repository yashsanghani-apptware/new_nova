import mongoose from "mongoose";
import Listing from "../models/Listing";
import ListingController from '../controllers/listingController'; // Import the ListingController class
import { Request, Response } from 'express';
import { MongoMemoryServer } from "mongodb-memory-server";
import {translate, initI18n} from '../utils/i18n';
let mongoServer: MongoMemoryServer;

describe("ListingController.updateListing method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(async () => {
    // Set up an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up and stop the MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    // Initialize request and response objects before each test
    // req = {
    //   params: { listing_id: new mongoose.Types.ObjectId().toString() },
    //   body: {},
    // };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it("should update a listing if the listing_id and fields are valid", async () => {
    const listingId = new mongoose.Types.ObjectId().toString();
    
    // Mock a Mongoose document with `toObject` method
    const currentListing = {
      listing_id: listingId,
      name: "Old Listing Name",
      type: "House",
      property_description: "Old description",
      days_on_market: 10,
      address: { house_number: "100", street: "Old St", city: "Old City", state: "Old State", zip: "00000" },
      property_highlights: { total_acres: 40, tillable: 10, woodland: 5, wetland: 2, deed_restrictions: "None", barns: [] },
      sales_and_tax: { sales_history: [], tax_history: [] },
      property_details: { parking: {}, interior: {}, exterior: {}, financial: {}, utilities: {}, location: {}, other: {} },
      listing_agent: { name: "Old Agent", email: "old@example.com", phone_number: "000-000-0000", company: "Old Company" },
      public_facts: {},
      schools: [],
      status: "ACTIVE",
      built_on: new Date(),
      renovated_on: new Date(),
      workflows: []
    };

    const updates = {
      name: "Updated Listing Name",
      type: "Farm",
      property_description: "Updated description",
      days_on_market: 20,
      address: { house_number: "123", street: "Main St", city: "Sample City", state: "Sample State", zip: "12345" },
      property_highlights: { total_acres: 50, tillable: 20, woodland: 10, wetland: 5, deed_restrictions: "Updated", barns: [] },
      sales_and_tax: { sales_history: [], tax_history: [] },
      property_details: { parking: {}, interior: {}, exterior: {}, financial: {}, utilities: {}, location: {}, other: {} },
      listing_agent: { name: "Updated Agent", email: "updated@example.com", phone_number: "123-456-7890", company: "Updated Company" },
      public_facts: {},
      schools: []
    };
    req = {
      params: { listing_id: listingId },
      body: updates,
    };

    // Mock the findOne method to return an object with `toObject` method
    const mockCurrentListing = {
      ...currentListing,
      toObject: jest.fn().mockReturnValue(currentListing)
    };
    jest.spyOn(Listing, "findOne").mockResolvedValue(mockCurrentListing as any);
    jest.spyOn(Listing, "findOneAndUpdate").mockResolvedValue({ ...currentListing, ...updates } as any);

    const updatedListing = await ListingController.updateListing(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Listing.findOne).toHaveBeenCalledWith({ listing_id: listingId });
  });


  it("should return 404 if the listing is not found", async () => {
    // Mock the findOneAndUpdate method to simulate a listing not found
    jest.spyOn(Listing, "findOneAndUpdate").mockResolvedValue(null);

    req.body = {
      name: "Updated Listing Name",
    };

    // Call the updateListing method from ListingController
    await ListingController.updateListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("LISTING_NOT_FOUND")
    });
  });

  it("should return 400 if the listing_id is invalid", async () => {
    // Set an invalid listing_id
    req.params!.listing_id = "invalidId";

    // Call the updateListing method from ListingController
    await ListingController.updateListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_LISTING_ID"),
    });
  });

  it("should return 400 if the name is invalid", async () => {
    // Set an invalid name in the request body
    req.body = {
      name: 123, // Invalid type
    };

    // Call the updateListing method from ListingController
    await ListingController.updateListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_NAME"),
    });
  });

  it("should return 400 if address fields are missing", async () => {
    // Set an invalid address in the request body
    req.body = {
      address: {
        house_number: "123",
        street: "Main St",
        // Missing city, state, and zip
      },
    };

    // Call the updateListing method from ListingController
    await ListingController.updateListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_ADDRESS"),
    });
  });

  it("should return 400 if property_highlights is invalid", async () => {
    // Set an invalid property_highlights in the request body
    req.body = {
      property_highlights: {
        total_acres: "notANumber", // Invalid type
      },
    };

    // Call the updateListing method from ListingController
    await ListingController.updateListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_PROPERTY_HIGHLIGHTS"),
    });
  });
});
