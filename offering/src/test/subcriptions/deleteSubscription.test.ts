import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
import SubscriptionService from "../../services/subscriptionServices";

// Mocking SubscriptionService
jest.mock("../../services/subscriptionServices");

describe("SubscriptionController - deleteSubscription", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    req = { params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });


  it("should return a error if the subscription is not found", async () => {
    // Arrange
    const errorMessage = "Subscription not found";

    // Mock the subscriptionService to return false (subscription not found)
    SubscriptionService.prototype.deleteSubscription = jest.fn().mockResolvedValue(false);

    // Set params to include a non-existing subscription_id
    req.params = { subscription_id: "non_existing_sub_id" };

    // Act
    await SubscriptionController.deleteSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);  // Not Found status
  });

  it("should return  error if there is a server issue", async () => {
    // Arrange
    const errorMessage = "Error deleting subscription";

    // Mock the subscriptionService to throw an error
    SubscriptionService.prototype.deleteSubscription = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Set params to include a subscription_id
    req.params = { subscription_id: "sub_id_1" };

    // Act
    await SubscriptionController.deleteSubscription(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);  // Internal Server Error
  });
});
