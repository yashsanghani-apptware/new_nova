# **Project Nova - Detailed Design Specification**


**Introduction:**

Project Nova is designed to transform the Agsiri platform’s property listing management by implementing a robust, scalable, and secure Listing Service. This detailed design specification outlines the architecture, data models, API designs, workflows, and other key components necessary to realize the objectives outlined in the functional specifications.


# **1. System Architecture**

**1.1 High-Level Architecture:**

- **Microservices-Based Architecture:**
  - Project Nova will be built as a microservice, separate from but integrated with other Agsiri platform services.
  - Each component, such as Listing Management, Workflow Engine, and Event Logger, will function as independent, scalable services.
  
- **Service Interaction:**
  - The Listing Service will interact with external sources (Property Scouting Service, realtor platforms) via RESTful APIs.
  - Internal interactions will include the Farm Onboarding Service, Event Logging Service, and the Agsiri IAM system for authentication and authorization.

**1.2 Technology Stack:**

- **Backend:**
  - **Node.js** for the core service logic.
  - **Express.js** for building RESTful APIs.
  - **MongoDB** as the primary data store for listings.
  - **RabbitMQ** or **Kafka** for handling asynchronous events and workflows.
  - **Redis** for caching and session management.

- **Frontend:**
  - **React.js** for the user interface, including dashboards and listing management tools.
  - **Redux** for state management.

- **Security:**
  - **JWT (JSON Web Tokens)** for secure API authentication.
  - **TLS/SSL** for encrypting data in transit.
  - **AWS KMS (Key Management Service)** for encrypting sensitive data at rest.

**1.3 Deployment:**

- **Containerization:** 
  - Use **Docker** for containerizing the microservices.
  
- **Orchestration:**
  - Deploy on **Kubernetes (K8s)** for managing containers, ensuring scalability, and high availability.
  
- **CI/CD:**
  - Implement **Jenkins** or **GitLab CI** for continuous integration and deployment pipelines.
  
- **Monitoring and Logging:**
  - Utilize **Prometheus** for monitoring and **Grafana** for visualization.
  - Use **ELK Stack (Elasticsearch, Logstash, Kibana)** for centralized logging and error tracking.

---

# **2. Data Model Design**

**2.1 Listing Schema:**

The MongoDB schema for the Listing Service will be structured as follows:

```json
{
  "_id": ObjectId,
  "listing_id": {
    "type": "String",
    "unique": true,
    "required": true
  },
  "name": {
    "type": "String",
    "required": true
  },
  "address": {
    "house_number": "String",
    "street": "String",
    "apartment": "String",
    "city": "String",
    "state": "String",
    "zip": "String"
  },
  "property_description": {
    "type": "String",
    "required": true
  },
  "property_highlights": {
    "total_acres": "Number",
    "tillable": "Number",
    "woodland": "Number",
    "wetland": "Number",
    "deed_restrictions": "String",
    "barns": [
      {
        "size": "String",
        "description": "String"
      }
    ]
  },
  "days_on_market": {
    "type": "Number"
  },
  "type": {
    "type": "String",
    "required": true
  },
  "built_on": {
    "type": "Date"
  },
  "renovated_on": {
    "type": ["Date"]
  },
  "listing_agent": {
    "name": "String",
    "company": "String",
    "phone_number": "String",
    "email": {
      "type": "String",
      "match": "/.+\@.+\..+/"
    }
  },
  "dataroom_id": {
    "type": "String",
    "index": true
  },
  "workflows": {
    "type": "Object"
  },
  "images": ["String"],
  "videos": ["String"],
  "maps": ["String"],
  "property_details": {
    "parking": {
      "number_of_spaces": "Number",
      "type": "String"
    },
    "interior": {
      "bathrooms": {
        "number_full": "Number",
        "number_total": "Number",
        "bathroom1_level": "String",
        "bathroom2_level": "String"
      },
      "rooms": [
        {
          "type": "String",
          "level": "String"
        }
      ],
      "basement": "Object",
      "laundry": "Object",
      "fireplace": "Object",
      "interior_features": "Object"
    },
    "exterior": {
      "features": "Object",
      "property_information": "Object",
      "lot_information": "Object"
    },
    "financial": "Object",
    "utilities": {
      "heating_and_cooling": "Object",
      "utility": "Object"
    },
    "location": {
      "school_information": "Object",
      "location_information": "Object"
    },
    "other": {
      "listing_information": "Object"
    }
  },
  "sales_and_tax": {
    "sales_history": "Object",
    "tax_history": "Object"
  },
  "public_facts": {
    "type": "Object"
  },
  "schools": {
    "type": "Object"
  },
  "listing_source": {
    "type": "String",
    "enum": ["SYSTEM", "REALTOR"],
    "required": true
  },
  "status": {
    "type": "String",
    "enum": ["SOURCED", "SCREENED", "IN REVIEW", "REVIEWED", "IN DUE DILIGENCE", "SELECTED", "REJECTED", "ARCHIVED"],
    "required": true
  },
  "created_at": {
    "type": "Date",
    "default": "Date.now"
  },
  "updated_at": {
    "type": "Date",
    "default": "Date.now"
  }
}
```

**2.2 Indexing:**

- **Unique Indexes:** Apply unique indexes on `listing_id` to prevent duplication.
- **Compound Indexes:** Use compound indexes on `status` and `listing_source` to optimize queries based on listing workflows.
- **Text Indexes:** Implement text indexes on fields like `name`, `property_description`, and `address` to enable efficient search functionality.

---

# **3. API Design**

**3.1 Endpoint Specifications:**

- **Create a New Listing**
  - **Endpoint:** `POST /api/listings`
  - **Request Body:** JSON containing listing details as per the schema.
  - **Response:** 201 Created with the created listing object.
  - **Error Codes:** 400 Bad Request, 409 Conflict.

- **Retrieve a Listing**
  - **Endpoint:** `GET /api/listings/{listing_id}`
  - **Request Parameters:** `listing_id` as a path variable.
  - **Response:** 200 OK with the listing object.
  - **Error Codes:** 404 Not Found.

- **Update a Listing**
  - **Endpoint:** `PUT /api/listings/{listing_id}`
  - **Request Body:** JSON containing fields to be updated.
  - **Response:** 200 OK with the updated listing object.
  - **Error Codes:** 400 Bad Request, 404 Not Found.

- **Delete a Listing**
  - **Endpoint:** `DELETE /api/listings/{listing_id}`
  - **Request Parameters:** `listing_id` as a path variable.
  - **Response:** 204 No Content.
  - **Error Codes:** 404 Not Found, 409 Conflict (if linked to an active farm).

- **Trigger Workflow (Screening, Review, Due Diligence)**
  - **Endpoint:** `POST /api/listings/{listing_id}/workflows/{workflow_type}`
  - **Request Parameters:** `listing_id` as a path variable, `workflow_type` (e.g., screen, review, due_diligence) as another path variable.
  - **Response:** 200 OK with workflow initiation confirmation.
  - **Error Codes:** 400 Bad Request, 409 Conflict.

- **Manage Media (Images, Videos, Maps)**
  - **Endpoint:** `POST /api/listings/{listing_id}/media`
  - **Request Body:** JSON containing media URLs and descriptions.
  - **Response:** 201 Created with media details.
  - **Error Codes:** 400 Bad Request, 404 Not Found.

- ## Suggestion from @amolthite
  - **Pagination and Filtering:** We can Include details on pagination and filtering options for endpoints that return lists to improve performance and usability.

**3.2 Security:**

- **Authentication:** All endpoints will require JWT-based authentication.
- **Authorization:** RBAC will ensure that only users with appropriate roles can access or modify certain listings.
- **Input Validation:** Implement stringent input validation on all API endpoints to prevent SQL injection, XSS, and other common attacks.

---

# **4. Workflow Design**

**4.1 Listing Lifecycle Workflows:**

- **Workflow Stages:**
  1. **SOURCED:** Initial status when a property is sourced.
  2. **SCREENED:** After initial criteria are met.
  3. **IN REVIEW:** During the detailed analyst review phase.
  4. **REVIEWED:** After analyst review is complete.
  5

. **IN DUE DILIGENCE:** During the full due diligence process.
  6. **SELECTED:** Property passes due diligence.
  7. **REJECTED:** Property fails due diligence.
  8. **ARCHIVED:** Listing is no longer active but kept for historical purposes.

- **Status Transitions:**
  - Implement state machines to manage transitions between these statuses.
  - Each transition will trigger specific events that update the status and log the change.

**4.2 Automated Triggers:**

- **Screening Trigger:** Automatically trigger when a listing is sourced.
- **Review Trigger:** Manually triggered by an analyst after screening.
- **Due Diligence Trigger:** Automatically triggered after the review is complete.

---

# **5. Event Logging and Auditing**

**5.1 Event Schema:**

- **Common Fields:**
  - `event_id`: Unique identifier for the event.
  - `event_type`: Type of event (e.g., listing.created, listing.updated, listing.status_changed).
  - `timestamp`: When the event occurred.
  - `user_id`: ID of the user who triggered the event.
  - `listing_id`: ID of the affected listing.

- **Specific Event Types:**
  - **listing.created**
  - **listing.updated**
  - **listing.deleted**
  - **listing.status_changed**
  - **listing.media_added**

**5.2 Event Storage:**

- **Database:** Store events in a separate MongoDB collection with efficient indexing for querying.
- **Retention Policy:** Maintain event logs for a minimum of 5 years to meet compliance and auditing requirements.

---

# **6. User Interface Design**

**6.1 Admin Dashboard:**

- **Features:**
  - View and manage all listings.
  - Trigger workflows and status changes.
  - Generate reports on listing activities.

- **Technology:**
  - Built with React.js, using Material-UI for a consistent look and feel.
  - Use Redux for state management to handle data across the application.

**6.2 Realtor Portal:**

- **Features:**
  - Submit new property listings.
  - Track the status of submitted listings.
  - View feedback and results from the screening, review, and due diligence processes.

- **Technology:**
  - React.js frontend with responsive design for use on various devices.

---

# **7. Testing and Quality Assurance**

**7.1 Unit Testing:**

- **Tools:** Use Jest for unit tests on all service logic.
- **Coverage:** Ensure at least 90% code coverage across the service.

**7.2 Integration Testing:**

- **Tools:** Mocha and Chai for API endpoint testing.
- **Focus Areas:** Test all CRUD operations, workflows, and API security features.

**7.3 End-to-End Testing:**

- **Tools:** Cypress for end-to-end testing of UI and service interactions.
- **Scenarios:** Include user scenarios from listing creation to farm onboarding.

**7.4 Load Testing:**

- **Tools:** Apache JMeter for simulating high traffic conditions.
- **Goals:** Ensure the service can handle up to 10,000 concurrent users without significant performance degradation.

---

# **8. Deployment and Monitoring**

**8.1 CI/CD Pipeline:**

- **Integration:**
  - Automate testing, building, and deployment using Jenkins or GitLab CI.
  - Include steps for code linting, unit testing, integration testing, and deployment to staging and production environments.

**8.2 Monitoring and Alerts:**

- **Monitoring:**
  - Use Prometheus to monitor service health, API performance, and database metrics.
  - Set up Grafana dashboards for real-time monitoring and historical data analysis.

- **Alerts:**
  - Implement alerting with Prometheus Alertmanager for critical issues such as service downtime, API latency spikes, or database connection failures.

---

# **9. Maintenance and Support**

**9.1 Support System:**

- **Issue Tracking:** Use Jira or GitHub Issues for tracking bugs, enhancements, and user feedback.
- **Knowledge Base:** Maintain a knowledge base with troubleshooting guides, FAQs, and user manuals.

**9.2 Regular Updates:**

- **Patch Management:** Release regular updates for security patches, performance improvements, and new features.
- **User Feedback Loop:** Gather and analyze user feedback to continuously improve the service.

