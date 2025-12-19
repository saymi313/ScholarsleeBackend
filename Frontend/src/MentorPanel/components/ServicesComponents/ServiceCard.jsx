import React from 'react';
import { Star, DollarSign, Edit, Trash2, Eye, Clock } from 'lucide-react';

const ServiceCard = ({ service, onEdit, onDelete, onView }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  return (
    <div className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#5D38DE] transition-all duration-300 hover:shadow-lg hover:shadow-[#5D38DE]/10">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(service.status)}`}>
          {getStatusText(service.status)}
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
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onView && onView(service)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
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

        {/* Packages Count */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{service.packages?.length || 0} packages available</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit && onEdit(service)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(service)}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;