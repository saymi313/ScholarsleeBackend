# Scholarslee

A comprehensive global mentorship platform that connects aspiring students with international mentors studying abroad. Scholarslee offers personalized guidance for Statement of Purpose (SOP) writing, visa applications, scholarship opportunities, and university admissions.

## Overview

Scholarslee is designed to make study abroad guidance accessible and trustworthy through a seamless digital platform. Students can browse mentors by country, course, or university, then book and pay securely for mentorship services. The platform includes real-time chat, scheduling capabilities, and review systems to ensure quality mentorship experiences.

## Technology Stack

This project is built using the **MERN** stack:

- **MongoDB** - NoSQL database for storing user data, mentor profiles, and session information
- **Express.js** - Backend web application framework for Node.js
- **React.js** - Frontend library for building user interfaces
- **Node.js** - JavaScript runtime environment for server-side development

### Frontend Technologies

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **React Country Flag** - Country flag components
- **Lucide React** - Beautiful icon library
- **Recharts** - Chart library for analytics
- **React International Phone** - Phone number input components

### Key Features Implemented

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Modern dark UI with purple accent colors
- **Component Architecture** - Modular, reusable components
- **State Management** - React hooks for local state
- **Routing** - Client-side routing with React Router
- **Animations** - Smooth transitions and hover effects
- **Custom Styling** - Custom scrollbars and UI components

## Project Structure

```
Scholarslee/
├── Frontend/                 # React.js frontend application
│   ├── public/              # Static assets (images, icons)
│   ├── src/
│   │   ├── AdminPanel/      # Admin dashboard and management
│   │   │   ├── components/  # Admin-specific components
│   │   │   ├── pages/       # Admin pages (Dashboard, Users, Mentors, etc.)
│   │   │   ├── Routes/      # Admin routing
│   │   │   └── state/       # Admin state management
│   │   ├── MenteesPanel/    # Mentees dashboard and landing pages
│   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── SignUpComponents/ # Signup form and privacy policy
│   │   │   │   └── LoginPageComponents/ # Login form components
│   │   │   ├── pages/       # Page components
│   │   │   └── Routes/      # Mentees routing
│   │   ├── MentorPanel/     # Mentor dashboard and management
│   │   │   ├── components/    # Mentor-specific components
│   │   │   │   ├── Shared/     # Shared components (Sidebar, TopBar)
│   │   │   │   ├── Dashboard/  # Dashboard components
│   │   │   │   ├── Services/   # Services management
│   │   │   │   ├── Meetings/  # Meeting components
│   │   │   │   ├── Revenue/    # Revenue analytics
│   │   │   │   ├── Badges/     # Badge system
│   │   │   │   └── Chats/      # Chat system
│   │   │   ├── pages/       # Mentor pages
│   │   │   └── Routes/      # Mentor routing
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── Backend/                 # Express.js backend (to be developed)
├── Database/               # MongoDB schemas and migrations (to be developed)
└── README.md              # Project documentation
```

## Features

### Mentees Panel (Implemented)

- **Landing Page** - Comprehensive homepage with hero section, features, and testimonials
- **Mentor Discovery** - Browse and search mentors by specialization and location
- **Success Stories** - Showcase of successful student outcomes with country flags
- **Destination Guide** - Information about study abroad destinations
- **Registration Flow** - Step-by-step onboarding process with privacy policy integration
- **Privacy Policy System** - 30-second timer-based policy reading with professional popup
- **Services Page** - Browse and search mentorship services with education level filters
- **Contact Page** - Contact forms and information
- **Login System** - Role-based authentication (Mentor/Student)
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### Admin Panel (Fully Implemented)

- **Dashboard** - Comprehensive analytics with revenue charts and user metrics
- **User Management** - View and manage all platform users with responsive tables
- **Mentor Management** - Approve/reject mentors, manage verification status
- **Services Oversight** - Monitor and manage all mentorship services
- **Payment Tracking** - Transaction monitoring and payout management
- **Dispute Resolution** - Handle user disputes and conflicts
- **Review Management** - Moderate reviews and feedback
- **Notification System** - Send notifications to user segments
- **Data Tables** - Responsive tables with search, filtering, and pagination
- **Quick Actions** - Common administrative tasks and shortcuts

### Mentor Panel (Fully Implemented)

- **Dashboard** - Analytics overview with revenue, students, and transaction metrics
- **Services Management** - Create and manage mentorship services
- **Meetings** - Calendar integration with search functionality and upcoming meetings carousel
- **Revenue Tracking** - Comprehensive revenue analytics with charts and insights
- **Badges System** - Achievement system with hexagon-shaped badges and XP progress
- **Chat System** - WhatsApp-like messaging with file sharing and delivery status
- **Profile Settings** - Account management and preferences
- **Sidebar Navigation** - Collapsible sidebar with smooth animations

### Advanced Chat Features (Implemented)

- **Real-time Messaging** - Send and receive text messages with delivery status
- **File Sharing** - Upload and download files with type-specific icons
- **Chat Management** - Pin, mute, archive, block, and clear chat options
- **Status Indicators** - Visual indicators for chat states in sidebar
- **Message History** - Persistent chat history with search functionality
- **Voice Recording** - Voice message recording (UI ready)
- **Group Chats** - Support for group conversations

### UI/UX Features (Implemented)

- **Modern Design** - Dark theme with purple accent colors
- **Responsive Layout** - Mobile-first design with Tailwind CSS
- **Interactive Components** - Hover effects, animations, and transitions
- **Custom Scrollbars** - Styled scrollbars for better aesthetics
- **Loading States** - Smooth loading animations and transitions
- **Error Handling** - User-friendly error messages and fallbacks
- **Privacy Policy System** - Professional modal with 30-second reading timer
- **Form Validation** - Comprehensive validation with real-time feedback
- **Table Responsiveness** - Scrollable tables with proper overflow handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (for backend development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saymi313/Scholarslee.git
cd Scholarslee
```

2. Install frontend dependencies:
```bash
cd Frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Current Status

### ✅ Fully Functional Features

- **Complete Mentor Panel** - Dashboard, Services, Meetings, Revenue, Badges, Chats
- **Advanced Chat System** - WhatsApp-like interface with file sharing
- **Responsive Design** - Works on all device sizes
- **Authentication Flow** - Login system with role-based routing
- **Interactive Components** - All UI components are fully functional
- **Data Visualization** - Charts and analytics in Revenue section
- **File Management** - Upload, download, and preview files in chat
- **Privacy Policy System** - Professional modal with timer-based reading enforcement
- **Admin Panel** - Complete admin dashboard with responsive tables and data management
- **Form Validation** - Comprehensive validation with privacy policy integration

### 🎯 Demo Ready

The application is fully demo-ready with:
- Working navigation between all pages
- Interactive chat system with message delivery status
- File upload and download functionality
- Revenue analytics with charts
- Badge system with XP progress
- Meeting calendar with search
- Services management interface
- Privacy policy system with 30-second reading timer
- Admin panel with responsive data tables
- Form validation and user onboarding

### 📱 User Experience

- **Intuitive Navigation** - Easy-to-use sidebar and routing
- **Visual Feedback** - Status indicators, animations, and transitions
- **Modern UI** - Dark theme with consistent design language
- **Accessibility** - Proper contrast and keyboard navigation

## Development Roadmap

### Phase 1: Frontend Development ✅ (Completed)
- [x] Mentees panel landing page
- [x] Responsive design implementation
- [x] Component architecture setup
- [x] Routing configuration
- [x] Services page with search functionality
- [x] Contact page with forms
- [x] Login system with role-based authentication

### Phase 2: Mentor Panel ✅ (Completed)
- [x] Mentor dashboard with analytics
- [x] Services management system
- [x] Meetings calendar with search
- [x] Revenue tracking and analytics
- [x] Badges and achievement system
- [x] Advanced chat system with file sharing
- [x] Sidebar navigation with animations
- [x] Profile settings management

### Phase 3: Advanced Features ✅ (Completed)
- [x] WhatsApp-like chat interface
- [x] File upload and download system
- [x] Chat management (pin, mute, archive, block)
- [x] Message delivery status indicators
- [x] Voice recording UI
- [x] Custom scrollbar styling
- [x] Hexagon badge system
- [x] Revenue analytics with charts
- [x] Privacy policy system with timer-based reading
- [x] Admin panel with responsive data management
- [x] Form validation and user onboarding
- [x] Table responsiveness and overflow handling

### Phase 4: Backend Development (Planned)
- [ ] Express.js server setup
- [ ] MongoDB database integration
- [ ] Authentication system
- [ ] API endpoints development
- [ ] Real-time WebSocket connections
- [ ] File upload handling
- [ ] Payment integration

### Phase 5: Production Features (Planned)
- [ ] Video calling functionality
- [ ] Mobile application
- [ ] Push notifications
- [ ] Email system
- [ ] Admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions and support, please contact:
- Email: info@scholarslee.com
- Website: [scholarslee.com](https://scholarslee.com)

## Acknowledgments

- Design inspiration from modern educational platforms
- Community feedback and suggestions
- Open source libraries and frameworks used in development
