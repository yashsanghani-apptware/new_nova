import express from "express";
import { isAuthenticated, authorizeAction } from "../middlewares/roleAuthorization";
import { validateSubscriptionMiddleware } from "../middlewares/validateSubscriptionMiddleware";
import SubscriptionController from "../controllers/subscriptionController";

const router = express.Router();

// Route to create a new subcription - requires authentication and authorization
router.post("/:offering_id/subscriptions", isAuthenticated, authorizeAction("subscription.create"),(req, res) => SubscriptionController.createSubscription(req, res));

// Route to get all subscriptions - requires authentication and authorization
router.get("/:offering_id/subscriptions", isAuthenticated, authorizeAction("subscription.view"), (req, res) => SubscriptionController.getSubscriptions(req, res));

// Route to get a specific subscription by its ID
router.get("/:offering_id/subscriptions/:subscription_id", isAuthenticated, authorizeAction("subscription.view"), (req, res) => SubscriptionController.getSubscription(req, res));

router.put("/:offering_id/subscriptions/:subscription_id", isAuthenticated, authorizeAction("subscription.update"), (req, res) => SubscriptionController.updateSubscription(req, res));

// Route to delete a specific subscription by its ID
router.delete("/:offering_id/subscriptions/:subscription_id", isAuthenticated, authorizeAction("subscription.delete"), (req, res) => SubscriptionController.deleteSubscription(req, res));

// Route to update a specific subscription by its ID
router.put("/:offering_id/subscriptions/:subscription_id/allocation", isAuthenticated, authorizeAction("subscription.update"), (req, res) => SubscriptionController.updateSubscriptionAllocation(req, res));
export default router;