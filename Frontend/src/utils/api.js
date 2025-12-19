import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create axios instance with base configuration
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'https://api.scholarslee.com/api',
  baseURL: 'https://api.scholarslee.com/api', // Production
  // baseURL: 'http://localhost:5000/api', // Local development

  timeout: 30000, // Increased from 10s to 30s for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic for failed requests
axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status >= 500 && error.response?.status < 600);
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retrying request (${retryCount}/3):`, requestConfig.url);
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Don't redirect on 401 for login/auth endpoints - let the component handle the error
        const requestUrl = error.config?.url || '';
        const isLoginEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register') || requestUrl.includes('/mentees/auth/login') || requestUrl.includes('/mentees/auth/register');

        // Define public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/home',
          '/about',
          '/contact',
          '/services',
          '/mentors',
          '/pricing',
          '/mentor/',
          '/service/',
          '/login',
          '/signup',
          '/forgot-password',
          '/verify-email',
          '/mentees',
          '/mentees/home',
          '/mentees/mentor',
          '/mentees/mentor-details',
          '/mentees/services',
          '/mentees/service-details',
          '/pricings'
        ];

        const currentPath = window.location.pathname;
        // Check if current path is public
        const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
        // Check if this is a notification API call
        const isNotificationAPI = requestUrl.includes('/notifications/');

        // Handle notification API calls on public pages gracefully
        if (isNotificationAPI && isPublicRoute) {
          // For notification APIs on public pages, resolve with default data instead of rejecting
          return Promise.resolve({
            data: {
              success: true,
              data: { unreadCount: 0 }
            }
          });
        }

        if (!isLoginEndpoint) {
          // Only redirect if it's not a public route and not a notification API call on public page
          if (!isPublicRoute && !isNotificationAPI) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Check if this is an admin API call or admin route
            const isAdminRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/xyz/admin');
            const isAdminAPI = requestUrl.includes('/admin/');

            // Redirect to appropriate login page
            if (isAdminRoute || isAdminAPI) {
              // Don't redirect if already on admin login page
              if (currentPath !== '/xyz/admin/authenticate') {
                window.location.href = '/xyz/admin/authenticate';
              }
            } else {
              // Regular user login
              window.location.href = '/login';
            }
          }
        }

        // For login endpoints, return the original error message
        // For other endpoints, return session expired message
        const errorMessage = isLoginEndpoint
          ? (data?.message || 'Invalid credentials')
          : 'Session expired. Please login again.';

        return Promise.reject(new Error(errorMessage));
      }

      // Handle 403 Forbidden - especially for paused login
      if (status === 403) {
        const errorMessage = data?.message || 'Access denied';
        const requestUrl = error.config?.url || '';
        const currentPath = window.location.pathname;

        // Check if this is a login paused error
        if (errorMessage.includes('paused') || errorMessage.includes('Paused')) {
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Check if this is a mentor route
          const isMentorRoute = currentPath.startsWith('/mentor');
          const isMentorAPI = requestUrl.includes('/mentors/');

          if (isMentorRoute || isMentorAPI) {
            // Redirect mentor to login page
            if (currentPath !== '/login' && currentPath !== '/signup') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(new Error(errorMessage));
      }

      return Promise.reject(new Error(data.message || 'An error occurred'));
    }

    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(new Error('An unexpected error occurred'));
  }
);

// Profile API
export const profileAPI = {
  user: {
    get: () => api.get('/users/profile'),
    update: (data) => api.put('/users/profile', data),
    uploadAvatar: (data) => api.post('/users/avatar', data),
    deleteAvatar: () => api.delete('/users/avatar'),
  },
  mentee: {
    get: () => api.get('/mentees/profile'),
    update: (data) => api.put('/mentees/profile', data),
    create: (data) => api.post('/mentees/profile', data),
  },
  mentor: {
    get: () => api.get('/mentors/profile'),
    update: (data) => api.put('/mentors/profile', data),
    create: (data) => api.post('/mentors/profile', data),
  },
};

// Services API
export const servicesAPI = {
  // Mentor service management (for mentor panel)
  getAll: (params) => api.get('/mentors/services', { params }),
  getById: (id) => api.get(`/mentors/services/${id}`),
  create: (data) => api.post('/mentors/services', data),
  update: (id, data) => api.put(`/mentors/services/${id}`, data),
  delete: (id) => api.delete(`/mentors/services/${id}`),

  // Mentee service discovery (for mentee panel)
  search: (params) => api.get('/mentees/services/search', { params }),
  getByCategory: (category) => api.get(`/mentees/services/category/${category}`),
  getByMentor: (mentorId) => api.get(`/mentees/services/mentor/${mentorId}`),
  getCategories: () => api.get('/mentees/services/meta/categories'),
  getFeatured: () => api.get('/mentees/services/meta/featured'),
  getPopular: () => api.get('/mentees/services/meta/popular'),
};

// Mentee Services API (for mentee panel)
export const menteeServicesAPI = {
  getAll: (params) => api.get('/mentees/services', { params }),
  getById: (id) => api.get(`/mentees/services/${id}`),
  search: (params) => api.get('/mentees/services/search', { params }),
  getByCategory: (category) => api.get(`/mentees/services/category/${category}`),
  getByMentor: (mentorId) => api.get(`/mentees/services/mentor/${mentorId}`),
  getCategories: () => api.get('/mentees/services/meta/categories'),
  getFeatured: () => api.get('/mentees/services/meta/featured'),
  getPopular: () => api.get('/mentees/services/meta/popular'),
};

// Mentors API
export const mentorsAPI = {
  getAll: (params) => api.get('/mentees/mentors', { params }),
  getById: (id) => api.get(`/mentees/mentors/${id}`),
  search: (params) => api.get('/mentees/mentors/search', { params }),
  getFeatured: () => api.get('/mentees/mentors/featured'),
  getPopular: () => api.get('/mentees/mentors/popular'),
};

// Mentor Panel Mentees API (for meeting scheduling)
export const mentorMenteesAPI = {
  getMentorMentees: () => api.get('/mentors/mentees'),
};

// Booking API
export const bookingAPI = {
  // Mentee booking operations
  create: (data) => api.post('/mentees/bookings', data),
  getMenteeBookings: (params) => api.get('/mentees/bookings', { params }),
  getMenteeBookingById: (id) => api.get(`/mentees/bookings/${id}`),
  cancelMenteeBooking: (id, data) => api.put(`/mentees/bookings/${id}/cancel`, data),

  // Mentor booking operations
  getMentorBookings: (params) => api.get('/mentors/bookings', { params }),
  getMentorBookingById: (id) => api.get(`/mentors/bookings/${id}`),
  updateBookingStatus: (id, data) => api.put(`/mentors/bookings/${id}/status`, data),
};

// Meeting API
export const meetingAPI = {
  // Mentee meeting operations
  getMenteeMeetings: (params) => api.get('/mentees/meetings', { params }),
  getMenteeMeetingById: (id) => api.get(`/mentees/meetings/${id}`),
  joinMeeting: (id) => api.post(`/mentees/meetings/${id}/join`),
  getTodaysMeetings: () => api.get('/mentees/meetings/today'),
  getUpcomingMeetings: () => api.get('/mentees/meetings/upcoming'),
  leaveFeedback: (id, data) => api.post(`/mentees/meetings/${id}/feedback`, data),

  // Mentor meeting operations
  getMentorMeetings: (params) => api.get('/mentors/meetings', { params }),
  createMeeting: (bookingId, data) => api.post(`/mentors/bookings/${bookingId}/meetings`, data),
  startMeeting: (id) => api.put(`/mentors/meetings/${id}/start`),
  endMeeting: (id, data) => api.put(`/mentors/meetings/${id}/end`, data),
  cancelMeeting: (id, data) => api.put(`/mentors/meetings/${id}/cancel`, data),
  deleteMeeting: (id) => api.delete(`/mentors/meetings/${id}`),
  getTodaysMeetings: () => api.get('/mentors/meetings/today'),
  getUpcomingMeetings: () => api.get('/mentors/meetings/upcoming'),
  getMeetingsByDateRange: (params) => api.get('/mentors/meetings/calendar', { params }),
  getMeetingsByDate: (date) => api.get(`/mentors/meetings/date/${date}`),
};

// Notification API
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (data) => api.put('/notifications/mark-read', data),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  archive: (data) => api.put('/notifications/archive', data),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications/all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  getStats: () => api.get('/notifications/stats'),
};

// Badges API (for mentor panel)
export const badgesAPI = {
  getMentorBadge: () => api.get('/mentors/badges'),
  getAllBadges: () => api.get('/mentors/badges/all'),
  getBadgeProgress: () => api.get('/mentors/badges/progress'),
  recalculateBadge: () => api.post('/mentors/badges/calculate'),
};

// Service Feedback API
export const serviceFeedbackAPI = {
  create: (serviceId, data) => api.post(`/mentees/services/${serviceId}/feedback`, data),
  getByService: (serviceId, params) => api.get(`/mentees/services/${serviceId}/feedbacks`, { params }),
  getByMentor: (mentorId, params) => api.get(`/mentees/mentors/${mentorId}/feedbacks`, { params }),
  update: (id, data) => api.put(`/mentees/feedbacks/${id}`, data),
  delete: (id) => api.delete(`/mentees/feedbacks/${id}`),
};

// Mentor Feedback API (for mentor panel)
export const mentorFeedbackAPI = {
  getMyFeedbacks: (params) => api.get('/mentors/feedbacks', { params }),
};

// Admin Dashboard API
export const adminDashboardAPI = {
  getMetrics: () => api.get('/admin/dashboard/metrics'),
  getRevenueChart: (range) => api.get('/admin/dashboard/revenue-chart', { params: { range } }),
  getUsersByCountry: () => api.get('/admin/dashboard/users-by-country'),
  getTopServices: (limit) => api.get('/admin/dashboard/top-services', { params: { limit } }),
  getMentorLeaderboard: (limit) => api.get('/admin/dashboard/mentor-leaderboard', { params: { limit } }),
  getTransactionsChart: (range) => api.get('/admin/dashboard/transactions-chart', { params: { range } }),
};

// Admin Auth API
export const adminAuthAPI = {
  login: (email, password) => api.post('/admin/auth/login', { email, password }),
  getMe: () => api.get('/admin/auth/me'),
  logout: () => api.post('/admin/auth/logout'),
};

// Admin Notifications API
export const adminNotificationsAPI = {
  send: (data) => api.post('/admin/notifications/send', data),
  getHistory: (params) => api.get('/admin/notifications/history', { params }),
};

// Admin Services API
export const adminServicesAPI = {
  getAllServices: (params) => api.get('/admin/services', { params }),
  getServicesByCategory: () => api.get('/admin/services/by-category'),
};

// Admin Sessions API
export const adminSessionsAPI = {
  getAllSessions: (params) => api.get('/admin/sessions', { params }),
  getSessionById: (id) => api.get(`/admin/sessions/${id}`),
};

// Admin Mentors API
export const adminMentorsAPI = {
  getAllMentors: (params) => api.get('/admin/mentors', { params }),
  getMentorById: (id) => api.get(`/admin/mentors/${id}`),
  getMentorsByStatus: () => api.get('/admin/mentors/by-status'),
  updateApprovalStatus: (id, status, reason) => api.patch(`/admin/mentors/${id}/approval`, { status, reason }),
  togglePauseLogin: (id, isPaused) => api.patch(`/admin/mentors/${id}/pause-login`, { isPaused }),
};

// Admin Reviews API
export const adminReviewsAPI = {
  getFeedbacks: (params) => api.get('/admin/reviews', { params }),
  updateVisibility: (id, isVisible) => api.patch(`/admin/reviews/${id}/visibility`, { isVisible }),
  deleteFeedback: (id) => api.delete(`/admin/reviews/${id}`),
  updateResponse: (id, response) => api.patch(`/admin/reviews/${id}/response`, { response }),
  getContactMessages: (params) => api.get('/admin/reviews/contact-messages', { params }),
  respondToContact: (id, response) => api.post(`/admin/reviews/contact-messages/${id}/respond`, { response }),
};

// Contact API
export const contactAPI = {
  create: (data) => api.post('/contact', data),
};

// Admin Settings API
export const adminSettingsAPI = {
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
  addCategory: (category) => api.post('/admin/settings/categories', { category }),
  removeCategory: (category) => api.delete('/admin/settings/categories', { data: { category } }),
};

// Admin Users API
export const adminUsersAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
  getUsersByCountry: () => api.get('/admin/users/by-country'),
};

// Mentor Revenue API
export const mentorRevenueAPI = {
  getDashboard: () => api.get('/mentors/revenue/dashboard'),
};

// Payments API
export const paymentAPI = {
  createCheckoutSession: (data) => api.post('/payments/create-checkout-session', data),
  verifySession: (sessionId) => api.get(`/payments/verify-session/${sessionId}`),
  getPaymentDetails: (paymentId) => api.get(`/payments/details/${paymentId}`),
  getPaymentHistory: (params) => api.get('/payments/history', { params }),
  refundPayment: (paymentId, reason) => api.post(`/payments/refund/${paymentId}`, { reason }),
};

// Mentor Profile API
export const mentorProfileAPI = {
  get: () => api.get('/mentors/profile'),
  create: (data) => api.post('/mentors/profile', data),
  update: (data) => api.put('/mentors/profile', data),

  // Education
  addEducation: (data) => api.post('/mentors/profile/education', data),
  updateEducation: (id, data) => api.put(`/mentors/profile/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/mentors/profile/education/${id}`),

  // Experience
  addExperience: (data) => api.post('/mentors/profile/experience', data),
  updateExperience: (id, data) => api.put(`/mentors/profile/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/mentors/profile/experience/${id}`),

  // Achievements
  addAchievement: (data) => api.post('/mentors/profile/achievement', data),
  deleteAchievement: (id) => api.delete(`/mentors/profile/achievement/${id}`),

  // Availability
  updateAvailability: (data) => api.put('/mentors/profile/availability', data)
};

// Auth API (for password reset)
export const authAPI = {
  forgotPassword: (email) => api.post('/mentees/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/mentees/auth/verify-otp', { email, otp }),
  resetPassword: (email, password) => api.post('/mentees/auth/reset-password', { email, password }),
};

export default api;
