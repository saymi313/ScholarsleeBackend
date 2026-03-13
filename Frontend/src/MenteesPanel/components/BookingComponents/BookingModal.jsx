import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, User, MessageSquare, Info, Globe } from 'lucide-react';
import { paymentAPI } from '../../../utils/api';

const getPackageDurationInMinutes = (value, fallback = 60) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const match = value.match(/\d+/);
    if (match) {
      const minutes = parseInt(match[0], 10);
      if (Number.isFinite(minutes)) {
        return minutes;
      }
    }
  }

  return fallback;
};

const BookingModal = ({ isOpen, onClose, service, selectedPackage, onSuccess }) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    duration: 60,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const packageToUse = selectedPackage || service?.packages?.[0];
    if (packageToUse && isOpen) {
      const defaultDuration = getPackageDurationInMinutes(packageToUse.duration, 60);
      setFormData(prev => ({
        ...prev,
        duration: defaultDuration
      }));
    }
  }, [service, selectedPackage, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service) return;

    setLoading(true);
    setError('');

    try {
      const normalizedDuration = Number(formData.duration);
      if (!normalizedDuration || Number.isNaN(normalizedDuration) || normalizedDuration <= 0) {
        setError("Please choose how long you'd like the session to be.");
        setLoading(false);
        return;
      }

      if (!formData.scheduledDate) {
        setError('Please pick a date and time for your session.');
        setLoading(false);
        return;
      }

      const packageToBook = selectedPackage || service.packages?.[0];
      if (!packageToBook?._id) {
        setError('Something went wrong with the selected package. Please try selecting it again.');
        setLoading(false);
        return;
      }

      const isoScheduledDate = new Date(formData.scheduledDate).toISOString();

      const response = await paymentAPI.createCheckoutSession({
        serviceId: service._id,
        packageId: packageToBook._id,
        scheduledDate: isoScheduledDate,
        duration: normalizedDuration,
        notes: formData.notes
      });

      const checkoutUrl = response?.data?.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError(response.data?.message || "We couldn't start your payment. Please try again or contact support if this keeps happening.");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message || "We couldn't start your payment. Please try again or contact support if this keeps happening.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value
    }));
  };

  if (!isOpen || !service) return null;

  const activePackage = selectedPackage || service.packages?.[0];
  const totalAmount = activePackage?.price || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Book Service</h3>
                <p className="text-gray-600 text-sm">{service.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Service Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Mentor:</span>
                  <span className="font-medium">{service.mentorId?.profile?.firstName} {service.mentorId?.profile?.lastName}</span>
                </div>
                <div className="flex items-center justify-between col-span-2 p-3 bg-white border border-gray-200 rounded-xl mt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">Price Breakdown</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Base: ${totalAmount}</span>
                      <span className="text-gray-400">+</span>
                      <span className="text-gray-600">Fee: ${Math.max(0, (Math.ceil(((totalAmount + 0.30) / (1 - 0.029)) * 100) / 100) - totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total to Pay</p>
                    <p className="text-xl font-black text-[#5D38DE]">
                      ${(Math.ceil(((totalAmount + 0.30) / (1 - 0.029)) * 100) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#5D38DE]" />
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Mentor Availability</h4>
              </div>

              {service.mentorAvailability && (service.mentorAvailability.daysAvailable?.length > 0 || service.mentorAvailability.workingHours) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">TZ:</span>
                    <span className="text-gray-700 font-medium">{service.mentorAvailability.timezone || 'UTC'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">Hours:</span>
                    <span className="text-gray-700 font-medium">{service.mentorAvailability.workingHours || 'Not specified'}</span>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {service.mentorAvailability.daysAvailable?.length > 0 ? (
                        service.mentorAvailability.daysAvailable.map(day => (
                          <span key={day} className="px-2 py-0.5 bg-white text-[#5D38DE] text-[10px] font-bold uppercase rounded border border-indigo-100">
                            {day.substring(0, 3)}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">No specific days set</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 mt-1 py-1">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm leading-tight">
                    <span className="font-semibold text-indigo-700">Flexible timings:</span> Your mentor will coordinate a suitable time with you after booking.
                  </p>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any specific requirements or questions for your mentor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Book Now - ${(Math.ceil(((totalAmount + 0.30) / (1 - 0.029)) * 100) / 100).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
