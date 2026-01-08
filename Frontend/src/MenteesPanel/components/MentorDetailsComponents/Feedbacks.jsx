import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, MessageSquare, Tag, Filter } from 'lucide-react';
import { serviceFeedbackAPI } from '../../../utils/api';

export default function Feedbacks({ mentorData }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [filterService, setFilterService] = useState('all');
  const [services, setServices] = useState([]);

  const mentorId = mentorData?.userId?._id || mentorData?.userId || mentorData?._id;

  useEffect(() => {
    if (mentorId) {
      loadFeedbacks();
    }
  }, [mentorId]);

  useEffect(() => {
    if (mentorId) {
      loadServices();
    }
  }, [mentorId]);

  // Filter feedbacks by service on frontend (since backend doesn't support service filter yet)
  const filteredFeedbacks = filterService === 'all'
    ? feedbacks
    : feedbacks.filter(f => {
      const serviceId = f.serviceId?._id || f.serviceId;
      return serviceId === filterService;
    });

  const loadFeedbacks = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await serviceFeedbackAPI.getByMentor(mentorId, {
        page,
        limit: pagination.limit
      });

      if (response.data?.success) {
        const feedbacksData = response.data.data?.feedbacks || [];
        setFeedbacks(feedbacksData);
        setPagination(response.data.data?.pagination || pagination);
      } else {
        setError(response.data?.message || 'Please login or register to view feedbacks');
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setError('Please login or register your account to view feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      // Extract unique services from feedbacks
      const response = await serviceFeedbackAPI.getByMentor(mentorId, {
        page: 1,
        limit: 100
      });

      if (response.data?.success) {
        const feedbacksData = response.data.data?.feedbacks || [];
        const uniqueServices = [];
        const serviceIds = new Set();

        feedbacksData.forEach(feedback => {
          const serviceId = feedback.serviceId?._id || feedback.serviceId;
          const serviceTitle = feedback.serviceId?.title || 'Unknown Service';

          if (serviceId && !serviceIds.has(serviceId)) {
            serviceIds.add(serviceId);
            uniqueServices.push({
              _id: serviceId,
              title: serviceTitle
            });
          }
        });

        setServices(uniqueServices);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  };

  const getMenteeName = (menteeId) => {
    if (!menteeId) return 'Anonymous';
    if (typeof menteeId === 'string') return 'Anonymous';

    const firstName = menteeId.profile?.firstName || '';
    const lastName = menteeId.profile?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Anonymous';
  };

  const getMenteeAvatar = (menteeId) => {
    if (!menteeId || typeof menteeId === 'string') return null;
    return menteeId.profile?.avatar || null;
  };

  const getServiceName = (serviceId) => {
    if (!serviceId) return 'Unknown Service';
    if (typeof serviceId === 'string') return 'Unknown Service';
    return serviceId.title || 'Unknown Service';
  };

  if (loading && feedbacks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D38DE]"></div>
        </div>
      </div>
    );
  }

  if (error && feedbacks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Reviews & Feedback
          </h3>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {pagination.total} {pagination.total === 1 ? 'review' : 'reviews'} across all services
            </p>
          )}
        </div>

        {/* Service Filter */}
        {services.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D38DE] focus:border-transparent outline-none text-sm bg-white text-gray-900"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredFeedbacks.length === 0 && feedbacks.length > 0 ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback for selected service</h4>
          <p className="text-sm text-gray-600">
            Try selecting a different service or view all feedbacks.
          </p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
          <p className="text-sm text-gray-600">
            This mentor hasn't received any feedback yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => {
              const menteeName = getMenteeName(feedback.menteeId);
              const menteeAvatar = getMenteeAvatar(feedback.menteeId);
              const menteeInitials = getAvatarInitials(
                feedback.menteeId?.profile?.firstName,
                feedback.menteeId?.profile?.lastName
              );
              const serviceName = getServiceName(feedback.serviceId);

              return (
                <div
                  key={feedback._id}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {menteeAvatar ? (
                        <img
                          src={menteeAvatar}
                          alt={menteeName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5D38DE] to-[#4d2ec4] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                          {menteeInitials}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {menteeName}
                            </h4>
                            {/* Service Tag */}
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                              <Tag className="w-3 h-3" />
                              <span>{serviceName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= feedback.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                    }`}
                                />
                              ))}
                              <span className="ml-1 text-sm font-medium text-gray-700">
                                {feedback.rating}.0
                              </span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={feedback.createdAt}>
                                {formatDate(feedback.createdAt)}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mt-3">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {feedback.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => loadFeedbacks(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => loadFeedbacks(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

