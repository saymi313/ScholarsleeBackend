# User Roles and Permissions

## Overview

The Scholarslee platform implements a **Role-Based Access Control (RBAC)** system to manage user permissions and access levels. This system ensures that users can only access features and data appropriate to their role, maintaining security and data integrity across the platform.

The system defines **three distinct user roles**, each with specific permissions and responsibilities:

1. **Mentee** - Students seeking mentorship
2. **Mentor** - Experienced individuals providing mentorship services  
3. **Admin** - Platform administrators managing operations

## Role Hierarchy

The platform uses a hierarchical role system where roles are assigned numeric priority levels:

```
┌──────────────┐
│   Admin (3)  │  ← Highest authority
├──────────────┤
│  Mentor (2)  │  ← Service providers
├──────────────┤
│  Mentee (1)  │  ← Service consumers
└──────────────┘
```

**Priority Levels:**
- **Mentee**: Level 1 (Base user)
- **Mentor**: Level 2 (Service provider)
- **Admin**: Level 3 (Full platform access)

Higher-level roles can access resources typically restricted to lower-level roles when necessary (e.g., Admin can access Mentor and Mentee features for support purposes).

---

## User Roles Defined

### 1. Mentee (Student)

**Description**: Mentees are students who seek guidance and mentorship services from experienced mentors for their study abroad journey.

#### Core Responsibilities
- Search and discover mentors based on specialization, location, and services
- Book mentorship services and complete payments
- Communicate with mentors through the integrated chat system
- Attend scheduled mentoring sessions
- Provide feedback and ratings for services received
- Manage their profile and preferences

#### Access Level
- **Panel Access**: Mentee Panel only
- **Profile Management**: Full access to own profile
- **Service Discovery**: Read-only access to all approved mentor services
- **Booking Management**: Create and manage own bookings
- **Payment**: Initiate and complete payments
- **Chat**: Access conversations with booked mentors
- **Reviews**: Submit reviews for completed bookings

#### Registration & Authentication
- Can register via email/password or Google OAuth
- Email verification required for local registration
- Password reset functionality available
- Role selected during registration process

#### Approval Process
- **Auto-approved** upon email verification
- No administrative approval required
- Immediate access to platform features

---

### 2. Mentor (Service Provider)

**Description**: Mentors are individuals with international study experience who provide guidance and mentorship services to students.

#### Core Responsibilities
- Create and maintain comprehensive mentor profile
- Design and manage mentorship service offerings
- Set pricing and package tiers (Basic, Standard, Premium)
- Accept and manage booking requests
- Conduct mentorship sessions
- Communicate with mentees through integrated chat
- Track revenue and request payouts
- Build reputation through ratings and badges

#### Access Level
- **Panel Access**: Mentor Panel only
- **Profile Management**: Create and manage mentor profile including:
  - Professional summary and bio
  - Education history
  - Work experience
  - Skills and expertise
  - Achievements and certifications
  - Availability settings
- **Service Management**: Full CRUD access to own services
- **Booking Management**: View and manage bookings for own services
- **Revenue Tracking**: Access to earnings dashboard and analytics
- **Payout Requests**: Submit withdrawal requests
- **Chat**: Access conversations with booked mentees
- **Badge System**: Earn and display achievement badges
- **Google Meet Integration**: Create and manage meeting links

#### Registration & Authentication
- Can register via email/password
- Must complete comprehensive profile with credentials
- Email verification required
- Additional login status checks for paused accounts

#### Approval Process
- **Admin approval required** for new mentor accounts
- Approval statuses:
  - **Pending**: Default status after registration, awaiting admin review
  - **Approved**: Can access full mentor panel features
  - **Rejected**: Access denied, must contact support
- Services require separate admin approval before going live
- Admins can pause mentor login access temporarily

#### Special Restrictions
**Login Pause Feature**: Admins can temporarily pause a mentor's login access without deactivating their account. When paused:
- Current authentication tokens are blacklisted
- Mentor is logged out immediately
- Cannot log in until pause is lifted
- Used for temporary suspensions or compliance issues

---

### 3. Admin (Platform Administrator)

**Description**: Admins are platform operators responsible for managing the entire ecosystem, ensuring quality, and maintaining platform integrity.

#### Core Responsibilities
- Review and approve/reject mentor applications
- Review and approve/reject service listings
- Manage user accounts (activate/deactivate)
- Monitor platform analytics and metrics
- Process mentor payout requests
- Moderate reviews and feedback
- Resolve disputes between users
- Manage platform settings and notifications
- Oversee payment transactions

#### Access Level
- **Panel Access**: Admin Panel with full platform oversight
- **User Management**: Full access to all user accounts
  - View all mentees and mentors
  - Activate/deactivate accounts
  - View detailed user statistics
  - Search and filter users
- **Mentor Management**: 
  - Review mentor applications
  - Approve/reject mentor profiles
  - Toggle login pause for mentors
  - View mentor approval status
- **Service Management**:
  - Review and approve service listings
  - View all services across platform
  - Moderate service content
- **Booking Oversight**:
  - View all bookings across platform
  - Access booking details and history
- **Payment Management**:
  - Monitor all transactions
  - Process payout requests
  - View payment analytics
- **Review Management**:
  - Access all reviews
  - Moderate inappropriate content
- **Analytics Dashboard**:
  - Platform-wide statistics
  - Revenue metrics
  - User engagement data
  - Service performance metrics
- **Notification System**:
  - Send platform-wide announcements
  - Manage notification templates
- **Settings Management**:
  - Configure platform settings
  - Manage system parameters

#### Registration & Authentication
- Admin accounts are **not publicly registrable**
- Created through direct database insertion or existing admin
- Login via email/password only (no OAuth)
- No email verification required (pre-verified)

#### Approval Process
- **Pre-approved** (no approval workflow)
- Immediate full access upon creation

---

## Role-Based Access Control Implementation

### Authentication System

The platform uses **JWT (JSON Web Token)** based authentication with the following flow:

1. **User Login**: Credentials verified, JWT token generated
2. **Token Storage**: Token stored client-side (localStorage)
3. **Request Authentication**: Token sent in Authorization header
4. **Token Verification**: Middleware verifies token validity
5. **User Context**: Decoded token provides user ID and role
6. **Route Authorization**: Role checked against required permissions

### Authentication Middleware

**File**: `src/shared/middlewares/auth.js`

**Functionality**:
- Extracts JWT token from `Authorization: Bearer <token>` header
- Checks if token is blacklisted (for logged-out users)
- Verifies token signature and expiration
- Decodes token to extract user information
- Attaches user data to request object (`req.user`)
- Returns 401 Unauthorized for invalid/missing tokens

**Applied To**: All protected routes across all panels

### Authorization Middleware

**File**: `src/shared/middlewares/roleAuth.js`

**Core Function**: `authorize(...allowedRoles)`

**Functionality**:
- Accepts one or more role names as parameters
- Checks if authenticated user's role matches allowed roles
- Returns 403 Forbidden if role doesn't match
- Allows request to proceed if authorized

**Pre-configured Middleware**:
```javascript
authorizeAdmin    // Only Admin
authorizeMentor   // Mentor or Admin
authorizeMentee   // Mentee or Admin
```

**Usage Pattern**: Applied after authentication middleware on protected routes

### Mentor-Specific Middleware

**File**: `src/MentorPanel/middlewares/mentorAuth.js`

**Function**: `checkMentorLoginStatus`

**Functionality**:
- Verifies user has Mentor role
- Checks if mentor account is active
- Validates mentor approval status (must be "approved")
- Checks if mentor login is paused by admin
- Blacklists current token if login is paused
- Returns appropriate error messages for each case

**Applied To**: All protected Mentor Panel routes

---

## Permission Matrix

### Feature-Level Permissions

| Feature | Mentee | Mentor | Admin |
|---------|--------|--------|-------|
| **Authentication & Profile** |
| Register Account | ✓ | ✓ | ✗ |
| Login/Logout | ✓ | ✓ | ✓ |
| View Own Profile | ✓ | ✓ | ✓ |
| Edit Own Profile | ✓ | ✓ | ✓ |
| Password Reset | ✓ | ✓ | ✓ |
| Email Verification | ✓ | ✓ | ✗ |
| Google OAuth Login | ✓ | ✗ | ✗ |
| **Mentor Profiles** |
| View Mentor Profiles | ✓ | ✓ | ✓ |
| Create Mentor Profile | ✗ | ✓ | ✗ |
| Edit Own Mentor Profile | ✗ | ✓ | ✗ |
| Add Education/Experience | ✗ | ✓ | ✗ |
| Manage Availability | ✗ | ✓ | ✗ |
| View All Mentor Profiles | ✗ | ✗ | ✓ |
| Approve Mentor Profiles | ✗ | ✗ | ✓ |
| Pause Mentor Login | ✗ | ✗ | ✓ |
| **Services** |
| Browse Services | ✓ | ✓ | ✓ |
| Search/Filter Services | ✓ | ✓ | ✓ |
| View Service Details | ✓ | ✓ | ✓ |
| Create Services | ✗ | ✓ | ✗ |
| Edit Own Services | ✗ | ✓ | ✗ |
| Delete Own Services | ✗ | ✓ | ✗ |
| Approve Services | ✗ | ✗ | ✓ |
| View All Services | ✗ | ✗ | ✓ |
| **Bookings** |
| Create Booking | ✓ | ✗ | ✗ |
| View Own Bookings | ✓ | ✓ | ✗ |
| Manage Received Bookings | ✗ | ✓ | ✗ |
| Cancel Booking | ✓ | ✓ | ✗ |
| Mark Booking Complete | ✗ | ✓ | ✗ |
| View All Bookings | ✗ | ✗ | ✓ |
| **Payments** |
| Make Payments | ✓ | ✗ | ✗ |
| View Payment History | ✓ | ✗ | ✗ |
| Track Revenue | ✗ | ✓ | ✓ |
| Request Payout | ✗ | ✓ | ✗ |
| Process Payouts | ✗ | ✗ | ✓ |
| View All Transactions | ✗ | ✗ | ✓ |
| **Communication** |
| Chat with Booked Mentor | ✓ | ✗ | ✗ |
| Chat with Booked Mentee | ✗ | ✓ | ✗ |
| Upload Files in Chat | ✓ | ✓ | ✗ |
| Create Google Meet Links | ✗ | ✓ | ✗ |
| **Reviews & Feedback** |
| Submit Service Review | ✓ | ✗ | ✗ |
| View Own Reviews | ✗ | ✓ | ✗ |
| Moderate Reviews | ✗ | ✗ | ✓ |
| View All Reviews | ✗ | ✗ | ✓ |
| **Dashboard & Analytics** |
| View Mentee Dashboard | ✓ | ✗ | ✗ |
| View Mentor Dashboard | ✗ | ✓ | ✗ |
| View Revenue Analytics | ✗ | ✓ | ✗ |
| Earn/View Badges | ✗ | ✓ | ✗ |
| View Admin Dashboard | ✗ | ✗ | ✓ |
| View Platform Analytics | ✗ | ✗ | ✓ |
| **User Management** |
| View All Users | ✗ | ✗ | ✓ |
| Activate/Deactivate Users | ✗ | ✗ | ✓ |
| View User Statistics | ✗ | ✗ | ✓ |
| **Notifications** |
| Receive Notifications | ✓ | ✓ | ✓ |
| Send Platform Notifications | ✗ | ✗ | ✓ |
| **Settings** |
| Manage Own Settings | ✓ | ✓ | ✓ |
| Manage Platform Settings | ✗ | ✗ | ✓ |

---

## API Route Protection Examples

### Mentee Panel Routes

**Protected with**: `authenticate` + `authorizeMentee`

```
GET    /api/mentee/profile               // View own profile
PUT    /api/mentee/profile               // Update own profile
GET    /api/mentee/bookings              // View own bookings
POST   /api/mentee/bookings              // Create new booking
GET    /api/mentee/mentors               // Browse mentors
POST   /api/mentee/feedback              // Submit feedback
```

### Mentor Panel Routes

**Protected with**: `authenticate` + `authorizeMentor` + `checkMentorLoginStatus`

```
GET    /api/mentor/profile               // View mentor profile
PUT    /api/mentor/profile               // Update mentor profile
POST   /api/mentor/profile/education     // Add education
GET    /api/mentor/services              // View own services
POST   /api/mentor/services              // Create new service
GET    /api/mentor/bookings              // View received bookings
GET    /api/mentor/revenue               // View revenue analytics
POST   /api/mentor/wallet/payout         // Request payout
GET    /api/mentor/badges                // View earned badges
```

### Admin Panel Routes

**Protected with**: `authenticate` + `authorizeAdmin`

```
GET    /api/admin/users                  // View all users
PATCH  /api/admin/users/:id/status       // Update user status
GET    /api/admin/mentors                // View all mentors
PATCH  /api/admin/mentors/:id/approval   // Approve/reject mentor
PATCH  /api/admin/mentors/:id/pause      // Pause mentor login
GET    /api/admin/services               // View all services
PATCH  /api/admin/services/:id/approve   // Approve service
GET    /api/admin/dashboard              // View analytics
GET    /api/admin/payouts                // View payout requests
PATCH  /api/admin/payouts/:id            // Process payout
GET    /api/admin/reviews                // View all reviews
```

---

## Security Mechanisms

### 1. Token-Based Authentication
- **Technology**: JWT (JSON Web Tokens)
- **Storage**: Client-side localStorage
- **Transmission**: Authorization header (`Bearer <token>`)
- **Expiration**: Configurable token lifetime
- **Blacklisting**: Tokens added to blacklist on logout

### 2. Password Security
- **Hashing**: bcrypt with salt rounds
- **Minimum Length**: 6 characters
- **Validation**: Server-side validation on registration/reset
- **Reset Flow**: OTP-based password reset via email

### 3. Input Validation
- **Library**: express-validator
- **Applied To**: All user inputs (registration, login, profile updates)
- **Validates**: Email format, password strength, required fields
- **Sanitization**: Prevents XSS and injection attacks

### 4. Session Management
- **Active Tokens**: Tracked in database
- **Logout**: Token blacklisted immediately
- **Forced Logout**: Admin can pause mentor login (auto-blacklists tokens)
- **Concurrent Sessions**: Allowed but individually trackable

### 5. Resource Ownership Validation
- **Profile Access**: Users can only modify their own profiles
- **Booking Access**: Users can only view their own bookings
- **Service Access**: Mentors can only edit their own services
- **Admin Override**: Admins can access resources for support purposes

### 6. Account Status Checks
- **isActive**: Account must be active to log in
- **isVerified**: Email verification required for mentees
- **mentorApprovalStatus**: Mentors must be "approved" to access panel
- **isLoginPaused**: Mentor login can be paused by admin

---

## User Lifecycle & Status Management

### Mentee Lifecycle

```
Registration → Email Verification → Active User → [Optional: Deactivation]
```

**Statuses**:
- `isVerified: false` → Cannot make bookings until verified
- `isActive: true` → Full platform access
- `isActive: false` → Account deactivated (by admin or self)

### Mentor Lifecycle

```
Registration → Profile Setup → Admin Review → Approved → Active Mentor → [Optional: Pause/Deactivation]
```

**Statuses**:
- `mentorApprovalStatus: pending` → Cannot access mentor panel
- `mentorApprovalStatus: approved` → Full mentor panel access
- `mentorApprovalStatus: rejected` → Access denied
- `isLoginPaused: true` → Temporarily locked out
- `isActive: false` → Account deactivated

### Admin Lifecycle

```
Manual Creation → Immediate Active Status
```

**Statuses**:
- `isActive: true` → Full admin panel access (default)
- No approval workflow required

---

## Common Access Control Patterns

### Pattern 1: Self-Resource Access
**Use Case**: User accessing own profile/bookings

```javascript
// Controller checks
if (req.user.id !== resource.userId) {
  return sendErrorResponse(res, 'Unauthorized', 403);
}
```

### Pattern 2: Role-Based Access
**Use Case**: Admin accessing all resources

```javascript
// Middleware checks
if (!['mentor', 'admin'].includes(req.user.role)) {
  return sendErrorResponse(res, 'Forbidden', 403);
}
```

### Pattern 3: Mentor Status Validation
**Use Case**: Mentor accessing protected features

```javascript
// Additional checks for mentors
if (user.mentorApprovalStatus !== 'approved') {
  return sendErrorResponse(res, 'Pending approval', 403);
}
if (user.isLoginPaused) {
  // Blacklist token and logout
  return sendErrorResponse(res, 'Login paused', 403);
}
```

### Pattern 4: Admin Override
**Use Case**: Admin performing actions on behalf of users

```javascript
// Many admin routes allow accessing any user's resources
const isOwner = req.user.id === resource.userId;
const isAdmin = req.user.role === 'admin';

if (!isOwner && !isAdmin) {
  return sendErrorResponse(res, 'Unauthorized', 403);
}
```

---

## Error Messages & HTTP Status Codes

### Authentication Errors
- **401 Unauthorized**: Missing or invalid token, token blacklisted
- **401 Unauthorized**: Email not verified (for required flows)
- **401 Unauthorized**: Account deactivated

### Authorization Errors
- **403 Forbidden**: User role not authorized for resource
- **403 Forbidden**: Mentor approval pending
- **403 Forbidden**: Mentor approval rejected
- **403 Forbidden**: Mentor login paused
- **403 Forbidden**: Not resource owner (and not admin)

### Validation Errors
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation failed

---

## Best Practices for Developers

### 1. Always Authenticate First
```javascript
router.use(authenticate); // Apply to all routes
```

### 2. Use Pre-configured Authorization
```javascript
router.get('/admin-only', authenticate, authorizeAdmin, handler);
router.get('/mentor-action', authenticate, authorizeMentor, handler);
```

### 3. Add Mentor Status Check
```javascript
router.use(authenticate);
router.use(authorizeMentor);
router.use(checkMentorLoginStatus); // For mentor routes only
```

### 4. Validate Resource Ownership
```javascript
const resource = await Resource.findById(id);
if (req.user.id !== resource.userId && req.user.role !== 'admin') {
  return sendErrorResponse(res, 'Unauthorized', 403);
}
```

### 5. Use Consistent Error Messages
```javascript
const { ERROR_MESSAGES } = require('../utils/constants/messages');

return sendErrorResponse(res, ERROR_MESSAGES.UNAUTHORIZED, 401);
return sendErrorResponse(res, ERROR_MESSAGES.FORBIDDEN, 403);
```

---

## Frequently Asked Questions

### Q: Can a user have multiple roles?
**A**: No, each user account has exactly one role (mentee, mentor, or admin). If someone wants to be both a mentor and mentee, they must create separate accounts.

### Q: Can an admin access mentor and mentee features?
**A**: Yes, admins have elevated permissions. The `authorizeMentor` and `authorizeMentee` middleware allow admin access. This enables admins to assist users and troubleshoot issues.

### Q: What happens when a mentor's login is paused?
**A**: When an admin pauses a mentor's login:
1. Their current authentication token is blacklisted
2. They are immediately logged out
3. They cannot log in again until the pause is lifted
4. Their profile and services remain visible to mentees

### Q: How does the approval process work for mentors?
**A**: New mentors register with `mentorApprovalStatus: pending`. They cannot access the mentor panel until an admin reviews and approves their profile. Once approved, they have full access. If rejected, they must contact support.

### Q: Can mentees leave reviews for any service?
**A**: No, mentees can only review services they have booked and completed. The system validates that a completed booking exists before allowing review submission.

### Q: How are payments secured?
**A**: The platform uses Stripe for payment processing. No credit card data is stored on our servers. All payment flows use Stripe's PCI-compliant API, and webhooks verify payment completion.

### Q: What's the difference between deactivating and pausing a mentor?
**A**: 
- **Deactivation** (`isActive: false`): Complete account shutdown for any user type
- **Login Pause** (`isLoginPaused: true`): Temporary login restriction specific to mentors, used for compliance or temporary suspensions

---

## Related Documentation

- **System Architecture**: See `SystemArchitecture.md` for technical implementation details
- **Technology Stack**: See `TechnologyStack.md` for authentication libraries and tools
- **Features and Modules**: See `FeaturesAndModules.md` for feature-specific access patterns
- **API Documentation**: See `backend.md` for complete API endpoint specifications

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Prepared By**: Scholarslee Development Team  
**Classification**: Internal Documentation
