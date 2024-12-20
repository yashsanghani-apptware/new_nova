import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Listing from "../models/Listing";
import ListingController from "../controllers/listingController"; // Import the ListingController class
import {translate, initI18n} from '../utils/i18n';

let mongoServer: MongoMemoryServer;

describe("Listing Controller", () => {
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
    // Initialize the response object before each test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    // Clear database and mocks after each test
    await Listing.deleteMany({});
    jest.clearAllMocks();
  });

  describe("getListing method", () => {
    it("should return a listing if the id is valid", async () => {
      const listingObj = new Listing({
        _id: new mongoose.Types.ObjectId(),
        listing_id: new mongoose.Types.ObjectId(),
        name: "Sample Property",
        address: {
          house_number: "123",
          street: "Main St",
          city: "Sample City",
          state: "SC",
          zip: "12345",
        },
        property_description: "A beautiful property",
        property_highlights: {
          total_acres: 5,
          tillable: 2,
          woodland: 1,
          wetland: 0.5,
          deed_restrictions: "None",
          barns: [],
        },
        days_on_market: 10,
        type: "Residential",
        built_on: "2020-01-01",
        renovated_on: "2022-01-01",
        listing_agent: {
          name: "Agent Name",
          company: "Real Estate Co",
          phone_number: "123-456-7890",
          email: "agent@example.com",
        },
        dataroom_id: "dataroom123",
        workflows: [],
        images: [],
        videos: [],
        maps: [],
        sales_and_tax: {},
        public_facts: {},
        schools: [],
        listing_source: "SYSTEM",
        status: "SOURCED",
      });

      await listingObj.save();

      req = {
        params: {
          listing_id: (
            listingObj.listing_id as mongoose.Types.ObjectId
          ).toString(),
        },
      };

      // Call the getListing method from ListingController
      await ListingController.getListing(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listing_id: listingObj.listing_id,
          name: listingObj.name,
        })
      );
    });

    it("should return 404 if the listing is not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      req = { params: { listing_id: validObjectId.toString() } };

      // Call the getListing method from ListingController
      await ListingController.getListing(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("LISTING_NOT_FOUND")
      });
    });

    it("should return 400 if the listing_id is invalid", async () => {
      const invalidId = "6697869c79860840b6111af39";

      req = { params: { listing_id: invalidId } };

      // Call the getListing method from ListingController
      await ListingController.getListing(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("INVALID_LISTING_ID")
      });
    });
  });

  describe("getAllListings method", () => {
    beforeEach(async () => {
      const listings = [
        {
          _id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: "Sample Property 3",
          address: {
            house_number: "123",
            street: "Main St",
            city: "Sample City",
            state: "SC",
            zip: "12345",
          },
          property_description: "A beautiful property",
          property_highlights: {
            total_acres: 5,
            tillable: 2,
            woodland: 1,
            wetland: 0.5,
            deed_restrictions: "None",
            barns: [],
          },
          days_on_market: 10,
          type: "Residential",
          built_on: "2020-01-01",
          renovated_on: "2022-01-01",
          listing_agent: {
            name: "Agent Name",
            company: "Real Estate Co",
            phone_number: "123-456-7890",
            email: "agent@example.com",
          },
          dataroom_id: "dataroom123",
          workflows: [],
          images: [],
          videos: [],
          maps: [],
          sales_and_tax: {},
          public_facts: {},
          schools: [],
          listing_source: "SYSTEM",
          status: "SOURCED",
        },
        {
          _id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: "Sample Property 2",
          address: {
            house_number: "123",
            street: "Main St",
            city: "Sample City",
            state: "SC",
            zip: "12345",
          },
          property_description: "A beautiful property",
          property_highlights: {
            total_acres: 5,
            tillable: 2,
            woodland: 1,
            wetland: 0.5,
            deed_restrictions: "None",
            barns: [],
          },
          days_on_market: 10,
          type: "Residential",
          built_on: "2020-01-01",
          renovated_on: "2022-01-01",
          listing_agent: {
            name: "Agent Name",
            company: "Real Estate Co",
            phone_number: "123-456-7890",
            email: "agent@example.com",
          },
          dataroom_id: "dataroom123",
          workflows: [],
          images: [],
          videos: [],
          maps: [],
          sales_and_tax: {},
          public_facts: {},
          schools: [],
          listing_source: "SYSTEM",
          status: "SOURCED",
        },
      ];
      await Listing.insertMany(listings);
    });

    it("should return a list of all data rooms", async () => {
      req = {};

      // Call the getAllListings method from ListingController
      await ListingController.getAllListings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: "Sample Property 3" }),
          expect.objectContaining({ name: "Sample Property 2" }),
        ])
      );
    });
  });
});
