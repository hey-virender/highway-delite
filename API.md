# API Documentation

This document provides detailed information about the HD Notes API endpoints.

## Base URL

```
Development: http://localhost:8000/api
Production: https://your-backend-url.com/api
```

## Authentication

The API uses Clerk session tokens for authentication. Include the session token in the request headers:

```
clerk_session_token: your_session_token_here
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## User Endpoints

### Create/Update User

Creates a new user or updates an existing one. Supports both email and OAuth providers.

```
POST /api/user/create
```

#### Request Body

```json
{
  "user_id": "clerk_user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://example.com/avatar.jpg",
  "dob": "1990-01-01",
  "authProvider": "email", // "email" | "google"
  "sessionToken": "clerk_session_token"
}
```

#### Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "mongo_object_id",
      "user_id": "clerk_user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "image": "https://example.com/avatar.jpg",
      "dob": "1990-01-01T00:00:00.000Z",
      "authProvider": "email",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_2abc123def456",
    "email": "john@example.com",
    "name": "John Doe",
    "authProvider": "email",
    "sessionToken": "session_token_here"
  }'
```

### User Login

Updates user session information on login.

```
POST /api/user/login
```

#### Request Body

```json
{
  "user_id": "clerk_user_id",
  "sessionToken": "clerk_session_token"
}
```

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "mongo_object_id",
      "user_id": "clerk_user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### User Logout

Handles user logout (clears session information).

```
POST /api/user/logout
```

#### Request Body

```json
{
  "user_id": "clerk_user_id"
}
```

#### Response

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

### Get User Profile

Retrieves the authenticated user's profile information.

```
GET /api/user/profile
Headers: clerk_session_token: your_token
```

#### Response

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "mongo_object_id",
      "user_id": "clerk_user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "image": "https://example.com/avatar.jpg",
      "dob": "1990-01-01T00:00:00.000Z",
      "authProvider": "email",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get User by ID

Retrieves a specific user by their ID (protected route).

```
GET /api/user/:user_id
Headers: clerk_session_token: your_token
```

#### Response

Same as Get User Profile response.

## Notes Endpoints

### Get User Notes

Retrieves all notes for a specific user.

```
GET /api/note/user/:user_id
Headers: clerk_session_token: your_token
```

#### Response

```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "_id": "note_mongo_id",
        "title": "My First Note",
        "content": "This is the content of my note",
        "user_id": "clerk_user_id",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### cURL Example

```bash
curl -X GET http://localhost:8000/api/note/user/user_2abc123def456 \
  -H "clerk_session_token: your_session_token_here"
```

### Create Note

Creates a new note for the authenticated user.

```
POST /api/note/create
Headers: clerk_session_token: your_token
```

#### Request Body

```json
{
  "title": "My Note Title",
  "content": "The content of my note",
  "user_id": "clerk_user_id"
}
```

#### Response

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "note": {
      "_id": "note_mongo_id",
      "title": "My Note Title",
      "content": "The content of my note",
      "user_id": "clerk_user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/note/create \
  -H "Content-Type: application/json" \
  -H "clerk_session_token: your_session_token_here" \
  -d '{
    "title": "My New Note",
    "content": "This is my note content",
    "user_id": "user_2abc123def456"
  }'
```

### Update Note

Updates an existing note.

```
PUT /api/note/update/:note_id
Headers: clerk_session_token: your_token
```

#### Request Body

```json
{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

#### Response

```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "note": {
      "_id": "note_mongo_id",
      "title": "Updated Note Title",
      "content": "Updated note content",
      "user_id": "clerk_user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### Delete Note

Deletes a specific note.

```
DELETE /api/note/delete/:note_id
Headers: clerk_session_token: your_token
```

#### Response

```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": null
}
```

#### cURL Example

```bash
curl -X DELETE http://localhost:8000/api/note/delete/note_mongo_id \
  -H "clerk_session_token: your_session_token_here"
```

## Error Codes

### Authentication Errors

| Code | Description |
|------|-------------|
| `AUTH_MISSING_TOKEN` | Session token not provided |
| `AUTH_INVALID_TOKEN` | Invalid or expired session token |
| `AUTH_USER_NOT_FOUND` | User not found in database |
| `AUTH_UNAUTHORIZED` | User not authorized for this action |

### Validation Errors

| Code | Description |
|------|-------------|
| `VALIDATION_MISSING_FIELD` | Required field missing |
| `VALIDATION_INVALID_EMAIL` | Invalid email format |
| `VALIDATION_INVALID_DOB` | Invalid date of birth |
| `VALIDATION_INVALID_USER_ID` | Invalid user ID format |

### Database Errors

| Code | Description |
|------|-------------|
| `DB_CONNECTION_ERROR` | Database connection failed |
| `DB_OPERATION_ERROR` | Database operation failed |
| `DB_DUPLICATE_KEY` | Duplicate key error |

### Note Errors

| Code | Description |
|------|-------------|
| `NOTE_NOT_FOUND` | Note not found |
| `NOTE_ACCESS_DENIED` | User cannot access this note |
| `NOTE_CREATION_FAILED` | Failed to create note |
| `NOTE_UPDATE_FAILED` | Failed to update note |
| `NOTE_DELETE_FAILED` | Failed to delete note |

## Rate Limiting

Currently, the API does not implement rate limiting. In production, consider implementing rate limiting to prevent abuse.

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `https://highway-delite-six.vercel.app/` (Production frontend)
- `http://127.0.0.1:5173` (Alternative localhost)

## Authentication Flow

1. **Frontend**: User signs in via Clerk
2. **Frontend**: Receives session token from Clerk
3. **Frontend**: Includes token in API requests
4. **Backend**: Verifies token with Clerk
5. **Backend**: Processes request if token is valid

## Testing the API

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables for base URL and session token
3. Test each endpoint with valid data

### Using curl

Examples are provided for each endpoint above. Replace placeholder values with actual data.

### Using the Frontend

The frontend application provides a complete interface for testing all API functionality:
- User registration and login
- Note creation, reading, updating, and deletion
- Google OAuth integration

## Development Notes

- All endpoints return JSON responses
- Timestamps are in ISO 8601 format
- MongoDB ObjectIds are used for database records
- Clerk user IDs are used for user identification
- Session tokens expire based on Clerk configuration

## Production Considerations

- Implement rate limiting
- Add request logging
- Monitor API performance
- Set up health check endpoints
- Configure proper error logging
- Implement API versioning if needed 