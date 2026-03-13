# System Architecture Documentation

## Overview

Scholarslee is built on a three-tier architecture pattern using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The system follows a client-server model with clear separation of concerns between the presentation layer (frontend), application layer (backend), and data layer (database). This architecture enables scalability, maintainability, and independent development of each component.

## Architecture Layers

### 1. Presentation Layer (Client-Side)

**Technology**: React.js with Vite

The presentation layer is responsible for user interface rendering, user interaction handling, and client-side state management. It consists of three distinct panels:

- **Mentee Panel**: Public-facing website and student dashboard
- **Mentor Panel**: Mentor dashboard and service management interface
- **Admin Panel**: Platform administration and analytics interface

**Key Responsibilities**:
- Render user interfaces based on application state
- Handle user input and interactions
- Manage client-side routing and navigation
- Maintain local application state
- Communicate with backend via HTTP requests and WebSocket connections
- Display data received from the backend
- Implement client-side validation for better user experience
- Manage authentication tokens in browser storage

**Components**:
- React components organized by feature and panel
- React Router for client-side navigation
- Axios for HTTP communication
- Socket.io Client for real-time features
- Context API for global state (authentication, socket connection)
- Local state management using React hooks

### 2. Application Layer (Server-Side)

**Technology**: Node.js with Express.js

The application layer contains the business logic, API endpoints, authentication mechanisms, and integration with third-party services. It acts as an intermediary between the frontend and the database.

**Key Responsibilities**:
- Expose RESTful API endpoints for client consumption
- Implement business logic and validation rules
- Handle authentication and authorization
- Manage real-time communication via WebSocket
- Process payments through Stripe integration
- Handle file uploads to Cloudinary
- Send emails for notifications and verification
- Perform data validation and sanitization
- Execute database queries through Mongoose
- Generate and verify JWT tokens
- Manage user sessions and permissions

**Components**:
- Express.js server with middleware stack
- Controllers for business logic
- Routes for API endpoint definition
- Middleware for authentication, validation, and error handling
- Services for third-party integrations
- Socket.io server for real-time features
- Mongoose models for database interaction

### 3. Data Layer (Database)

**Technology**: MongoDB with Mongoose ODM

The data layer is responsible for persistent storage of all application data. MongoDB stores data in flexible, JSON-like documents organized into collections.

**Key Responsibilities**:
- Store and retrieve application data
- Maintain data integrity through schema validation
- Execute complex queries and aggregations
- Index data for performance optimization
- Handle relationships between entities
- Automatically expire temporary data (TTL indexes)
- Support transactions for critical operations

**Collections**:
- Users, MentorProfiles, MenteeProfiles
- Services, Bookings, Payments
- Conversations, Messages
- Notifications, ServiceFeedback
- Meetings, Badges, PayoutRequests
- Settings, BlacklistedTokens, PendingUsers
- PasswordResetOTP, ContactMessages

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Mentee Panel │  │ Mentor Panel │  │ Admin Panel  │          │
│  │  (React.js)  │  │  (React.js)  │  │  (React.js)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
│                    ┌───────▼────────┐                            │
│                    │  React Router  │                            │
│                    └───────┬────────┘                            │
│                            │                                      │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                  │
│    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼──────┐          │
│    │  Axios   │    │  Socket.io  │    │   Local    │          │
│    │  Client  │    │   Client    │    │  Storage   │          │
│    └────┬─────┘    └──────┬──────┘    └────────────┘          │
└─────────┼─────────────────┼──────────────────────────────────────┘
          │                 │
          │ HTTP/HTTPS      │ WebSocket
          │                 │
┌─────────▼─────────────────▼──────────────────────────────────────┐
│                      BACKEND SERVER                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   Express.js Application                    │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │              Middleware Stack                         │  │  │
│  │  │  • CORS • Helmet • Body Parser • Authentication      │  │  │
│  │  │  • File Upload • Validation • Error Handler          │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │    Admin     │  │    Mentor    │  │   Mentee     │    │  │
│  │  │   Routes     │  │   Routes     │  │   Routes     │    │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │  │
│  │         │                  │                  │             │  │
│  │  ┌──────▼──────────────────▼──────────────────▼───────┐   │  │
│  │  │              Shared Routes                          │   │  │
│  │  │  • Auth • Chat • Notifications • Upload • Public   │   │  │
│  │  └──────┬──────────────────────────────────────────────┘   │  │
│  │         │                                                   │  │
│  │  ┌──────▼──────────────────────────────────────────────┐   │  │
│  │  │                  Controllers                         │   │  │
│  │  │  • Business Logic • Validation • Data Processing    │   │  │
│  │  └──────┬──────────────────────────────────────────────┘   │  │
│  │         │                                                   │  │
│  │  ┌──────▼──────────────────────────────────────────────┐   │  │
│  │  │                   Services                           │   │  │
│  │  │  • Email • Payment • Upload • Analytics • Search    │   │  │
│  │  └──────┬──────────────────────────────────────────────┘   │  │
│  │         │                                                   │  │
│  │  ┌──────▼──────────────────────────────────────────────┐   │  │
│  │  │              Mongoose Models                         │   │  │
│  │  │  • Schema Definition • Validation • Relationships   │   │  │
│  │  └──────┬──────────────────────────────────────────────┘   │  │
│  └─────────┼──────────────────────────────────────────────────┘  │
│            │                                                      │
│  ┌─────────▼──────────┐                                          │
│  │   Socket.io Server │                                          │
│  │  • Chat Events     │                                          │
│  │  • Notifications   │                                          │
│  │  • Presence        │                                          │
│  └────────────────────┘                                          │
└───────────┬────────────────────┬─────────────────┬───────────────┘
            │                    │                 │
            │                    │                 │
    ┌───────▼────────┐  ┌────────▼────────┐  ┌────▼─────────┐
    │    MongoDB     │  │   Cloudinary    │  │    Stripe    │
    │    Atlas       │  │   (File CDN)    │  │  (Payments)  │
    └────────────────┘  └─────────────────┘  └──────────────┘
```

## Component Interaction Flow

### Frontend to Backend Communication

**HTTP REST API Communication**:
1. User interacts with the React frontend (clicks button, submits form)
2. React component triggers an action (event handler)
3. Axios client prepares HTTP request with:
   - URL endpoint (e.g., `/api/mentee/bookings`)
   - HTTP method (GET, POST, PUT, DELETE)
   - Request headers (Content-Type, Authorization with JWT)
   - Request body (JSON data for POST/PUT requests)
4. Request sent to backend server over HTTPS
5. Backend receives request and processes through middleware stack
6. Controller executes business logic and interacts with database
7. Response formatted and sent back to frontend
8. Axios receives response and updates React component state
9. React re-renders UI with new data

**WebSocket Communication (Real-time)**:
1. User performs real-time action (sends chat message)
2. Socket.io client emits event with data
3. Backend Socket.io server receives event
4. Server validates and processes the event
5. Server stores data in database if needed
6. Server broadcasts event to relevant connected clients
7. All connected clients receive the event
8. React components update state and re-render

### Backend to Database Communication

**Query Execution Flow**:
1. Controller receives validated request data
2. Controller calls Mongoose model method
3. Mongoose constructs MongoDB query
4. Query sent to MongoDB database
5. Database executes query using indexes
6. Results returned to Mongoose
7. Mongoose transforms results into JavaScript objects
8. Controller processes results
9. Response sent back to frontend

**Data Persistence Flow**:
1. Controller receives data to save
2. Validation performed using Mongoose schema
3. Pre-save middleware executes (e.g., password hashing)
4. Document saved to MongoDB collection
5. Post-save middleware executes (e.g., notifications)
6. Saved document returned with generated ID
7. Success response sent to frontend

## Request and Response Flow

### Standard HTTP Request Flow

```
CLIENT REQUEST
    │
    ├─► 1. User Action (Click, Submit, Navigate)
    │
    ├─► 2. React Event Handler Triggered
    │
    ├─► 3. Axios Prepares HTTP Request
    │       • Method: GET/POST/PUT/DELETE
    │       • URL: /api/endpoint
    │       • Headers: Authorization, Content-Type
    │       • Body: JSON data (if POST/PUT)
    │
    ├─► 4. Request Sent Over HTTPS
    │
    ▼
SERVER PROCESSING
    │
    ├─► 5. Express Receives Request
    │
    ├─► 6. Middleware Stack Execution (Sequential)
    │       • CORS: Validate origin
    │       • Helmet: Set security headers
    │       • Body Parser: Parse JSON body
    │       • Authentication: Verify JWT token
    │       • Authorization: Check user permissions
    │       • Validation: Validate request data
    │
    ├─► 7. Route Matching
    │       • Express matches URL to route handler
    │       • Route parameters extracted
    │
    ├─► 8. Controller Execution
    │       • Extract request data
    │       • Execute business logic
    │       • Call service functions if needed
    │
    ├─► 9. Database Interaction
    │       • Mongoose model methods called
    │       • Query constructed and executed
    │       • Results retrieved
    │
    ├─► 10. Response Preparation
    │       • Format data for response
    │       • Set appropriate HTTP status code
    │       • Add response headers
    │
    ├─► 11. Response Sent to Client
    │
    ▼
CLIENT RESPONSE HANDLING
    │
    ├─► 12. Axios Receives Response
    │
    ├─► 13. Response Interceptor (if configured)
    │       • Transform response data
    │       • Handle errors globally
    │
    ├─► 14. Promise Resolution
    │       • Success: .then() or await result
    │       • Error: .catch() or try-catch
    │
    ├─► 15. Component State Update
    │       • setState or state setter called
    │
    ├─► 16. React Re-render
    │       • Virtual DOM diff calculated
    │       • Real DOM updated efficiently
    │
    └─► 17. UI Updated for User
```

### Example: Fetching Mentor List

**Step-by-Step Flow**:

1. **User Action**: User navigates to mentors page
2. **Component Mount**: React component `useEffect` hook triggers
3. **API Call**: `axios.get('/api/public/mentors?country=USA')`
4. **Request Sent**: GET request with query parameters
5. **Server Receives**: Express matches route to `GET /api/public/mentors`
6. **Controller Executes**: `publicController.getMentors()`
7. **Database Query**: `MentorProfile.find({ currentCountry: 'USA' }).populate('userId')`
8. **MongoDB Executes**: Query with index on `currentCountry`
9. **Results Retrieved**: Array of mentor documents
10. **Response Formatted**: `{ success: true, data: mentors, count: 25 }`
11. **Response Sent**: HTTP 200 with JSON body
12. **Frontend Receives**: Axios promise resolves with data
13. **State Updated**: `setMentors(response.data.data)`
14. **UI Re-renders**: Mentor cards displayed on screen

### Example: Creating a Booking

**Step-by-Step Flow**:

1. **User Action**: User clicks "Book Service" button
2. **Form Submission**: React form handler triggered
3. **API Call**: `axios.post('/api/mentee/bookings', bookingData, { headers: { Authorization: 'Bearer token' } })`
4. **Request Sent**: POST with JSON body and auth header
5. **CORS Middleware**: Validates origin is allowed
6. **Auth Middleware**: Verifies JWT token, extracts user ID
7. **Validation Middleware**: Validates booking data structure
8. **Route Matched**: `POST /api/mentee/bookings`
9. **Controller Executes**: `bookingController.createBooking()`
10. **Business Logic**:
    - Check service availability
    - Verify user is not the mentor
    - Calculate pricing with platform fee
11. **Database Operations**:
    - Create booking document
    - Update service booking count
    - Create notification for mentor
12. **Payment Intent**: Stripe API called to create payment intent
13. **Response Prepared**: `{ success: true, data: { booking, clientSecret } }`
14. **Response Sent**: HTTP 201 Created
15. **Frontend Receives**: Booking data and payment secret
16. **Payment Flow**: Stripe payment form displayed
17. **UI Updated**: Booking confirmation shown

## Authentication and Authorization Flow

### Registration Flow

```
1. USER REGISTRATION REQUEST
   │
   ├─► Frontend: User fills registration form
   │   • Email, password, role, profile data
   │
   ├─► Frontend: Form validation
   │   • Email format, password strength
   │
   ├─► Frontend: POST /api/auth/register
   │
   ▼
2. BACKEND PROCESSING
   │
   ├─► Validation Middleware
   │   • Check required fields
   │   • Validate email format
   │   • Verify password strength
   │
   ├─► Controller: authController.register()
   │   • Check if email already exists
   │   • Hash password using bcrypt (10 salt rounds)
   │   • Create user document
   │   • Create role-specific profile (Mentor/Mentee)
   │
   ├─► Database: Save user and profile
   │
   ├─► JWT Generation
   │   • Payload: { userId, role, email }
   │   • Sign with secret key
   │   • Set expiration (7 days)
   │
   ├─► Email Service (Optional)
   │   • Send verification email
   │   • Include verification token
   │
   ├─► Response: { success: true, token, user }
   │
   ▼
3. FRONTEND HANDLING
   │
   ├─► Store JWT token
   │   • localStorage or sessionStorage
   │
   ├─► Set Axios default header
   │   • Authorization: Bearer <token>
   │
   ├─► Update auth context
   │   • Set user data
   │   • Set authenticated state
   │
   └─► Redirect to dashboard
       • Role-based routing
```

### Login Flow

```
1. USER LOGIN REQUEST
   │
   ├─► Frontend: User enters credentials
   │   • Email and password
   │
   ├─► Frontend: POST /api/auth/login
   │
   ▼
2. BACKEND AUTHENTICATION
   │
   ├─► Validation Middleware
   │   • Verify email and password provided
   │
   ├─► Controller: authController.login()
   │
   ├─► Database Query
   │   • Find user by email
   │   • Include password field (normally excluded)
   │
   ├─► User Verification
   │   • Check if user exists
   │   • Check if account is active
   │   • Check if email is verified (optional)
   │
   ├─► Password Verification
   │   • bcrypt.compare(inputPassword, hashedPassword)
   │   • Returns true/false
   │
   ├─► JWT Generation (if valid)
   │   • Create access token (7 days)
   │   • Create refresh token (30 days)
   │   • Payload includes userId, role, email
   │
   ├─► Response: { success: true, token, refreshToken, user }
   │
   ▼
3. FRONTEND HANDLING
   │
   ├─► Store tokens securely
   │   • Access token in memory or localStorage
   │   • Refresh token in httpOnly cookie (preferred)
   │
   ├─► Configure Axios
   │   • Set Authorization header
   │
   ├─► Update application state
   │   • AuthContext with user data
   │   • Authenticated flag set to true
   │
   └─► Navigate to dashboard
       • Mentor → /mentor/dashboard
       • Mentee → /mentee/dashboard
       • Admin → /admin/dashboard
```

### Protected Route Access Flow

```
1. USER NAVIGATES TO PROTECTED ROUTE
   │
   ├─► Frontend: React Router checks route
   │
   ├─► ProtectedRoute Component
   │   • Check if user is authenticated
   │   • Check if user has required role
   │
   ├─► If not authenticated:
   │   • Redirect to /login
   │   • Store intended destination
   │
   ├─► If authenticated:
   │   • Render requested component
   │
   ▼
2. API REQUEST FROM PROTECTED PAGE
   │
   ├─► Axios Request Interceptor
   │   • Attach JWT token to Authorization header
   │   • Format: "Bearer <token>"
   │
   ├─► Request sent to backend
   │
   ▼
3. BACKEND AUTHORIZATION
   │
   ├─► Authentication Middleware (auth.js)
   │   • Extract token from Authorization header
   │   • Verify token signature
   │   • Check token expiration
   │   • Decode payload
   │
   ├─► Token Blacklist Check
   │   • Query BlacklistedToken collection
   │   • Ensure token hasn't been revoked
   │
   ├─► Attach user to request
   │   • req.user = decoded payload
   │   • Contains userId, role, email
   │
   ├─► Role Authorization Middleware (roleAuth.js)
   │   • Check if user role matches required role
   │   • Example: requireRole(['mentor', 'admin'])
   │
   ├─► If authorized:
   │   • Continue to controller
   │
   ├─► If unauthorized:
   │   • Return 403 Forbidden
   │   • Response: { success: false, error: 'Insufficient permissions' }
   │
   ▼
4. FRONTEND ERROR HANDLING
   │
   ├─► Axios Response Interceptor
   │   • Detect 401 Unauthorized
   │   • Attempt token refresh
   │
   ├─► If refresh fails:
   │   • Clear stored tokens
   │   • Reset auth state
   │   • Redirect to login
   │
   └─► If 403 Forbidden:
       • Show "Access Denied" message
       • Redirect to appropriate page
```

### Google OAuth Flow

```
1. USER CLICKS "SIGN IN WITH GOOGLE"
   │
   ├─► Frontend: Redirect to /api/auth/google
   │
   ▼
2. BACKEND OAUTH INITIATION
   │
   ├─► Passport Google Strategy
   │   • Redirect to Google OAuth consent screen
   │   • Request user profile and email
   │
   ▼
3. USER GRANTS PERMISSION
   │
   ├─► Google redirects to callback URL
   │   • /api/auth/google/callback
   │   • Includes authorization code
   │
   ▼
4. BACKEND OAUTH COMPLETION
   │
   ├─► Passport exchanges code for tokens
   │   • Access token from Google
   │   • User profile data retrieved
   │
   ├─► Controller: authController.googleCallback()
   │   • Extract email, name, googleId, picture
   │
   ├─► Database Check
   │   • Find user by googleId or email
   │
   ├─► If user exists:
   │   • Update last login
   │   • Generate JWT token
   │
   ├─► If new user:
   │   • Create user document
   │   • Set googleId field
   │   • Mark email as verified
   │   • Create default profile
   │   • Generate JWT token
   │
   ├─► Redirect to frontend
   │   • URL: https://frontend.com/auth/callback?token=<jwt>
   │
   ▼
5. FRONTEND HANDLING
   │
   ├─► Extract token from URL
   │
   ├─► Store token
   │
   ├─► Update auth state
   │
   └─► Redirect to dashboard
```

### Logout Flow

```
1. USER CLICKS LOGOUT
   │
   ├─► Frontend: POST /api/auth/logout
   │   • Include current JWT token
   │
   ▼
2. BACKEND LOGOUT PROCESSING
   │
   ├─► Authentication Middleware
   │   • Verify token is valid
   │
   ├─► Controller: authController.logout()
   │   • Extract token from request
   │   • Decode to get expiration
   │
   ├─► Blacklist Token
   │   • Create BlacklistedToken document
   │   • Store token hash
   │   • Set expiration (same as token)
   │   • TTL index auto-deletes after expiration
   │
   ├─► Response: { success: true, message: 'Logged out' }
   │
   ▼
3. FRONTEND CLEANUP
   │
   ├─► Remove token from storage
   │   • Clear localStorage/sessionStorage
   │
   ├─► Reset Axios headers
   │   • Remove Authorization header
   │
   ├─► Clear auth context
   │   • Set user to null
   │   • Set authenticated to false
   │
   ├─► Disconnect Socket.io
   │   • Close real-time connection
   │
   └─► Redirect to login page
```

## High-Level Data Flow

### Service Booking Complete Flow

This example demonstrates how data flows through the entire system for a complete user journey.

```
STEP 1: SERVICE DISCOVERY
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User browses services page                               │
│  • GET /api/public/services?category=sop&educationLevel=graduate │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend                                                      │
│  • publicController.getServices()                           │
│  • Query: Service.find({ category, educationLevel, status: 'approved' }) │
│  • Populate mentor details                                  │
│  • Sort by rating                                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Execute query on Services collection                     │
│  • Use indexes on category, educationLevel, status          │
│  • Join with MentorProfiles and Users                       │
│  • Return array of services                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • Receive services array                                   │
│  • Render ServiceCard components                            │
│  • Display mentor info, pricing, ratings                    │
└─────────────────────────────────────────────────────────────┘

STEP 2: SERVICE SELECTION
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User clicks on service card                              │
│  • Navigate to /services/:serviceId                         │
│  • GET /api/public/services/:serviceId                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend                                                      │
│  • publicController.getServiceDetails()                     │
│  • Query: Service.findById(serviceId).populate('mentorId')  │
│  • Fetch related reviews                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Find service by ID                                       │
│  • Populate mentor profile and user data                    │
│  • Fetch ServiceFeedback documents                          │
│  • Return complete service details                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • Display service details page                             │
│  • Show packages (Basic, Standard, Premium)                 │
│  • Display mentor profile                                   │
│  • Show reviews and ratings                                 │
└─────────────────────────────────────────────────────────────┘

STEP 3: BOOKING CREATION
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User selects package (e.g., Standard)                    │
│  • User clicks "Book Now"                                   │
│  • POST /api/mentee/bookings                                │
│  • Body: { serviceId, packageType: 'standard', scheduledDate } │
│  • Headers: { Authorization: 'Bearer <token>' }             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Middleware Stack                                  │
│  • Auth middleware: Verify JWT, extract userId              │
│  • Validation: Check required fields                        │
│  • Authorization: Ensure user is mentee                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Controller                                         │
│  • bookingController.createBooking()                        │
│  • Validate service exists and is active                    │
│  • Verify user is not booking own service                   │
│  • Calculate pricing from package                           │
│  • Calculate platform fee (15%)                             │
│  • Calculate mentor earnings (85%)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Payment Service                                   │
│  • Create Stripe Payment Intent                             │
│  • Amount: package price in cents                           │
│  • Metadata: bookingId, serviceId, mentorId                 │
│  • Return clientSecret for frontend                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Create Booking document                                  │
│    - status: 'pending'                                      │
│    - paymentStatus: 'pending'                               │
│  • Create Payment document                                  │
│    - status: 'pending'                                      │
│    - stripePaymentIntentId                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • Receive booking and clientSecret                         │
│  • Display Stripe payment form                              │
│  • User enters card details                                 │
└─────────────────────────────────────────────────────────────┘

STEP 4: PAYMENT PROCESSING
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User submits payment                                     │
│  • Stripe.js handles card processing                        │
│  • Payment sent directly to Stripe                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Stripe                                                       │
│  • Process payment                                          │
│  • Validate card                                            │
│  • Execute 3D Secure if required                            │
│  • Charge card                                              │
│  • Send webhook to backend                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Webhook Handler                                   │
│  • POST /api/webhooks/stripe                                │
│  • Verify webhook signature                                 │
│  • Extract event type: payment_intent.succeeded             │
│  • Extract payment intent ID                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Payment Service                                   │
│  • Find Payment by stripePaymentIntentId                    │
│  • Update Payment status: 'succeeded'                       │
│  • Find associated Booking                                  │
│  • Update Booking status: 'confirmed'                       │
│  • Update Booking paymentStatus: 'paid'                     │
│  • Update Service totalBookings count                       │
│  • Update MentorProfile totalStudents count                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database - Transaction                                       │
│  • Update Payment document                                  │
│  • Update Booking document                                  │
│  • Increment Service.totalBookings                          │
│  • Increment MentorProfile.totalStudents                    │
│  • All updates in single transaction                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Notification Service                              │
│  • Create notification for mentor                           │
│    - type: 'booking'                                        │
│    - message: 'New booking received'                        │
│  • Create notification for mentee                           │
│    - type: 'booking'                                        │
│    - message: 'Booking confirmed'                           │
│  • Send email to mentor                                     │
│  • Send email to mentee                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Socket.io Server                                             │
│  • Emit 'new_booking' event to mentor's socket              │
│  • Emit 'booking_confirmed' event to mentee's socket        │
│  • Emit 'new_notification' to both users                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend - Real-time Updates                                │
│  • Mentor receives notification instantly                   │
│  • Mentee sees confirmation instantly                       │
│  • Notification badge updated                               │
│  • Dashboard stats refreshed                                │
└─────────────────────────────────────────────────────────────┘

STEP 5: MEETING SCHEDULING
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentor)                                            │
│  • Mentor views new booking                                 │
│  • Clicks "Schedule Meeting"                                │
│  • POST /api/mentor/google-meet/create                      │
│  • Body: { bookingId, scheduledAt, duration, title }        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Google Meet Service                               │
│  • Authenticate with Google API                             │
│  • Create Google Calendar event                             │
│  • Add mentee as attendee                                   │
│  • Generate Google Meet link                                │
│  • Return event details                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Create Meeting document                                  │
│    - bookingId, mentorId, menteeId                          │
│    - meetingLink (Google Meet URL)                          │
│    - googleEventId                                          │
│    - status: 'scheduled'                                    │
│  • Update Booking with meetingLink                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Notification Service                              │
│  • Notify mentee of scheduled meeting                       │
│  • Send calendar invite email                               │
│  • Create reminder notification                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Both Users)                                        │
│  • Meeting appears in calendar                              │
│  • Meeting link accessible                                  │
│  • Reminder notifications sent                              │
└─────────────────────────────────────────────────────────────┘

STEP 6: CHAT COMMUNICATION
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User navigates to chat                                   │
│  • Socket.io connects with JWT                              │
│  • Emit: 'join_conversation' { conversationId }             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Socket.io Server                                             │
│  • Authenticate socket connection                           │
│  • Join user to conversation room                           │
│  • Fetch conversation history                               │
│  • Send history to client                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • Display chat history                                     │
│  • User types message                                       │
│  • Emit: 'send_message' { conversationId, content, type }   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Socket.io Server                                             │
│  • Validate message content                                 │
│  • Save to database                                         │
│  • Broadcast to conversation room                           │
│  • Update conversation lastMessage                          │
│  • Increment unread count for recipient                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Create Message document                                  │
│  • Update Conversation.lastMessage                          │
│  • Update Conversation.unreadCount                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentor)                                            │
│  • Receive 'new_message' event                              │
│  • Display message in chat                                  │
│  • Update unread badge                                      │
│  • Play notification sound                                  │
└─────────────────────────────────────────────────────────────┘

STEP 7: SERVICE COMPLETION
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentor)                                            │
│  • Mentor marks booking as complete                         │
│  • PUT /api/mentor/bookings/:id/complete                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend                                                      │
│  • Verify mentor owns the booking                           │
│  • Update Booking status: 'completed'                       │
│  • Update Meeting status: 'completed'                       │
│  • Credit mentor wallet with earnings                       │
│  • Update mentor XP and check for badges                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Update Booking.status and completedAt                    │
│  • Update Meeting.status                                    │
│  • Create/Update MentorWallet transaction                   │
│  • Update MentorProfile.xp                                  │
│  • Check badge criteria and award if met                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Notification Service                              │
│  • Notify mentee to leave review                            │
│  • Notify mentor of completion                              │
│  • If badge earned, notify mentor                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • Receive completion notification                          │
│  • Prompt to leave review                                   │
│  • Display review form                                      │
└─────────────────────────────────────────────────────────────┘

STEP 8: REVIEW SUBMISSION
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentee)                                            │
│  • User fills review form                                   │
│  • Rating (1-5 stars)                                       │
│  • Comment                                                  │
│  • Aspect ratings (communication, expertise, etc.)          │
│  • POST /api/mentee/reviews                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend                                                      │
│  • Validate review data                                     │
│  • Verify booking is completed                              │
│  • Verify user hasn't already reviewed                      │
│  • Create ServiceFeedback document                          │
│  • Recalculate service average rating                       │
│  • Recalculate mentor average rating                        │
│  • Update review counts                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Database                                                     │
│  • Create ServiceFeedback document                          │
│  • Update Service.rating (weighted average)                 │
│  • Update Service.totalReviews                              │
│  • Update MentorProfile.rating                              │
│  • Update MentorProfile.totalReviews                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend - Notification Service                              │
│  • Notify mentor of new review                              │
│  • Include rating and comment                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Mentor)                                            │
│  • Receive review notification                              │
│  • Updated rating visible on profile                        │
│  • Can respond to review                                    │
└─────────────────────────────────────────────────────────────┘
```

## Real-Time Communication Architecture

### Socket.io Connection Management

**Connection Establishment**:
1. User authenticates via HTTP (receives JWT)
2. Frontend creates Socket.io connection with JWT in auth payload
3. Backend Socket.io middleware validates JWT
4. User socket stored in memory with userId mapping
5. User automatically joins personal room (userId)
6. Connection confirmed to client

**Event Flow**:
1. Client emits event with data
2. Server receives event on specific socket
3. Server validates user permissions
4. Server processes event (save to DB, business logic)
5. Server broadcasts to relevant rooms/sockets
6. Connected clients receive event
7. Clients update UI in real-time

**Disconnection Handling**:
1. User closes browser or loses connection
2. Socket.io detects disconnection
3. Server removes socket from active connections
4. User status updated to offline
5. Offline status broadcasted to relevant users
6. Automatic reconnection attempted by client

### Chat Message Flow

**Sending Message**:
```
User A Types Message
    ↓
Frontend validates locally
    ↓
Socket.io emits 'send_message'
    ↓
Server receives event
    ↓
Server validates:
    • User is participant
    • Conversation exists
    • Content is valid
    ↓
Server saves to database:
    • Create Message document
    • Update Conversation.lastMessage
    • Increment unreadCount for User B
    ↓
Server broadcasts to conversation room:
    • All participants receive 'new_message'
    ↓
User B's frontend receives event
    ↓
User B's UI updates:
    • Message appears in chat
    • Unread badge increments
    • Notification sound plays
    ↓
User B reads message
    ↓
Frontend emits 'message_read'
    ↓
Server updates Message.isRead
    ↓
Server emits 'message_read' to User A
    ↓
User A sees read receipt
```

## Error Handling Architecture

### Frontend Error Handling

**Axios Interceptors**:
```javascript
// Request Interceptor
- Attach JWT token
- Set request timestamp
- Log request in development

// Response Interceptor
- Handle 401: Attempt token refresh, redirect to login
- Handle 403: Show access denied message
- Handle 404: Show not found message
- Handle 500: Show server error message
- Handle network errors: Show offline message
- Transform response data
```

**Component Error Boundaries**:
```javascript
- Catch React component errors
- Display fallback UI
- Log error to monitoring service
- Prevent entire app crash
```

### Backend Error Handling

**Middleware Error Handler**:
```javascript
1. Catch all errors from routes/controllers
2. Determine error type:
   - Validation error (400)
   - Authentication error (401)
   - Authorization error (403)
   - Not found error (404)
   - Database error (500)
   - Third-party service error (502)
3. Format error response:
   {
     success: false,
     error: {
       message: "User-friendly message",
       statusCode: 400,
       errors: [] // Validation errors
     }
   }
4. Log error with stack trace
5. Send response to client
```

**Try-Catch Pattern**:
```javascript
try {
  // Business logic
  // Database operations
  // Third-party API calls
} catch (error) {
  // Log error
  // Determine error type
  // Pass to error handler middleware
  next(error);
}
```

## Performance Optimization Strategies

### Database Optimization

**Indexing**:
- Single field indexes on frequently queried fields
- Compound indexes for multi-field queries
- Text indexes for search functionality
- TTL indexes for automatic document expiration

**Query Optimization**:
- Use projection to select only needed fields
- Implement pagination for large result sets
- Use aggregation pipeline for complex queries
- Avoid N+1 queries with populate

### Frontend Optimization

**Code Splitting**:
- Route-based lazy loading
- Component lazy loading
- Dynamic imports for heavy libraries

**Caching**:
- Browser caching for static assets
- API response caching for frequently accessed data
- Memoization of expensive computations

**Rendering Optimization**:
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for function memoization
- Virtual scrolling for long lists

### Backend Optimization

**Response Optimization**:
- Compress responses with gzip
- Minimize response payload size
- Use pagination for large datasets
- Implement field selection

**Caching Strategy** (Future):
- Redis for session storage
- Cache frequently accessed data
- Cache database query results
- Implement cache invalidation

## Scalability Considerations

### Horizontal Scaling

**Frontend**:
- Static files served via CDN
- Multiple frontend instances behind load balancer
- Stateless design enables easy scaling

**Backend**:
- Stateless API design (JWT, no server sessions)
- Multiple server instances behind load balancer
- Socket.io with Redis adapter for multi-server support
- Shared MongoDB connection across instances

**Database**:
- MongoDB replica sets for high availability
- Sharding for horizontal data distribution
- Read replicas for read-heavy workloads

### Vertical Scaling

- Increase server CPU and RAM
- Optimize database server resources
- Use connection pooling
- Implement caching layers

## Conclusion

The Scholarslee system architecture follows industry best practices for building scalable, maintainable, and secure web applications. The clear separation of concerns between frontend, backend, and database layers enables independent development, testing, and deployment of each component.

The authentication and authorization flow ensures secure access to resources, while the real-time communication layer provides instant updates for chat and notifications. The comprehensive error handling and performance optimization strategies ensure a reliable and responsive user experience.

This architecture is designed to support the current feature set while providing flexibility for future enhancements such as mobile applications, advanced analytics, and third-party integrations.

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Prepared By**: Scholarslee Development Team  
**Classification**: Technical Documentation
