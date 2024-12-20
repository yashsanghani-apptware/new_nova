interface Config {
  mongoURI: string;
  mongoTestURI: string;
  listingServiceUrl: string;
  // The URL for the Policy Service, used for policy management operations
  policyServiceUrl: string;

  // The URL for the Policy Service, used for policy management operations
  offeringServiceUrl: string;

  // The URL for the Data Room service, used for Data room management operations
  dataRoomServiceUrl: string;

  // The Agsiri Resource Identifier (ARI) for a specific resource managed
  // by this service
  resourceARI: string;
}

const config: Config = {
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb+srv://saddamshah:hOzlWf1NF6Xnx7aA@agsiri.nk7ua3s.mongodb.net/portfolio" ||
    "mongodb://localhost:27017/portfolio",
  mongoTestURI:
    process.env.TEST_MONGO_URI || "mongodb://localhost:27017/portfolio",
  listingServiceUrl:
    process.env.LISTING_SERVICE_URL || "http://listing-service:3002",
  // Set the Policy Service URL from environment variables or use a
  // default local URL
  policyServiceUrl:
    process.env.POLICY_SERVICE_URL || "http://policy-service:4000",
  // "http://localhost:4000",
  // Set the Offering Service URL from environment variables or use a
  // default local URL
  offeringServiceUrl:
    process.env.OFFERING_SERVICE_URL || "http://offering-service:3004",

  // Set the Data room service URL from environment variables or use a
  // default local URL
  dataRoomServiceUrl:
    process.env.DATA_ROOM_SERVICE_URL || "http://data-room-service:3001",

  // Set the Resource ARI from environment variables or use a default ARI;
  // This should be customized to match the specific resource for each service
  resourceARI: process.env.RESOURCE_ARI || "ari:nova:us:agsiri:listings",
};

export default config;
