import { Request, Response } from "express";
import SubscriptionController from "../../controllers/subscriptionController";
import SubscriptionService from "../../services/subscriptionServices";

// Mocking SubscriptionService
jest.mock("../../services/subscriptionServices");

describe("SubscriptionController - updateSubscriptionAllocation", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
  });

  it("should returnerror if the subscription is not found", async () => {
    // Arrange
    const errorMessage = "Subscription not found";

    // Mock the subscriptionService to return null (subscription not found)
    SubscriptionService.prototype.updateSubscriptionAllocation = jest.fn().mockResolvedValue(null);

    // Set params and body for the request
    req.params = { subscription_id: "non_existing_sub_id", offering_id: "offering_id_1" };
    req.body = { shares_allocated: 50, investment_amount: 5000 };

    // Act
    await SubscriptionController.updateSubscriptionAllocation(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500); 
  });

  it("should return 500 error if there is a server issue", async () => {
    // Arrange
    const errorMessage = "Error updating subscription allocation";

    // Mock the subscriptionService to throw an error
    SubscriptionService.prototype.updateSubscriptionAllocation = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Set params and body for the request
    req.params = { subscription_id: "sub_id_1", offering_id: "offering_id_1" };
    req.body = { shares_allocated: 50, investment_amount: 5000 };

    // Act
    await SubscriptionController.updateSubscriptionAllocation(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);  // Internal Server Error
  });
});
