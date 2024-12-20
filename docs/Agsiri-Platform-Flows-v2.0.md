Here is the revised and better-structured markdown document:

---

# Agsiri Flows v2.0

## User Roles

1. **Administrator**: Manages platform operations and approves critical actions.
2. **Investor**: Buys and sells farmland ownership units and undergoes onboarding.
3. **Buyer**: Purchases entire farmland or assets and completes suitability assessments.
4. **Seller**: Lists farmland or assets for sale and provides documentation.
5. **Farm SME**: Conducts due diligence on properties and provides expert analysis.
6. **Farm Manager**: Manages farm operations and updates performance metrics.
7. **Financial Analyst**: Analyses financial data, manages distributions, and collaborates with accountants.
8. **Accountant**: Handles accounting activities and ensures financial accuracy.
9. **Campaign Manager**: Creates and monitors marketing campaigns and targets investor profiles.

## User Stories and Scenarios

### 1. Administrator

**Role Description**:
- **Responsibilities**: Administrators are responsible for the day-to-day operations of the platform. They act as super users with extensive access to all parts of the system.
- **Critical Operations**: Given the sensitivity of the platform, critical operations require 4-eyes approval to prevent any adverse activities.

**Example Scenario**:
- **User Story**: As an administrator, I need to approve a large fund transfer initiated by another administrator to ensure there are no unauthorized activities.
- **Action**: Administrator A initiates the transfer of funds.
- **Approval**: Administrator B reviews and approves the transfer to complete the transaction.

### 2. Investor

**Role Description**:
- **Responsibilities**: Investors are registered users who can buy and sell farmland ownership units. They are typically accredited investors who have undergone a thorough onboarding process.
- **Onboarding Process**: Investors must meet certain criteria and provide necessary documentation to gain access to the platform.

**Example Scenario**:
- **User Story**: As an investor, I want to review the available farmland units and invest in those that match my portfolio requirements.
- **Action**: The investor logs in, reviews the listings, and selects a farmland unit to invest in.

### 3. Buyer

**Role Description**:
- **Responsibilities**: Buyers are registered users looking to purchase entire farmland or sustainable assets outright. They undergo a deeper suitability assessment based on applicable laws and regulations.

**Example Scenario**:
- **User Story**: As a buyer, I want to purchase a specific piece of farmland outright and need to complete a detailed suitability assessment.
- **Action**: The buyer undergoes a suitability assessment, reviews the farm's details, and completes the purchase.

### 4. Seller

**Role Description**:
- **Responsibilities**: Sellers are users who list farmland or sustainable assets for sale. They provide necessary documentation and details about the property.

**Example Scenario**:
- **User Story**: As a seller, I want to list my farmland on the platform to attract potential buyers.
- **Action**: The seller provides detailed information and documentation about the farmland, which is then listed on the platform.

### 5. Farm SME (Subject Matter Expert)

**Role Description**:
- **Responsibilities**: Farm SMEs provide detailed analysis and due diligence on selected properties. They have access only to listed properties and related data rooms but no access to investor information unless explicitly granted.

**Example Scenario**:
- **User Story**: As a farm SME, I need to perform due diligence on a newly listed property and provide my expert analysis.
- **Action**: The farm SME accesses the data room for the property, reviews the documents, and submits their analysis.

### 6. Farm Manager

**Role Description**:
- **Responsibilities**: Farm Managers are responsible for managing the day-to-day operations of the farm. They can view operational data and update metrics related to farm performance.

**Example Scenario**:
- **User Story**: As a farm manager, I need to update the farm's daily operational metrics and view performance reports.
- **Action**: The farm manager logs in, updates the metrics, and reviews performance reports.

### 7. Financial Analyst

**Role Description**:
- **Responsibilities**: Financial Analysts analyze and report financial data and asset performance. They are also responsible for distributing proceeds, tracking allocations, and collaborating with accountants.

**Example Scenario**:
- **User Story**: As a financial analyst, I need to prepare a financial performance report for the last quarter and ensure distributions are correctly allocated.
- **Action**: The financial analyst analyzes the data, prepares the report, and coordinates with the accountant for distributions.

### 8. Accountant

**Role Description**:
- **Responsibilities**: Accountants manage day-to-day accounting activities, ensuring accurate financial records and compliance with regulations.

**Example Scenario**:
- **User Story**: As an accountant, I need to reconcile the financial statements and ensure all transactions are accurately recorded.
- **Action**: The accountant logs in, reviews the transactions, reconciles the statements, and updates the records.

### 9. Campaign Manager

**Role Description**:
- **Responsibilities**: Campaign Managers create marketing campaigns based on approved offerings. They have access to investor profiles, previous investments, and interest lists to tailor their campaigns effectively.

**Example Scenario**:
- **User Story**: As a campaign manager, I want to launch a marketing campaign for a new offering and monitor its performance.
- **Action**: The campaign manager creates the campaign, targets specific investors based on their profiles, and tracks the campaign's performance.

## Common Services

- **Resources**: These are the resources available to the user.
- **About**: Information about Agsiri, including contact information.
- **Chat**: Chat easily with support.

## Flows

### Investor Flow

- **Landing Page**
- **Portfolio**: This is the complete portfolio of the logged-in investor (see Portfolio Flow).
- **Offerings**: These are the current offerings available for investing. The investor can select one or more offerings to subscribe to.

#### Portfolio Flow

- **Summary**
- **Total Investment**
- **Number of properties subscribed to**
- **Income (YTD)**
- **Yield (YTD)**
- **Total Income**
- **Total Yield**

#### List of Investments

List all the current investments for the investor. There should also be an option for the investor to look at their previous investments. The following information can be provided for each investment:

- Summary of the investment
- Description
- Images/Videos/Maps of the property
- Disclosures
- Property Documents
- Legal Documents (contracts, etc.)
- Operational Metrics
- Analytics
- Future Plan (if any)
- Option to sell shares of the property

#### Offering Flow

List all the current offerings available to the investor. The following information can be provided for each offering:

- Description of the property
- Why the investor should invest in it
- Images/Videos/Maps of the property
- Disclosures
- Property Documents
- Operational Metrics (if any) - may or may not be available for new offerings
- Analytics (if any) - may or may not be available for new offerings
- Plan for developing the property
- Option to subscribe to shares of the property

### Farm Onboarding Flow

#### Types of Shares

Shares can be of different types depending on how/when they are issued:

- **Preferential Shares**: These are shares allocated to the founding members (initial investors) of the farm. These shares have preferential treatment (e.g., voting rights).
- **Ordinary Shares**: Investors who invest later will receive ordinary shares. If a founding investor sells some of their shares to another investor, the preferential shares are converted into ordinary shares.

#### Share Price

There are two ways the price can be determined - fixed price and variable price. When a farm is onboarded, the initial share price can be set at either $500 or $1000 per share.

#### Number of Shares

When a farm is onboarded, the number of shares is determined based on the value of the farm and the share price. The number of shares can change based on new shares issued if the farm's value changes due to reevaluation.

#### Flow

1. Compute the number of shares to be issued based on the farm's value and the price of each share. Fractional shares are possible.
2. Once the farm is onboarded, a campaign is sent to all customers of the system, providing complete details of the farm, including share price and the number of shares.
3. Each initial investor can opt to buy any number of shares subject to a maximum and minimum. This limits the number of initial investors and prevents one investor from controlling the whole farm.
4. There is a minimum holding period before which investors cannot sell their shares.

## Trading Flow

This flow is for investors to buy and sell shares of the investment:

- Shares can be sold by the investor at any time after the initial holding period.
- Shares to be sold are subject to the minimum shares that can be held by the investor, except if they want to sell all shares.
- The investor initiates the process by specifying how many shares they want to sell. The share price will always be determined by the system.
- The system generates a campaign to be sent to all customers with the complete details of the sale.
- If customers are interested in buying part or all shares (subject to limitations), the sale proceeds.
- If there is oversubscription, it will be treated on a first-come, first-served basis.
- If there is under subscription, the seller can only sell the number of shares the buyer(s) are interested in.
- If there is no interest, the seller cannot sell any shares.
- The seller pays a transaction fee (e.g., 1% of the transaction cost).
- The buyer also pays a transaction fee (e.g., 1% of the transaction cost

).

## Publishing Flow

- **Create**: Content for campaigns, newsletters, etc.
- **Publish**: Campaigns, newsletters, etc.
  - Campaigns can be published in real-time.
  - Newsletters can be published in real-time or on a periodic basis.

## Subscription Flow

Once an offering is created for a farm, a campaign is sent to all/interested investors.

- Investors subscribe to the offering by specifying the number of shares they want to invest in.
- At the end of the offering period, the shares are allocated on a first-come, first-served basis.
- Legal and other documents are sent to the allocated investors.
- Once all required documents are signed by the investor, the allocated shares and signed legal documents become part of the investor’s portfolio.

# Agsiri Platform Design

The design focuses on four key topics:

1. **Data Model**
2. **APIs**
3. **Transition Flow**
4. **UI Flow**

## Database

Before defining the data model, we need to finalize the type of database for storing platform data. AWS DocumentDB is a good candidate for Agsiri’s requirements.

### AWS DocumentDB Features:

- **Semi-structured and hierarchical data**: DocumentDB is well-suited for storing semi-structured and hierarchical data.
- **Schemaless design**: Provides the flexibility required for Agsiri to evolve without making significant changes.
- **ACID transactions**: Supports ACID transactions across multiple documents, statements, collections, and databases.
- **ML and Gen AI support**: Amazon DocumentDB enables machine learning and generative artificial intelligence models to work with data stored in real-time.

S3 will store images, videos, and maps, with DocumentDB holding references to this data. We may also need a Document Management System (DMS) for routing and managing farm documents, legal documents, and other documents (TBD).

## Data Model

### Listing

This document type stores data from the listing (MLS) database. The first step in farm onboarding is to integrate with the listing source and other external data sources to get farm details, which are stored in the listing DocumentDB collection.

```json
{
  "listing_id": "1",
  "name": "",
  "address": {
    "house_number": "",
    "street": "",
    "apartment": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  "property_description": "132 acres in the heart of the Amish community",
  "property_highlights": {
    "total_acres": 132,
    "tillable": 105,
    "woodland": 20,
    "wetland": 2,
    "deed_restrictions": "no",
    "barns": [
      {
        "size": "20x30",
        "description": "Needs lots of repairs"
      }
    ],
    "days_on_market": "",
    "type": "",
    "built_on": "",
    "renovated_on": []
  },
  "listing_agent": {
    "name": "",
    "company": "",
    "phone_number": "",
    "email": ""
  },
  "dataroom_id": "",
  "workflows": {},
  "images": [],
  "videos": [],
  "maps": [],
  "property_details": {
    "parking": {
      "number_of_spaces": "",
      "type": ""
    },
    "interior": {
      "bathrooms": {
        "number_full": "",
        "number_total": "",
        "bathroom1_level": "",
        "bathroom2_level": ""
      },
      "rooms": [
        {
          "type": "",
          "level": ""
        }
      ],
      "basement": {},
      "laundry": {},
      "fireplace": {},
      "interior_features": {}
    },
    "exterior": {
      "features": {},
      "property_information": {},
      "lot_information": {}
    },
    "financial": {},
    "utilities": {
      "heating_and_cooling": {},
      "utility": {}
    },
    "location": {
      "school_information": {},
      "location_information": {}
    },
    "other": {
      "listing_information": {}
    }
  },
  "sales_and_tax": {
    "sales_history": {},
    "tax_history": {}
  },
  "public_facts": {},
  "schools": {}
}
```

### Farm

Once the data is in the listing collection, it is enhanced with more information, such as soil types, and this data is added to the farm DocumentDB collection. The farm manager conducts a complete due diligence process to determine if the farm is suitable for investment on the Agsiri platform. All findings during the due diligence process are recorded in the farm collection.

```json
{
  "farm_id": "1",
  "listing_id": "",
  "name": "217 Pickle Hill",
  "address": {
    "house_number": "",
    "street": "",
    "apartment": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  "location": {
    "longitude": "",
    "latitude": ""
  },
  "property_description": "",
  "dataroom_id": "",
  "workflows": {},
  "images": [],
  "videos": [],
  "maps": [],
  "parcel_information": [],
  "due_diligence": {
    "soil_information": {
      "documents": [],
      "maps": []
    },
    "financial_information": {
      "cash_flow": {},
      "sales_data": {},
      "expenses_data": {},
      "documents": []
    },
    "crop_information": {},
    "other": {}
  }
}
```

### Offering

After the due diligence process, if the farm is deemed suitable for investment, it proceeds to the next step—creating an offering for the farm. Shares of the farm are created for investors to invest in.

```json
{
  "offering_id": "1",
  "farm_id": "1",
  "name": "217 Pickle Hill",
  "address": {
    "house_number": "",
    "street": "",
    "apartment": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  "property_description": "",
  "main_picture": "",
  "dataroom_id": "",
  "workflows": {},
  "images": [],
  "videos": [],
  "maps": [],
  "parcel_information": [],
  "value_driver": {}, // Why we like the deal
  "expected_returns": {
    "target_net_irr": "",
    "target_net_yield": "",
    "net_equity_multiple": "",
    "target_hold": "",
    "target_net_returns": ""
  },
  "details": {
    "valid_from_date": "",
    "valid_to_date": "",
    "total_shares": "",
    "shares_remaining": "",
    "holding_period": "",
    "minimum_holding_shares": "",
    "maximum_holding_shares": "",
    "subscription_start_date": "",
    "subscription_end_date": ""
  },
  "documents": {
    "investor_memo": "",
    "investor_documents": [],
    "compliance_audits": []
  }
}
```

### Subscriptions

Once an offering is created, investors can subscribe to invest in the offerings. Subscriptions are always for a particular investor. Each investor will have one and only one subscription for a particular offering.

```json
{
  "offering_id": "",
  "subscriptions": [
    {
      "user_id": "",
      "shares_subscribed": "",
      "date_subscribed": "",
      "status": "ACTIVE|CLOSED"
    }
  ],
  "allocations": [
    {
      "user_id": "",
      "shares_allocated": "",
      "date_allocated": "",
      "documents": []
    }
  ],
  "dataroom_id": "",
  "workflows": {}
}
```

### Campaign

Once an offering is created, a campaign is sent to all/interested investors providing information about the offering, documentation, and reasons to invest. Multiple campaigns can be sent for the same offering until the offering is closed or fully subscribed.

```json
{
  "campaign_id": "1",
  "offering_id": "",
  "name": "217 Pickle Hill",
  "address": {
    "house_number": "",
    "street": "",
    "apartment": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  "property_description": "",
  "dataroom_id": "",
  "workflows": {},
  "main_picture": "",
  "images": [],
  "videos": [],
  "maps": [],
  "expected_returns": {
    "target_net_irr": "",
    "target_net_yield": "",
    "net_equity_multiple": "",
    "target_hold": "",
    "target_net_returns": ""
  },
  "offering_details": {
    "valid_from_date": "",
    "valid_to_date": "",
    "total_shares": "",
    "shares_remaining": "",
    "holding_period": "",
    "minimum_holding_shares": "",
    "maximum_holding_shares": "",
    "subscription_start_date": "",
    "subscription_end_date": ""
  },
  "webinars": [],
  "newsletters": []
}
```

### Notifications

Notifications should be defined and implemented as needed for each service and process.

### User

Agsiri supports different types of users:

- **Investor**
- **Farm Subject Matter Expert**
- **Farm Manager**
- **Analyst**
- **Admin**

Only investors can sign up by themselves on Agsiri. All other users are created manually.

**Investor Signup Flow**:
1. Get the investor’s personal information.
2.

 Get documents for KYC/AML (e.g., driver’s license, passport).
3. Perform KYC/AML checks and approve/reject the investor.
4. Get account information for funding.
5. Get beneficiary information.

```json
{
  "user_id": "",
  "first_name": "",
  "last_name": "",
  "date_of_birth": "",
  "email_address": "",
  "phone_number": "",
  "address": {},
  "user_role": "INVESTOR|FARM SME|FARM MANAGER|ANALYST|ADMIN",
  "investor": {
    "accounts": [],
    "beneficiaries": [
      {
        "first_name": "",
        "last_name": "",
        "relationship": "",
        "type": "INDIVIDUAL|TRUST",
        "percentage": ""
      }
    ]
  }
}
```

### Portfolio

The portfolio document stores information about an investor's portfolio.

```json
{
  "portfolio_id": "1",
  "user_id": "1",
  "investments": [
    {
      "offering_id": "1",
      "number_of_shares": "",
      "share_price": "",
      "investment_date": "",
      "holding_period": "",
      "documents": [],
      "status": "ACTIVE|CLOSED"
    }
  ]
}
```

### Data Room

A data room provides a secure way to store and organize documents and files. Fine-grained access control mechanisms will be provided to control who has access to which files and when. All access to files/documents is audited to provide extensive logging and tracking.

#### Tenant Definition

A Tenant can represent different entities within the system, including:

1. **Investor**: An individual or entity that invests in offerings.
2. **Organization (e.g., Farm)**: A business entity or enterprise, such as a farm, onboarded into the system.
3. **Group (e.g., Syndicate)**: A collective group of investors or organizations that subscribes to an offering.

#### Structure and Contents

**Creation of Tenants**:
- **Farm Tenant**: Created when a farm is onboarded into the system.
- **Investor Tenant**: Created when an investor subscribes to an offering.
- **Group Tenant**: Created for a group, such as a syndicate, when the group subscribes to an offering.

**Data Room Structure**:
- **Cabinets**: Each data room contains one or more cabinets.
  - **Nested Cabinets**: Cabinets can contain other cabinets or files.
  - **Files**: Individual documents or files stored within cabinets.

#### Encryption

- **At Rest**: All transactional files, especially those containing Personally Identifiable Information (PII), are encrypted when stored.
- **In Transit**: Encryption is also applied to files during transmission to ensure data security and confidentiality.

#### Shared Files and Cabinets

- **Individual Sharing**: Some cabinets or individual files can be shared with other users within the system.
- **Granular Access**: Sharing permissions are assigned at the individual user level.

#### Version Control

- **Document Management**: Version control is used to manage changes and revisions for many documents, including Word or HTML files.
- **Storage**: 
  - **S3**: All documents are stored in Amazon S3.
  - **Vector Format**: Essential content is stored in vector format in DocumentDB, leveraging GenAI capabilities for advanced search and recommendations.

#### Permissions

- **Resource Creation and Modification**: Each resource in the system is created and modified by a named user.
- **Access Control**:
  - **Role-based Permissions**: Access to documents and resources is governed by role-based permissions.
  - **Permission Policies**: Define access levels for specific resources.

**Permission Definition Example**:
- **Data Room**: `Read=true, Create=false, Update=false, Delete=false`
- **Cabinets and Files**: Similar permission bundles are defined for cabinets and files.

#### Event Capture

- **Event Logging**: All data room events (e.g., CREATED, ACCEPTED) are captured by the system.
- **Automated Actions**: The system automatically performs predefined actions based on these events.

#### Automated Workflow

- **Trigger Mechanisms**: Certain document creation events automatically trigger predefined workflows, streamlining processes.

#### Audit Controls

- **Transactional Document Management**: The system manages cover pages and signature pages for all legally binding documents.
- **Compliance**: Ensures all activities are auditable and comply with relevant regulations.

### File Type and Permissions

#### Shared

**Definition**:
- **Shareable Files**: Include images, videos, maps, webinars, and other multimedia files intended for broad access within the system.

**Storage and Security**:
- **Unencrypted Storage**: Shared files are stored without encryption for easy access.
- **Minimal Logging and Audit Tracking**: Due to their non-sensitive nature, these files require minimal logging or audit tracking.
- **System-wide Access**: Shared documents are accessible to all users in the system.

**Examples**:
- **Images**: Photographs, diagrams, and other visual content.
- **Videos**: Recorded webinars, training videos, and promotional content.
- **Maps**: Geographical maps and layout diagrams.
- **Webinars**: Recorded sessions for educational or promotional purposes.

#### Templates

**Definition**:
- **Template Files**: Include documents, envelopes, and other templates used for electronic signing (e-signing).

**Storage and Security**:
- **Encrypted Storage**: Template files are encrypted to ensure security during storage.
- **Post-Signing Management**: Once documents are e-signed, they are automatically transferred to the secure area of the respective investor.
- **Secure by Design**: Ensures that even while used as templates, these files remain protected.

**Examples**:
- **Document Templates**: Predefined layouts for contracts, agreements, and other formal documents.
- **Envelope Templates**: Standardized templates for e-signing workflows.

#### Secure

**Definition**:
- **Sensitive Documents**: Include legal, contractual, and operational documents requiring the highest level of security.

**Storage and Security**:
- **Highly Secure Storage**: Files are encrypted before storage to ensure their confidentiality.
- **Fine-Grained Access Control**: Access to these files is controlled with very fine-grained permissions.
- **AWS Key Management Service (KMS)**: Encryption keys are managed using AWS KMS for robust security.

**Examples**:
- **Legal Documents**: Contracts, legal agreements, and compliance documents.
- **Contractual Documents**: Binding agreements between parties.
- **Operational Documents**: Internal procedures, policy documents, and sensitive communications.

**Key Features**:
- **Encryption**: All sensitive documents are encrypted at rest and in transit.
- **Key Management**: Utilizes AWS KMS for managing encryption keys securely.
- **Access Control**: Implements strict access control mechanisms.

### Data Room Creation and Access Steps

A data room in this context is similar to Dropbox but with enhanced controls, workflows, and policies. It is designed to securely store and manage documents related to properties or farms.

#### Data Room Creation and Access Control

**Overview**:
- **Data Room**: Each property/farm can have its own dedicated data room.
- **Access Control**: Access is controlled at the data room level and can be overridden for sub-entities (cabinets).
- **Encryption**: Each data room has a unique key for encryption.

**Structure**:
- **Cabinets**: A data room can contain one or more cabinets.
  - **Investor Cabinets**: Dedicated cabinets for each investor to store their files.
  - **Shared Cabinets**: Cabinets that store files shared among all investors.
  - **Template Cabinets**: Cabinets for storing template files used for e-signing.

**Storage**:
- **File Storage**: Files are stored in a system like Amazon S3, with their location URLs embedded within the data room.
- **Flexibility**: The storage system can be switched in the future without disrupting the data room structure.

#### Example Scenario: Data Room Creation for a Farm

**Actors**:
- **Administrator**: Responsible for setting up the data room, cabinets, and associated files.
- **Roles Involved**: Analyst, Realtor, Farm Advisor, etc.

**Steps**:
1. **Data Room Creation**:
   - **Initiation**: When a farm is onboarded, an administrator creates a data room for the farm.
   - **Role Assignment**: The administrator provisions initial roles and permissions for the data room assets.
2. **Cabinet Setup**:
   - **Investor Cabinets**: Create cabinets for each investor to store their related documents.
   - **Shared Cabinets**: Create a cabinet for shared files accessible to all investors.
   - **Template Cabinets**: Create a cabinet for template files used for e-signing.
3. **Permission Management**:
   - **Initial Permissions**: Create permission records for each resource (data room, cabinets, files).
   - **Role Mapping**: Map these permissions to different roles.
   - **Role Permissions**: Each role can have one or more permissions (e.g., view, create, modify, delete).
4. **Default Permissions**:
   - **Creator Access**: By default, only the creator (administrator) has full access to the data room.
   - **Role-Based Access**: Additional roles are assigned permissions based on their responsibilities.

**Example**:
- **Farm Onboarding**:
  - A new farm named "Sunny Acres" is onboarded.
  - An administrator creates a data room named "Sunny Acres Data Room."
- **Cabinet Creation**:
  - **Investor Cabinets**: Cabinets are created for investors "John Doe" and "Jane Smith," storing their respective documents.
  - **Shared Cabinet**: A cabinet named "Shared

 Documents" is created to store files accessible to all investors.
  - **Template Cabinet**: A cabinet named "Templates" is created to store e-signing templates.
- **Permission Assignment**:
  - **Administrator**: Has full access to create, view, modify, and delete all files and cabinets.
  - **Analyst**: Assigned permissions to view and analyze documents in the "Sunny Acres Data Room."
  - **Realtor**: Given access to view and upload documents to the "Investor Cabinets."
  - **Farm Advisor**: Assigned permissions to view, modify, and add notes to documents within the "Shared Cabinet."
- **Default Access**:
  - The administrator (creator) initially has all permissions.
  - Additional roles are configured and assigned specific permissions based on the needs of the farm and its investors.

#### Key Features and Security

- **Encryption**:
  - **At Rest**: All sensitive documents are encrypted using unique keys for each data room.
  - **In Transit**: Encryption is applied during file transmission.
- **Access Control**:
  - **Granular Permissions**: Access can be finely controlled at the data room, cabinet, and file levels.
  - **Role-Based Access**: Permissions are defined and assigned based on roles.
- **Event Capture and Workflow Automation**:
  - **Event Logging**: All actions (e.g., CREATED, ACCEPTED) within the data room are logged.
  - **Automated Workflows**: Certain events trigger predefined workflows, such as notifications, document reviews, or approvals.
- **Audit Controls**:
  - **Transactional Document Management**: The system manages cover pages and signature pages for legally binding documents.
  - **Compliance**: Ensures all activities are auditable and comply with relevant regulations.

### Cabinet

A cabinet is a container for different types of files and/or other cabinets. Cabinets are hierarchical, and some files may have a process associated with them (e.g., legal and contract files may go through a signing process).

#### Permissions

- **View**: Allows the user to view files without the ability to create/write/modify them.
- **Read**: Allows the user to read files with the ability to copy/print them.
- **Write**: Allows the user to read, write, and modify files subject to file status.
- **Create**: Allows the user to create new files in the cabinet.

Files within a cabinet can have their own permissions, usually more restrictive than the cabinet's permissions. If no permissions are specified for files, they inherit the cabinet's permissions. If multiple permissions apply to a user for a file/cabinet, the most restrictive set of permissions is applied.

### Document e-Signing

We can integrate with DocuSign eSignature API to electronically sign and track documents. DocuSign eSignatures are based on envelopes, documents, recipients, and tabs.

- **Envelope**: The overall container for a DocuSign transaction, containing one or more documents to be signed electronically.

There are two ways documents can be signed:
- **Remote Signing**: Envelopes are sent to recipients for remote signing.
- **Embedded Signing**: Signing is done within the application's UI.

## Service APIs

### Listing Service (Stage 1)

#### Create a new Listing

This API creates a new listing in Agsiri. The listing object is obtained by integrating with an external source like MLS.

```http
POST /listings
```

The body of this API will be the listing document defined above. Returns the complete listing document, if successful.

#### Modify an existing Listing

This API modifies an existing listing. The modifications can include a subset of the attributes or the whole listing document.

```http
PUT /listings/{listing_id}
```

The body contains the attributes that need to be modified/added. This returns the complete listing document, if successful.

#### Get all Listings

Get all the listings from the listing service.

```http
GET /listings
```

This returns an array of all the listing documents.

#### Get a particular Listing

Get a particular listing specified by the listing_id.

```http
GET /listings/{listing_id}
```

This returns the requested listing document.

#### Delete a Listing

Delete a listing from the listing service. Note that the listing cannot be deleted if any farm document is created from the specified listing id.

```http
DELETE /listings/{listing_id}
```

### Farm Service (Stage 2)

#### Create a new Farm

This API creates a new farm in Agsiri.

```http
POST /farms
```

The body of this API will be the farm document defined above. Returns the complete farm document, if successful.

#### Modify an existing Farm

This API modifies an existing farm. The modifications can include a subset of the attributes or the whole farm document.

```http
PUT /farms/{farm_id}
```

The body contains the attributes that need to be modified/added. This returns the complete farm document, if successful.

#### Get all Farms

Get all the farms from the farm service.

```http
GET /farms
```

This returns an array of all the farm documents.

#### Get a particular Farm

Get a particular farm specified by the farm_id.

```http
GET /farms/{farm_id}
```

This returns the requested farm document.

#### Delete a Farm

Delete a farm from the farm service. Note that the farm cannot be deleted if any offering document is created from the specified farm id.

```http
DELETE /farms/{farm_id}
```

#### Create/Update Due Diligence Information

This API creates/updates due diligence information (e.g., soil, financial, crop) for a farm.

- **Soil Information**: `PUT /farms/{farm_id}/dd/soil`
- **Financial Information**: `PUT /farms/{farm_id}/dd/financial`
- **Crop Information**: `PUT /farms/{farm_id}/dd/crop`
- **Other Information**: `PUT /farms/{farm_id}/dd/other`

The body will have one or more attributes that will be updated as part of the due diligence of the farm. These APIs return the complete farm object.

### Offering Service (Stage 3)

#### Create a new Offering

This API creates a new offering in Agsiri.

```http
POST /offerings
```

The body of this API will be the offering document defined above. Many attributes may not be populated when the offering is initially created. Returns the complete offering document, if successful.

#### Modify an existing Offering

This API modifies an existing offering. The modifications can include a subset of the attributes or the whole offering document.

```http
PUT /offerings/{offering_id}
```

The body contains the attributes that need to be modified/added. This returns the complete offering document, if successful.

#### Get all Offerings

Get all the offerings from the offering service.

```http
GET /offerings
```

This returns an array of all the offering documents.

#### Get a particular Offering

Get a particular offering specified by the offering_id.

```http
GET /offerings/{offering_id}
```

This returns the requested offering document.

#### Create/Update Offering Details

These APIs create/update the offering details, documents, and expected returns.

- **Expected Returns**: `PUT /offerings/{offering_id}/dd/expected_returns`
- **Offering Details**: `PUT /offerings/{offering_id}/details`
- **Offering Documents**: `PUT /offerings/{offering_id}/documents`

The body will have one or more attributes or documents that will be updated for the offering. These APIs return the complete offering object.

### Subscription Service (Stage 5)

#### Create/Update Subscriptions

This API creates/updates subscriptions for an investor for an offering.

```http
PUT /subscriptions/{offering_id}/investor/{investor_id}
```

The body will have one or more attributes of the subscription information that will be updated. This API returns the complete subscription object.

#### List Offering Subscriptions

This API lists all the subscriptions for an offering.

```http
GET /subscriptions/{offering_id}/
```

This returns an array of the subscription objects.

#### List Investor Subscriptions

This API lists all the subscriptions for an investor. It lists only the currently active subscriptions for the investor.

```http
GET /subscriptions/investor/{user_id}/
```

This returns an array of the subscription objects.

#### Delete Subscription

This API deletes an offering subscription for an investor.

```http
DELETE /subscriptions/{offering_id}/investor/{user_id}/
```

#### Create/Update Allocations

Once the subscription period expires, allocations are done to the investors on a first-come, first-served basis.

```http
PUT /subscriptions/{offering_id}/investor/{user_id}/allocations
```

The body will have one or more attributes of the allocation information that will be updated. This API returns the complete subscription object.

#### Delete an Allocation

This API deletes an offering allocation for an investor.

```http
DELETE /subscriptions/{offering_id}/investor/{user_id}/allocations
```

### User Service

#### Create a new User

This API creates a new user in Agsiri.

```http
POST /users
```

The body of this API will be the user document defined above. Returns the complete user document, if successful.

#### Modify a User

This API modifies an existing user.

```http
PUT /users/{user_id}
```

The body of this API will have the changes to be made to the user. Returns the complete user document, if successful.

#### Delete a User

This API deletes an existing user.

```http
DELETE /users/{user_id}
```

Returns the complete user document, if successful.

#### Update KYC

 Data

Add/Update KYC data for an existing user.

```http
PUT /users/{user_id}/investor/kyc
```

The body contains KYC data, including documentation required for KYC verification. Returns the complete user document, if successful.

#### Update Beneficiaries

Add/Update beneficiary data for an existing user.

```http
PUT /users/{user_id}/investor/beneficiaries
```

The body contains beneficiary data to be added/updated. Returns the complete user document, if successful.

#### Update Accounts

Add/Update account data for an existing user.

```http
PUT /users/{user_id}/investor/accounts
```

The body contains account data to be added/updated. Returns the complete user document, if successful.

### Portfolio Service (Stage 6)

#### Create/Update Portfolios

This API creates/updates portfolios for an investor for an offering.

```http
PUT /portfolios/{investor_id}/offering/{offering_id}
```

The body will have one or more attributes of the portfolio information that will be updated. This API returns the complete portfolio object.

#### Get Active Portfolios for a Particular User

This API gets all the currently active portfolios for a particular investor.

```http
GET /portfolios/{investor_id}/
```

This API returns the portfolio object with the currently active portfolios.

#### Get All Portfolios for a Particular User

This API gets all portfolios, both active and closed, for a particular investor.

```http
GET /portfolios/{investor_id}/all
```

This API returns the complete portfolio object.

### Data Room Service

#### Get a Particular Data Room

This API gets a particular data room.

```http
GET /datarooms/{dataroom_id}
```

This API returns the data room object.

#### Get List of Data Rooms

This API gets the list of all data rooms.

```http
GET /datarooms/
```

This API returns the list of data rooms.

#### Create a new Data Room


--------
@amolthite
### For the User Roles section, consider the following suggestions:

### Role Definitions:

- Admin: Full access to initiate, manage, and monitor all workflows. Can modify roles and permissions.
- Analyst: Can initiate and manage workflows related to property listings but has limited access to sensitive settings.
- Reviewer: Can view and comment on workflows but cannot initiate or manage them.
- Realtor: Limited to initiating workflows related to their own listings, with no access to other users' listings or settings.

### Permissions:

- Initiate Workflows: Define which roles have permission to start specific workflows, such as Screening, Review, or Due Diligence.
- Manage Workflows: Specify roles that can update or cancel workflows, and set criteria for managing workflow progress.
- Monitor Workflows: Allow roles to view the status and history of workflows, including completed and ongoing processes.
- Access Sensitive Data: Outline which roles have access to confidential information and settings within the workflows.


### Role-Based Access Control (RBAC):

- Regularly review and update roles and permissions to adapt to changing requirements and user needs.


