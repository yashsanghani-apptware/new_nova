import mongoose from "mongoose";
import { Request, Response } from "express";
import Offering from "../model/Portfolio";
import portfolioController from "../controllers/portfolioController";
import { MongoMemoryServer } from "mongodb-memory-server";
import axios from "axios";
import { translate } from "../utils/i18n";
import config from "../config";
import Portfolio from "../model/Portfolio";

// Mock axios for HTTP requests

let mongoServer: MongoMemoryServer;

describe("createPortfolio function", () => {
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
    await Portfolio.deleteMany({});
    jest.clearAllMocks();
  });

  it("should create a new Portfolio", async () => {
    req = {
      body: {
        portfolio_id: new mongoose.Types.ObjectId(),
        user_id: "671728ea49e0d9ab243f0dd0",
        investments: [
          {
            offering_id: "671b6030c7f72951635dd3a2",
            number_of_shares: 100,
            share_price: 5077,
            investment_date: new Date(),
            holding_period: "5 years",
            documents: ["673b0e1b904a3c4c2410380a", "673b1ecd3c71d90be10881a1"],
            status: "ACTIVE",
          },
        ],
      },
      headers: { authorization: `Bearer ${token.token}` },
    };

    const savedPortfolio = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
    };

    // Mock the save method of the Offering model
    jest.spyOn(Portfolio.prototype, "save").mockResolvedValue(savedPortfolio);

    // Call the createOffering method from OfferingController
    await portfolioController.createPortfolio(req as Request, res as Response);

    // Check the response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedPortfolio);
  });

  it("should return an error if portfolio data is missing", async () => {
    req = {
      body: {
        portfolio_id: "valid_portfolio_id",
      },
      // headers: { authorization: `Bearer ${token.token}` },
    };

    await portfolioController.createPortfolio(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return an error if token is missing", async () => {
    req = {
      body: {
        portfolio_id: "valid_portfolio_id",
      },
      headers: {},
    };

    await portfolioController.createPortfolio(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
