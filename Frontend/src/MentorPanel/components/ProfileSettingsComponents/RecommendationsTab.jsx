"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, Quote, Calendar, Tag, MessageSquare, Loader2 } from "lucide-react"
import { profileAPI, mentorFeedbackAPI } from "../../../utils/api"
import { useAuth } from "../../../context/AuthContext"

const RecommendationsTab = () => {
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 50
  })

  // Helper functions
  const getMenteeName = (menteeId) => {
    if (!menteeId) return 'Anonymous'
    if (typeof menteeId === 'string') return 'Anonymous'
    
    const firstName = menteeId.profile?.firstName || ''
    const lastName = menteeId.profile?.lastName || ''
    return `${firstName} ${lastName}`.trim() || 'Anonymous'
  }

  const getMenteeAvatar = (menteeId) => {
    if (!menteeId || typeof menteeId === 'string') return null
    return menteeId.profile?.avatar || null
  }

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return first + last || 'U'
  }

  const getServiceName = (serviceId) => {
    if (!serviceId) return 'Service Feedback'
    if (typeof serviceId === 'string') return 'Service Feedback'
    return serviceId.title || 'Service Feedback'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const loadRecommendations = async () => {
    try {
      const res = await profileAPI.mentor.get()
      if (res.data?.success) {
        const recs = res.data.data.profile?.recommendations || []
        const mapped = recs.map((r, idx) => ({
          id: r._id || idx,
          name: r.fromName || 'Anonymous',
          title: r.rating ? `${r.rating}★` : '',
          image: "",
          rating: r.rating || 5,
          date: new Date(r.createdAt || Date.now()).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          text: r.text || '',
          type: 'recommendation'
        }))
        // Merge with feedbacks if needed, or keep separate
        return mapped
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
    return []
  }

  const loadFeedbacks = async (page = 1) => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await mentorFeedbackAPI.getMyFeedbacks({
        page,
        limit: 50
      })

      if (response.data?.success) {
        const feedbacksData = response.data.data?.feedbacks || []
        
        // Transform feedbacks to match testimonial format
        const mappedFeedbacks = feedbacksData.map((feedback) => {
          const menteeName = getMenteeName(feedback.menteeId)
          const serviceName = getServiceName(feedback.serviceId)
          const menteeAvatar = getMenteeAvatar(feedback.menteeId)

          return {
            id: feedback._id,
            name: menteeName,
            title: serviceName,
            image: menteeAvatar || '',
            rating: feedback.rating,
            date: formatDate(feedback.createdAt),
            text: feedback.comment,
            type: 'feedback',
            serviceName: serviceName,
            createdAt: feedback.createdAt
          }
        })

        setFeedbacks(mappedFeedbacks)
        setPagination(prev => ({
          ...prev,
          ...(response.data.data?.pagination || {}),
          current: page
        }))
        
        // Also set as testimonials for the carousel
        setTestimonials(mappedFeedbacks)
      } else {
        setError(response.data?.message || 'Failed to load feedbacks')
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error)
      setError('Failed to load feedbacks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadFeedbacks(1)
      // Also load old recommendations if needed
      loadRecommendations()
    }
  }, [user?.id])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex] || {}

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error && feedbacks.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-red-500/30">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Featured Feedback Carousel */}
      {testimonials.length > 0 && (
        <div className="bg-gradient-to-br from-[#5D38DE]/20 to-[#1a1a1a] rounded-2xl p-8 border border-[#5D38DE]/30 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[#5D38DE]/20">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              {currentTestimonial.image ? (
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-20 h-20 rounded-full border-4 border-[#5D38DE] object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-[#5D38DE] bg-gradient-to-br from-[#5D38DE] to-[#4d2ec4] flex items-center justify-center text-white font-bold text-2xl">
                  {getAvatarInitials(
                    currentTestimonial.name?.split(' ')[0],
                    currentTestimonial.name?.split(' ')[1]
                  )}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{currentTestimonial.name}</h3>
                {currentTestimonial.serviceName && (
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="w-4 h-4 text-[#5D38DE]" />
                    <p className="text-sm text-gray-400">{currentTestimonial.serviceName}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-600 text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {currentTestimonial.date}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">{currentTestimonial.text}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-[#5D38DE] w-8" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  disabled={testimonials.length === 0}
                  className="p-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  disabled={testimonials.length === 0}
                  className="p-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Feedbacks Grid */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#5D38DE]" />
            <h2 className="text-2xl font-bold text-white">
              All Feedbacks ({pagination.total || feedbacks.length})
            </h2>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No feedbacks yet</h3>
            <p className="text-sm text-gray-500">
              You haven't received any feedbacks from mentees yet. Feedbacks will appear here once mentees leave reviews on your services.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-[#242424] rounded-xl p-5 border border-[#3a3a3a] hover:border-[#5D38DE]/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  {feedback.image ? (
                    <img
                      src={feedback.image}
                      alt={feedback.name}
                      className="w-12 h-12 rounded-full border-2 border-[#5D38DE] object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-[#5D38DE] bg-gradient-to-br from-[#5D38DE] to-[#4d2ec4] flex items-center justify-center text-white font-semibold text-sm">
                      {getAvatarInitials(
                        feedback.name?.split(' ')[0],
                        feedback.name?.split(' ')[1]
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{feedback.name}</h4>
                    {feedback.serviceName && (
                      <div className="flex items-center gap-1 mt-1">
                        <Tag className="w-3 h-3 text-[#5D38DE]" />
                        <p className="text-xs text-gray-400 truncate">{feedback.serviceName}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-600 text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {feedback.date.split(',')[0]}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">{feedback.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#2a2a2a]">
            <button
              onClick={() => loadFeedbacks(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#242424] border border-[#3a3a3a] rounded-lg hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-400">
              Page {pagination.current} of {pagination.pages}
            </span>
            <button
              onClick={() => loadFeedbacks(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#242424] border border-[#3a3a3a] rounded-lg hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendationsTab
