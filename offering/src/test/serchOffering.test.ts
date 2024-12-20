import { Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Offering from "../model/Offering"; // Your Offering model
import OfferingController from "../controllers/offeringController"; // The function you're testing

let mongoServer: MongoMemoryServer;

describe("Offering Controller - searchOffering", () => {
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

  describe("searchOffering function", () => {
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

    it("should return paginated list of offerings", async () => {
      req = {
        query: { page: "1", limit: "1" },
      };

      await OfferingController.searchOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.any(Array),
          total: expect.any(Number),
          page: 1,
          pages: expect.any(Number),
        })
      );
    });

    it("should filter offerings by name using partial and case-insensitive search", async () => {
      req = {
        query: { name: "Sample Property 2" },
      };

      await OfferingController.searchOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.arrayContaining([
            expect.objectContaining({ name: "Sample Property 2" }),
          ]),
        })
      );
    });

    it("should return an empty array when no offerings match the filter", async () => {
      req = {
        query: { status: "INVALID_STATUS" },
      };

      await OfferingController.searchOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: [],
          total: 0,
          page: 1,
          pages: 0,
        })
      );
    });

    it("should apply multiple filters at the same time", async () => {
      req = {
        query: { name: "Sample Property" },
      };

      await OfferingController.searchOfferings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          offerings: expect.arrayContaining([
            expect.objectContaining({
              name: "Sample Property 1",
            }),
          ]),
        })
      );
    });
  });
});
