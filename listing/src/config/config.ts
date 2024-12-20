// Define an interface for S3 configuration settings
interface S3Config {
  // The access key ID for authenticating with AWS S3
  accessKeyId?: string; 

  // The secret access key for authenticating with AWS S3
  secretAccessKey?: string; 

  // The AWS region where the S3 bucket is hosted
  region?: string; 

  // The name of the S3 bucket to be used
  bucketName?: string; 
}

interface ariConfig {
  prefix: string;
  namespace: string;
  service: string;
  region: string;
  accountId: string;
  resource: string;
}

interface CabinetConfig {
  name: string;
  description: string;
  key_info: object;
  permissions: string[];
  type: string;
  created_at: Date;
  media: object[];
  documents: object[];
  contracts: object[];
}

// Define the main configuration interface for the service
interface Config {

  // The connection string for the primary MongoDB instance
  mongoURI: string;

  // The connection string for the test MongoDB instance
  mongoTestURI: string;

  // The URL for the Policy Service, used for policy management operations
  policyServiceUrl: string;

  // The URL for the Data Room service, used for Data room management operations
  dataRoomServiceUrl: string;

   // The URL for the listing service, used for listing management operations
  listingServiceUrl: string;

  // The Agsiri Resource Identifier (ARI) for a specific resource managed 
  // by this service
  resourceARI: string;

  // The configuration object for AWS S3 storage settings
  s3: S3Config; 

  // The URL for the Workflow Service, if used for managing workflows
  workflowServiceURL?: string;

  // The URL for the Notification Service, if used for sending notifications
  notificationServiceURL?: string;


  // The configuration object for the ARI
  ari: ariConfig;

  // The configuration object for the Cabinet
  cabinet: CabinetConfig;
}

// Initialize the configuration object with default values or 
// environment variables
const config: Config = {

  // Set the MongoDB URI from environment variables or use a default local URI
  // mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/listingService',
  mongoURI: "mongodb+srv://saddamshah:hOzlWf1NF6Xnx7aA@agsiri.nk7ua3s.mongodb.net/listingService",

  // Set the test MongoDB URI from environment variables or use a 
  // default local URI
  mongoTestURI: process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/listingService',

  // Set the Policy Service URL from environment variables or use a 
  // default local URL
  policyServiceUrl: process.env.POLICY_SERVICE_URL || 'http://policy-service:4000',

  // Set the Data room service URL from environment variables or use a
  // default local URL
  dataRoomServiceUrl: process.env.DATA_ROOM_SERVICE_URL || 'http://data-room-service:3001',

   // Set the Data listing service URL from environment variables or use a
  // default local URL
  listingServiceUrl:
    process.env.LISTING_SERVICE_URL || "http://listing-service:3002",

  // Set the Resource ARI from environment variables or use a default ARI; 
  // This should be customized to match the specific resource for each service
  resourceARI: process.env.RESOURCE_ARI || 'ari:nova:us:agsiri:listings', 

  // Configure S3 settings using environment variables for AWS credentials 
  // and bucket information
  s3: {
    // AWS access key ID for S3 authentication
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,

    // AWS secret access key for S3 authentication
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

    // AWS region for the S3 bucket
    region: process.env.AWS_REGION,

    // Name of the S3 bucket
    bucketName: process.env.S3_BUCKET_NAME,
  },

  // Set the Workflow Service URL from environment variables, if provided
  workflowServiceURL: process.env.WORKFLOW_SERVICE_URL,

  // Set the Notification Service URL from environment variables, if provided
  notificationServiceURL: process.env.NOTIFICATION_SERVICE_URL,

  // Set the name of the ARI:
  ari: {
    prefix: process.env.ariPrefix || 'ari',
    namespace: process.env.ariNamespace || 'nova',
    service: process.env.ariService || 'listings',
    region: process.env.ariRegion || 'us',
    accountId: process.env.ariAccountId || 'agsiri-listings-123456789012',
    resource: process.env.ariResource || 'dataroom',
  },

  // Set default for cabinet:
  cabinet : {
      name: process.env.CABINET_NAME || `Cabinet`,
      description:  process.env.CABINET_DESCRIPTION || `Cabinet creating for the Lising`,
      key_info: process.env.key_info ? JSON.parse(process.env.key_info) : {},  
      permissions: process.env.permissions? JSON.parse(process.env.permissions) || [] : [],
      type: process.env.type || 'REGULAR',
      created_at: new Date(),
      media: process.env. media? JSON.parse(process.env. media)  || [] : [],
      documents: process.env.documents? JSON.parse(process.env.documents) || [] : [],
      contracts: process.env.contracts? JSON.parse(process.env.contracts) || [] : [],
    }
};

// Export the configuration object for use in other parts of the application
export default config;

