import mongoose from "mongoose";
import Offering from "../model/Portfolio";
import OfferingController from "../controllers/portfolioController"; // Import the OfferingController class
import { Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { translate, initI18n } from "../utils/i18n";
import Portfolio from "../model/Portfolio";
import PortfolioController from "../controllers/portfolioController";

// jest.mock("../model/Portfolio");
let mongoServer: MongoMemoryServer;

describe("Portfolio Controller.updatePortfolio method", () => {
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
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it("should update a  if the portfolio_id and fields are valid", async () => {
    const portfolioId = new mongoose.Types.ObjectId().toString();

    // Mock a Mongoose document with `toObject` method
    const currentPortfolio = {
      portfolio_id: portfolioId,
      investments: [
        {
          offering_id: "67374e94cd7651779560b495",
          number_of_shares: 100,
          share_price: 5077,
          investment_date: new Date(),
          holding_period: 5,
          hp_annotation: "no more then 7 years",
          documents: ["673b0e1b904a3c4c2410380a", "673b1ecd3c71d90be10881a1"],
          status: "ACTIVE",
        },
      ],
    };

    const updates = {
      investments: [
        {
          offering_id: "67374e94cd7651779560b495",
          number_of_shares: 1444444,
          share_price: 5077,
          investment_date: new Date(),
          holding_period: 10,
          hp_annotation: "no more then 7 years",
          documents: ["673b0e1b904a3c4c2410380a", "673b1ecd3c71d90be10881a1"],
          status: "ACTIVE",
        },
      ],
    };
    req = {
      params: { portfolio_id: portfolioId },
      body: updates,
    };

    // Mock the findOne method to return an object with `toObject` method
    const mockCurrentPortfolio = {
      ...currentPortfolio,
      toObject: jest.fn().mockReturnValue(currentPortfolio),
    };
    jest
      .spyOn(Portfolio, "findOne")
      .mockResolvedValue(mockCurrentPortfolio as any);
    jest
      .spyOn(Portfolio, "findOneAndUpdate")
      .mockResolvedValue({ ...currentPortfolio, ...updates } as any);

    const updatedPortfolio = await PortfolioController.updatePortfolio(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Portfolio.findOne).toHaveBeenCalledWith({
      portfolio_id: portfolioId,
      is_deleted: false,
    });
  });

  it("should return 404 if the Portfolio is not found", async () => {
    // Mock the findOneAndUpdate method to simulate a Portfolio not found
    jest.spyOn(Portfolio, "findOneAndUpdate").mockResolvedValue(null);

    req.body = {
      investments: [
        {
          share_price: 33333,
          investment_date: new Date(),
        },
      ],
    };

    // Call the updatePortfolio method from PortfolioController
    await PortfolioController.updatePortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("PORTFOLIO_NOT_FOUND"),
    });
  });

  it("should return 400 if the portfolio_id is invalid", async () => {
    // Set an invalid portfolio_id
    req.params!.portfolio_id = "invalidId";

    // Call the updatePortfolio method from PortfolioController
    await PortfolioController.updatePortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_PORTFOLIO_ID"),
    });
  });

  it("should return 400 if the investments is invalid", async () => {
    // Set an invalid name in the request body
    req.body = {
      investments: 123, // Invalid type
    };

    // Call the updatePortfolio method from PortfolioController
    await PortfolioController.updatePortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: translate("INVALID_NAME"),
    });
  });
});
