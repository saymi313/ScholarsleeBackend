import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../../shared/components/ImageUpload';

const ServiceForm = ({ isEdit = false, service = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    packages: [
      { name: 'Basic', price: '', duration: '', features: [], calls: 1 },
      { name: 'Standard', price: '', duration: '', features: [], calls: 2 },
      { name: 'Premium', price: '', duration: '', features: [], calls: 3 }
    ],
    tags: [],
    images: []
  });

  // Initialize form with service data if editing
  useEffect(() => {
    ('ServiceForm useEffect - isEdit:', isEdit, 'service:', service);
    if (isEdit && service) {
      ('Setting form data from service:', service);
      setFormData({
        title: service.title || '',
        description: service.description || '',
        category: service.category || '',
        packages: service.packages || formData.packages,
        tags: service.tags || [],
        images: service.images || []
      });
    }
  }, [isEdit, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      setSuccess(isEdit ? 'Service updated successfully!' : 'Service created successfully!');
      setTimeout(() => {
        navigate('/mentor/services');
      }, 1500);
    } catch (error) {
      console.error('Error saving service:', error);
      setError(error.message || "We couldn't save your service. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Study Abroad Guidance',
    'University Applications',
    'Visa Assistance',
    'Career Counseling',
    'Language Learning',
    'Academic Writing',
    'Research Guidance',
    'Interview Preparation',
    'Scholarship Guidance',
    'Cultural Orientation'
  ];

  ('ServiceForm render - formData:', formData);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isEdit ? 'Edit Service' : 'Create New Service'}
        </h2>
        <p className="text-gray-400">
          {isEdit ? 'Update your service information and packages' : 'Add a new service to your portfolio'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:border-[#5D38DE] focus:outline-none"
                placeholder="e.g., SOP Writing & Review"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:border-[#5D38DE] focus:outline-none"
              placeholder="Describe your service in detail..."
              required
            />
          </div>
        </div>

        {/* Service Images */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-xl font-semibold text-white mb-6">Service Images</h3>

          <ImageUpload
            type="service"
            multiple={true}
            maxFiles={5}
            onUploadSuccess={(fileUrls) => {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...fileUrls]
              }));
            }}
          />

          {/* Display Current Images */}
          {formData.images.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Current Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`}
                      alt={`Service ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[#3a3a3a]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/mentor/services')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#5D38DE] hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;