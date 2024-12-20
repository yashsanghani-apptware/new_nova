import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
import SubscriptionService from "../../services/subscriptionServices";

// Mocking SubscriptionService
jest.mock("../../services/subscriptionServices");

describe("SubscriptionController - updateSubscription", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  it("should return a 500 error if the subscription is not found", async () => {
    // Arrange
    const errorMessage = "Subscription not found";

    // Mock the subscriptionService to return null (subscription not found)
    SubscriptionService.prototype.updateSubscription = jest.fn().mockResolvedValue(null);

    // Set params to include a non-existing subscription_id and body with updated data
    req.params = { subscription_id: "non_existing_sub_id" };
    req.body = { shares_allocated: 200, investment_amount: 10000 };

    // Act
    await SubscriptionController.updateSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return a 500 error if there is a server issue", async () => {
    // Arrange
    const errorMessage = "Error updating subscription";

    // Mock the subscriptionService to throw an error
    SubscriptionService.prototype.updateSubscription = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Set params to include a subscription_id and body with updated data
    req.params = { subscription_id: "sub_id_1" };
    req.body = { shares_allocated: 200, investment_amount: 10000 };

    // Act
    await SubscriptionController.updateSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);  // Internal Server Error
    // expect(res.json).toHaveBeenCalledWith({ message: "SERVER_ERROR", error: errorMessage });  // Error message
  });
});
