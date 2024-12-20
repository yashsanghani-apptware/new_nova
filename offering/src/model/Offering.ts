import mongoose, { Document, Schema, Model } from 'mongoose';



/**
 * Interface representing the expected returns of the offering.
 * @interface IExpectedReturns
 */
interface IExpectedReturns {
  target_net_irr: string; // Target Net IRR
  target_net_yield: string; // Target Net Yield
  net_equity_multiple: string; // Net Equity Multiple
  target_hold: string; // Target Hold Period
  target_net_returns: string; // Target Net Returns
}

/**
 * Interface representing the details of the offering.
 * @interface IDetails
 */
export interface IDetails {
  valid_from_date: string; // Valid from date for the offering
  valid_to_date: string; // Valid to date for the offering
  total_shares: string; // Total shares available
  shares_remaining: string; // Remaining shares
  holding_period: string; // Holding period details
  minimum_holding_shares: string; // Minimum shares required for holding
  maximum_holding_shares: string; // Maximum shares allowed for holding
  subscription_start_date: string; // Subscription start date
  subscription_end_date: string; // Subscription end date
  row_crop: string[]; // Multi-select field (corn, soybeans, mixed_vegetables)
  capital_being_raised: string; // Input field for the capital being raised
  total_acres: string; // Total acres (from detailed listing)
  price_unit: string; // Capital/total acres
  est_ownership_duration: string[]; // Dropdown (0-5, 5-10, 10-15, etc.)
  min_investment: string; // Minimum investment (input)
  attr: { [key: string]: any };
  offering_size: string,
  target_net_irr: string,
  target_net_cash_yield: string,
  target_net_moic: string,
  target_hold: string,
  target_net_ltv_ratio: string
}

/**
 * Interface representing the documents related to the offering.
 * @interface IDocuments
 */
export interface IDocuments {
  investor_memo: string; // URL or path to the investor memo
  investor_documents: string[]; // Array of URLs or paths to investor documents
  compliance_audits: string[]; // Array of URLs or paths to compliance audits
}

/**
 * Interface representing the comprehensive Offering details.
 * @interface IOffering
 * @extends Document
 */

/**
 * Interface representing the financial details of the offering.
 * @interface IFinancialDetails
 */
export interface IFinancialDetails {
  total_cost_of_farm: {
    cost_of_farmland: number; // Cost of Farmland
    land_due_diligence_fee: number; // Land Due Diligence Fee
    title_transfer_closing_costs: number; // Title, Transfer & Closing Costs
    broker_dealer_filing_fees: number; // 3rd Party Broker-Dealer & Filing Fees
    total_improvements: number; // Total Improvements
    legal_preparation_cost: number; // Legal Preparation Cost
    working_capital_reserve: number; // Working Capital Reserve
    total_estimated_cost_of_farm: number; // Total Estimated Cost of Farm
    total_acres: number; // Total Acres
    total_cost_per_acre: number; // Total Cost Per Acre
  };

  rent_estimates: {
    estimated_rent_per_acre: number; // Estimated Rent per Acre
    number_of_tillable_acres: number; // Number of Tillable Acres
    other_income: number; // Other Income
    estimated_total_revenue: number; // Estimated Total Revenue
  };

  operating_expense_net_income_estimates: {
    farm_offering_price: number; // Farm Offering Price
    farm_management_fee_percentage: number; // Farm Management Fee (% of Offering Price)
    annual_management_fee: number; // Annual Management Fee
    estimated_annual_taxes: number; // Estimated Annual Taxes
    estimated_annual_insurance: number; // Estimated Annual Insurance
    tax_preparation_residency_fee: number; // Tax Preparation & Residency Fee
    total_estimated_annual_expenses: number; // Total Estimated Annual Expenses
    total_estimated_annual_net_income: number; // Total Estimated Annual Net Income
    estimated_avg_annual_net_cash_percentage: number; // Avg Annual Net Cash from Operating Activities as % of Total Capital Expenditures
  };

  attr: { [key: string]: any };  // Additional attributes
}

/**
 * Interface representing the investment overview of the offering.
 * @interface IInvestmentOverview
 */
export interface IInvestmentOverview {
  description: string; // General description of the investment
  why_we_chose_this_investment: string; // Explanation of why this investment was selected
  additional_details: string; // Any additional relevant details about the investment
  disclosures: string; // Important disclosures related to the investment
  attr: { [key: string]: any };
}

export interface IOffering extends Document {
  offering_id?: string; // Unique identifier for the offering
  listing_id: string; // Identifier for the associated farm
  name: string; // Name of the offering
  workflows?: Record<string, unknown>;
  value_driver?: Record<string, unknown>; // Reasons why the deal is attractive
  expected_returns?: IExpectedReturns; // Expected returns from the offering
  details?: IDetails; // Detailed information about the offering
  financial_details?: IFinancialDetails, // Financial Details for offering
  investment_overview?: IInvestmentOverview, // Investment overview
  documents?: IDocuments; // Documents related to the offering
  status?: string; // Current status of the offering
  created_at?: Date; // Date when the offering was created
  updated_at?: Date; // Date when the offering was last updated
  isDeleted?: boolean;
}



/**
 * Mongoose schema for the Expected Returns model.
 */
const ExpectedReturnsSchema = new Schema<IExpectedReturns>({
  target_net_irr: { type: String, required: true },
  target_net_yield: { type: String, required: true },
  net_equity_multiple: { type: String, required: true },
  target_hold: { type: String, required: true },
  target_net_returns: { type: String, required: true },
});

/**
 * Mongoose schema for the Details model.
 */
const DetailsSchema = new Schema<IDetails>({
  valid_from_date: { type: String, },
  valid_to_date: { type: String, },
  total_shares: { type: String, },
  shares_remaining: { type: String, },
  holding_period: { type: String, },
  minimum_holding_shares: { type: String, },
  maximum_holding_shares: { type: String, },
  subscription_start_date: { type: String, },
  subscription_end_date: { type: String, },
  row_crop: { type: [String], },
  capital_being_raised: { type: String, },
  total_acres: { type: String, },
  price_unit: { type: String, required: true },
  est_ownership_duration: { type: [String], },
  min_investment: { type: String, },
  attr: { type: Map },
  offering_size: { type: String, },
  target_net_irr: { type: String, },
  target_net_cash_yield: { type: String, },
  target_net_moic: { type: String, },
  target_hold: { type: String, },
  target_net_ltv_ratio: { type: String, }
});

/**
 * Mongoose schema for the Documents model.
 */
const DocumentsSchema = new Schema<IDocuments>({
  investor_memo: { type: String },
  investor_documents: { type: [String] },
  compliance_audits: { type: [String] },
});

/**
 * Mongoose schema for the financial details model.
 */

const FinancialDetailsSchema = new Schema<IFinancialDetails>({
  total_cost_of_farm: {
    cost_of_farmland: { type: Number },
    land_due_diligence_fee: { type: Number },
    title_transfer_closing_costs: { type: Number },
    broker_dealer_filing_fees: { type: Number },
    total_improvements: { type: Number },
    legal_preparation_cost: { type: Number },
    working_capital_reserve: { type: Number },
    total_estimated_cost_of_farm: { type: Number },
    total_acres: { type: Number },
    total_cost_per_acre: { type: Number },
  },

  rent_estimates: {
    estimated_rent_per_acre: { type: Number },
    number_of_tillable_acres: { type: Number },
    other_income: { type: Number },
    estimated_total_revenue: { type: Number },
  },

  operating_expense_net_income_estimates: {
    farm_offering_price: { type: Number },
    farm_management_fee_percentage: { type: Number },
    annual_management_fee: { type: Number },
    estimated_annual_taxes: { type: Number },
    estimated_annual_insurance: { type: Number },
    tax_preparation_residency_fee: { type: Number },
    total_estimated_annual_expenses: { type: Number },
    total_estimated_annual_net_income: { type: Number },
    estimated_avg_annual_net_cash_percentage: { type: Number },
  },

  attr: { type: Map, of: String },  // Additional attributes as key-value pairs
});
const InvestmentOverviewSchema = new Schema<IInvestmentOverview>({
  description: { type: String },
  why_we_chose_this_investment: { type: String },
  additional_details: { type: String },
  disclosures: { type: String },
  attr: { type: Map }
})

/**
 * Mongoose schema for the main Offering model.
 */
const OfferingSchema = new Schema<IOffering>({
  offering_id: { type: String, required: false },
  listing_id: { type: String, unique: true }, //id from listing model
  name: { type: String },
  workflows: { type: Schema.Types.Mixed },
  value_driver: { type: Schema.Types.Mixed },
  expected_returns: { type: ExpectedReturnsSchema },
  details: { type: DetailsSchema, default: null },
  financial_details: { type: FinancialDetailsSchema, default: null },
  investment_overview: { type: InvestmentOverviewSchema, default: null },
  documents: { type: DocumentsSchema, default: null },
  status: {
    type: String,
    enum: ["PENDING_CLOSING", "CLOSED", "ACTIVE", "INACTIVE", "UNDER_REVIEW", "DRAFT", "ARCHIVED", "IN_CONTRACT"],  // restricts status to enum values
    default: "DRAFT", // default value
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

// Mongoose schema for the Crop model
const CropSchema = new mongoose.Schema({
  crops: {
    type: [String], // Array of strings
    required: true
  }
});

/**
 * Mongoose model for the Offering schema.
 * This model represents the collection in the MongoDB database
 * and provides methods to interact with the data.
 */
const Offering: Model<IOffering> = mongoose.model<IOffering>(
  "Offering",
  OfferingSchema
);

export const Crop = mongoose.model("Crop", CropSchema);

export default Offering;
