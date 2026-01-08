import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Video, Play, CheckCircle, AlertCircle, X, Eye, DollarSign } from 'lucide-react';
import Header from '../../components/Shared/Header';
import Footer from '../../components/Shared/Footer';
import { bookingAPI, meetingAPI } from '../../../utils/api';

const BookingsAndMeetingsPage = () => {
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
        setError(response.data?.message || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please login to view your bookings');
      } else {
        setError('Failed to load bookings. Please login first or register your account.');
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
        setError('Please login to view your meetings');
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
      alert('Failed to cancel booking');
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
      alert('Failed to join meeting');
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bookings & Meetings</h1>
          <p className="mt-2 text-gray-600">
            Manage your service bookings and join scheduled meetings
          </p>
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
                <h3 className="text-sm font-medium text-red-800">Authentication Required</h3>
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

                        <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => {/* View booking details */ }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
};

export default BookingsAndMeetingsPage;
