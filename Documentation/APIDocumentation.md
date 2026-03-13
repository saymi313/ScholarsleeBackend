# API Documentation

## Overview

This document provides comprehensive API documentation for the Scholarslee MERN stack backend. All endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `http://localhost:5000/api` (Development)

**Authentication**: JWT Bearer token in Authorization header
```
Authorization: Bearer <token>
```

**Standard Response Format**:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... }
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Mentee/Mentor Authentication

#### Register User
```
POST /api/mentees/auth/register
POST /api/mentors/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "mentee|mentor"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Login
```
POST /api/mentees/auth/login
POST /api/mentors/auth/login
POST /api/admin/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User
```
GET /api/mentees/auth/me
GET /api/mentors/auth/me
GET /api/admin/auth/me
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "mentee|mentor|admin",
      "profile": { ... }
    }
  }
}
```

#### Logout
```
POST /api/mentees/auth/logout
POST /api/mentors/auth/logout
POST /api/admin/auth/logout
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Verify Email
```
POST /api/mentees/auth/verify-email
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Password Reset Flow
```
POST /api/mentees/auth/forgot-password
POST /api/mentees/auth/verify-otp
POST /api/mentees/auth/reset-password
```

---

## Mentee Panel Endpoints

### Profile Management

#### Get Mentee Profile
```
GET /api/mentees/profile
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "user_id",
      "studyGoals": [...],
      "targetCountries": [...],
      "academicInterests": [...],
      "preferences": { ... }
    }
  }
}
```

#### Update Mentee Profile
```
PUT /api/mentees/profile
```

**Request Body**:
```json
{
  "studyGoals": ["Masters in CS"],
  "targetCountries": ["USA", "Canada"],
  "academicInterests": ["AI", "ML"]
}
```

### Mentor Discovery

#### Get All Mentors
```
GET /api/mentees/mentors
```

**Query Parameters**:
- `country` - Filter by country
- `specialization` - Filter by specialization
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mentors": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50
    }
  }
}
```

#### Get Mentor by ID
```
GET /api/mentees/mentors/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mentor": {
      "_id": "mentor_id",
      "profile": { ... },
      "education": [...],
      "experience": [...],
      "rating": 4.5
    }
  }
}
```

### Service Discovery

#### Get All Services
```
GET /api/mentees/services
```

**Query Parameters**:
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `page`, `limit` - Pagination

**Response** (200):
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "service_id",
        "title": "SOP Review",
        "category": "sop",
        "packages": [...],
        "mentorId": { ... }
      }
    ]
  }
}
```

#### Get Service by ID
```
GET /api/mentees/services/:id
```

### Booking Management

#### Create Booking
```
POST /api/mentees/bookings
```

**Request Body**:
```json
{
  "serviceId": "service_id",
  "packageId": "package_id",
  "scheduledDate": "2026-02-15T10:00:00Z",
  "duration": 60,
  "notes": "Optional notes"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "booking_id",
      "status": "pending",
      "totalAmount": 50
    }
  }
}
```

#### Get My Bookings
```
GET /api/mentees/bookings
```

**Query Parameters**:
- `status` - Filter by status (pending, confirmed, completed, cancelled)
- `page`, `limit` - Pagination

#### Cancel Booking
```
PUT /api/mentees/bookings/:id/cancel
```

**Request Body**:
```json
{
  "reason": "Cancellation reason"
}
```

### Meetings

#### Get My Meetings
```
GET /api/mentees/meetings
```

#### Get Today's Meetings
```
GET /api/mentees/meetings/today
```

#### Join Meeting
```
POST /api/mentees/meetings/:id/join
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "meetingLink": "https://meet.google.com/...",
    "meetingPassword": "password"
  }
}
```

---

## Mentor Panel Endpoints

### Profile Management

#### Create Mentor Profile
```
POST /api/mentors/profile
```

**Request Body**:
```json
{
  "bio": "Professional summary",
  "title": "Software Engineer",
  "specialization": ["SOP", "Visa"],
  "country": "USA",
  "university": "MIT"
}
```

#### Add Education
```
POST /api/mentors/profile/education
```

**Request Body**:
```json
{
  "degree": "Masters",
  "field": "Computer Science",
  "university": "MIT",
  "country": "USA",
  "startDate": "2020-09",
  "endDate": "2022-05"
}
```

#### Add Experience
```
POST /api/mentors/profile/experience
```

### Service Management

#### Create Service
```
POST /api/mentors/services
```

**Request Body**:
```json
{
  "title": "SOP Review Service",
  "category": "sop",
  "description": "Detailed description",
  "packages": [
    {
      "name": "Basic",
      "price": 30,
      "features": ["1 review", "48h turnaround"]
    }
  ]
}
```

#### Get My Services
```
GET /api/mentors/services
```

#### Update Service
```
PUT /api/mentors/services/:id
```

#### Delete Service
```
DELETE /api/mentors/services/:id
```

### Booking Management

#### Get My Bookings
```
GET /api/mentors/bookings
```

#### Update Booking Status
```
PUT /api/mentors/bookings/:id/status
```

**Request Body**:
```json
{
  "status": "confirmed|completed|cancelled",
  "notes": "Optional notes"
}
```

#### Create Meeting
```
POST /api/mentors/bookings/:bookingId/meetings
```

**Request Body**:
```json
{
  "scheduledDate": "2026-02-15T10:00:00Z",
  "duration": 60,
  "meetingLink": "https://meet.google.com/...",
  "agenda": "Meeting agenda"
}
```

### Revenue & Wallet

#### Get Revenue Dashboard
```
GET /api/mentors/revenue/dashboard
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalEarnings": 1500,
    "pendingEarnings": 300,
    "availableBalance": 1200,
    "monthlyRevenue": [...]
  }
}
```

#### Get Wallet Data
```
GET /api/mentors/wallet/data
```

#### Request Withdrawal
```
POST /api/mentors/wallet/withdraw
```

**Request Body**:
```json
{
  "amount": 500,
  "payoutMethodId": "method_id"
}
```

### Badges

#### Get My Badge
```
GET /api/mentors/badges
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "badge": {
      "level": "Gold",
      "completedSessions": 50,
      "rating": 4.8
    }
  }
}
```

---

## Admin Panel Endpoints

### Dashboard

#### Get Dashboard Metrics
```
GET /api/admin/dashboard/metrics
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalMentors": 150,
    "totalRevenue": 50000,
    "activeBookings": 25
  }
}
```

#### Get Revenue Chart
```
GET /api/admin/dashboard/revenue-chart
```

### User Management

#### Get All Users
```
GET /api/admin/users
```

**Query Parameters**:
- `country`, `status`, `search`
- `page`, `limit`

#### Update User Status
```
PATCH /api/admin/users/:id/status
```

**Request Body**:
```json
{
  "isActive": true|false
}
```

### Mentor Management

#### Get All Mentors
```
GET /api/admin/mentors
```

#### Update Mentor Approval
```
PATCH /api/admin/mentors/:id/approval
```

**Request Body**:
```json
{
  "status": "approved|rejected",
  "reason": "Optional reason"
}
```

#### Pause Mentor Login
```
PATCH /api/admin/mentors/:id/pause-login
```

**Request Body**:
```json
{
  "isPaused": true|false
}
```

### Service Management

#### Get All Services
```
GET /api/admin/services
```

#### Approve Service
```
PATCH /api/admin/services/:id/approve
```

**Request Body**:
```json
{
  "status": "approved|rejected"
}
```

### Payout Management

#### Get All Payouts
```
GET /api/admin/payouts
```

#### Complete Payout
```
POST /api/admin/payouts/:id/complete
```

#### Reject Payout
```
POST /api/admin/payouts/:id/reject
```

---

## Shared Endpoints

### Chat System

#### Get Conversations
```
GET /api/chat/conversations
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "conversationId": "conv_id",
        "participant": { ... },
        "lastMessage": { ... },
        "unreadCount": 3
      }
    ]
  }
}
```

#### Get/Create Conversation
```
POST /api/chat/conversations
GET /api/chat/conversations/:participantId
```

**Request Body** (POST):
```json
{
  "participantId": "user_id"
}
```

#### Get Messages
```
GET /api/chat/conversations/:conversationId/messages
```

**Query Parameters**:
- `page`, `limit`

#### Send Message
```
POST /api/chat/messages
```

**Request Body**:
```json
{
  "conversationId": "conv_id",
  "content": "Message text",
  "messageType": "text|file|image"
}
```

#### Delete Message
```
DELETE /api/chat/messages/:messageId
```

### Payment System

#### Create Checkout Session
```
POST /api/payments/create-checkout-session
```

**Request Body**:
```json
{
  "bookingId": "booking_id",
  "amount": 50
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessionId": "stripe_session_id",
    "url": "https://checkout.stripe.com/..."
  }
}
```

#### Verify Session
```
GET /api/payments/verify-session/:sessionId
```

#### Get Payment History
```
GET /api/payments/history
```

### Notifications

#### Get Notifications
```
GET /api/notifications
```

**Query Parameters**:
- `isRead` - Filter by read status
- `page`, `limit`

#### Mark as Read
```
PUT /api/notifications/:id/read
```

#### Mark All as Read
```
PUT /api/notifications/read-all
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]  // Optional validation errors
}
```

### Common Errors

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**400 Validation Error**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes
- **File Upload**: 10 uploads per hour

---

## Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "current": 1,
    "pages": 10,
    "total": 100
  }
}
```

---

## File Upload

**Endpoint**: `POST /api/upload`

**Content-Type**: `multipart/form-data`

**Request**:
```
file: <binary>
folder: "profiles|services|chat"
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "url": "https://cloudinary.com/...",
    "publicId": "file_id"
  }
}
```

**Limits**:
- Max file size: 5MB
- Allowed types: jpg, png, pdf, doc, docx

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Prepared By**: Usairam Saeed
**Classification** : Technical Dcoumentation