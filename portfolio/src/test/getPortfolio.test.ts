import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Offering from "../model/Portfolio";
import OfferingController from "../controllers/portfolioController"; // Import the OfferingController class
import { translate, initI18n } from "../utils/i18n";
import config from "../config";
import axios from "axios";
import Portfolio from "../model/Portfolio";
import portfolioController from "../controllers/portfolioController";

let mongoServer: MongoMemoryServer;

describe("Portfolio Controller", () => {
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
    await Portfolio.deleteMany({});
    jest.clearAllMocks();
  });

  describe("getPortfolio method", () => {
    it("should return a portfolio if the id is valid", async () => {
      const portfolioObj = new Portfolio({
        _id: new mongoose.Types.ObjectId(),
        portfolio_id: new mongoose.Types.ObjectId().toString(),
        user_id: new mongoose.Types.ObjectId().toString(),
      });

      await portfolioObj.save();

      req = {
        params: { portfolio_id: portfolioObj.portfolio_id ?? "" },
        headers: { authorization: `Bearer ${token.token}` },
      };

      // Call the getPortfolio method from PortfolioController
      await portfolioController.getPortfolio(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if the portfolio is not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      req = {
        params: { portfolio_id: validObjectId.toString() },
        headers: { Authorization: `Bearer ${token.token}` },
      };

      // Call the getPortfolio method from PortfolioController
      await portfolioController.getPortfolio(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("PORTFOLIO_NOT_FOUND"),
      });
    });

    it("should return 400 if the portfolio_id is invalid", async () => {
      const invalidId = "6697869c79860840b6111af39";

      req = {
        params: { portfolio_id: invalidId },
        headers: { Authorization: `Bearer ${token.token}` },
      };

      // Call the getPortfolio method from PortfolioController
      await portfolioController.getPortfolio(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: translate("INVALID_portfolio_id"),
      });
    });
  });

  describe("getAllPortfolios method", () => {
    beforeEach(async () => {
      let portfolio = [
        {
          _id: new mongoose.Types.ObjectId(),
          portfolio_id: new mongoose.Types.ObjectId(),
          user_id: new mongoose.Types.ObjectId(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          portfolio_id: new mongoose.Types.ObjectId(),
          user_id: new mongoose.Types.ObjectId(),
        },
      ];
      await Portfolio.insertMany(portfolio);
    });

    it("should return  all portfolios", async () => {
      req = {};

      // Call the getAllPortfolios method from PortfolioController
      await portfolioController.getAllPortfolios(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ portfolio_id: expect.any(String) }),
          expect.objectContaining({ portfolio_id: expect.any(String) }),
        ])
      );
    });
  });
});
