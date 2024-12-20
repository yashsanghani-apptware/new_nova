import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing the address of a property.
 * @interface IAddress
 */
interface IAddress {
  house_number: string; // House number of the property
  street: string; // Street name of the property
  apartment?: string; // Apartment number, if applicable
  city: string; // City where the property is located
  state: string; // State where the property is located
  zip: string; // ZIP code of the property's location
}

/**
 * Interface representing the details of a barn on the property.
 * @interface IBarn
 */
interface IBarn {
  size: string; // Size of the barn (e.g., 20x30)
  description: string; // Description of the barn
}

/**
 * Interface representing the highlights of a property.
 * @interface IPropertyHighlights
 */
interface IPropertyHighlights {
  total_acres: number; // Total acres of the property
  tillable: number; // Tillable acres on the property
  woodland: number; // Woodland acres on the property
  wetland: number; // Wetland acres on the property
  deed_restrictions: string; // Any deed restrictions on the property
  barns: IBarn[]; // List of barns on the property
}

/**
 * Interface representing the listing agent's details.
 * @interface IListingAgent
 */
interface IListingAgent {
  name: string; // Name of the listing agent
  company: string; // Company of the listing agent
  phone_number: string; // Phone number of the listing agent
  email?: string; // Email address of the listing agent
}

/**
 * Interface representing the parking details of the property.
 * @interface IParking
 */
interface IParking {
  number_of_spaces: number; // Number of parking spaces available
  type: string; // Type of parking (e.g., Garage, Open)
}

/**
 * Interface representing the interior details of the property.
 * @interface IInterior
 */
interface IInterior {
  bathrooms: {
    number_full: number; // Number of full bathrooms
    number_total: number; // Total number of bathrooms
    bathroom1_level: string; // Level of the first bathroom
    bathroom2_level: string; // Level of the second bathroom
  };
  rooms: Array<{
    type: string; // Type of the room (e.g., Living Room)
    level: string; // Level where the room is located (e.g., First Floor)
  }>;
  basement?: Record<string, unknown>; // Details of the basement, if applicable
  laundry?: Record<string, unknown>; // Details of the laundry area, if applicable
  fireplace?: Record<string, unknown>; // Details of the fireplace, if applicable
  interior_features?: Record<string, unknown>; // Additional interior features
}

/**
 * Interface representing the exterior details of the property.
 * @interface IExterior
 */
interface IExterior {
  features?: Record<string, unknown>; // Exterior features of the property
  property_information?: Record<string, unknown>; // General property information
  lot_information?: Record<string, unknown>; // Information about the lot
}

/**
 * Interface representing the utility details of the property.
 * @interface IUtilities
 */
interface IUtilities {
  heating_and_cooling?: Record<string, unknown>; // Details about heating and cooling systems
  utility?: Record<string, unknown>; // Utility details (e.g., water, electricity)
}

/**
 * Interface representing the location details of the property.
 * @interface ILocation
 */
interface ILocation {
  school_information?: Record<string, unknown>; // Information about nearby schools
  location_information?: Record<string, unknown>; // Additional location information
}

/**
 * Interface representing the comprehensive property details.
 * @interface IPropertyDetails
 */
interface IPropertyDetails {
  parking?: IParking; // Parking details
  interior?: IInterior; // Interior details
  exterior?: IExterior; // Exterior details
  financial?: Record<string, unknown>; // Financial details of the property
  utilities?: IUtilities; // Utility details
  location?: ILocation; // Location details
  other?: Record<string, unknown>; // Other relevant details
}

/**
 * Interface representing the sales and tax history of the property.
 * @interface ISalesAndTax
 */
interface ISalesAndTax {
  sales_history?: Record<string, unknown>; // Sales history of the property
  tax_history?: Record<string, unknown>; // Tax history of the property
}

/**
 * Interface representing a property listing in the system.
 * @interface IListing
 * @extends Document
 */
export interface IListing extends Document {
  listing_id: mongoose.Types.ObjectId; // Unique identifier for the listing
  name: string; // Name of the property listing
  address: IAddress; // Address of the property
  property_description: string; // Detailed description of the property
  property_highlights: IPropertyHighlights; // Key highlights of the property
  days_on_market?: number; // Number of days the property has been on the market
  type: string; // Type of the property (e.g., Farm, Residential)
  built_on?: Date; // Date when the property was built
  renovated_on?: Date[]; // Dates when the property was renovated
  listing_agent: IListingAgent; // Details of the listing agent
  dataroom_id?: string; // Identifier for the associated data room
  workflows?: Record<string, unknown>; // Workflow-related information
  images?: string[]; // URLs of images related to the property
  videos?: string[]; // URLs of videos related to the property
  documents?: string[]; // URLs of videos related to the property
  maps?: object[]; // URLs of maps related to the property
  property_details?: IPropertyDetails; // Comprehensive property details
  sales_and_tax?: ISalesAndTax; // Sales and tax history of the property
  public_facts?: Record<string, unknown>; // Public facts about the property
  schools?: Record<string, unknown>; // Information about nearby schools
  listing_source: 'SYSTEM' | 'REALTOR'; // Source of the listing (SYSTEM or REALTOR)
  status: 'SOURCED' | 'SCREENED' | 'IN REVIEW' | 'REVIEWED' | 'IN DUE DILIGENCE' | 'SELECTED' | 'REJECTED' | 'ARCHIVED'; // Current status of the listing
  created_at?: Date; // Date when the listing was created
  updated_at?: Date; // Date when the listing was last updated
}

// Create the schema for the listing model with JSDoc comments

/**
 * Mongoose schema for the Address model.
 */
const AddressSchema = new Schema<IAddress>({
  house_number: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

/**
 * Mongoose schema for the Barn model.
 */
const BarnSchema = new Schema<IBarn>({
  size: { type: String, required: true },
  description: { type: String, required: true },
});

/**
 * Mongoose schema for the Property Highlights model.
 */
const PropertyHighlightsSchema = new Schema<IPropertyHighlights>({
  total_acres: { type: Number, required: true },
  tillable: { type: Number, required: true },
  woodland: { type: Number, required: true },
  wetland: { type: Number, required: true },
  deed_restrictions: { type: String, required: true },
  barns: { type: [BarnSchema], required: false },
});

/**
 * Mongoose schema for the Listing Agent model.
 */
const ListingAgentSchema = new Schema<IListingAgent>({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: false, match: /.+\@.+\..+/ },
});

/**
 * Mongoose schema for the Parking model.
 */
const ParkingSchema = new Schema<IParking>({
  number_of_spaces: { type: Number, required: true },
  type: { type: String, required: true },
});

/**
 * Mongoose schema for the Interior model.
 */
const InteriorSchema = new Schema<IInterior>({
  bathrooms: {
    type: {
      number_full: { type: Number, required: true },
      number_total: { type: Number, required: true },
      bathroom1_level: { type: String, required: true },
      bathroom2_level: { type: String, required: true },
    },
    required: true,
  },
  rooms: {
    type: [
      {
        type: { type: String, required: false },
        level: { type: String, required: false },
      },
    ],
    required: true,
  },
  basement: { type: Schema.Types.Mixed },
  laundry: { type: Schema.Types.Mixed },
  fireplace: { type: Schema.Types.Mixed },
  interior_features: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the Exterior model.
 */
const ExteriorSchema = new Schema<IExterior>({
  features: { type: Schema.Types.Mixed },
  property_information: { type: Schema.Types.Mixed },
  lot_information: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the Utilities model.
 */
const UtilitiesSchema = new Schema<IUtilities>({
  heating_and_cooling: { type: Schema.Types.Mixed },
  utility: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the Location model.
 */
const LocationSchema = new Schema<ILocation>({
  school_information: { type: Schema.Types.Mixed },
  location_information: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the Property Details model.
 */
const PropertyDetailsSchema = new Schema<IPropertyDetails>({
  parking: { type: ParkingSchema },
  interior: { type: InteriorSchema },
  exterior: { type: ExteriorSchema },
  financial: { type: Schema.Types.Mixed },
  utilities: { type: UtilitiesSchema },
  location: { type: LocationSchema },
  other: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the Sales and Tax model.
 */
const SalesAndTaxSchema = new Schema<ISalesAndTax>({
  sales_history: { type: Schema.Types.Mixed },
  tax_history: { type: Schema.Types.Mixed },
});

/**
 * Mongoose schema for the main Listing model.
 */
const ListingSchema = new Schema<IListing>({
  listing_id: { type: mongoose.Schema.Types.ObjectId, unique: true, required: false },
  name: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  property_description: { type: String, required: true },
  property_highlights: { type: PropertyHighlightsSchema, required: true },
  days_on_market: { type: Number },
  type: { type: String, required: true },
  built_on: { type: Date },
  renovated_on: { type: [Date] },
  listing_agent: { type: ListingAgentSchema, required: true },
  dataroom_id: { type: String, index: true },
  workflows: { type: Schema.Types.Mixed },
  images: { type: [String] },
  videos: { type: [String] },
  maps: { type: [Object] },
  property_details: { type: PropertyDetailsSchema },
  sales_and_tax: { type: SalesAndTaxSchema },
  public_facts: { type: Schema.Types.Mixed },
  schools: { type: Schema.Types.Mixed },
  listing_source: { type: String, enum: ['SYSTEM', 'REALTOR'], required: true },
  status: {
    type: String,
    enum: [
      'ACTIVE',
      'PENDING',
      'SOURCED',
      'SCREENED',
      'IN REVIEW',
      'REVIEWED',
      'IN DUE DILIGENCE',
      'SELECTED',
      'REJECTED',
      'ARCHIVED',
    ],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

/**
 * Mongoose model for the Listing schema.
 * This model represents the collection in the MongoDB database
 * and provides methods to interact with the data.
 */
// const ListingModel = model<IListing>('Listing', ListingSchema);
const Listing: Model<IListing> = mongoose.model<IListing>(
  "Listing",
  ListingSchema
);

export default Listing;

  