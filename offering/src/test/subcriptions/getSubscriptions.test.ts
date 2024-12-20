import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
import SubscriptionService from "../../services/subscriptionServices";

// Mocking SubscriptionService
jest.mock("../../services/subscriptionServices");

describe("SubscriptionController - getSubscriptions", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    req = { query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  it("should return subscriptions based on query parameters", async () => {
    // Arrange
    const mockSubscriptions = [
      {
        subscription_id: "sub_id_1",
        offering_id: "offering_id_1",
        user_id: "user_id_1",
        investment_amount: 1000,
      },
      {
        subscription_id: "sub_id_2",
        offering_id: "offering_id_2",
        user_id: "user_id_2",
        investment_amount: 2000,
      },
    ];

    // Mock the subscriptionService to return subscriptions
    SubscriptionService.prototype.getSubscriptions = jest.fn().mockResolvedValue(mockSubscriptions);

    // Set query parameters (if any)
    req.query = { offering_id: "offering_id_1" };  // Example query

    // Act
    await SubscriptionController.getSubscriptions(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);  // OK status
  });

  it("should return an empty array if no subscriptions are found", async () => {
    // Arrange
    const mockSubscriptions: any[] = [];

    // Mock the subscriptionService to return an empty array
    SubscriptionService.prototype.getSubscriptions = jest.fn().mockResolvedValue(mockSubscriptions);

    // Set query parameters (if any)
    req.query = { offering_id: "non_existing_offering_id" };  // Query that doesn't match any subscription

    // Act
    await SubscriptionController.getSubscriptions(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);  // OK status
  });

});
