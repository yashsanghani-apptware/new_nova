import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import Offering from "../model/Subscription";
import { translate, initI18n } from "../utils/i18n";
import SubscriptionService from "../services/subscriptionServices";

class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  /**
   * Create a new subscription for an offering.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the created subscription object
   */
  public async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionData = req.body;
      const authHeader = req.headers.authorization;
      const offering_id = req.params.offering_id;


      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      if(!offering_id){
        res.status(400).json({ message: translate("OFFERING_ID_REQUIRED") });
        return;
      }

      const createdSubscription = await this.subscriptionService.createSubscription(
        subscriptionData,
        offering_id,
        authHeader
      );
      res.status(201).json(createdSubscription);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
    }
  }

   /**
   * Retrieve all subscriptions based on query parameters (e.g., offering_id or user_id).
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} List of subscriptions
   */
   public async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const subscriptions = await this.subscriptionService.getSubscriptions(query);
      res.status(200).json(subscriptions);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error.message);
      res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
    }
  }

  /**
   * Retrieve a specific subscription by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Subscription details
   */
  public async getSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { subscription_id } = req.params;

      const subscription = await this.subscriptionService.getSubscription(subscription_id);
      if (!subscription) {
        res.status(404).json({ message: translate("SUBSCRIPTION_NOT_FOUND") });
        return;
      }

      res.status(200).json(subscription);
    } catch (error: any) {
      console.error("Error fetching subscription:", error.message);
      res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
    }
  }


  /**
   * Updates a specific subscription by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Updated subscription details
   */
  public async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { subscription_id } = req.params;
      const updateData = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      const updatedSubscription = await this.subscriptionService.updateSubscription(
        subscription_id,
        updateData,
        authHeader
      );

      if (!updatedSubscription) {
        res.status(404).json({ message: translate("SUBSCRIPTION_NOT_FOUND") });
        return;
      }

      res.status(200).json(updatedSubscription);
    } catch (error: any) {
      console.error("Error updating subscription:", error.message);
      res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
   }
  }

  /**
   * Deletes a specific subscription by subscription ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Response indicating success or failure.
   */
    public async deleteSubscription(req: Request, res: Response): Promise<void> {
      try {
        const { subscription_id } = req.params;

        const result = await this.subscriptionService.deleteSubscription(subscription_id);

        if (!result) {
          res.status(404).json({ message: translate("SUBSCRIPTION_NOT_FOUND") });
          return;
        }

        res.status(200).json({ message: translate("SUBSCRIPTION_DELETED_SUCCESS") });
      } catch (error: any) {
        console.error("Error deleting subscription:", error.message);
        res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
      }
    }

  public async updateSubscriptionAllocation(req: Request, res: Response): Promise<void> {
    try{
      const { subscription_id } = req.params;
      const updateData = req.body;
      const authHeader = req.headers.authorization;
      const offering_id = req.params.offering_id;

      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      const updatedSubscription = await this.subscriptionService.updateSubscriptionAllocation(
        subscription_id,
        offering_id,
        updateData,
        authHeader
      );

      if (!updatedSubscription) {
        res.status(404).json({ message: translate("SUBSCRIPTION_NOT_FOUND") });
        return;
      }

      res.status(200).json(updatedSubscription);  
    } catch (error: any) {
      console.error("Error updating subscription:", error.message);
      res.status(500).json({ message: translate("SERVER_ERROR"), error: error.message });
    }
   }
}

export default new SubscriptionController();