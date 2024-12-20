import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing a campaign in the system.
 * @interface ICampaign
 * @extends Document
 */
export interface ICampaign extends Document {
  campaign_id: mongoose.Types.ObjectId; // Unique identifier for the campaign
  offering_id: mongoose.Types.ObjectId; // Offering identifier
  name: string; // Name of the campaign
  main_picture: string; // URL of the main picture
  webinars?: string[]; // URLs of related webinars
  newsletters?: string[]; // URLs of related newsletters
  isDeleted: boolean; // Flag indicating if the campaign is deleted
}

/**
 * Mongoose schema for the main Campaign model.
 */
const CampaignSchema = new Schema<ICampaign>({
  campaign_id: { type: mongoose.Schema.Types.ObjectId, unique: true, required: false },
  offering_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  main_picture: { type: String, required: true }, 
  webinars: { type: [String] },
  newsletters: { type: [String] },
  isDeleted: { type: Boolean, default: false },
});

/**
 * Mongoose model for the Campaign schema.
 * This model represents the collection in the MongoDB database
 * and provides methods to interact with the data.
 */
const Campaign: Model<ICampaign> = mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
