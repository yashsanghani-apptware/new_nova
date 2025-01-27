import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Listing from '../models/Listing';
import ListingController from "../controllers/listingController"; // The function you're testing

let mongoServer: MongoMemoryServer;

describe('Listing Controller - queryListings', () => {
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
    await Listing.deleteMany({});
    jest.clearAllMocks();
  });

  describe('queryListings function', () => {
    beforeEach(async () => {
      const listings = [
        {
          _id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: 'Sample Property 1',
          address: {
            house_number: '123',
            street: 'Main St',
            city: 'Sample City',
            state: 'SC',
            zip: '12345',
          },
          property_description: 'A beautiful property',
          property_highlights: {
            total_acres: 5,
            tillable: 2,
            woodland: 1,
            wetland: 0.5,
            deed_restrictions: 'None',
            barns: [],
          },
          days_on_market: 10,
          type: 'Residential',
          built_on: '2020-01-01',
          renovated_on: '2022-01-01',
          listing_agent: {
            name: 'Agent Name',
            company: 'Real Estate Co',
            phone_number: '123-456-7890',
            email: 'agent@example.com',
          },
          dataroom_id: 'dataroom123',
          workflows: [],
          images: [],
          videos: [],
          maps: [],
          sales_and_tax: {},
          public_facts: {},
          schools: [],
          listing_source: 'SYSTEM',
          status: 'SOURCED',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          listing_id: new mongoose.Types.ObjectId(),
          name: 'Sample Property 2',
          address: {
            house_number: '456',
            street: 'Second St',
            city: 'Another City',
            state: 'AC',
            zip: '67890',
          },
          property_description: 'Another beautiful property',
          property_highlights: {
            total_acres: 3,
            tillable: 1,
            woodland: 0.5,
            wetland: 0.2,
            deed_restrictions: 'None',
            barns: [],
          },
          days_on_market: 5,
          type: 'Commercial',
          built_on: '2019-01-01',
          renovated_on: '2021-01-01',
          listing_agent: {
            name: 'Another Agent',
            company: 'Real Estate Co',
            phone_number: '987-654-3210',
            email: 'anotheragent@example.com',
          },
          dataroom_id: 'dataroom456',
          workflows: [],
          images: [],
          videos: [],
          maps: [],
          sales_and_tax: {},
          public_facts: {},
          schools: [],
          listing_source: 'SYSTEM',
          status: 'SCREENED',
        },
      ];
      await Listing.insertMany(listings);
    });

    it('should return a paginated list of listings', async () => {
      req = {
        query: { page: '1', limit: '1' },
        body: {},
      };

      await ListingController.queryListings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listings: expect.any(Array),
          total: expect.any(Number),
          page: 1,
          limit: 1,
          pages: expect.any(Number),
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listings: expect.arrayContaining([
            expect.objectContaining({ name: 'Sample Property 1' }),
          ]),
        })
      );
    });

    it('should filter listings by name', async () => {
      req = {
        query: { name: 'Sample Property 2' },
        body: {},
      };

      await ListingController.queryListings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listings: expect.arrayContaining([
            expect.objectContaining({ name: 'Sample Property 2' }),
          ]),
        })
      );
    });

    it('should filter listings by status', async () => {
      req = {
        query: { status: 'SOURCED' },
        body: {},
      };

      await ListingController.queryListings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listings: expect.arrayContaining([
            expect.objectContaining({ status: 'SOURCED' }),
          ]),
        })
      );
    });

    it('should return an empty array if no listings match the filter', async () => {
      req = {
        query: { status: 'NOT_EXISTING_STATUS' },
        body: {},
      };

      await ListingController.queryListings(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          listings: [],
          total: 0,
          page: 1,
          limit: expect.any(Number),
          pages: 0,
        })
      );
    });
  });
});
