import mongoose from "mongoose";
import Offering from "../model/Offering";
import OfferingController from "../controllers/offeringController"; // Import the OfferingController class
import { Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { translate, initI18n } from "../utils/i18n";
let mongoServer: MongoMemoryServer;

describe("OfferingController.updateOffering method", () => {
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
    //   params: { offering_id: new mongoose.Types.ObjectId().toString() },
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

  it("should update a  if the offering_id and fields are valid", async () => {
    const offeringId = new mongoose.Types.ObjectId().toString();

    // Mock a Mongoose document with `toObject` method
    const currentOffering = {
      offering_id: offeringId,
      name: "Old Listing Name",
    };

    const updates = {
      name: "Updated Listing Name",
    };
    req = {
      params: { offering_id: offeringId },
      body: updates,
    };

    // Mock the findOne method to return an object with `toObject` method
    const mockCurrentOffering = {
      ...currentOffering,
      toObject: jest.fn().mockReturnValue(currentOffering),
    };
    jest
      .spyOn(Offering, "findOne")
      .mockResolvedValue(mockCurrentOffering as any);
    jest
      .spyOn(Offering, "findOneAndUpdate")
      .mockResolvedValue({ ...currentOffering, ...updates } as any);

    const updatedOffering = await OfferingController.updateOffering(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Offering.findOne).toHaveBeenCalledWith({
      offering_id: offeringId,
      isDeleted: false,
    });
  });

  it("should return 404 if the Offering is not found", async () => {
    // Mock the findOneAndUpdate method to simulate a Offering not found
    jest.spyOn(Offering, "findOneAndUpdate").mockResolvedValue(null);

    req.body = {
      name: "Updated Offering Name",
    };

    // Call the updateOffering method from OfferingController
    await OfferingController.updateOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("OFFERING_NOT_FOUND"),
    });
  });

  it("should return 400 if the offering_id is invalid", async () => {
    // Set an invalid offering_id
    req.params!.offering_id = "invalidId";

    // Call the updateOffering method from OfferingController
    await OfferingController.updateOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_OFFERING_ID"),
    });
  });

  it("should return 400 if the name is invalid", async () => {
    // Set an invalid name in the request body
    req.body = {
      name: 123, // Invalid type
    };

    // Call the updateOffering method from OfferingController
    await OfferingController.updateOffering(req as Request, res as Response);

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

    // Call the updateOffering method from OfferingController
    await OfferingController.updateOffering(req as Request, res as Response);

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

    // Call the updateOffering method from OfferingController
    await OfferingController.updateOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_PROPERTY_HIGHLIGHTS"),
    });
  });
});
