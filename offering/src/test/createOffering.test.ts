import mongoose from "mongoose";
import { Request, Response } from "express";
import Offering from "../model/Offering";
import OfferingController from "../controllers/offeringController";
import { MongoMemoryServer } from "mongodb-memory-server";
import axios from "axios";
import { translate } from "../utils/i18n";
import config from "../config";

// Mock axios for HTTP requests

let mongoServer: MongoMemoryServer;

describe("createOffering function", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };
  let token: any;

  beforeAll(async () => {
    // Set up an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    token = await axios
      .post(`${config.policyServiceUrl}/v1/auth/login`, {
        // Add your body content here, for example, login credentials
        username: "johndoe-2",
        password: "securePassword123",
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(translate("ERROR_FETCH_USER"), error.response.data);
      });

    if (!token) {
      throw new Error(translate("NO_USER_DATA"));
    }
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
    } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  afterEach(async () => {
    // Clear database and mocks after each test
    await Offering.deleteMany({});
    jest.clearAllMocks();
  });

  it("should create a new Offering", async () => {
    req = {
      body: {
        listing_id: "66e3d2f9c845e9f8818308ff",
        name: "Sample Property",
      },
      headers: { authorization: `Bearer ${token.token}` },
    };

    const savedOffering = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
    };

    // Mock the save method of the Offering model
    jest.spyOn(Offering.prototype, "save").mockResolvedValue(savedOffering);

    // Call the createOffering method from OfferingController
    await OfferingController.createOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedOffering);
  });

  it("should return an error if offering data is missing", async () => {
    req = {
      body: {
        listing_id: "valid_listing_id",
      },
      headers: { authorization: `Bearer ${token.token}` },
    };

    await OfferingController.createOffering(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("NO_OFFERING_DATA"),
      error: "",
    });
  });

  it("should return an error if file data is missing", async () => {
    req = {
      body: {
        listing_id: "valid_listing_id",
        name: "Sample Property",
      },
      headers: { authorization: `Bearer ${token.token}` },
    };

    await OfferingController.createOffering(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("NO_FILE_DATA"),
      error: "",
    });
  });
});
