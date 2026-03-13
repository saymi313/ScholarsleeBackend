import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, DollarSign } from 'lucide-react';
import { servicesAPI } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';

const ServiceList = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      console.log('🔧 Loading services for ServiceList...');
      const response = await servicesAPI.getAll(filters);
      console.log('🔧 ServiceList response:', response.data);

      if (response.data.success) {
        setServices(response.data.data.services || []);
      } else {
        setError(response.data.message || "We couldn't load your services. Please refresh the page.");
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError("We couldn't load your services. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        console.log('🗑️ Deleting service:', serviceId);
        const response = await servicesAPI.delete(serviceId);
        console.log('🗑️ Delete response:', response);
        console.log('🗑️ Delete response data:', response.data);
        console.log('🗑️ Delete response status:', response.status);

        // Check for success in multiple ways
        const isSuccess = response.data?.success === true ||
          response.status === 200 ||
          response.statusText === 'OK';

        if (isSuccess) {
          console.log('✅ Delete successful, updating UI');
          setServices(services.filter(service => service._id !== serviceId));
          showSuccess('Service deleted successfully!');
        } else {
          console.log('❌ Delete failed:', response.data);
          showError(response.data?.message || "We couldn't delete this service. Please try again.");
        }
      } catch (error) {
        console.error('❌ Error deleting service:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        showError("We couldn't delete this service. Please try again.");
      }
    }
  };

  const formatPrice = (packages) => {
    if (!packages || packages.length === 0) return 'N/A';
    const minPrice = Math.min(...packages.map(pkg => pkg.price));
    const maxPrice = Math.max(...packages.map(pkg => pkg.price));
    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Services</h1>
          <p className="text-gray-400">Manage your mentorship services and packages</p>
        </div>
        <button
          onClick={() => navigate('/mentor/services/create')}
          className="flex items-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
          <p className="text-gray-400 text-center mb-6">
            Create your first service to start offering mentorship
          </p>
          <button
            onClick={() => navigate('/mentor/services/create')}
            className="flex items-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#5D38DE] transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>

              {/* Service Image */}
              <div className="relative aspect-[4/3] bg-[#5D38DE]">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/50 text-4xl">📚</div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-[#5D38DE] transition-colors">
                    {service.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {service.description}
                </p>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">
                      {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#5D38DE]" />
                    <div>
                      <div className="text-xs text-gray-400">Starting at</div>
                      <div className="text-lg font-bold text-white">{formatPrice(service.packages)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/mentor/services/${service._id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;