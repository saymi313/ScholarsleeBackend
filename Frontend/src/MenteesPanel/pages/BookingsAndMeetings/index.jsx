import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Video, Play, CheckCircle, AlertCircle, X, Eye, DollarSign } from 'lucide-react';
import Header from '../../components/Shared/Header';
import Footer from '../../components/Shared/Footer';
import { bookingAPI, meetingAPI } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import menteeMeetingService from './menteeMeetingService';
import MenteeMeetingSchedulingModal from '../../components/MeetingSchedulingModal';
import MeetingConfirmationModal from '../../../MentorPanel/components/MeetingsComponents/MeetingConfirmationModal';
import MeetingLoader from '../../../MentorPanel/components/MeetingsComponents/MeetingLoader';
import MeetingLinkDisplay from '../../../MentorPanel/components/MeetingsComponents/MeetingLinkDisplay';

const BookingsAndMeetingsPage = () => {
  const { showError } = useToast();
  const location = useLocation();
  // Check URL params for tab, or default based on pathname
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === 'meetings' ? 'meetings' :
      location.pathname.includes('/meetings') ? 'meetings' : 'bookings'
  );
  const [bookings, setBookings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [meetingFilter, setMeetingFilter] = useState('all');

  // Meeting Scheduling States
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedBookingForMeeting, setSelectedBookingForMeeting] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderStep, setLoaderStep] = useState(1);
  const [generatedMeetingLink, setGeneratedMeetingLink] = useState('');
  const [showLinkDisplay, setShowLinkDisplay] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  // Update active tab when URL param changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl === 'meetings' && activeTab !== 'meetings') {
      setActiveTab('meetings');
    } else if (tabFromUrl === 'bookings' && activeTab !== 'bookings') {
      setActiveTab('bookings');
    }
  }, [location.search, activeTab]);

  useEffect(() => {
    loadBookings();
    loadMeetings();
  }, [bookingFilter, meetingFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { status: bookingFilter === 'all' ? '' : bookingFilter };
      const response = await bookingAPI.getMenteeBookings(params);

      if (response.data && response.data.success) {
        setBookings(response.data.data.bookings || []);
      } else {
        setError(response.data?.message || "We couldn't load your bookings. Please try again.");
      }
    } catch (error) {
      console.error('Error loading bookings:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please log in first to see your bookings. It only takes a moment!');
      } else {
        setError("You need to be logged in to view your bookings. Please log in or create an account to continue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMeetings = async () => {
    try {
      const params = { status: meetingFilter === 'all' ? '' : meetingFilter };
      const response = await meetingAPI.getMenteeMeetings(params);

      if (response.data && response.data.success) {
        setMeetings(response.data.data.meetings || []);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please log in first to see your meetings. It only takes a moment!');
      }
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingAPI.cancelMenteeBooking(bookingId, {
        reason: 'Cancelled by mentee'
      });

      if (response.data && response.data.success) {
        setBookings(prev =>
          prev.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError("We couldn't cancel this booking. Please try again.");
    }
  };

  const joinMeeting = async (meetingId) => {
    try {
      const response = await meetingAPI.joinMeeting(meetingId);
      if (response.data && response.data.success) {
        // Open meeting link in new tab
        if (response.data.data.meetingLink) {
          window.open(response.data.data.meetingLink, '_blank');
        }
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      showError("We couldn't join the meeting. Please try again.");
    }
  };

  const handleConnectGoogle = async () => {
    try {
      await menteeMeetingService.beginOAuthFlow();
    } catch (error) {
      console.error('Failed to initiate Google authorization:', error);
      showError(error.message || "We couldn't connect to Google. Please try again.");
    }
  };

  const validateMeetingDetails = (details) => {
    const errors = [];
    if (!details.topic || details.topic.trim() === '') errors.push('Meeting topic is required');
    if (!details.date) errors.push('Date is required');
    if (!details.time) errors.push('Time is required');
    return errors;
  };

  const formatErrorMessage = (error) => {
    const message = error.message || error?.response?.data?.message || String(error);
    
    // Map backend error messages to user-friendly versions
    const errorMap = {
      'Scheduled date must be in the future': 'Please select a date and time in the future',
      'Cannot create meeting': 'Meeting could not be created. Please check the booking status or try again',
      'Access denied': 'You do not have permission to create this meeting',
      'Valid booking not found': 'The booking is no longer valid. Please refresh and try again',
      'Calendar access is not authorized': 'Your Google Calendar is not connected. Please click "Connect Calendar" and try again',
      'Google Calendar access is not authorized yet': 'Your Google Calendar is not yet authorized. Please connect to Google Calendar first',
      'Authorization code is required': 'Google authorization failed. Please try connecting to Google Calendar again',
      'We couldn\'t complete Google sign-in': 'Google sign-in failed. Please try again or reconnect your calendar',
      'check if you have connected your calendar': 'Please ensure your Google Calendar is connected',
    };

    // Check for matching error messages
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key) || message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // For specific HTTP errors
    if (message.includes('400')) return 'Invalid meeting details. Please check your input and try again';
    if (message.includes('401')) return 'Your session has expired. Please log in again';
    if (message.includes('403')) return 'You do not have permission to create this meeting';
    if (message.includes('404')) return 'The booking could not be found. Please refresh the page';
    if (message.includes('409')) return 'A meeting has already been scheduled for this booking';
    if (message.includes('428')) return 'Please connect your Google Calendar first before scheduling a meeting';
    if (message.includes('500')) return 'Server error occurred. Please try again later';
    if (message.includes('Network')) return 'Network error. Please check your connection and try again';

    // Default message
    return message || 'An error occurred while creating the meeting. Please try again';
  };

  const handleScheduleMeetingRequest = (booking) => {
    setSelectedBookingForMeeting(booking);
    setShowSchedulingModal(true);
  };

  const handleSchedulingSubmit = (details) => {
    setMeetingDetails({
      ...details,
      bookingId: selectedBookingForMeeting?._id,
      mentorId: selectedBookingForMeeting?.mentorId?._id
    });
    setShowSchedulingModal(false);
    setShowConfirmationModal(true);
  };

  const generateMeetingLink = async (details) => {
    try {
      setShowLoader(true);
      setLoaderStep(1);

      const validationErrors = validateMeetingDetails(details);
      if (validationErrors.length > 0) {
        setShowLoader(false);
        showError(validationErrors.join(' • '));
        return;
      }

      const stepInterval = setInterval(() => {
        setLoaderStep(prev => prev < 4 ? prev + 1 : prev);
      }, 800);

      const result = await menteeMeetingService.generateMeetingLink(details);

      clearInterval(stepInterval);
      setLoaderStep(4);

      if (result.success) {
        setGeneratedMeetingLink(result.meetingLink);
        setShowLoader(false);
        setShowLinkDisplay(true);
        setCalendarKey(prev => prev + 1);
        loadMeetings(); // Refresh the list
      } else {
        throw new Error(result.error || "We couldn't generate the meeting link.");
      }
    } catch (error) {
      console.error('Error generating meeting link:', error);
      setShowLoader(false);
      
      const userFriendlyError = formatErrorMessage(error);
      showError(userFriendlyError);
    }
  };

  const handleConfirmationConfirm = () => {
    setShowConfirmationModal(false);
    generateMeetingLink(meetingDetails);
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false);
    setShowSchedulingModal(true);
  };

  const handleLinkDisplayClose = () => {
    setShowLinkDisplay(false);
    setMeetingDetails(null);
    setGeneratedMeetingLink("");
    setLoaderStep(1);
    setSelectedBookingForMeeting(null);
  };

  const getStatusColor = (status, type = 'booking') => {
    const colorMap = {
      booking: {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-purple-100 text-purple-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'rejected': 'bg-gray-100 text-gray-800'
      },
      meeting: {
        'scheduled': 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-purple-100 text-purple-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'no-show': 'bg-gray-100 text-gray-800'
      }
    };
    return colorMap[type][status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status, type = 'booking') => {
    const iconMap = {
      booking: {
        'pending': <Clock className="w-4 h-4" />,
        'confirmed': <CheckCircle className="w-4 h-4" />,
        'in-progress': <Clock className="w-4 h-4" />,
        'completed': <CheckCircle className="w-4 h-4" />,
        'cancelled': <X className="w-4 h-4" />,
        'rejected': <X className="w-4 h-4" />
      },
      meeting: {
        'scheduled': <Calendar className="w-4 h-4" />,
        'in-progress': <Play className="w-4 h-4" />,
        'completed': <CheckCircle className="w-4 h-4" />,
        'cancelled': <X className="w-4 h-4" />,
        'no-show': <AlertCircle className="w-4 h-4" />
      }
    };
    return iconMap[type][status] || <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMeetingTime = (scheduledDate) => {
    const now = new Date();
    const meetingTime = new Date(scheduledDate);
    const timeDiff = meetingTime.getTime() - now.getTime();
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -15 * 60 * 1000; // Within 15 minutes
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings & Meetings</h1>
            <p className="mt-2 text-gray-600">
              Manage your service bookings and join scheduled meetings
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
             <button
                onClick={handleConnectGoogle}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors"
              >
                <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5 mr-3" />
                Connect Calendar
              </button>
             <button
                onClick={() => {
                  window.location.href = '/mentees/services';
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors"
                title="Browse Services to Book"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Service
              </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'meetings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Video className="w-4 h-4 inline mr-2" />
                Meetings ({meetings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Please Log In First</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="/login"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Login Now
                  </a>
                  <button
                    onClick={() => {
                      setError('');
                      if (activeTab === 'bookings') loadBookings();
                      else loadMeetings();
                    }}
                    className="px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Booking Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setBookingFilter(filterType)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${bookingFilter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-lg shadow-sm">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                  <p className="text-gray-500">
                    {bookingFilter === 'all'
                      ? 'You haven\'t made any bookings yet.'
                      : `No ${bookingFilter} bookings found.`
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.serviceId?.title || 'Service'}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status, 'booking')}`}>
                              {getStatusIcon(booking.status, 'booking')}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Mentor: {booking.mentorId?.profile?.firstName} {booking.mentorId?.profile?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.scheduledDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>${booking.totalAmount}</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Notes:</strong> {booking.notes}
                              </p>
                            </div>
                          )}

                          {booking.meetingLink && (
                            <div className="mt-3">
                              <a
                                href={booking.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>

                          <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto justify-end">
                            {booking.status === 'confirmed' && booking.mentorId && !booking.meetingLink && (
                              <button
                                onClick={() => handleScheduleMeetingRequest(booking)}
                                className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium border border-green-200 shadow-sm"
                                title="Create Google Meet for this booking"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Create Meeting
                              </button>
                            )}
                            {booking.meetingLink && (
                              <a
                                href={booking.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium border border-blue-200 shadow-sm"
                                title="Join existing meeting"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Meeting
                              </a>
                            )}
                            <button
                              onClick={() => {/* View booking details */}}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent shadow-sm"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {(booking.status === 'pending' || booking.status === 'confirmed') && !booking.meetingLink && (
                              <button
                                onClick={() => cancelBooking(booking._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent shadow-sm"
                                title="Cancel Booking"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            {/* Meeting Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setMeetingFilter(filterType)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${meetingFilter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Meetings List */}
            <div className="bg-white rounded-lg shadow-sm">
              {meetings.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meetings Found</h3>
                  <p className="text-gray-500">
                    {meetingFilter === 'all'
                      ? 'You don\'t have any meetings scheduled yet.'
                      : `No ${meetingFilter} meetings found.`
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting._id}
                      className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${isMeetingTime(meeting.scheduledDate) && meeting.status === 'scheduled'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : ''
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {meeting.title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meeting.status, 'meeting')}`}>
                              {getStatusIcon(meeting.status, 'meeting')}
                              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                            </span>
                            {isMeetingTime(meeting.scheduledDate) && meeting.status === 'scheduled' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Starting Soon
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Mentor: {meeting.mentorId?.profile?.firstName} {meeting.mentorId?.profile?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(meeting.scheduledDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{meeting.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              <span>Type: {meeting.meetingType}</span>
                            </div>
                          </div>

                          {meeting.description && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {meeting.description}
                              </p>
                            </div>
                          )}

                          {meeting.meetingLink && (meeting.status === 'scheduled' || meeting.status === 'in-progress') && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => joinMeeting(meeting._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </button>

                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                <Play className="w-4 h-4" />
                                Open in New Tab
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Meeting Scheduling Modals */}
      <MenteeMeetingSchedulingModal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        onSchedule={handleSchedulingSubmit}
        booking={selectedBookingForMeeting}
      />

      <MeetingConfirmationModal
        isOpen={showConfirmationModal}
        meetingDetails={meetingDetails}
        onConfirm={handleConfirmationConfirm}
        onCancel={handleConfirmationCancel}
      />

      <MeetingLoader
        isVisible={showLoader}
        currentStep={loaderStep}
        totalSteps={4}
      />

      <MeetingLinkDisplay
        isVisible={showLinkDisplay}
        meetingDetails={meetingDetails}
        meetingLink={generatedMeetingLink}
        onClose={handleLinkDisplayClose}
        onScheduleAnother={() => {
          handleLinkDisplayClose();
          setShowSchedulingModal(true);
        }}
      />
    </div>
  );
};

export default BookingsAndMeetingsPage;
