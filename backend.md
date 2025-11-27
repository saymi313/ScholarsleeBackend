# Backend Implementation Plan for Scholarslee

## Project Overview
Scholarslee is a comprehensive mentorship platform connecting students with international mentors for study abroad guidance. The platform includes three main panels: **Mentees Panel**, **Mentor Panel**, and **Admin Panel**.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Real-time**: Socket.io for chat functionality
- **File Upload**: Multer for file handling
- **Payment**: Stripe integration
- **Email**: Nodemailer for notifications

## Database Schema Design

### Core Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['mentee', 'mentor', 'admin']),
  isActive: Boolean,
  isVerified: Boolean,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String,
    country: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Mentor Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'Users'),
  title: String,
  bio: String,
  specializations: [String],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: [{
    company: String,
    position: String,
    duration: String
  }],
  achievements: [String],
  rating: Number,
  totalReviews: Number,
  isVerified: Boolean,
  verificationDocuments: [String],
  availability: {
    timezone: String,
    workingHours: String
  }
}
```

#### 3. Mentee Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'Users'),
  educationLevel: String,
  studyGoals: [String],
  targetCountries: [String],
  budget: Number,
  preferences: {
    mentorGender: String,
    communicationStyle: String
  }
}
```

#### 4. Services Collection
```javascript
{
  _id: ObjectId,
  mentorId: ObjectId (ref: 'MentorProfiles'),
  title: String,
  description: String,
  category: String,
  packages: [{
    name: String,
    price: Number,
    duration: String,
    features: [String],
    calls: Number
  }],
  images: [String],
  rating: Number,
  totalReviews: Number,
  status: String (enum: ['draft', 'pending', 'approved', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Chats Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId] (ref: 'Users'),
  lastMessage: {
    content: String,
    senderId: ObjectId,
    timestamp: Date
  },
  isActive: Boolean,
  createdAt: Date
}
```

#### 6. Messages Collection
```javascript
{
  _id: ObjectId,
  chatId: ObjectId (ref: 'Chats'),
  senderId: ObjectId (ref: 'Users'),
  content: String,
  messageType: String (enum: ['text', 'image', 'file', 'voice']),
  fileUrl: String,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

#### 7. Bookings Collection
```javascript
{
  _id: ObjectId,
  menteeId: ObjectId (ref: 'Users'),
  mentorId: ObjectId (ref: 'Users'),
  serviceId: ObjectId (ref: 'Services'),
  packageId: String,
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  scheduledDate: Date,
  duration: Number,
  totalAmount: Number,
  paymentStatus: String,
  createdAt: Date
}
```

#### 8. Reviews Collection
```javascript
{
  _id: ObjectId,
  menteeId: ObjectId (ref: 'Users'),
  mentorId: ObjectId (ref: 'Users'),
  serviceId: ObjectId (ref: 'Services'),
  rating: Number,
  comment: String,
  isVerified: Boolean,
  createdAt: Date
}
```

## Sequential Implementation Plan

### Phase 1: Foundation & Authentication (Week 1-2)

#### 1.1 Project Setup
- [x] Initialize Node.js project with Express.js
- [x] Setup MongoDB connection with Mongoose
- [x] Configure environment variables
- [x] Setup basic project structure
- [x] Install core dependencies (express, mongoose, bcrypt, jwt, cors, helmet)
- [x] mongodb string: mongodb+srv://scholarslee:avenuescholars1234@scholarslee.zrwttoj.mongodb.net/?retryWrites=true&w=majority&appName=Scholarslee

#### 1.2 Authentication System
- [x] User registration (mentee/mentor role selection)
- [x] User login with JWT tokens
- [x] Password hashing with bcrypt
- [ ] Email verification system (Deferred to later phase)
- [ ] Password reset functionality (Deferred to later phase)
- [x] Role-based middleware for route protection

**Priority**: HIGH - Foundation for all other features

### Phase 2: User Management & Profiles (Week 3-4)

#### 2.1 User Profile Management
- [x] Complete user profile creation
- [x] Profile image upload with Multer
- [x] Profile update endpoints
- [x] User profile retrieval

#### 2.2 Mentor Profile System
- [ ] Mentor profile creation with education/experience
- [ ] Mentor verification system
- [ ] Mentor profile update
- [ ] Mentor discovery/search functionality

#### 2.3 Mentee Profile System
- [x] Mentee profile creation
- [x] Study goals and preferences
- [x] Mentee profile management

**Priority**: HIGH - Core user functionality

### Phase 3: Services & Marketplace (Week 5-6)

#### 3.1 Service Management
- [x] Service creation by mentors
- [x] Service packages (Basic, Standard, Premium)
- [x] Service image upload
- [x] Service approval workflow
- [x] Service search and filtering

#### 3.2 Service Discovery
- [x] Public service listing
- [x] Service search by category/location
- [x] Service details with mentor information
- [x] Service reviews and ratings

**Priority**: HIGH - Core business functionality

### Phase 4: Communication System (Week 7-8)

#### 4.1 Chat System Foundation
- [x] Socket.io integration
- [x] Chat room creation
- [x] Real-time messaging
- [x] Message persistence
- [ ] Online/offline status

#### 4.2 Advanced Chat Features
- [ ] File sharing in chats
- [ ] Image sharing
- [x] Message status (sent, delivered, read)
- [x] Chat history
- [x] Chat privacy controls

**Priority**: HIGH - Core communication feature

### Phase 5: Booking & Meeting System (Week 9-10)

#### 5.1 Booking System
- [ ] Service booking creation
- [ ] Booking confirmation
- [ ] Booking status management
- [ ] Booking history

#### 5.2 Meeting Management
- [ ] Meeting scheduling
- [ ] Calendar integration
- [ ] Meeting reminders
- [ ] Meeting completion tracking

**Priority**: MEDIUM - Business process

### Phase 6: Payment Integration (Week 11-12)

#### 6.1 Payment System
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Payment confirmation
- [ ] Refund handling
- [ ] Payment history

#### 6.2 Revenue Management
- [ ] Mentor earnings tracking
- [ ] Platform commission calculation
- [ ] Payout system for mentors

**Priority**: HIGH - Revenue generation

### Phase 7: Review & Rating System (Week 13)

#### 7.1 Review System
- [ ] Review creation after service completion
- [ ] Rating calculation
- [ ] Review moderation
- [ ] Review display on profiles

**Priority**: MEDIUM - Trust and quality

### Phase 8: Admin Panel Backend (Week 14-15)

#### 8.1 Admin Dashboard
- [ ] User management (view, edit, delete users)
- [ ] Mentor verification system
- [ ] Service approval workflow
- [ ] Payment monitoring
- [ ] Platform analytics

#### 8.2 Admin Features
- [ ] Dispute resolution system
- [ ] Notification management
- [ ] System logs
- [ ] Admin role management

**Priority**: HIGH - Platform management

### Phase 9: Notifications & Communication (Week 16)

#### 9.1 Notification System
- [ ] Email notifications (Nodemailer)
- [x] In-app notifications
- [ ] Push notifications (future mobile app)
- [ ] Notification preferences

**Priority**: MEDIUM - User engagement

### Phase 10: Advanced Features (Week 17-18)

#### 10.1 Analytics & Reporting
- [ ] User analytics
- [ ] Revenue analytics
- [ ] Service performance metrics
- [ ] Admin dashboard data

#### 10.2 Security & Performance
- [ ] Rate limiting
- [ ] Input validation
- [ ] Security headers
- [ ] Performance optimization
- [ ] Error handling

**Priority**: MEDIUM - Platform stability

## API Endpoints Structure

### Authentication Routes
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
```

### User Routes
```
GET /api/users/profile
PUT /api/users/profile
POST /api/users/upload-avatar
GET /api/mentors
GET /api/mentors/:id
```

### Service Routes
```
GET /api/services
POST /api/services
GET /api/services/:id
PUT /api/services/:id
DELETE /api/services/:id
POST /api/services/:id/approve
```

### Chat Routes
```
GET /api/chats
POST /api/chats
GET /api/chats/:id/messages
POST /api/chats/:id/messages
```

### Booking Routes
```
POST /api/bookings
GET /api/bookings
PUT /api/bookings/:id
```

### Admin Routes
```
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/mentors
GET /api/admin/services
POST /api/admin/notifications
```

## Implementation Priority Matrix

### Critical Path (Must Implement First)
1. **Authentication System** - Foundation for all features
2. **User Profiles** - Core user data
3. **Services Management** - Core business functionality
4. **Chat System** - Primary communication
5. **Payment Integration** - Revenue generation

### Secondary Priority
1. **Booking System** - Service delivery
2. **Admin Panel** - Platform management
3. **Review System** - Quality assurance

### Nice to Have
1. **Advanced Analytics** - Business insights
2. **Notification System** - User engagement
3. **Performance Optimization** - Scalability

## Development Guidelines

### Code Organization
```
backend/
├── app.js                          # Express app configuration
├── server.js                       # Main server file
└── src/
    ├── AdminPanel/
    │   ├── controllers/
    │   │   ├── dashboardController.js   # Admin dashboard data
    │   │   ├── userManagementController.js # User CRUD operations
    │   │   ├── mentorController.js      # Mentor verification and management
    │   │   ├── serviceController.js     # Service approval workflow
    │   │   ├── paymentController.js     # Payment monitoring
    │   │   ├── disputeController.js     # Dispute resolution
    │   │   ├── notificationController.js # System notifications
    │   │   ├── analyticsController.js   # Platform analytics
    │   │   └── logsController.js        # System logs
    │   │
    │   ├── models/
    │   │   ├── Admin.js            # Admin-specific data
    │   │   ├── User.js             # Base user model
    │   │   ├── MentorProfile.js    # Mentor-specific profile
    │   │   ├── Service.js          # Services offered by mentors
    │   │   ├── Booking.js          # Service bookings
    │   │   ├── Payment.js          # Payment transactions
    │   │   └── Notification.js     # System notifications
    │   │
    │   └── routes/
    │       ├── adminRoutes.js          # Admin dashboard routes
    │       ├── userRoutes.js           # User management routes
    │       ├── mentorRoutes.js         # Mentor management routes
    │       ├── serviceRoutes.js        # Service approval routes
    │       ├── paymentRoutes.js        # Payment monitoring routes
    │       ├── disputeRoutes.js        # Dispute routes
    │       ├── notificationRoutes.js   # Notification routes
    │       ├── analyticsRoutes.js      # Analytics routes
    │       └── logsRoutes.js           # Logs routes
    │
    ├── MentorPanel/
    │   ├── controllers/
    │   │   ├── profileController.js     # Mentor profile management
    │   │   ├── serviceController.js     # Service creation and management
    │   │   ├── bookingController.js     # Booking management
    │   │   ├── chatController.js        # Chat functionality
    │   │   ├── revenueController.js     # Earnings and revenue
    │   │   ├── calendarController.js    # Meeting scheduling
    │   │   └── verificationController.js # Mentor verification
    │   │
    │   ├── models/
    │   │   ├── MentorProfile.js    # Mentor-specific profile
    │   │   ├── Service.js          # Services offered by mentors
    │   │   ├── Booking.js          # Service bookings
    │   │   ├── Chat.js             # Chat rooms
    │   │   ├── Message.js          # Individual messages
    │   │   ├── Review.js           # Reviews and ratings
    │   │   └── Payment.js          # Payment transactions
    │   │
    │   └── routes/
    │       ├── mentorRoutes.js         # Mentor-specific routes
    │       ├── serviceRoutes.js        # Service management routes
    │       ├── bookingRoutes.js        # Booking management routes
    │       ├── chatRoutes.js           # Chat routes
    │       ├── revenueRoutes.js        # Revenue routes
    │       ├── calendarRoutes.js       # Calendar routes
    │       └── verificationRoutes.js   # Verification routes
    │
    ├── MenteesPanel/
    │   ├── controllers/
    │   │   ├── profileController.js     # Mentee profile management
    │   │   ├── searchController.js      # Mentor search and discovery
    │   │   ├── bookingController.js     # Service booking
    │   │   ├── chatController.js        # Chat functionality
    │   │   ├── reviewController.js      # Leave reviews
    │   │   └── paymentController.js     # Payment processing
    │   │
    │   ├── models/
    │   │   ├── MenteeProfile.js    # Mentee-specific profile
    │   │   ├── Service.js          # Services offered by mentors
    │   │   ├── Booking.js          # Service bookings
    │   │   ├── Chat.js             # Chat rooms
    │   │   ├── Message.js          # Individual messages
    │   │   ├── Review.js           # Reviews and ratings
    │   │   └── Payment.js          # Payment transactions
    │   │
    │   └── routes/
    │       ├── menteeRoutes.js         # Mentee-specific routes
    │       ├── searchRoutes.js         # Search and discovery routes
    │       ├── bookingRoutes.js        # Booking routes
    │       ├── chatRoutes.js           # Chat routes
    │       ├── reviewRoutes.js         # Review routes
    │       └── paymentRoutes.js        # Payment routes
    │
    └── shared/
        ├── config/
        │   ├── database.js          # MongoDB connection configuration
        │   ├── jwt.js              # JWT configuration
        │   ├── multer.js           # File upload configuration
        │   ├── nodemailer.js       # Email configuration
        │   ├── stripe.js           # Payment configuration
        │   └── environment.js      # Environment variables validation
        │
        ├── middlewares/
        │   ├── auth.js             # JWT authentication middleware
        │   ├── roleAuth.js         # Role-based authorization
        │   ├── validation.js       # Input validation middleware
        │   ├── rateLimiter.js      # Rate limiting
        │   ├── upload.js           # File upload middleware
        │   └── errorHandler.js     # Global error handling
        │
        └── utils/
            ├── helpers/
            │   ├── dateHelpers.js          # Date manipulation utilities
            │   ├── stringHelpers.js        # String manipulation utilities
            │   ├── fileHelpers.js          # File handling utilities
            │   └── responseHelpers.js      # Standardized API responses
            │
            ├── validators/
            │   ├── emailValidator.js       # Email validation
            │   ├── passwordValidator.js    # Password validation
            │   └── fileValidator.js        # File validation
            │
            ├── constants/
            │   ├── roles.js                # User roles constants
            │   ├── status.js               # Status constants
            │   └── messages.js             # Error/success messages
            │
            └── logger/
                ├── logger.js               # Application logging
                └── errorLogger.js          # Error logging
```

### Security Considerations
- Input validation and sanitization
- Rate limiting on all endpoints
- JWT token expiration and refresh
- File upload security
- SQL injection prevention
- CORS configuration

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Database testing with test database
- Authentication flow testing

## Deployment Considerations

### Environment Setup
- Development environment
- Staging environment
- Production environment
- Environment-specific configurations

### Database Considerations
- MongoDB Atlas for production
- Database indexing for performance
- Data backup strategies
- Connection pooling

### Monitoring & Logging
- Application logging
- Error tracking
- Performance monitoring
- Database monitoring

This implementation plan provides a structured approach to building the Scholarslee backend, ensuring that critical features are implemented first while maintaining code quality and security standards.
