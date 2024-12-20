import mongoose, { Document, Schema, Model } from 'mongoose';

export enum IStatusEnum {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ALLOCATED = 'ALLOCATED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_ESCROW = 'IN_ESCROW',
}

/**
 * Interface representing a subscription in the system.
 * @interface ISubscription
 * @extends Document
 */
export interface ISubscription extends Document {
  offering_id: mongoose.Types.ObjectId; // Unique identifier for the offering
  subscription_id: mongoose.Types.ObjectId; // Unique identifier for the subscription
  user_id: mongoose.Types.ObjectId; // User subscribing to the offering
  dataroom_id: mongoose.Types.ObjectId; // Data room associated with the subscription
  subscription: {
    shares_subscribed: number; // Number of shares subscribed
    date_subscribed: Date; // Subscription date
    investment_amount: number; // Subscription price
  };
  allocation: {
    shares_allocated: number; // Number of shares allocated
    date_allocated: Date; // Allocation date
    investment_amount: number; // Allocation price
    documents: string[]; // List of related document URLs
  };
  workflows: Record<string, any>; // Workflow details, if any
  status: IStatusEnum; // Subscription status
  updated_at: Date; // Last updated timestamp
  updated_by: mongoose.Types.ObjectId; // User who last updated the subscription
  is_deleted: boolean; // Flag indicating if the subscription is deleted
}

/**
 * Mongoose schema for the Subscription model.
 */
const SubscriptionSchema = new Schema<ISubscription>({
  offering_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  subscription_id: { type: mongoose.Schema.Types.ObjectId },  
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  dataroom_id: { type: mongoose.Schema.Types.ObjectId },
  subscription: {
      shares_subscribed: { type: Number, required: true },
      date_subscribed: { type: Date, default: Date.now },
      investment_amount: { type: Number, required: true },
  },
  allocation: {
      shares_allocated: { type: Number,  },
      investment_amount: { type: Number,  },
      date_allocated: { type: Date },
      documents: { type: [String] },
  },
  workflows: { type: Schema.Types.Mixed, default: {} },
  status: {type: String, default: IStatusEnum.IN_PROGRESS, required: true },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId },
  is_deleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} });

/**
 * Mongoose model for the Subscription schema.
 * This model represents the collection in the MongoDB database
 * and provides methods to interact with the data.
 */
const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);

export default Subscription;