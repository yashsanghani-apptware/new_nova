import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
import SubscriptionService from "../../services/subscriptionServices";

// Mocking SubscriptionService
jest.mock("../../services/subscriptionServices");

describe("SubscriptionController - getSubscription", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    req = { params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  it("should return error if subscription is not found", async () => {
    // Arrange
    const errorMessage = "Subscription not found";

    // Mock the subscriptionService to return null (subscription not found)
    SubscriptionService.prototype.getSubscription = jest.fn().mockResolvedValue(null);

    // Set params to include a non-existing subscription_id
    req.params = { subscription_id: "non_existing_sub_id" };

    // Act
    await SubscriptionController.getSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);  // Not Found status
  });

  it("should return a 404 error if there is a server issue", async () => {
    // Arrange
    const errorMessage = "Server error fetching subscription";

    // Mock the subscriptionService to throw an error
    SubscriptionService.prototype.getSubscription = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Set params to include a subscription_id
    req.params = { subscription_id: "sub_id_1" };

    // Act
    await SubscriptionController.getSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);  // Internal Server Error
  });
});
