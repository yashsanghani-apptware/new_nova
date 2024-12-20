import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Offering from "../model/Portfolio"; // Your Offering model
import OfferingController from "../controllers/portfolioController"; // The function you're testing
import Portfolio from "../model/Portfolio";
import PortfolioController from "../controllers/portfolioController";

let mongoServer: MongoMemoryServer;

describe("Portfolio Controller - searchPortfolio", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await Portfolio.deleteMany({});
    jest.clearAllMocks();
  });

  describe("searchPortfolio function", () => {
    beforeEach(async () => {
      const portfoilo = [
        {
          _id: new mongoose.Types.ObjectId(),
          portfolio_id: new mongoose.Types.ObjectId(),
          user_id: "671728ea49e0d9ab243f0dd0",
        },
        {
          _id: new mongoose.Types.ObjectId(),
          portfolio_id: new mongoose.Types.ObjectId(),
          user_id: new mongoose.Types.ObjectId(),
        },
      ];
      await Portfolio.insertMany(portfoilo);
    });

    it("should return paginated list of portfolios", async () => {
      req = {
        query: { page: "1", limit: "1" },
      };

      await PortfolioController.searchPortfolios(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          portfolios: expect.any(Array),
          total: expect.any(Number),
          page: 1,
          pages: expect.any(Number),
        })
      );
    });

    it("should filter portfolios by name using partial and case-insensitive search", async () => {
      req = {
        query: { user_id: "671728ea49e0d9ab243f0dd0" },
      };

      await PortfolioController.searchPortfolios(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          portfolios: expect.arrayContaining([
            expect.objectContaining({ user_id: "671728ea49e0d9ab243f0dd0" }),
          ]),
        })
      );
    });

    it("should return an empty array when no portfolios match the filter", async () => {
      req = {
        query: { status: "INVALID_STATUS" },
      };

      await PortfolioController.searchPortfolios(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          portfolios: [],
          total: 0,
          page: 1,
          pages: 0,
        })
      );
    });

    it("should apply multiple filters at the same time", async () => {
      req = {
        query: {},
      };

      await PortfolioController.searchPortfolios(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          portfolios: expect.arrayContaining([
            expect.objectContaining({
              user_id: "671728ea49e0d9ab243f0dd0",
            }),
          ]),
        })
      );
    });
  });
});
