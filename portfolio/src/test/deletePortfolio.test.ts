import mongoose from "mongoose";
import { Request, Response } from "express";
import Offering from "../model/Portfolio";
import OfferingController from "../controllers/portfolioController"; // Import the ListingController class
import OfferingService from "../services/portfolioServices";
import { translate, initI18n } from "../utils/i18n";
import portfolioController from "../controllers/portfolioController";
import Portfolio from "../model/Portfolio";

jest.mock("../model/Portfolio");

describe("PortfolioController.deleteOffering method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Initialize request and response objects before each test
    req = {
      params: { portfolio_id: "66ed2140763a9dd0c03c16c6" },
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
    await portfolioController.deletePortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("OFFERING_NOT_FOUND"),
    });
  });

  it("should return 400 if the portfolio_id is invalid", async () => {
    // Set an invalid portfolio_id
    req.params!.portfolio_id = "invalidId";

    // Call the deleteOffering method from OfferingController
    await portfolioController.deletePortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_portfolio_id"),
    });
  });

  it("should delete a Offering if the id is valid", async () => {
    const portfolioId = new mongoose.Types.ObjectId().toString();
    req = { params: { portfolio_id: portfolioId } };

    // Mock the deleted offering data
    const mockDeletedOffering = {
      portfolio_id: portfolioId,
      name: "Test Offering",
      isDeleted: true,
    };

    // Mock the Portfolio.findOneAndUpdate call to return the updated offering
    (Portfolio.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockDeletedOffering
    );

    // Call the method
    await portfolioController.deletePortfolio(req as Request, res as Response);

    // Expect the result to match the updated (deleted) offering data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      portfolio_id: portfolioId,
      message: undefined,
    });
  });
});
