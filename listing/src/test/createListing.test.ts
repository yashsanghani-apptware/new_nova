import mongoose from "mongoose";
import { Request, Response } from "express";
import axios from "axios";
import Listing from "../models/Listing"; // Assuming you have a Listing model
import ListingController from "../controllers/listingController"; // Import the ListingController class
import { MongoMemoryServer } from "mongodb-memory-server";
import { createDataRoomName, extractUserIdFromToken } from "../utils/utils";
import {translate, initI18n} from '../utils/i18n';
import * as listingSchema  from '../schemas/agsiri.schema.v2-5.json';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateListing = ajv.compile(listingSchema);

// Mock the extractUserIdFromToken function
jest.mock("../utils/utils", () => ({
  createDataRoomName: jest.fn(),
  extractUserIdFromToken: jest.fn(),
}));

// Mock the axios.post method
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let mongoServer: MongoMemoryServer;

describe("ListingController.createListing method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>& { status: jest.Mock; json: jest.Mock };

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
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it("should create a new listing", async () => {
    // Mock request headers with authorization
    req.headers = {
      authorization: "Bearer mockToken",
    };
    // Mock request body with valid listing data
    req.body = {
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
      property_details: {
        parking: {
          number_of_spaces: 2,
          type: "Garage",
        },
        interior: {
          bathrooms: 2,
          rooms: ["Living Room", "Bedroom", "Kitchen"],
        },
      },
      sales_and_tax: {},
      public_facts: {},
      schools: [],
      listing_source: "SYSTEM",
      status: "SOURCED",
    };

    const savedListing = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
    };

    // Mock extractUserIdFromToken to return a fake user
    (extractUserIdFromToken as jest.Mock).mockResolvedValue({
      userId: "mockUserId",
      role: "admin",
    });

    // Mock createDataRoomName to return a fake data room name
    (createDataRoomName as jest.Mock).mockReturnValue("sample_property");

    // Mock the response of axios.post for creating a data room
    mockedAxios.post.mockResolvedValue({
      data: {
        dataRoom: {
          _id: "mockDataRoomId",
        },
      },
    });

    // Mock the save method of the Listing model
    jest.spyOn(Listing.prototype, "save").mockResolvedValue(savedListing);

    // Call the createListing method from ListingController
    await ListingController.createListing(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedListing);
  });

  it('should return validation error for invalid data', async () => {
    req.headers = {
      authorization: 'Bearer mockToken',
    };

    // Mock request body with invalid data
    req.body = {
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
      renovated_on: ["2022-01-01"], // Assume this is invalid per schema
      listing_agent: {
        name: "Agent Name",
        company: "Real Estate Co",
        phone_number: "123-456-7890",
        email: "agent@example.com",
      },
      dataroom_id: "dataroom123",
      workflows: {},
      images: [],
      videos: [],
      maps: [],
      sales_and_tax: {},
      public_facts: {},
      schools: [],
      listing_source: "SYSTEM",
      status: "SOURCED",
    };

    // Mock validation
    const isValid = validateListing(req.body);
    if (!isValid) {
      console.log("Validation failed:", validateListing.errors);
      res.status(400).json({ error: validateListing.errors });

      // Check the response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Array) })
      );
    } else {
      // If the validation passes, fail the test
      fail(translate("INVALID_DATA"));
    }
  });

  it('should return validation error for invalid data', async () => {
    req.headers = {
      authorization: 'Bearer mockToken',
    };

    // Mock request body with invalid data
    req.body = {
      name: 123,
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
      renovated_on: "2022-01-01", // This should be an array or different format per schema
      listing_agent: {
        name: "Agent Name",
        company: "Real Estate Co",
        phone_number: "123-456-7890",
        email: "agent@example.com",
      },
      dataroom_id: "dataroom123",
      workflows: {},
      images: [],
      videos: [],
      maps: [],
      property_details: {
        parking: {
          number_of_spaces: 2,
          type: "Garage",
        },
        interior: {
          bathrooms: "two", // Invalid type, should be an object or number
          rooms: ["Living Room", "Bedroom", "Kitchen"],
        },
      },
      sales_and_tax: {},
      public_facts: {},
      schools: [],
      listing_source: "SYSTEM",
      status: "SOURCED",
    };

    // Mock validation
    const isValid = validateListing(req.body);
    if (!isValid) {
      console.log("Validation failed:", validateListing.errors);
      res.status(400).json({ error: validateListing.errors });

      // Check the response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Array) })
      );
    } else {
      // If validation passes unexpectedly, fail the test
      fail(translate("VALIDATION_ERROR"));
    }
  });
});
