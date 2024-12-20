import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Offering from "../model/Offering";
import OfferingController from "../controllers/offeringController"; // Import the OfferingController class
import { translate, initI18n } from "../utils/i18n";
import config from "../config";
import axios from "axios";

let mongoServer: MongoMemoryServer;

describe("Offering Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
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
    // Initialize the response object before each test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    // Clear database and mocks after each test
    await Offering.deleteMany({});
    jest.clearAllMocks();
  });

  describe("getOffering method", () => {
    it("should return a Offering if the id is valid", async () => {
      const offeringObj = new Offering({
        _id: new mongoose.Types.ObjectId(),
        offering_id: new mongoose.Types.ObjectId().toString(),
        listing_id: "66d5a1ab921544e12cd82314",
        name: "Sample Property",
      });

      await offeringObj.save();

      req = {
        params: { offering_id: offeringObj.offering_id ?? "" },
        headers: { authorization: `Bearer ${token.token}` },
      };

      // Call the getOffering method from OfferingController
      await OfferingController.getOffering(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if the offering is not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      req = {
        params: { offering_id: validObjectId.toString() },
        headers: { Authorization: `Bearer ${token.token}` },
      };

      // Call the getOffering method from OfferingController
      await OfferingController.getOffering(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("OFFERING_NOT_FOUND"),
      });
    });

    it("should return 400 if the Offering_id is invalid", async () => {
      const invalidId = "6697869c79860840b6111af39";

      req = {
        params: { offering_id: invalidId },
        headers: { Authorization: `Bearer ${token.token}` },
      };

      // Call the getOffering method from OfferingController
      await OfferingController.getOffering(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("INVALID_OFFERING_ID"),
      });
    });
  });

  describe("getAllOfferings method", () => {
    beforeEach(async () => {
      const offering = [
        {
          _id: new mongoose.Types.ObjectId(),
          offering_id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: "Sample Property 3",
        },
        {
          _id: new mongoose.Types.ObjectId(),
          offering_id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: "Sample Property 2",
        },
      ];
      await Offering.insertMany(offering);
    });

    it("should return a Offering of all data rooms", async () => {
      req = {};

      // Call the getAllOfferings method from OfferingController
      await OfferingController.getAllofferings(req as Request, res as Response);

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
