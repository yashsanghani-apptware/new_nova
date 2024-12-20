## 1. Authorization Service

The Authorization Service is critical for securing access to the Pola system. It ensures that only authenticated users can perform operations within the system by issuing and managing JWT (JSON Web Tokens). The Authorization Service API provides endpoints for user login and token refresh operations.

### **1.1 POST `/auth/login` - Login User and Return JWT Token**

**Description**: Authenticates a user by verifying their credentials. Upon successful login, it returns a JWT token that must be included in the Authorization header for subsequent requests to access protected routes.

**Example Request**:

```bash
curl -X POST https://pola.ai:4000/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "exampleUser",
  "password": "examplePassword"
}'
```

**Example Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Mandatory Attributes**:
- `username`: The username of the user attempting to log in.
- `password`: The user's password.

**Optional Attributes**:
- None.

**Considerations**:
- Ensure secure handling of credentials, including hashing passwords.
- Implement rate limiting to prevent brute-force attacks.

### **1.2 POST `/auth/refresh-token` - Refresh the JWT Token**

**Description**: Refreshes an existing JWT token before it expires. This endpoint helps maintain session continuity without requiring the user to log in again.

**Example Request**:

```bash
curl -X POST https://pola.ai:4000/v1/auth/refresh-token \
-H "Authorization: Bearer <old-token>" \
-H "Content-Type: application/json"
```

**Example Response**:

```json
{
  "token": "new-JWT-token"
}
```

**Mandatory Attributes**:
- The old JWT token must be provided in the Authorization header.

**Optional Attributes**:
- None.

**Considerations**:
- Ensure that the old token is still valid and has not been tampered with.
- Implement token rotation policies to enhance security.

---

## 2. User Management Service

The User Management Service provides comprehensive functionality for managing users within the Pola system. Users are central to policy evaluations, and managing them effectively is crucial for maintaining secure access control. This section details the endpoints available for creating, retrieving, updating, and deleting users, as well as managing their associated groups, roles, and policies.

### **2.1 POST `/v1/users` - Create a New User**

**Description**: Creates a new user in the system, storing all relevant information such as name, email, contact details, and associated groups, roles, and policies.

**Example Request**:

```bash
curl -X POST https://pola.ai:4000/v1/users \
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

**Example Response**:

```json
{
  "_id": "60b5ed9b9c25d532dc4a6f41",
  "name": "John Doe",
  "givenName": "John",
  "familyName": "Doe",
  "email": "john.doe@example.com",
  "telephone": "+1234567890",
  "username": "johndoe",
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
}
```

**Mandatory Attributes**:
- `name`, `givenName`, `familyName`, `email`, `telephone`, `username`, `password`, `contactPoint`: Basic information required to identify and contact the user.

**Optional Attributes**:
- `jobTitle`, `address`, `groups`, `roles`, `organization`, `attr`: Additional user details that can be included depending on the organization's requirements.

**Considerations**:
- Validate the email format and ensure that the username is unique.
- Hash the password before storing it in the database.

### **2.2 GET `/v1/users` - Get All Users**

**Description**: Retrieves a list of all users within the system, potentially filtered or paginated for large datasets.

**Example Request**:

```bash
curl -X GET https://pola.ai:4000/v1/users \
-H "Authorization: Bearer <token>"
```

**Example Response**:

```json
[
  {
    "_id": "60b5ed9b9c25d532dc4a6f41",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "roles": ["<role-id>"],
    "groups": ["<group-id>"],
    "organization": "60b5ed9b9c25d532dc4a6f35"
  },
  {
    "_id": "60b5ed9b9c25d532dc4a6f42",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "username": "janesmith",
    "roles": ["<role-id>"],
    "groups": ["<group-id>"],
    "organization": "60b5ed9b9c25d532dc4a6f35"
  }
]
```

**Mandatory Attributes**:
- None.

**Optional Attributes**:
- Pagination parameters (e.g., `limit`, `offset`) for large datasets.

**Considerations**:
- Implement pagination to handle large numbers of users.
- Secure the endpoint to ensure that only authorized personnel can access the list of users.

### **2.3 GET `/v1/users/:id` - Get a User by ID**

**Description**: Retrieves the details of a specific user based on their unique identifier.

**Example Request**:

```bash
curl -X GET https://pola.ai:4000/v1/users/60b5ed9b9c25d532dc4a6f41 \
-H "Authorization: Bearer <token>"
```

**Example Response**:

```json
{
  "_id": "60b5ed9b9c25d532dc4a6f41",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "roles": ["<role-id>"],
  "groups": ["<group-id>"],
  "organization": "60b5ed9b9c25d532dc4a6f35"
}
```

**Mandatory Attributes**:
- `id`: The unique identifier of the user.

**Optional Attributes**:
- None.

**Considerations**:
- Handle cases where the user ID does not exist and return an appropriate error message.

### **2.4 PUT `/v1/users/:id` - Update a User by ID**

**Description**:

 Updates the details of an existing user based on their unique identifier.

**Example Request**:

```bash
curl -X PUT https://pola.ai:4000/v1/users/60b5ed9b9c25d532dc4a6f41 \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "email": "new.email@example.com",
  "telephone": "+0987654321",
  "attr": {
    "department": "Marketing"
  }
}'
```

**Example Response**:

```json
{
  "_id": "60b5ed9b9c25d532dc4a6f41",
  "name": "John Doe",
  "email": "new.email@example.com",
  "telephone": "+0987654321",
  "attr": {
    "department": "Marketing"
  }
}
```

**Mandatory Attributes**:
- `id`: The unique identifier of the user.

**Optional Attributes**:
- Any fields that need to be updated (e.g., `email`, `telephone`, `attr`).

**Considerations**:
- Ensure proper validation of the updated fields.
- Handle concurrency to prevent conflicts during updates.

### **2.5 DELETE `/v1/users/:id` - Delete a User by ID**

**Description**: Deletes a user from the system based on their unique identifier.

**Example Request**:

```bash
curl -X DELETE https://pola.ai:4000/v1/users/60b5ed9b9c25d532dc4a6f41 \
-H "Authorization: Bearer <token>"
```

**Example Response**:

```json
{
  "message": "User deleted successfully"
}
```

**Mandatory Attributes**:
- `id`: The unique identifier of the user.

**Optional Attributes**:
- None.

**Considerations**:
- Implement safeguards to prevent accidental deletion of important users.
- Consider a soft-delete approach where the user is marked as inactive rather than permanently removed.
