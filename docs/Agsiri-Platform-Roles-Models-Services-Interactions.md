# Agsiri Platform Key Services, Models, and Interactions

## **Key Services**

1. **Listing Service**: 
   - **Purpose**: Manages property listings on the platform.
   - **Operations**: Create, Update, View, Delete, Search, Publish, Review, Approve.
   - **Key Roles**:
     - **Realtor**: Initiates and manages property listings.
     - **Asset Manager**: Oversees and updates listings as part of business operations.
     - **Analyst**: Reviews and analyzes listings for due diligence.

2. **Offering Service**:
   - **Purpose**: Manages investment offerings based on property listings.
   - **Operations**: Create, Update, View, Delete, Search, Publish, Review, Approve.
   - **Key Roles**:
     - **Asset Manager**: Creates and manages offerings.
     - **Analyst**: Provides analysis for creating offerings.

3. **Portfolio Service**:
   - **Purpose**: Manages investor portfolios and their associated investments.
   - **Operations**: Create, Update, View, Search, Analyze, Report, Audit.
   - **Key Roles**:
     - **Investor**: Views their own portfolio.
     - **Financial Analyst**: Manages financial performance related to portfolios.
     - **Controller**: Monitors financial activities within portfolios.

4. **Data Room Service**:
   - **Purpose**: Provides secure storage for documents related to listings, offerings, and portfolios.
   - **Operations**: Create, Update, View, Delete, Grant, Revoke, Audit, Review, Upload, Download.
   - **Key Roles**:
     - **Investor**: Has read-only access to data rooms for properties they invested in.
     - **Farm SME**: Accesses data rooms to conduct due diligence.
     - **Asset Manager**: Manages data rooms as part of business operations.
     - **Compliance Officer**: Accesses customer data records for compliance reviews.

5. **Campaign Service**:
   - **Purpose**: Manages marketing campaigns for property offerings.
   - **Operations**: Create, Update, View, Delete, Publish, Review, Approve.
   - **Key Roles**:
     - **Campaign Manager**: Creates and monitors campaigns.
     - **Asset Manager**: Oversees campaign performance.

6. **Compliance Service**:
   - **Purpose**: Ensures platform compliance with regulatory requirements.
   - **Operations**: View, Search, Audit, Approve, Revoke, Report.
   - **Key Roles**:
     - **Compliance Officer**: Manages compliance activities and monitors investor records.

7. **Financial Monitoring Service**:
   - **Purpose**: Monitors all financial transactions on the platform.
   - **Operations**: View, Search, Analyze, Report, Audit, Review, Approve, Revoke.
   - **Key Roles**:
     - **Controller**: Monitors financial activities and investigates exceptions.
     - **Accountant**: Manages financial records and transactions.

8. **Orchestration Service**:
   - **Purpose**: Coordinates all user interactions and workflows across services.
   - **Operations**: Create, Update, View, Approve, Report, Review.
   - **Key Roles**:
     - **All Roles**: Interact with the system through orchestrated workflows.

## **Key Data Models**

1. **Listing Model**:
   - **Fields**: Listing ID, property details, owner, status, etc.
   - **Associated Services**: Listing Service, Data Room Service, IAM, Actions Service, and Workflow Service.

2. **Offering Model**:
   - **Fields**: Offering ID, associated listing, terms, status, etc.
   - **Associated Services**: Offering Service, Data Room Service, IAM, Actions Service, and Workflow Service..

3. **Portfolio Model**:
   - **Fields**: Portfolio ID, investor details, investments, performance metrics, etc.
   - **Associated Services**: Portfolio Service, Data Room Service, IAM, Actions Service, and Workflow Service..

4. **Data Room Model**:
   - **Fields**: Data Room ID, associated listing/offering, documents, access controls, etc.
   - **Associated Services**: Data Room Service, IAM, Actions Service, and Workflow Service..

5. **Campaign Model**:
   - **Fields**: Campaign ID, associated offering, target audience, performance metrics, etc.
   - **Associated Services**: Campaign Service, IAM, Actions Service, and Workflow Service..

6. **Compliance Model**:
   - **Fields**: Compliance ID, associated user, KYC/AML records, status, etc.
   - **Associated Services**: Compliance Service, IAM, Actions Service, and Workflow Service..

7. **Financial Activity Model**:
   - **Fields**: Transaction ID, associated portfolio, amount, date, status, etc.
   - **Associated Services**: Financial Monitoring Service, IAM, Actions Service, and Workflow Service..

## **Key Operations**

- **Create**: Add new entities (listings, offerings, portfolios, data rooms, campaigns, etc.).
- **Update**: Modify existing entities with new or updated information.
- **View**: Retrieve data for viewing or analysis.
- **Delete**: Remove entities (limited to certain operations like listings).
- **Search**: Find specific entities based on defined criteria.
- **Analyze**: Perform detailed analysis for decision-making (e.g., due diligence, financial reports).
- **Report**: Generate reports on performance, activities, and compliance.
- **Audit**: Review and ensure the accuracy of records and transactions.
- **Review**: Evaluate and provide feedback on entities (e.g., listings, campaigns).
- **Due Diligence**: Conduct thorough checks and assessments (applicable to Analysts, Farm SMEs, and Compliance Officers).
- **Publish**: Make listings, offerings, or campaigns available on the platform.
- **Approve**: Grant final approval for entities to be published or actions to be taken.
- **Grant**: Provide specific access rights (e.g., access to data rooms).
- **Revoke**: Remove specific access rights (e.g., access to data rooms).
- **Upload**: Upload documents or files into the data room.
- **Download**: Download documents or files from the data room.

## **Key Workflows**

1. **Property Listing Workflow**:
   - **Initiator**: Realtor or Asset Manager.
   - **Approver**: Asset Manager or Analyst.
   - **Reviewer**: Analyst or Reviewer.
   - **Executor**: Asset Manager.

2. **Offering Creation Workflow**:
   - **Initiator**: Asset Manager.
   - **Reviewer**: Analyst.
   - **Approver**: Asset Manager.
   - **Executor**: Asset Manager.

3. **Portfolio Management Workflow**:
   - **Initiator**: Investor.
   - **Manager**: Financial Analyst.
   - **Monitor**: Controller.

4. **Campaign Management Workflow**:
   - **Initiator**: Campaign Manager.
   - **Reviewer**: Asset Manager.
   - **Executor**: Campaign Manager.
   - **Monitor**: Asset Manager.

5. **Compliance Audit Workflow**:
   - **Initiator**: Compliance Officer.
   - **Reviewer**: Compliance Officer.
   - **Approver**: Compliance Officer.
   - **Executor**: Compliance Officer.

6. **Financial Monitoring Workflow**:
   - **Initiator**: Controller.
   - **Reviewer**: Controller.
   - **Executor**: Controller.
   - **Auditor**: Accountant.

7. **Data Room Access Workflow**:
   - **Initiator**: Investor or Farm SME.
   - **Approver**: Asset Manager.
   - **Executor**: Asset Manager.
   - **Monitor**: Asset Manager.

8. **Document Management Workflow**:
   - **Initiator**: Asset Manager, Farm SME, or Investor.
   - **Executor**: Data Room Service.
   - **Operations**: Upload and download documents within the data room.
   - **Monitor**: Asset Manager.

9. **Orchestration Workflow**:
   - **Initiator**: Any Role.
   - **Coordinator**: Orchestration Service.
   - **Executor**: Relevant service based on the request.

## **Role Responsibilities**

- **Administrator**: Ensures smooth technical operations, focusing on platform stability.
- **Investor**: Views listings, offerings, campaigns, and their own portfolio; accesses data rooms for invested properties.
- **Buyer**: Completes suitability assessments, purchases properties.
- **Seller**: Lists properties, provides documentation.
- **Farm SME**: Conducts due diligence, provides expert analysis.
- **Farm Manager**: Manages farm operations, updates metrics.
- **Financial Analyst**: Analyzes financial data, manages distributions.
- **Accountant**: Manages financial records, ensures accuracy.
- **Campaign Manager**: Creates and monitors marketing campaigns.
- **Analyst**: Conducts due diligence, provides recommendations.
- **Reviewer**: Reviews and comments on workflows.
- **Realtor**: Brings new properties, manages listings.
- **Compliance Officer**: Ensures compliance, audits KYC/AML.
- **Controller**: Monitors financial activities, handles exceptions.
- **Asset Manager**: Manages all aspects of assets, oversees business operations, and controls data rooms.

This structure outlines the updated services, data models, operations, and workflows, incorporating the critical roles and responsibilities within the Agsiri platform.
