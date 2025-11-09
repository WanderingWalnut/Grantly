# Grantly API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your-secure-password",
  "metadata": {
    "contact_name": "John Doe"
  }
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "metadata": {}
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "message": "Authentication successful"
}
```

### Sign In
Authenticate an existing user.

**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "metadata": {}
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "message": "Authentication successful"
}
```

### Sign Out
Sign out the current user.

**Endpoint:** `POST /auth/signout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Signed out successfully"
}
```

### Get Current User
Get information about the authenticated user.

**Endpoint:** `GET /auth/user`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "metadata": {}
  }
}
```

### Refresh Token
Refresh an expired access token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "your-refresh-token"
}
```

**Response:** `200 OK`
```json
{
  "session": {
    "access_token": "new-jwt-token",
    "refresh_token": "new-refresh-token"
  }
}
```

## Organization Endpoints

All organization endpoints require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Create Organization
Create a new organization profile.

**Endpoint:** `POST /organizations/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "organization_name": "Community Care Foundation",
  "legal_business_name": "Community Care Foundation Inc.",
  "operating_name": "Community Care",
  "business_number": "123456789",
  "business_structure": "nonprofit",
  "address": "123 Main St, City, Province",
  "contact_information": "Contact: John Doe, Phone: 555-1234",
  "date_of_establishment": "2020-01-15",
  "phone_number": "555-1234",
  "email_address": "contact@communitycare.org",
  "number_of_employees": "11-50",
  "mission_statement": "Our mission is to...",
  "company_description": "We are a nonprofit organization...",
  "target_beneficiaries": "Youth and families in need",
  "organization_type": "nonprofit",
  "year_established": 2020,
  "annual_budget": "500k-1m"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "organization_name": "Community Care Foundation",
  "message": "Organization saved successfully"
}
```

### Get Organization
Retrieve the organization profile for the authenticated user.

**Endpoint:** `GET /organizations/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "organization_name": "Community Care Foundation",
  "legal_business_name": "Community Care Foundation Inc.",
  "operating_name": "Community Care",
  "business_number": "123456789",
  "business_structure": "nonprofit",
  "address": "123 Main St, City, Province",
  "contact_information": "Contact: John Doe, Phone: 555-1234",
  "date_of_establishment": "2020-01-15",
  "phone_number": "555-1234",
  "email_address": "contact@communitycare.org",
  "number_of_employees": "11-50",
  "mission_statement": "Our mission is to...",
  "company_description": "We are a nonprofit organization...",
  "target_beneficiaries": "Youth and families in need",
  "organization_type": "nonprofit",
  "year_established": 2020,
  "annual_budget": "500k-1m",
  "created_at": "2024-11-08T12:00:00Z",
  "updated_at": "2024-11-08T12:00:00Z"
}
```

### Update Organization
Update the organization profile for the authenticated user.

**Endpoint:** `PUT /organizations/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "organization_name": "Updated Name",
  "phone_number": "555-5678",
  "annual_budget": "1m-5m"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "organization_name": "Updated Name",
  // ... other fields
}
```

### Delete Organization
Delete the organization profile for the authenticated user.

**Endpoint:** `DELETE /organizations/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Organization deleted successfully"
}
```

## Grant Search Endpoints

### Search Grants
Search for grants based on organization profile and filters.

**Endpoint:** `POST /grants/search`

**Request Body:**
```json
{
  "organization": {
    "legal_name": "Community Care Foundation",
    "operating_name": "Community Care",
    "naics_code": "813110",
    "sector_tags": ["youth", "community"],
    "address": {
      "province": "AB",
      "city": "Calgary"
    }
  },
  "filters": {
    "province": "AB",
    "min_amount": 10000,
    "max_results": 10
  }
}
```

**Response:** `200 OK`
```json
{
  "mode": "mock",
  "count": 3,
  "results": [
    {
      "title": "Community Facility Enhancement Program",
      "link": "https://alberta.ca/...",
      "summary": "Funding for community facilities...",
      "eligibility": "Nonprofit organizations...",
      "deadline": null,
      "amount_min": 25000,
      "amount_max": 100000,
      "currency": "CAD",
      "sponsor": "Government of Alberta",
      "program": "CFEP",
      "region": "Alberta",
      "tags": ["community", "infrastructure"],
      "source_citations": ["https://alberta.ca/..."]
    }
  ],
  "generated_at": "2024-11-08T12:00:00Z"
}
```

## Error Responses

All endpoints may return error responses in the following format:

### 400 Bad Request
```json
{
  "detail": {
    "error": "Validation error",
    "detail": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "detail": "No organization found for this user"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended to implement rate limiting in production.

## CORS

The API allows requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`

Additional origins can be configured in `app/main.py`.

## Interactive API Documentation

FastAPI provides interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
