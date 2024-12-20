import axios from "axios";
import Subscription from "../model/Subscription";
// import Offering, { IOffering, IInvestmentOverview, IFinancialDetails, IDetails, IDocuments, Crop } from "../model/Subscription";
import mongoose, { SortOrder } from "mongoose";
import config from "../config";
import { translate } from "../utils/i18n";
import { extractUserIdFromToken, uploadFileToDataRoom } from "../utils/utils";
import Offering from "../model/Offering";

class SubscriptionService {
  /**
   * Creates a new subscription for an offering.
   * @param subscriptionData - The subscription data from the request.
   * @param authHeader - The authorization header from the request.
   * @returns The created subscription document.
   */
  public async createSubscription(
    subscriptionData: any,
    offering_id: string,
    authHeader: string
  ): Promise<any> {
    try {

      const user = extractUserIdFromToken(authHeader);

      // Validate offering existence
      const offeringData = await Offering.findOne({ offering_id: offering_id }).exec();

      if (!offeringData) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }

      // Create and save the subscription
      const subscription = new Subscription({
        offering_id: offering_id,
        subscription_id: new mongoose.Types.ObjectId(),
        user_id: subscriptionData.user_id,
        subscription: {
          shares_subscribed: subscriptionData?.shares_subscribed,
          investment_amount: subscriptionData?.investment_amount,
          date_subscribed: new Date(),
        },
        allocation: {
          shares_allocated: subscriptionData?.shares_subscribed,
          investment_amount: subscriptionData?.investment_amount,
          date_allocated: new Date(),
          documents: [],
        },
        workflows: {},
        updated_at: new Date(),
        updated_by: user?.userId,
      });

      const savedSubscription = await subscription.save();

      //call potfolio API
      let url = `${config.portfolioServiceUrl}/portfolios`
      let holding_period = Number(offeringData?.details?.target_hold)|| 1
      let requestBody = {
        user_id: subscriptionData.user_id,
        investments: [
            {
                offering_id: offering_id,
                number_of_shares: subscriptionData?.shares_subscribed,
                share_price: subscriptionData?.investment_amount,
                investment_date: new Date(),
                holding_period,
                hp_annotation: `No more then ${holding_period} years`,
                documents: [],
                status: "ACTIVE"
            }
        ]
    }
     let savedPortfolio = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      },
     }).then((response: any) => {
      return response.data;
    }).catch((error: any) => {
      console.log(error.data )
    })
      return  savedSubscription
    } catch (error: any) {
      console.error("Error creating subscription:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Fetches subscriptions based on query parameters.
   *
   * @param query - Query parameters (offering_id or user_id)
   * @returns Array of subscriptions matching the criteria
   */
  public async getSubscriptions(query: any): Promise<any> {
    try {
      const filters: any = {};
      if (query.offering_id) {
        filters.offering_id = new mongoose.Types.ObjectId(query.offering_id);
      }
      if (query.user_id) {
        filters["subscriptions.user_id"] = new mongoose.Types.ObjectId(query.user_id);
      }

      filters.is_deleted = false;
      const subscriptions = await Subscription.find(filters);
      return subscriptions;
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Fetches a specific subscription by its ID.
   *
   * @param subscription_id - ID of the subscription
   * @returns The subscription document
   */
  public async getSubscription(subscription_id: string): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(subscription_id)) {
        throw new Error("Invalid subscription ID");
      }

      console.log("Subscription ID:", subscription_id);
      const subscription = await Subscription.findOne({ subscription_id });
      return subscription;
    } catch (error: any) {
      console.error("Error fetching subscription:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Deletes a specific subscription by subscription ID.
   *
   * @param subscription_id - The ID of the subscription to delete.
   * @returns {Promise<boolean>} Indicates whether the subscription was deleted.
   */
  public async deleteSubscription(subscription_id: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(subscription_id)) {
        throw new Error("Invalid subscription ID");
      }

      const result = await Subscription.findOneAndUpdate({ subscription_id }, { is_deleted: true }, { new: true });
      return result?.is_deleted != false; // Returns true if a document was deleted, otherwise false.
    } catch (error: any) {
      console.error("Error deleting subscription:", error.message);
      throw new Error(error.message);
    }
  }

  public async updateSubscription(subscription_id: string, updateData: any, authHeader: string,): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(subscription_id)) {
        throw new Error("Invalid subscription ID");
      }

      const user = extractUserIdFromToken(authHeader);
      const subscription = await Subscription.findOne({ subscription_id });
      if (!subscription) {
        throw new Error(translate("SUBSCRIPTION_NOT_FOUND"));
      }

      //check if the update data have any fields
      if (Object.keys(updateData).length == 0) {
        throw new Error(translate("NO_UPDATE_FIELDS"));
      }

      //check if the subsciption is active
      if (subscription.status == "ACTIVE") {
        throw new Error(translate("SUBSCRIPTION_ALREADY_ACTIVE"));
      }

      let subscriptionUpdate: any = subscription;
      subscriptionUpdate.updated_at = new Date();
      subscriptionUpdate.updated_by = user?.userId;

     if( updateData.shares_subscribed) {
      subscriptionUpdate.subscription.shares_subscribed = updateData.shares_subscribed;
     }

     if( updateData.status ) {
      subscriptionUpdate.status = updateData.status;
     }
    
      const updatedSubscription = await Subscription.findOneAndUpdate({ subscription_id }, subscriptionUpdate , { new: true });
      return updatedSubscription;
    } catch (error: any) {
      console.error("Error updating subscription:", error.message);
      throw new Error(error.message);
    }
  }

  public async updateSubscriptionAllocation( subscription_id: string, offering_id: string, updateData: any, authHeader: string): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(subscription_id)) {
        throw new Error("Invalid subscription ID");
      }

      //get price_unit in Offering details
      const offering = await Offering.findOne({ offering_id });
      if (!offering) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }

      const user = extractUserIdFromToken(authHeader);
      const subscription = await Subscription.findOne({ subscription_id });
      if (!subscription) {
        throw new Error(translate("SUBSCRIPTION_NOT_FOUND"));
      }

      //check if the update data have any fields
      if (Object.keys(updateData).length == 0) {
        throw new Error(translate("NO_UPDATE_FIELDS"));
      }

      //check if the subsciption is active
      if (subscription.status == "ACTIVE") {
        throw new Error(translate("SUBSCRIPTION_ALREADY_ACTIVE"));
      }

      let subscriptionUpdate: any = subscription;
      subscriptionUpdate.updated_at = new Date();
      subscriptionUpdate.updated_by = user?.userId;

     if( updateData.shares_allocated) {
      subscriptionUpdate.allocation.shares_allocated = updateData.shares_allocated;
      
      //calculate investment_amount
      (offering?.details?.price_unit)?
        subscriptionUpdate.allocation.investment_amount = Number(updateData.shares_allocated) * Number(offering?.details?.price_unit)
      : subscriptionUpdate.allocation.investment_amount = Number(updateData.shares_allocated)
     }

     if( updateData.status ) {
      subscriptionUpdate.status = updateData.status;
     }
    
      const updatedSubscription = await Subscription.findOneAndUpdate({ subscription_id }, subscriptionUpdate , { new: true });
      return updatedSubscription;

    } catch (error: any) {
      console.error("Error updating subscription:", error.message);
      throw new Error(error.message);
    }
   }
}

export default SubscriptionService;



