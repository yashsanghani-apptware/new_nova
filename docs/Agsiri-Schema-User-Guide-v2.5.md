# User Guide for the Agsiri Platform JSON Schema

## Introduction

The Agsiri Platform JSON Schema defines the structure and format of various entities within the Agsiri ecosystem. The schema ensures consistency and validation of data across the platform, facilitating interoperability and data integrity. This guide provides detailed instructions on how to use the JSON Schema to create, validate, and manage data objects, ensuring compliance with the platform's data requirements.

## Overview of the JSON Schema

The schema defines the following primary entities:

1. **Listing**: Represents real estate listings, including details about the property, agent, and related media.
2. **Farm**: Represents agricultural properties that are being assessed or managed for potential investment.
3. **Offering**: Describes an investment opportunity related to a farm, including financial details and expected returns.
4. **Subscription**: Captures the details of investor subscriptions to specific offerings.
5. **Campaign**: Represents marketing or informational campaigns related to specific offerings.
6. **Portfolio**: Tracks the investment holdings of a user across various offerings.

Each entity must be valid according to its respective schema definition and must adhere to the specified types, required properties, and formats.

## Reusable Components in the Schema

To promote clarity, reusability, and maintainability, the schema defines a set of reusable components under `$defs`. These components are referenced within the entity definitions to ensure consistency.

## Reusable Components:

1. **Address (`agsiri.schema.v2.5.Address`)**: Defines a standard structure for addresses used in various entities.
2. **Agent (`agsiri.schema.v2.5.Agent`)**: Represents an agent associated with a listing or another entity, including details like name, affiliation, and contact information.
3. **DataroomId (`agsiri.schema.v2.5.DataroomId`)**: A unique identifier for the data room associated with an entity.
4. **ImageObject (`agsiri.schema.v2.5.ImageObject`)**: An array of URIs representing images associated with an entity.
5. **VideoObject (`agsiri.schema.v2.5.VideoObject`)**: An array of URIs representing videos associated with an entity.
6. **Workflows (`agsiri.schema.v2.5.Workflows`)**: An object that represents workflows associated with an entity.
7. **ExpectedReturns (`agsiri.schema.v2.5.ExpectedReturns`)**: Defines the expected financial returns from an offering or campaign.
8. **OfferingDetails (`agsiri.schema.v2.5.OfferingDetails`)**: Provides details about an offering, including dates, shares, and holding periods.

## Entity Definitions

Each entity in the Agsiri Platform is defined as a schema with specific properties and requirements.

## 1. **Listing**

A `Listing` represents a real estate property that is available on the Agsiri platform. This entity includes essential information such as the property details, listing agent, images, and videos.

- **Required Properties**:
  - `listing_id`: Unique identifier for the listing.
  - `name`: The name or title of the listing.
  - `address`: Address object defining the property's location (`agsiri.schema.v2.5.Address`).
  - `property_description`: A description of the property.
  - `listing_agent`: Information about the agent handling the listing (`agsiri.schema.v2.5.Agent`).

- **Additional Properties**:
  - `property_highlights`: Details of property features like total acres, tillable land, woodland, etc.
  - `dataroom_id`: Reference to the data room associated with the listing (`agsiri.schema.v2.5.DataroomId`).
  - `workflows`: Workflows related to the listing (`agsiri.schema.v2.5.Workflows`).
  - `images`, `videos`: Media objects associated with the listing (`agsiri.schema.v2.5.ImageObject`, `agsiri.schema.v2.5.VideoObject`).
  - `property_details`: Additional details about the property’s interior and exterior.

## 2. **Farm**

A `Farm` represents an agricultural property that is being assessed for investment opportunities on the Agsiri platform.

- **Required Properties**:
  - `farm_id`: Unique identifier for the farm.
  - `listing_id`: The `listing_id` of the related listing.
  - `name`: Name of the farm.
  - `address`: Address object (`agsiri.schema.v2.5.Address`).
  - `property_description`: A description of the farm.

- **Additional Properties**:
  - `location`: Longitude and latitude coordinates of the farm.
  - `dataroom_id`: Reference to the data room for the farm (`agsiri.schema.v2.5.DataroomId`).
  - `workflows`: Workflows related to the farm (`agsiri.schema.v2.5.Workflows`).
  - `images`, `videos`: Media associated with the farm (`agsiri.schema.v2.5.ImageObject`, `agsiri.schema.v2.5.VideoObject`).
  - `due_diligence`: Details of due diligence activities conducted for the farm.

## 3. **Offering**

An `Offering` represents an investment opportunity in a farm listed on the Agsiri platform. It includes detailed financial and property information.

- **Required Properties**:
  - `offering_id`: Unique identifier for the offering.
  - `farm_id`: The `farm_id` of the related farm.
  - `name`: Name of the offering.
  - `address`: Address object (`agsiri.schema.v2.5.Address`).
  - `property_description`: A description of the offering.

- **Additional Properties**:
  - `main_picture`: URI of the main picture of the offering.
  - `dataroom_id`: Reference to the data room associated with the offering (`agsiri.schema.v2.5.DataroomId`).
  - `workflows`: Workflows related to the offering (`agsiri.schema.v2.5.Workflows`).
  - `expected_returns`: Expected financial returns from the offering (`agsiri.schema.v2.5.ExpectedReturns`).
  - `details`: Detailed information about the offering (`agsiri.schema.v2.5.OfferingDetails`).

## 4. **Subscription**

A `Subscription` captures the details of investor subscriptions to specific offerings.

- **Required Properties**:
  - `offering_id`: The `offering_id` of the related offering.
  - `subscriptions`: Array of subscription objects, each containing:
    - `user_id`: Identifier for the subscribing user.
    - `shares_subscribed`: Number of shares subscribed.
    - `date_subscribed`: Date of subscription.
    - `status`: Status of the subscription (`ACTIVE` or `CLOSED`).

- **Additional Properties**:
  - `allocations`: Array of allocation objects defining share allocations.
  - `dataroom_id`: Reference to the data room for the subscription (`agsiri.schema.v2.5.DataroomId`).
  - `workflows`: Workflows related to the subscription (`agsiri.schema.v2.5.Workflows`).

## 5. **Campaign**

A `Campaign` represents a marketing or informational campaign associated with an offering on the Agsiri platform.

- **Required Properties**:
  - `campaign_id`: Unique identifier for the campaign.
  - `offering_id`: The `offering_id` of the related offering.
  - `name`: Name of the campaign.
  - `address`: Address object (`agsiri.schema.v2.5.Address`).
  - `property_description`: Description of the campaign.

- **Additional Properties**:
  - `dataroom_id`: Reference to the data room for the campaign (`agsiri.schema.v2.5.DataroomId`).
  - `workflows`: Workflows related to the campaign (`agsiri.schema.v2.5.Workflows`).
  - `expected_returns`: Expected returns from the campaign (`agsiri.schema.v2.5.ExpectedReturns`).

## 6. **Portfolio**

A `Portfolio` tracks the investment holdings of a user across various offerings on the Agsiri platform.

- **Required Properties**:
  - `portfolio_id`: Unique identifier for the portfolio.
  - `user_id`: Identifier for the user owning the portfolio.
  - `investments`: Array of investment objects, each containing:
    - `offering_id`: Identifier of the related offering.
    - `number_of_shares`: Number of shares held.
    - `share_price`: Price per share.
    - `investment_date`: Date of investment.
    - `status`: Status of the investment (`ACTIVE` or `CLOSED`).

## How to Use the Agsiri Platform Schema

1. **Creating an Entity Object**: Use the schema definitions to construct a valid JSON object for any entity you want to create or validate (e.g., Listing, Farm, Offering). Ensure that all required properties are included and conform to the specified types and formats.

2. **Validating an Object**: Use a JSON Schema validator tool to check if your JSON object conforms to the Agsiri Platform schema. The schema provides validation rules for required fields, types, formats, and structures.

3. **Reusing Components**: Utilize the reusable components (`$defs`) to maintain consistency and reduce redundancy when creating or managing multiple entities. For example, use the `Address` definition wherever an address is needed, or the `Agent` definition to define an agent.

4. **Extending the Schema**: If additional properties or modifications are required, the schema can be extended by defining new components under `$defs` or adding new properties to existing entity definitions.

## Best Practices

- **Ensure Data Consistency**: Always follow the schema definitions to maintain data consistency across the Agsiri Platform.
- **Use Reusable Components**: Le

verage reusable components (`$defs`) to standardize data fields and promote uniformity.
- **Validate Regularly**: Regularly validate your data against the schema to catch errors early and ensure compliance with platform requirements.
- **Keep the Schema Updated**: Monitor schema updates and changes in the platform’s data requirements to ensure that your data remains compatible.

## Conclusion

This guide provides an overview of the Agsiri Platform JSON Schema and instructions on how to use it effectively to create, validate, and manage data entities. By adhering to the schema definitions, users can ensure that their data is consistent, validated, and compatible with the Agsiri Platform.

# Appendix A: Agsiri Entities and Examples
Here is an extended user guide for the Agsiri Platform JSON Schema that includes examples for each entity. Each example is provided with mandatory values only, followed by a comprehensive example containing all possible attributes.

## Extended User Guide with Examples

### 1. **Listing**

**Example with Mandatory Values:**

```json
{
  "Listing": {
    "listing_id": "LIST001",
    "name": "Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "A beautiful farm with ample land.",
    "listing_agent": {
      "name": "John Doe",
      "affiliation": "Agsiri Realty",
      "telephone": "123-456-7890",
      "email": "johndoe@agsiri.com"
    }
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Listing": {
    "listing_id": "LIST001",
    "name": "Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "A beautiful farm with ample land.",
    "property_highlights": {
      "total_acres": 100,
      "tillable": 75,
      "Woodland": 20,
      "wetland": 5,
      "deed_restrictions": false,
      "barns": [
        {
          "size": "30x40",
          "description": "Large barn suitable for equipment storage."
        }
      ],
      "days_on_market": 30,
      "type": "Agricultural",
      "built_on": "1990-01-01",
      "renovated_on": ["2000-01-01", "2010-01-01"]
    },
    "listing_agent": {
      "name": "John Doe",
      "affiliation": "Agsiri Realty",
      "telephone": "123-456-7890",
      "email": "johndoe@agsiri.com"
    },
    "dataroom_id": "DR001",
    "workflows": {},
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "videos": ["https://example.com/video1.mp4"],
    "maps": ["https://example.com/map1.png"],
    "property_details": {
      "parking": {
        "number_of_spaces": 10,
        "type": "Garage"
      },
      "interior": {
        "bathrooms": {
          "number_full": 2,
          "number_total": 3,
          "bathroom1_level": "1",
          "bathroom2_level": "2"
        },
        "rooms": [
          {
            "type": "Bedroom",
            "level": "2"
          },
          {
            "type": "Living Room",
            "level": "1"
          }
        ]
      }
    },
    "sales_and_tax": {
      "sales_history": {},
      "tax_history": {}
    },
    "public_facts": {},
    "schools": {}
  }
}
```

### 2. **Farm**

**Example with Mandatory Values:**

```json
{
  "Farm": {
    "farm_id": "FARM001",
    "listing_id": "LIST001",
    "name": "Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "A beautiful farm with ample land."
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Farm": {
    "farm_id": "FARM001",
    "listing_id": "LIST001",
    "name": "Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "location": {
      "longitude": -89.650,
      "latitude": 39.7817
    },
    "property_description": "A beautiful farm with ample land.",
    "dataroom_id": "DR001",
    "workflows": {},
    "images": ["https://example.com/image1.jpg"],
    "videos": ["https://example.com/video1.mp4"],
    "maps": ["https://example.com/map1.png"],
    "parcel_information": [],
    "due_diligence": {
      "soil_information": {
        "documents": ["https://example.com/soil_report.pdf"],
        "maps": ["https://example.com/soil_map.png"]
      },
      "financial_information": {
        "cash_flow": {},
        "sales_data": {},
        "expenses_data": {},
        "documents": ["https://example.com/financial_report.pdf"]
      },
      "crop_information": {},
      "other": {}
    }
  }
}
```

### 3. **Offering**

**Example with Mandatory Values:**

```json
{
  "Offering": {
    "offering_id": "OFF001",
    "farm_id": "FARM001",
    "name": "Investment Opportunity in Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "An opportunity to invest in a productive agricultural property."
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Offering": {
    "offering_id": "OFF001",
    "farm_id": "FARM001",
    "name": "Investment Opportunity in Sunny Acres Farm",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "An opportunity to invest in a productive agricultural property.",
    "main_picture": "https://example.com/main_image.jpg",
    "dataroom_id": "DR001",
    "workflows": {},
    "images": ["https://example.com/image1.jpg"],
    "videos": ["https://example.com/video1.mp4"],
    "maps": ["https://example.com/map1.png"],
    "value_driver": {},
    "expected_returns": {
      "target_net_irr": 8.5,
      "target_net_yield": 5.0,
      "net_equity_multiple": 1.5,
      "target_hold": 5,
      "target_net_returns": 10.0
    },
    "details": {
      "valid_from_date": "2023-01-01",
      "valid_to_date": "2023-12-31",
      "total_shares": 1000,
      "shares_remaining": 500,
      "holding_period": "5 years",
      "minimum_holding_shares": 50,
      "maximum_holding_shares": 200,
      "subscription_start_date": "2023-01-01",
      "subscription_end_date": "2023-06-30"
    },
    "documents": {
      "investor_memo": "https://example.com/investor_memo.pdf",
      "investor_documents": ["https://example.com/investor_document1.pdf"],
      "compliance_audits": ["https://example.com/compliance_audit.pdf"]
    }
  }
}
```

### 4. **Subscription**

**Example with Mandatory Values:**

```json
{
  "Subscription": {
    "offering_id": "OFF001",
    "subscriptions": [
      {
        "user_id": "USER001",
        "shares_subscribed": 100,
        "date_subscribed": "2023-02-01",
        "status": "ACTIVE"
      }
    ]
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Subscription": {
    "offering_id": "OFF001",
    "subscriptions": [
      {
        "user_id": "USER001",
        "shares_subscribed": 100,
        "date_subscribed": "2023-02-01",
        "status": "ACTIVE"
      }
    ],
    "allocations": [
      {
        "user_id": "USER001",
        "shares_allocated": 100,
        "date_allocated": "2023-02-15",
        "documents": ["https://example.com/allocation_document.pdf"]
      }
    ],
    "dataroom_id": "DR002",
    "workflows": {}
  }
}
```

### 5. **Campaign**

**Example with Mandatory Values:**

```json
{
  "Campaign": {
    "campaign_id": "CAM001",
    "offering_id": "OFF001",
    "name": "Sunny Acres Investment Campaign",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",


      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "Join our campaign to invest in Sunny Acres Farm."
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Campaign": {
    "campaign_id": "CAM001",
    "offering_id": "OFF001",
    "name": "Sunny Acres Investment Campaign",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "USA"
    },
    "property_description": "Join our campaign to invest in Sunny Acres Farm.",
    "dataroom_id": "DR003",
    "workflows": {},
    "main_picture": "https://example.com/campaign_main.jpg",
    "images": ["https://example.com/campaign_image1.jpg"],
    "videos": ["https://example.com/campaign_video1.mp4"],
    "maps": ["https://example.com/campaign_map1.png"],
    "expected_returns": {
      "target_net_irr": 8.5,
      "target_net_yield": 5.0,
      "net_equity_multiple": 1.5,
      "target_hold": 5,
      "target_net_returns": 10.0
    },
    "offering_details": {
      "valid_from_date": "2023-01-01",
      "valid_to_date": "2023-12-31",
      "total_shares": 1000,
      "shares_remaining": 500,
      "holding_period": "5 years",
      "minimum_holding_shares": 50,
      "maximum_holding_shares": 200,
      "subscription_start_date": "2023-01-01",
      "subscription_end_date": "2023-06-30"
    },
    "webinars": [{}],
    "newsletters": [{}]
  }
}
```

### 6. **Portfolio**

**Example with Mandatory Values:**

```json
{
  "Portfolio": {
    "portfolio_id": "PORT001",
    "user_id": "USER001",
    "investments": [
      {
        "offering_id": "OFF001",
        "number_of_shares": 100,
        "share_price": 1000,
        "investment_date": "2023-02-01",
        "status": "ACTIVE"
      }
    ]
  }
}
```

**Comprehensive Example with All Attributes:**

```json
{
  "Portfolio": {
    "portfolio_id": "PORT001",
    "user_id": "USER001",
    "investments": [
      {
        "offering_id": "OFF001",
        "number_of_shares": 100,
        "share_price": 1000,
        "investment_date": "2023-02-01",
        "holding_period": "5 years",
        "documents": ["https://example.com/investment_document.pdf"],
        "status": "ACTIVE"
      }
    ]
  }
}
```

