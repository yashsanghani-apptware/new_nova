## User Guide for CRUDSQL Operations for Listing Service (Nova)

This guide provides step-by-step instructions for performing CRUD (Create, Read, Update, Delete) operations using the Listing Service (Nova). Before executing these operations, ensure you have completed the following setup steps.

### Setup Steps

1. **Create a User:**

   Use the Policy Service endpoint to create a new user. This stores all relevant information such as name, email, contact details, and associated groups, roles, and policies.

   **Endpoint:**
   ```
   POST http://localhost:4000/v1/users
   ```

   **Example Request:**
   ```bash
   curl -X POST http://localhost:4000/v1/users \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{
     "name": "John Doe",
     "givenName": "John",
     "familyName": "Doe",
     "email": "john.doe@example.com",
     "telephone": "+1234567890",
     "username": "johndoe",
     "password": "securePassword123",
     "address": {
       "streetAddress": "123 Main St",
       "addressLocality": "Springfield",
       "addressRegion": "IL",
       "postalCode": "62701",
       "addressCountry": "USA"
     },
     "contactPoint": {
       "telephone": "+1234567890",
       "contactType": "personal",
       "email": "john.doe@example.com"
     },
     "groups": ["<group-id>"],
     "roles": ["<role-id>"],
     "organization": "60b5ed9b9c25d532dc4a6f35",
     "attr": {
       "department": "Engineering"
     }
   }'
   ```

2. **Login with the Created User:**

   Authenticate the user and receive a JWT token for accessing protected routes.

   **Endpoint:**
   ```
   POST http://localhost:4000/v1/auth/login
   ```

   **Example Request:**
   ```bash
   curl -X POST http://localhost:4000/v1/auth/login \
   -H "Content-Type: application/json" \
   -d '{
     "username": "exampleUser",
     "password": "examplePassword"
   }'
   ```

   **Example Response:**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

   Save the JWT token for future use.

3. **Create a Resource with ARI:**

   Create a new resource in the system for the `Listing` service.

   **Endpoint:**
   ```
   POST http://localhost:4000/v1/resources
   ```

   **Example Request:**
   ```bash
   curl -X POST http://localhost:4000/v1/resources \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{
     "typeName": "Example::Resource::Type",
     "ari": "ari:nova:us:agsiri:listings",
     "description": "A sample resource type",
     "properties": {
       "Property1": "Value1",
       "Property2": "Value2"
     },
     "required": ["Property1"],
     "handlers": {
       "create": {
         "permissions": ["CreatePermission"],
         "timeoutInMinutes": 60
       },
       "read": {
         "permissions": ["ReadPermission"],
         "timeoutInMinutes": 30
       },
       "update": {
         "permissions": ["UpdatePermission"],
         "timeoutInMinutes": 45
       },
       "delete": {
         "permissions": ["DeletePermission"],
         "timeoutInMinutes": 30
       },
       "list": {
         "permissions": ["ListPermission"],
         "timeoutInMinutes": 15
       }
     },
     "primaryIdentifier": ["Property1"],
     "additionalIdentifiers": ["Property2"]
   }'
   ```

4. **Create a Resource Policy:**

   Create a resource policy allowing READ and WRITE access to all users.

   **Example Policy:**
   ```json
   {
     "apiVersion": "api.agsiri.dev/v1",
     "name": "NovaDefaultPolicy",
     "resourcePolicy": {
       "resource": "ari:nova:us:agsiri:listings",
       "version": "1.0",
       "rules": [
         {
           "effect": "EFFECT_ALLOW",
           "action": ["delete", "create", "view", "list"]
         }
       ]
     }
   }
   ```

### Performing CRUDSQL Operations

After completing the setup steps, you are ready to perform CRUDSQL operations on the Listing service.

#### 1. **Create a New Listing**

To create a new property listing, send a POST request to the `/listings` endpoint.

**Endpoint:**
```
POST http://localhost:6000/api/listings
```

**Example Request:**
```bash
curl -X POST http://localhost:6000/api/listings \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Sample Property",
  "address": {
    "house_number": "123",
    "street": "Main St",
    "city": "Sample City",
    "state": "SC",
    "zip": "12345"
  },
  "property_description": "A beautiful property",
  "property_highlights": {
    "total_acres": 5,
    "tillable": 2,
    "woodland": 1,
    "wetland": 0.5,
    "deed_restrictions": "None",
    "barns": []
  },
  "days_on_market": 10,
  "type": "Residential",
  "listing_agent": {
    "name": "Agent Name",
    "company": "Real Estate Co",
    "phone_number": "123-456-7890",
    "email": "agent@example.com"
  },
  "listing_source": "SYSTEM",
  "status": "SOURCED"
}'
```

#### 2. **Retrieve a Listing by ID**

To retrieve a listing by its ID, send a GET request to the `/listings/:listing_id` endpoint.

**Endpoint:**
```
GET http://localhost:6000/api/listings/:listing_id
```

**Example Request:**
```bash
curl -X GET http://localhost:6000/api/listings/{listing_id} \
-H "Authorization: Bearer <token>"
```

#### 3. **Retrieve All Listings**

To retrieve all listings, send a GET request to the `/listings` endpoint.

**Endpoint:**
```
GET http://localhost:6000/api/listings
```

**Example Request:**
```bash
curl -X GET http://localhost:6000/api/listings \
-H "Authorization: Bearer <token>"
```

#### 4. **Update an Existing Listing**

To update an existing listing, send a PUT request to the `/listings/:listing_id` endpoint.

**Endpoint:**
```
PUT http://localhost:6000/api/listings/:listing_id
```

**Example Request:**
```bash
curl -X PUT http://localhost:6000/api/listings/{listing_id} \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Property Name",
  "address": {
    "house_number": "456",
    "street": "Elm St",
    "city": "Updated City",
    "state": "UC",
    "zip": "54321"
  },
  "property_description": "An updated description of the property",
  "status": "IN REVIEW"
}'
```

#### 5. **Delete a Listing by ID**

To delete a listing by its ID, send a DELETE request to the `/listings/:listing_id` endpoint.

**Endpoint:**
```
DELETE http://localhost:6000/api/listings/:listing_id
```

**Example Request:**
```bash
curl -X DELETE http://localhost:6000/api/listings/{listing_id} \
-H "Authorization: Bearer <token>"
```

#### Notes:

- Replace `{listing_id}` with the actual ID of the listing you want to retrieve, update, or delete.
- Ensure that the JWT token is included in the `Authorization` header for all requests.

By following this guide, you can perform all CRUDSQL operations using the Listing Service (Nova) efficiently and securely.
