import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Offering from "../model/Offering";
import OfferingController from "../controllers/offeringController"; // The function you're testing

let mongoServer: MongoMemoryServer;

describe("Offering Controller - queryOffering", () => {
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
    await Offering.deleteMany({});
    jest.clearAllMocks();
  });

  describe("queryOffering function", () => {
    beforeEach(async () => {
      const offering = [
        {
          _id: new mongoose.Types.ObjectId(),
          offering_id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: "Sample Property 1",
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

    it("should return a paginated list of Offerings", async () => {
      req = {
        query: { page: "1", limit: "1" },
        body: {},
      };

      //   await OfferingController.queryOffering(req as Request, res as Response);
      await OfferingController.queryOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.any(Array),
          total: expect.any(Number),
          page: 1,
          limit: 1,
          pages: expect.any(Number),
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.arrayContaining([
            expect.objectContaining({ name: "Sample Property 1" }),
          ]),
        })
      );
    });

    it("should filter Offerings by name", async () => {
      req = {
        query: { name: "Sample Property 2" },
        body: {},
      };

      await OfferingController.queryOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.arrayContaining([
            expect.objectContaining({ name: "Sample Property 2" }),
          ]),
        })
      );
    });

    it("should return an empty array if no Offerings match the filter", async () => {
      req = {
        query: { status: "NOT_EXISTING_STATUS" },
        body: {},
      };

      await OfferingController.queryOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: [],
          total: 0,
          page: 1,
          limit: expect.any(Number),
          pages: 0,
        })
      );
    });
  });
});
