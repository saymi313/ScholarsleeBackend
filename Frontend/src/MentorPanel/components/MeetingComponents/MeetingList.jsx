import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Video, Play, Square, MoreVertical, Eye, X, CheckCircle } from 'lucide-react';
import { meetingAPI } from '../../../utils/api';

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, scheduled, in-progress, completed, cancelled

  useEffect(() => {
    loadMeetings();
  }, [filter]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = { status: filter === 'all' ? '' : filter };
      const response = await meetingAPI.getMentorMeetings(params);
      
      if (response.data && response.data.success) {
        setMeetings(response.data.data.meetings || []);
      } else {
        setError(response.data?.message || 'Failed to load meetings');
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async (meetingId) => {
    try {
      const response = await meetingAPI.startMeeting(meetingId);
      if (response.data && response.data.success) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting._id === meetingId 
              ? { ...meeting, status: 'in-progress' }
              : meeting
          )
        );
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
      alert('Failed to start meeting');
    }
  };

  const endMeeting = async (meetingId) => {
    try {
      const response = await meetingAPI.endMeeting(meetingId, {
        notes: 'Meeting completed successfully'
      });
      if (response.data && response.data.success) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting._id === meetingId 
              ? { ...meeting, status: 'completed' }
              : meeting
          )
        );
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
      alert('Failed to end meeting');
    }
  };

  const cancelMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;

    try {
      const response = await meetingAPI.cancelMeeting(meetingId, {
        reason: 'Cancelled by mentor'
      });
      if (response.data && response.data.success) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting._id === meetingId 
              ? { ...meeting, status: 'cancelled' }
              : meeting
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      alert('Failed to cancel meeting');
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'scheduled': <Calendar className="w-4 h-4" />,
      'in-progress': <Play className="w-4 h-4" />,
      'completed': <CheckCircle className="w-4 h-4" />,
      'cancelled': <X className="w-4 h-4" />,
      'no-show': <X className="w-4 h-4" />
    };
    return iconMap[status] || <Calendar className="w-4 h-4" />;
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadMeetings}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === filterType
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meetings Found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You don\'t have any meetings scheduled yet.'
              : `No ${filter} meetings found.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                isMeetingTime(meeting.scheduledDate) && meeting.status === 'scheduled'
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meeting.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meeting.status)}`}>
                      {getStatusIcon(meeting.status)}
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                    {isMeetingTime(meeting.scheduledDate) && meeting.status === 'scheduled' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        Starting Soon
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Mentee: {meeting.menteeId?.profile?.firstName} {meeting.menteeId?.profile?.lastName}</span>
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
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Description:</strong> {meeting.description}
                      </p>
                    </div>
                  )}

                  {meeting.meetingLink && (
                    <div className="mt-3 flex gap-2">
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                      
                      {meeting.status === 'scheduled' && (
                        <button
                          onClick={() => startMeeting(meeting._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Start Meeting
                        </button>
                      )}
                      
                      {meeting.status === 'in-progress' && (
                        <button
                          onClick={() => endMeeting(meeting._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Square className="w-4 h-4" />
                          End Meeting
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {/* View meeting details */}}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {(meeting.status === 'scheduled' || meeting.status === 'in-progress') && (
                    <button
                      onClick={() => cancelMeeting(meeting._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel Meeting"
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
  );
};

export default MeetingList;
