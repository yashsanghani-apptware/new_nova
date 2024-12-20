import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface representing a single investment within a portfolio.
 * @interface IInvestment
 */
interface IInvestment {
  offering_id: string; // ID of the offering
  number_of_shares: Number; // Number of shares
  share_price: Number; // Price per share
  investment_date: Date; // Date of investment
  holding_period: number; // Holding period
  hp_annotation: string; // Holding period
  documents: string[]; // Array of related document URLs or paths
  status: "ACTIVE" | "CLOSED"; // Status of the investment
}

/**
 * Interface representing the portfolio.
 * @interface IPortfolio
 * @extends Document
 */
export interface IPortfolio extends Document {
  portfolio_id: string; // Unique identifier for the portfolio
  user_id: string; // ID of the user who owns the portfolio
  investments: IInvestment[]; // Array of investments in the portfolio
  created_at?: Date; // Date when the portfolio was created
  updated_at?: Date; // Date when the portfolio was last updated
  is_deleted?: boolean; // Soft delete flag
}

/**
 * Mongoose schema for a single investment within the portfolio.
 */
const InvestmentSchema = new Schema<IInvestment>({
  offering_id: { type: String, required: true },
  number_of_shares: { type: Number, required: false },
  share_price: { type: Number, required: false },
  investment_date: { type: Date, required: false },
  holding_period: { type: Number, required: false },
  hp_annotation: { type: String, required: false },
  documents: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["ACTIVE", "CLOSED"], // Restricts status to enum values
    required: true,
  },
});

/**
 * Mongoose schema for the Portfolio model.
 */
const PortfolioSchema = new Schema<IPortfolio>({
  portfolio_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  investments: { type: [InvestmentSchema], default: [] }, // Array of investments
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
});

/**
 * Mongoose model for the Portfolio schema.
 * This model represents the collection in the MongoDB database
 * and provides methods to interact with the data.
 */
const Portfolio: Model<IPortfolio> = mongoose.model<IPortfolio>(
  "Portfolio",
  PortfolioSchema
);

export default Portfolio;
