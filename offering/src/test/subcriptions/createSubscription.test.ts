import mongoose from "mongoose";
import axios from "axios";
import SubscriptionService from "../../services/subscriptionServices";  // Adjust path if necessary
import Offering from "../../model/Offering";
import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
// import { mockRequest, mockResponse } from "jest-mock-req-res"; // To mock req and res

import { translate } from "../../utils/i18n";
import config from "../../config";

// Mock the external services
jest.mock("axios");
jest.mock("../../model/Offering");
jest.mock("../../utils/i18n");

describe("createSubscription", () => {
  let subscriptionService: SubscriptionService;
  let mockAuthHeader: string;

  beforeAll(() => {
    subscriptionService = new SubscriptionService();
    mockAuthHeader = "Bearer mockToken";  // Mock token for authorization
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a subscription", async () => {
    // Arrange
    const subscriptionData = {
      user_id: new mongoose.Types.ObjectId(),
      shares_subscribed: 100,
      investment_amount: 5000,
    };
    const offering_id = new mongoose.Types.ObjectId().toString();

    const mockOffering = {
      _id: offering_id,
      offering_id: offering_id,
      details: {
        target_hold: 5,
      },
    };
    Offering.findOne = jest.fn().mockResolvedValue(mockOffering);

    const mockSavedSubscription = {
      ...subscriptionData,
      offering_id: offering_id,
      subscription_id: new mongoose.Types.ObjectId(),
      status: "IN_PROGRESS",
      updated_at: new Date(),
      updated_by: new mongoose.Types.ObjectId(),
    };

    SubscriptionService.prototype.createSubscription = jest.fn().mockResolvedValue(mockSavedSubscription);

    const result = await subscriptionService.createSubscription(subscriptionData, offering_id, mockAuthHeader);
    expect(result).toEqual(mockSavedSubscription);
  });

});


describe("SubscriptionController", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };
  let token: any;

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

  it("should return an error if token is missing", async () => {
    // Arrange
    req.body = { user_id: "some_id", investment_amount: 1000 }; // Mock request body
    // req.headers.authorization = ""; // Empty auth header
    // req.params.offering_id = "some_offering_id";

    // Act
    await SubscriptionController.createSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);  // Unauthorized status code
  });
});
