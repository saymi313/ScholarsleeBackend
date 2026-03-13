# Database Design Documentation

## Overview

The Scholarslee platform uses **MongoDB** as its primary database, leveraging Mongoose ODM for schema definition, validation, and data modeling. The database is designed to support a multi-role mentorship platform with real-time chat, booking management, payment processing, and comprehensive user profiles.

**Database Type**: NoSQL (MongoDB)  
**ODM**: Mongoose v8.19.1  
**Design Pattern**: Document-oriented with embedded documents and references

---

## Database Architecture

### Design Principles

1. **Separation of Concerns**: Core user data separated from role-specific profiles
2. **Referential Integrity**: ObjectId references with Mongoose populate for relationships
3. **Embedded Documents**: Used for tightly coupled data (e.g., packages within services, education within profiles)
4. **Indexing Strategy**: Indexes on frequently queried fields for performance
5. **Timestamps**: Automatic `createdAt` and `updatedAt` tracking on all collections
6. **Soft Deletes**: `isActive` flags instead of hard deletes where appropriate

---

## Collections Overview

The database consists of **16 primary collections**:

| Collection | Purpose | Key Relationships |
|------------|---------|-------------------|
| users | Core authentication and user data | Referenced by all role-specific collections |
| mentorprofiles | Mentor-specific profile information | userId → users |
| menteeprofiles | Mentee-specific profile information | userId → users |
| mentorservices | Services offered by mentors | mentorId →users |
| bookings | Service booking records | menteeId, mentorId, serviceId |
| meetings | Scheduled meetings | menteeId, mentorId, bookingId |
| payments | Payment transaction records | bookingId, menteeId, mentorId, serviceId |
| conversations | Chat conversation metadata | participants[] → users |
| messages | Individual chat messages | conversationId, sender, receiver → users |
| notifications | User notifications | userId → users |
| servicefeedbacks | Service reviews and ratings | menteeId, mentorId, serviceId, bookingId |
| payoutrequests | Mentor withdrawal requests | mentorId → users |
| blacklistedtokens | Invalidated JWT tokens | userId → users |
| passwordresetotps | Password reset verification codes | userId → users |
| pendingusers | Unverified user registrations | N/A (temporary storage) |
| contactmessages | Contact form submissions | userId → users (optional) |

---

## Detailed Collection Schemas

### 1. users

**Purpose**: Core authentication and base user information for all user types.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| email | String | Yes | Unique, lowercase, email format | User's email address |
| password | String | Conditional | Min 6 chars, hashed (bcrypt), `select: false` | Password (required for local auth) |
| googleId | String | No | Sparse index | Google OAuth ID |
| authProvider | String | Yes | Enum: ['local', 'google'] | Authentication method |
| googleAccessToken | String | No | `select: false` | Google OAuth access token |
| googleRefreshToken | String | No | `select: false` | Google OAuth refresh token |
| stripeCustomerId | String | No | Sparse index | Stripe customer ID |
| role | String | Conditional | Enum: ['mentee', 'mentor', 'admin', null] | User role |
| isActive | Boolean | Yes | Default: true | Account activation status |
| isVerified | Boolean | Yes | Default: false | Email verification status |
| verificationOTP | String | No | `select: false` | Email verification OTP |
| verificationOTPExpires | Date | No | `select: false` | OTP expiration time |
| mentorApprovalStatus | String | No | Enum: ['pending', 'approved', 'rejected'] | Mentor approval status |
| isLoginPaused | Boolean | Yes | Default: false | Login pause flag (admin control) |
| needsRoleSelection | Boolean | Yes | Default: false | Flag for Google OAuth users |
| profile.firstName | String | Yes | Trimmed | User's first name |
| profile.lastName | String | No | Trimmed, default: '' | User's last name |
| profile.avatar | String | No | URL | Profile picture URL |
| profile.phone | String | No | | Phone number |
| profile.country | String | No | | Country of residence |
| profile.timezone | String | Yes | Default: 'UTC' | User's timezone |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Indexes**:
- `email`: Unique index (enforced by MongoDB)
- `googleId`: Sparse index
- `stripeCustomerId`: Sparse index

**Relationships**:
- **One-to-One** with `mentorprofiles` (via userId)
- **One-to-One** with `menteeprofiles` (via userId)
- **One-to-Many** with `bookings` (as mentee or mentor)
- **One-to-Many** with `mentorservices` (as mentor)
- **One-to-Many** with `payments` (as mentee or mentor)

**Middleware**:
- Pre-save: Password hashing with bcrypt (salt rounds: 10)
- Prevents double-hashing of already hashed passwords

**Methods**:
- `comparePassword(candidatePassword)`: Verify password
- `toJSON()`: Remove password from JSON output

**Virtuals**:
- `fullName`: Computed from firstName + lastName

---

### 2. mentorprofiles

**Purpose**: Extended profile information specific to mentors.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| userId | ObjectId | Yes | Ref: 'User', **Unique** | Reference to users collection |
| title | String | Yes | Max 100 chars | Professional title |
| slug | String | No | Sparse unique | URL-friendly identifier |
| bio | String | Yes | Min 50, max 1000 chars | Professional bio |
| specializations | [String] | No | Max 50 chars each | Areas of expertise |
| education | [educationSchema] | No | Embedded documents | Education history |
| experience | [experienceSchema] | No | Embedded documents | Work experience |
| achievements | [String] | No | Max 1000 chars each | Notable achievements |
| rating | Number | Yes | Min 0, max 5, default: 0 | Average rating |
| totalReviews | Number | Yes | Min 0, default: 0 | Total number of reviews |
| isVerified | Boolean | Yes | Default: false | Admin verification status |
| verificationDocuments | [String] | No | | Document URLs |
| availability.timezone | String | Yes | Default: 'UTC' | Mentor's timezone |
| availability.workingHours | String | Yes | Default: '9 AM - 5 PM' | Working hours |
| availability.daysAvailable | [String] | No | Enum: weekday names | Available days |
| languages | [Object] | No | | Language proficiency |
| socialLinks.linkedin | String | No | URL | LinkedIn profile |
| socialLinks.website | String | No | URL | Personal website |
| socialLinks.twitter | String | No | URL | Twitter handle |
| background | String | No | Max 5000 chars | Detailed background |
| recommendations | [Object] | No | | Testimonials |
| connections | [ObjectId] | No | Ref: 'User' | Connected users |
| services | [ObjectId] | No | Ref: 'MentorService' | Offered services |
| successStory | Object | No | | Personal success story |
| isActive | Boolean | Yes | Default: true | Profile active status |
| badge | String | Yes | Enum badge levels | Gamification badge |
| wallet.availableBalance | Number | Yes | Default: 0 | Available balance |
| wallet.pendingEarnings | Number | Yes | Default: 0 | Pending earnings |
| wallet.totalWithdrawn | Number | Yes | Default: 0 | Total withdrawn |
| payoutMethods | [Object] | No | | Bank account details |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Embedded Schemas**:

**educationSchema**:
- degree (String, required)
- institution (String, required)
- year (Number, required, min: 1900, max: currentYear + 10)
- field (String)
- gpa (Number, min: 0, max: 4.0)

**experienceSchema**:
- company (String, required)
- position (String, required)
- duration (String)
- description (String)
- startDate (Date)
- endDate (Date)
- isCurrent (Boolean, default: false)

**Indexes**:
- Text index: `{ title: 'text', bio: 'text', specializations: 'text' }`
- Compound: `{ isVerified: 1, isActive: 1 }`
- Single: `{ rating: -1 }`
- Compound (optimized): `{ isActive: 1, isVerified: 1, rating: -1, totalReviews: -1 }`

**Relationships**:
- **Belongs to**: users (userId)
- **Has Many**: mentorservices (via userId)

**Middleware**:
- Pre-save: Auto-generate slug from user's first and last name

**Methods**:
- `calculateRating()`: Calculate average rating
- `addSpecialization(spec)`: Add new specialization
- `removeSpecialization(spec)`: Remove specialization

---

### 3. menteeprofiles

**Purpose**: Extended profile information specific to mentees/students.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| userId | ObjectId | Yes | Ref: 'User', **Unique** | Reference to users collection |
| educationLevel | String | Yes | Enum: education levels | Current education level |
| currentInstitution | String | No | | Current school/university |
| studyGoals | [String] | No | Max 100 chars each | Study objectives |
| targetCountries | [String] | No | Max 50 chars each | Target study countries |
| budget | Number | Yes | Min 0, default: 0 | Study abroad budget |
| budgetCurrency | String | Yes | Enum currencies, default: 'USD' | Budget currency |
| preferences.mentorGender | String | Yes | Enum, default: 'Any' | Mentor gender preference |
| preferences.communicationStyle | String | Yes | Enum, default: 'Mixed' | Communication preference |
| preferences.preferredLanguage | String | Yes | Default: 'English' | Language preference |
| preferences.timezone | String | Yes | Default: 'UTC' | Timezone preference |
| academicInterests | [String] | No | Max 50 chars each | Academic interests |
| careerGoals | [String] | No | Max 100 chars each | Career aspirations |
| timeline | String | Yes | Enum timelines, default: 'Flexible' | Application timeline |
| previousExperience | String | No | Max 500 chars | Previous experience |
| challenges | [String] | No | Max 100 chars each | Challenges faced |
| isActive | Boolean | Yes | Default: true | Profile active status |
| profileCompleteness | Number | Yes | Min 0, max 100, default: 0 | Completion percentage |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Indexes**:
- Text index: `{ studyGoals: 'text', academicInterests: 'text', careerGoals: 'text' }`
- Single: `{ targetCountries: 1 }`
- Single: `{ educationLevel: 1 }`
- Single: `{ isActive: 1 }`

**Relationships**:
- **Belongs to**: users (userId)

**Middleware**:
- Pre-save: Auto-calculate profile completeness

**Methods**:
- `calculateCompleteness()`: Calculate profile completion percentage
- `addStudyGoal(goal)`: Add study goal
- `removeStudyGoal(goal)`: Remove study goal
- `addTargetCountry(country)`: Add target country
- `removeTargetCountry(country)`: Remove target country

---

### 4. mentorservices

**Purpose**: Services and packages offered by mentors.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| mentorId | ObjectId | Yes | Ref: 'User' | Service creator |
| title | String | Yes | Max 100 chars | Service title |
| slug | String | No | Sparse index | URL-friendly identifier |
| description | String | Yes | Max 1000 chars | Service description |
| category | String | Yes | Enum: 10 categories | Service category |
| packages | [packageSchema] | Yes | Min 1 package | Service packages |
| images | [String] | No | URLs | Service images |
| rating | Number | Yes | Min 0, max 5, default: 0 | Average rating |
| totalReviews | Number | Yes | Min 0, default: 0 | Total reviews |
| status | String | Yes | Enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' | Approval status |
| isActive | Boolean | Yes | Default: true | Service active status |
| tags | [String] | No | | Search tags |
| location.country | String | No | | Service location country |
| location.city | String | No | | Service location city |
| availability.timezone | String | No | | Service timezone |
| availability.workingHours | String | No | | Working hours |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Embedded Schema - packageSchema**:
- name (String, required): Package name
- price (Number, required, min: 10): Package price in USD
- duration (String, required): Duration description
- features ([String]): Package features
- calls (Number, required, min: 0): Number of calls included

**Indexes**:
- Single: `{ mentorId: 1 }`
- Single: `{ category: 1 }`
- Single: `{ status: 1 }`
- Single: `{ rating: -1 }`
- Single: `{ createdAt: -1 }`
- Text: `{ title: 'text', description: 'text', tags: 'text' }`

**Relationships**:
- **Belongs to**: users (mentorId)
- **Belongs to**: mentorprofiles (via mentorId)
- **Has Many**: bookings
- **Has Many**: payments
- **Has Many**: servicefeedbacks

**Middleware**:
- Pre-save: Validate at least one package exists
- Pre-save: Ensure package names are unique within service
- Pre-save: Auto-generate slug from title

**Methods**:
- `updateRating(newRating)`: Update rating with new review
- `recalculateRating()`: Recalculate from all feedbacks

**Static Methods**:
- `getByCategory(category)`: Get approved services by category
- `searchServices(query, filters)`: Search with text index

**Virtuals**:
- `averageRating`: Computed average rating
- `mentorProfile`: Virtual populate to MentorProfile

---

### 5. bookings

**Purpose**: Track service booking lifecycle from creation to completion.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| menteeId | ObjectId | Yes | Ref: 'User' | Booking creator |
| mentorId | ObjectId | Yes | Ref: 'User' | Service provider |
| serviceId | ObjectId | Yes | Ref: 'MentorService' | Booked service |
| packageId | String | Yes | | Selected package ID |
| status | String | Yes | Enum: 6 statuses, default: 'pending' | Booking status |
| scheduledDate | Date | Yes | Must be future | Scheduled date/time |
| duration | Number | Yes | In minutes, min: 1 | Session duration |
| totalAmount | Number | Yes | Min: 0 | Total price |
| paymentStatus | String | Yes | Enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' | Payment status |
| paymentId | String | No | | Payment transaction reference |
| meetingLink | String | No | URL | Video meeting link |
| meetingId | String | No | | Meeting reference ID |
| notes | String | No | | General notes |
| menteeNotes | String | No | | Mentee's notes |
| mentorNotes | String | No | | Mentor's notes |
| isActive | Boolean | Yes | Default: true | Active status |
| completedAt | Date | No | | Completion timestamp |
| cancelledAt | Date | No | | Cancellation timestamp |
| cancellationReason | String | No | | Cancellation reason |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Indexes**:
- Single: `{ menteeId: 1 }`
- Single: `{ mentorId: 1 }`
- Single: `{ serviceId: 1 }`
- Single: `{ status: 1 }`
- Single: `{ scheduledDate: 1 }`
- Single: `{ createdAt: -1 }`

**Relationships**:
- **Belongs to**: users (menteeId, mentorId)
- **Belongs to**: mentorservices (serviceId)
- **Has Many**: meetings
- **Has One**: payments

**Middleware**:
- Pre-save validation:
  - Scheduled date must be in future
  - Duration must be positive
  - Total amount must be positive

**Methods**:
- `updateStatus(newStatus, notes)`: Update booking status with timestamps

**Static Methods**:
- `getByUser(userId, role)`: Get bookings for user by role
- `getUpcoming(userId, role)`: Get upcoming bookings

**Virtuals**:
- `durationHours`: Duration converted to hours
- `formattedDate`: Formatted scheduled date

---

### 6. meetings

**Purpose**: Individual meeting sessions associated with bookings.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| bookingId | ObjectId | Yes | Ref: 'Booking' |
| menteeId | ObjectId | Yes | Ref: 'User' |
| mentorId | ObjectId | Yes | Ref: 'User' |
| title | String | Yes | Meeting title |
| agenda | String | No | Meeting agenda |
| scheduledDate | Date | Yes | Meeting date/time |
| duration | Number | Yes | Duration in minutes |
| meetingLink | String | No | Google Meet link |
| meetingPassword | String | No | Meeting password |
| status | String | Yes | Enum: ['scheduled', 'in-progress', 'completed', 'cancelled'] |
| participants | [Object] | No | Participant tracking |
| startedAt | Date | No | Actual start time |
| endedAt | Date | No | Actual end time |
| feedback | Object | No | Post-meeting feedback |
| isActive | Boolean | Yes | Default: true |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ bookingId: 1 }`
- Single: `{ menteeId: 1 }`
- Single: `{ mentorId: 1 }`
- Single: `{ scheduledDate: 1 }`
- Single: `{ status: 1 }`

**Relationships**:
- **Belongs to**: bookings (bookingId)
- **Belongs to**: users (menteeId, mentorId)

---

### 7. payments

**Purpose**: Track payment transactions via Stripe.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| bookingId | ObjectId | No | Ref: 'Booking' | Associated booking |
| menteeId | ObjectId | Yes | Ref: 'User' | Payer |
| mentorId | ObjectId | Yes | Ref: 'User' | Recipient |
| serviceId | ObjectId | Yes | Ref: 'MentorService' | Service paid for |
| serviceTitle | String | No | | Service name (denormalized) |
| packageId | String | Yes | | Package identifier |
| packageName | String | No | | Package name (denormalized) |
| amount | Number | Yes | Min: 0 | Total amount |
| currency | String | Yes | Uppercase, default: 'USD' | Currency code |
| platformFee | Number | Yes | Min: 0 | Platform commission |
| mentorAmount | Number | Yes | Min: 0 | Amount for mentor |
| stripeSessionId | String | Yes | **Unique** | Stripe checkout session ID |
| stripePaymentIntentId | String | No | | Stripe payment intent ID |
| stripeChargeId | String | No | | Stripe charge ID |
| status | String | Yes | Enum: 6 statuses, default: 'pending' | Payment status |
| refundId | String | No | | Stripe refund ID |
| refundAmount | Number | Yes | Min: 0, default: 0 | Refunded amount |
| refundReason | String | No | | Refund reason |
| metadata | Map | No | String values | Additional data |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Indexes**:
- Single: `{ bookingId: 1 }`
- Single: `{ menteeId: 1 }`
- Single: `{ mentorId: 1 }`
- Single: `{ serviceId: 1 }`
- Unique: `{ stripeSessionId: 1 }` (auto-created by unique constraint)
- Single: `{ status: 1 }`

**Relationships**:
- **Belongs to**: bookings (optional)
- **Belongs to**: users (menteeId, mentorId)
- **Belongs to**: mentorservices (serviceId)

---

### 8. conversations

**Purpose**: Metadata for chat conversations between two users.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| conversationId | String | Yes | Format: "userId1_userId2" (sorted) |
| participants | [ObjectId] | Yes | Ref: 'User' (array of 2) |
| lastMessage | Object | No | Last message preview |
| unreadCount | [Object] | Yes | Per-user unread counts |
| isPinned | [ObjectId] | No | Users who pinned conversation |
| isMuted | [ObjectId] | No | Users who muted conversation |
| isArchived | [ObjectId] | No | Users who archived conversation |
| isBlocked | Boolean | Yes | Default: false |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ conversationId: 1 }`
- Single: `{ participants: 1 }`

**Relationships**:
- **Has Many**: messages
- **Belongs to**: users (participants array)

---

### 9. messages

**Purpose**: Individual chat messages within conversations.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| _id | ObjectId | Auto | Primary Key | |
| conversationId | String | Yes | Indexed | Conversation identifier |
| sender | ObjectId | Yes | Ref: 'User' | Message sender |
| receiver | ObjectId | Yes | Ref: 'User' | Message receiver |
| content | String | Yes | Trimmed | Message text/URL |
| messageType | String | Yes | Enum: ['text', 'image', 'file', 'voice', 'video'], default: 'text' | Message type |
| fileUrl | String | No | | File URL for media messages |
| fileName | String | No | | Original filename |
| fileSize | Number | No | | File size in bytes |
| isRead | Boolean | Yes | Default: false | Read status |
| readAt | Date | No | | Read timestamp |
| isDelivered | Boolean | Yes | Default: false | Delivery status |
| deliveredAt | Date | No | | Delivery timestamp |
| isDeleted | Boolean | Yes | Default: false | Soft delete flag |
| deletedBy | [ObjectId] | No | Ref: 'User' | Users who deleted message |
| replyTo | ObjectId | No | Ref: 'Message' | Replied message reference |
| metadata | Mixed | No | | Additional data |
| createdAt | Date | Auto | | Timestamp |
| updatedAt | Date | Auto | | Timestamp |

**Indexes**:
- Compound: `{ conversationId: 1, createdAt: -1 }`
- Compound: `{ sender: 1, receiver: 1 }`
- Compound: `{ sender: 1, isRead: 1 }`

**Relationships**:
- **Belongs to**: conversations (via conversationId)
- **Belongs to**: users (sender, receiver)
- **Belongs to**: messages (replyTo - self-reference)

**Static Methods**:
- `generateConversationId(userId1, userId2)`: Generate conversation ID

**Methods**:
- `markAsRead()`: Mark message as read
- `markAsDelivered()`: Mark message as delivered

---

### 10. servicefeedbacks

**Purpose**: Reviews and ratings for completed services.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| serviceId | ObjectId | Yes | Ref: 'MentorService' |
| bookingId | ObjectId | Yes | Ref: 'Booking' |
| menteeId | ObjectId | Yes | Ref: 'User' |
| mentorId | ObjectId | Yes | Ref: 'User' |
| rating | Number | Yes | Min: 1, max: 5 |
| review | String | No | Review text |
| isPublished | Boolean | Yes | Default: true |
| mentorResponse | String | No | Mentor's response |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ serviceId: 1 }`
- Single: `{ mentorId: 1 }`
- Single: `{ menteeId: 1 }`
- Single: `{ bookingId: 1 }`

**Relationships**:
- **Belongs to**: mentorservices (serviceId)
- **Belongs to**: bookings (bookingId)
- **Belongs to**: users (menteeId, mentorId)

---

### 11. payoutrequests

**Purpose**: Mentor withdrawal requests.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| mentorId | ObjectId | Yes | Ref: 'User' |
| amount | Number | Yes | Min: 0 |
| payoutMethod | Object | Yes | Bank account details |
| status | String | Yes | Enum: ['pending', 'processing', 'completed', 'rejected'] |
| processedBy | ObjectId | No | Ref: 'User' (admin) |
| processedAt | Date | No | Processing timestamp |
| rejectionReason | String | No | Reason for rejection |
| transactionId | String | No | External transaction reference |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ mentorId: 1 }`
- Single: `{ status: 1 }`

**Relationships**:
- **Belongs to**: users (mentorId)

---

### 12. notifications

**Purpose**: In-app notifications for users.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| userId | ObjectId | Yes | Ref: 'User' |
| type | String | Yes | Notification type |
| title | String | Yes | Notification title |
| message | String | Yes | Notification message |
| data | Object | No | Additional data |
| priority | String | Yes | Enum: ['low', 'medium', 'high'] |
| isRead | Boolean | Yes | Default: false |
| readAt | Date | No | Read timestamp |
| actionUrl | String | No | Click destination |
| actionText | String | No | Action button text |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ userId: 1 }`
- Compound: `{ userId: 1, isRead: 1 }`
- Single: `{ createdAt: -1 }`

**Relationships**:
- **Belongs to**: users (userId)

---

### 13. blacklistedtokens

**Purpose**: Track invalidated JWT tokens for logout functionality.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| token | String | Yes | **Unique** JWT token |
| userId | ObjectId | Yes | Ref: 'User' |
| expiresAt | Date | Yes | Token expiration |
| createdAt | Date | Auto | Timestamp |

**Indexes**:
- Unique: `{ token: 1 }`
- Single: `{ userId: 1 }`
- Single: `{ expiresAt: 1 }` (for TTL cleanup)

**Relationships**:
- **Belongs to**: users (userId)

---

### 14. passwordresetotps

**Purpose**: One-time passwords for password reset flow.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| userId | ObjectId | Yes | Ref: 'User' |
| otp | String | Yes | 4-digit OTP |
| expiresAt | Date | Yes | OTP expiration (15 min) |
| isUsed | Boolean | Yes | Default: false |
| createdAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ userId: 1 }`
- Single: `{ expiresAt: 1 }` (for TTL)

**Relationships**:
- **Belongs to**: users (userId)

---

### 15. pendingusers

**Purpose**: Temporary storage for unverified user registrations.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| email | String | Yes | Unique |
| password | String | Yes | Hashed |
| role | String | Yes | User role |
| profile | Object | Yes | Profile data |
| verificationOTP | String | Yes | Email OTP |
| verificationOTPExpires | Date | Yes | OTP expiration |
| createdAt | Date | Auto | Timestamp |

**Indexes**:
- Unique: `{ email: 1 }`
- Single: `{ verificationOTPExpires: 1 }` (for TTL)

**Purpose**: Deleted after email verification; data moved to users collection.

---

### 16. contactmessages

**Purpose**: Contact form submissions from website visitors.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Primary Key |
| name | String | Yes | Sender name |
| email | String | Yes | Sender email |
| subject | String | Yes | Message subject |
| message | String | Yes | Message content |
| userId | ObjectId | No | Ref: 'User' (if logged in) |
| status | String | Yes | Enum: ['new', 'read', 'responded'] |
| adminNotes | String | No | Internal notes |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes**:
- Single: `{ status: 1 }`
- Single: `{ createdAt: -1 }`

---

## Entity Relationship Diagram

```
users (Core)
├── One-to-One → mentorprofiles
├── One-to-One → menteeprofiles
├── One-to-Many → mentorservices (as mentor)
├── One-to-Many → bookings (as mentee or mentor)
├── One-to-Many → payments (as mentee or mentor)
├── One-to-Many → notifications
└── Many-to-Many → conversations (via participants)

mentorprofiles
└── One-to-Many → mentorservices (via userId)

mentorservices
├── One-to-Many → bookings
├── One-to-Many → payments
└── One-to-Many → servicefeedbacks

bookings
├── One-to-Many → meetings
├── One-to-One → payments
└── One-to-One → servicefeedbacks

conversations
└── One-to-Many → messages

users (additional)
├── One-to-Many → payoutrequests (mentors only)
├── One-to-Many → blacklistedtokens
└── One-to-Many → passwordresetotps
```

---

## Indexing Strategy

### Performance Indexes

**High-frequency queries**:
- `users.email` - Login/registration lookups
- `messages.conversationId + createdAt` - Chat message retrieval
- `bookings.menteeId/mentorId` - User booking lists
- `notifications.userId + isRead` - Notification fetching

**Text Search Indexes**:
- `mentorprofiles`: title, bio, specializations
- `mentorservices`: title, description, tags
- `menteeprofiles`: studyGoals, academicInterests, careerGoals

**Compound Indexes** (order-specific for optimization):
- `mentorprofiles`: `{ isActive: 1, isVerified: 1, rating: -1, totalReviews: -1 }`
- `messages`: `{ conversationId: 1, createdAt: -1 }`

### Constraints

**Unique Constraints**:
- `users.email` - Prevent duplicate accounts
- `mentorprofiles.userId` - One profile per user
- `menteeprofiles.userId` - One profile per user
- `payments.stripeSessionId` - Prevent duplicate transactions
- `blacklistedtokens.token` - Track unique tokens

**Sparse Indexes** (allow nulls):
- `users.googleId`, `users.stripeCustomerId`
- `mentorprofiles.slug`, `mentorservices.slug`

---

## Data Integrity & Validation

### Schema-Level Validation

1. **Required Fields**: Enforced via Mongoose `required` validators
2. **Enums**: Strict value sets for status fields, roles, categories
3. **Min/Max Constraints**: Applied to numbers (ratings, prices, years)
4. **Custom Validators**: Email format, password strength, date ranges
5. **String Constraints**: maxlength, trim, lowercase transformations

### Application-Level Integrity

1. **Referential Integrity**: Mongoose populate validates ObjectId references
2. **Cascade Deletes**: Not implemented (soft deletes preferred)
3. **Orphan Prevention**: Application logic prevents orphaned records
4. **Transaction Support**: Used for critical operations (payments, bookings)

---

## Common Query Patterns

### User Authentication
```javascript
// Login
User.findOne({ email }).select('+password')

// Get user with profile
User.findById(userId).populate('profile')
```

### Mentor Discovery
```javascript
// Search mentors
MentorProfile.find({
  isActive: true,
  isVerified: true
}).populate('userId').sort({ rating: -1, totalReviews: -1 })
```

### Service Discovery
```javascript
// Get approved services
MentorService.find({
  status: 'approved',
  isActive: true,
  category: 'Study Abroad Guidance'
}).populate('mentorId')
```

### Booking Management
```javascript
// Get user bookings
Booking.find({ menteeId: userId, isActive: true })
  .populate('mentorId', 'profile')
  .populate('serviceId', 'title packages')
  .sort({ createdAt: -1 })
```

### Chat Operations
```javascript
// Get conversation messages
Message.find({
  conversationId,
  deletedBy: { $ne: userId }
}).populate('sender', 'profile').sort({ createdAt: -1 })
```

---

## Database Maintenance

### Recommended Practices

1. **Regular Backups**: Daily automated backups
2. **Index Monitoring**: Track index usage and performance
3. **TTL Cleanup**: Automatic expiration for temporary data:
   - `blacklistedtokens` - after token expiration
   - `passwordresetotps` - after 15 minutes
   - `pendingusers` - after 24 hours
4. **Aggregation Pipelines**: For complex analytics and reports
5. **Connection Pooling**: MongoDB connection pool (default: 5-10 connections)

### Data Lifecycle

- **Soft Deletes**: Use `isActive: false` instead of removing documents
- **Archive Old Data**: Move completed bookings older than 2 years to archive collection
- **Purge Temporary Data**: Auto-delete expired OTPs and blacklisted tokens

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Database Version**: MongoDB 8.0+  
**ODM**: Mongoose 8.19.1  
**Prepared By**: Scholarslee Development Team
