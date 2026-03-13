import React, { useState, useEffect } from 'react';
import { Star, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { serviceFeedbackAPI } from '../../../utils/api';

export default function CommentForm({ service, onFeedbackSubmitted }) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasExistingFeedback, setHasExistingFeedback] = useState(false);
  const [checkingFeedback, setCheckingFeedback] = useState(true);

  // Check if user has already left feedback
  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (!isAuthenticated || !service?._id) {
        setCheckingFeedback(false);
        return;
      }

      try {
        // Fetch feedbacks for this service and check if current user has one
        const response = await serviceFeedbackAPI.getByService(service._id, { page: 1, limit: 100 });
        if (response.data?.success) {
          const feedbacks = response.data.data?.feedbacks || [];
          const userFeedback = feedbacks.find(f => f.menteeId?._id === user.id || f.menteeId === user.id);
          setHasExistingFeedback(!!userFeedback);
        }
      } catch (error) {
        console.error('Error checking existing feedback:', error);
      } finally {
        setCheckingFeedback(false);
      }
    };

    checkExistingFeedback();
  }, [isAuthenticated, service?._id, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please log in to share your feedback.');
      return;
    }

    if (rating === 0) {
      setError('Please tap a star to rate this service.');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a few words about your experience.');
      return;
    }

    if (comment.trim().length > 1000) {
      setError('Your comment is too long — please keep it under 1,000 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const response = await serviceFeedbackAPI.create(service._id, {
        rating,
        comment: comment.trim()
      });

      if (response.data?.success) {
        setSuccess(true);
        setRating(0);
        setComment('');
        setHasExistingFeedback(true);

        // Call callback to refresh feedbacks list
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(response.data?.message || "We couldn't submit your feedback. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || "We couldn't submit your feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingFeedback) {
    return (
      <section aria-labelledby="comment-heading" className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section aria-labelledby="comment-heading" className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 id="comment-heading" className="text-xl font-semibold text-gray-900 mb-4">
          Leave a Comment
        </h3>
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Please <a href="/login" className="font-semibold underline hover:text-blue-900">log in</a> to leave feedback on this service.
          </p>
        </div>
      </section>
    );
  }

  if (hasExistingFeedback) {
    return (
      <section aria-labelledby="comment-heading" className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 id="comment-heading" className="text-xl font-semibold text-gray-900 mb-4">
          Leave a Comment
        </h3>
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Thanks! You've already shared your feedback for this service.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="comment-heading" className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 id="comment-heading" className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                className={`transition-all duration-200 transform hover:scale-110 ${star <= (hoveredRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
                  }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-8 h-8 md:w-10 md:h-10 ${star <= (hoveredRating || rating)
                    ? 'fill-current'
                    : 'stroke-current fill-none'
                    }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-600">
                {rating} star{rating > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D38DE] focus:border-transparent outline-none transition-all duration-200 resize-none bg-white text-gray-900 placeholder-gray-400"
            placeholder="Share your experience with this service..."
            aria-label="Comment"
            aria-describedby="comment-help comment-error"
          />
          <div className="flex items-center justify-between">
            <p id="comment-help" className="text-xs text-gray-500">
              {comment.length}/1000 characters
            </p>
            {comment.length > 900 && (
              <p className="text-xs text-amber-600">Character limit approaching</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800" id="comment-error">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              Thank you! Your feedback has been submitted successfully.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0 || !comment.trim()}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5D38DE] to-[#4d2ec4] text-white font-semibold rounded-lg hover:from-[#4d2ec4] hover:to-[#3d24b3] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
