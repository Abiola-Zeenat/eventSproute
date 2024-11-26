# EventsPro API Documentation

**Description:** A RESTful API for managing events and users with email notifications and Role-Based Access Control (RBAC).

## Base URL

`http://localhost:5000/api`

## Authentication Routes

### 1. User Registration

- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user account
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password": "johndoe12",
    "role": "organizer" // Possible roles: user, organizer, admin
  }
  ```
- **Response:** User account created with unique identifier

### 2. User Login

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate user and generate access token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Response:** User data with JWT access token for authenticated sessions

## User Management Routes

### 1. Get Users

- **Endpoint:** `GET /users/`
- **Description:** Retrieve list of users
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Admin

### 2. Update User Role

- **Endpoint:** `POST /users/:userId/role`
- **Description:** Update a user's role
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Admin
- **Request Body:**
  ```json
  {
    "role": "organizer" // New role to assign
  }
  ```
- **URL Parameter:** `:userId` - MongoDB user ID

## Event Management Routes

### 1. Get All Events

- **Endpoint:** `GET /events/`
- **Description:** Retrieve all events
- **Authentication:** Required (Bearer Token)

### 2. Create Event

- **Endpoint:** `POST /events/`
- **Description:** Create a new event
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Organizer
- **Request Body:**
  ```json
  {
    "title": "Naija Dev Fest",
    "description": "Event for Nigerian developers",
    "date": "01/12/2025" // {format - MM/DD/YYYY}
  }
  ```

### 3. Get Specific Event

- **Endpoint:** `GET /events/:eventId`
- **Description:** Retrieve details of a specific event
- **Authentication:** Required (Bearer Token)
- **URL Parameter:** `:eventId` - MongoDB event ID

### 4. Update Event

- **Endpoint:** `PUT /events/:eventId`
- **Description:** Update an existing event
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Organizer (event creator)
- **Request Body:**
  ```json
  {
    "date": "01/27/2025", // Partial update supported {format - MM/DD/YYYY}
    "title": "Updated Event Title", // Optional
    "description": "Updated description" // Optional
  }
  ```

### 5. Delete Event

- **Endpoint:** `DELETE /events/:eventId`
- **Description:** Delete an existing event
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Admin, Organizer (event creator)
- **URL Parameter:** `:eventId` - MongoDB event ID

### 6. Send Event Notification

- **Endpoint:** `POST /events/:eventId/notify`
- **Description:** Send email notifications for an event
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Organizer (event creator)
- **URL Parameter:** `:eventId` - MongoDB event ID

### 7. Upload Event Banner

- **Endpoint:** `POST /events/upload`
- **Description:** Upload a banner image for an event
- **Authentication:** Required (Bearer Token)
- **Allowed Roles:** Organizer
- **Request Body:** Multipart form-data with `banner` file

## Authentication & Authorization

### Roles

- **User:** Basic event browsing
- **Organizer:** Can create, update, and manage own events
- **Admin:** Full system access, can manage users and all events

### Token

- JWT (JSON Web Token) used for authentication
- Include in `Authorization` header as Bearer token
- Tokens expire after a set duration (e.g., 30 days)

## Error Handling

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Best Practices

- Always include a valid JWT token
- Use HTTPS in production
- Validate and sanitize all input
- Handle errors gracefully
