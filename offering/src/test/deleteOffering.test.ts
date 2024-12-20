import mongoose from "mongoose";
import { Request, Response } from "express";
import Offering from "../model/Offering";
import OfferingController from "../controllers/offeringController"; // Import the ListingController class
import OfferingService from "../services/offeringServices";
import { translate, initI18n } from "../utils/i18n";

jest.mock("../model/Offering");

describe("OfferingController.deleteOffering method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Initialize request and response objects before each test
    req = {
      params: { offering_id: "66ed2140763a9dd0c03c16c6" },
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

  it("should return 404 if the offering is not found", async () => {
    // Mock the findOneAndDelete method to simulate a offering not found
    jest.spyOn(Offering, "findOneAndDelete").mockResolvedValue(null);

    // Call the deleteOffering method from OfferingController
    await OfferingController.deleteOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("OFFERING_NOT_FOUND"),
    });
  });

  it("should return 400 if the offering_id is invalid", async () => {
    // Set an invalid offering_id
    req.params!.offering_id = "invalidId";

    // Call the deleteOffering method from OfferingController
    await OfferingController.deleteOffering(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_OFFERING_ID"),
    });
  });

  it("should delete a Offering if the id is valid", async () => {
    const offeringId = new mongoose.Types.ObjectId().toString();
    req = { params: { offering_id: offeringId } };

    // Mock the deleted offering data
    const mockDeletedOffering = {
      offering_id: offeringId,
      name: "Test Offering",
      isDeleted: true,
    };

    // Mock the Offering.findOneAndUpdate call to return the updated offering
    (Offering.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockDeletedOffering
    );

    // Call the method
    await OfferingController.deleteOffering(req as Request, res as Response);

    // Expect the result to match the updated (deleted) offering data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      offering_id: offeringId,
      message: undefined,
    });
  });
});
