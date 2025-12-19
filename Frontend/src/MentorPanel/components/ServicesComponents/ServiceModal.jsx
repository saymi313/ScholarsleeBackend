import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Star, DollarSign, Clock } from 'lucide-react';
import { servicesAPI } from '../../../utils/api';

const ServiceModal = ({ isOpen, onClose, service = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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
    if (isOpen) {
      if (service) {
        setFormData({
          title: service.title || '',
          description: service.description || '',
          category: service.category || '',
          packages: service.packages || formData.packages,
          tags: service.tags || [],
          images: service.images || []
        });
      } else {
        // Reset form for new service
        setFormData({
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
      }
      setError('');
      setSuccess('');
    }
  }, [isOpen, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  const handleFeatureChange = (packageIndex, featureIndex, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[packageIndex].features[featureIndex] = value;
    setFormData(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  const addFeature = (packageIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[packageIndex].features.push('');
    setFormData(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  const removeFeature = (packageIndex, featureIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[packageIndex].features.splice(featureIndex, 1);
    setFormData(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (max 2MB per file for faster uploads)
    const maxSize = 2 * 1024 * 1024; // 2MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`Some files are too large. Maximum size is 2MB per file.`);
      return;
    }
    
    // Validate total number of files (max 5 images)
    if (formData.images.length + files.length > 5) {
      setError(`Maximum 5 images allowed. You already have ${formData.images.length} images.`);
      return;
    }
    
    // Convert files to base64 for instant preview and faster upload
    const processFiles = async () => {
      const processedImages = [];
      
      for (const file of files) {
        const base64 = await convertToBase64(file);
        processedImages.push({
          file: file,
          base64: base64,
          name: file.name,
          size: file.size
        });
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...processedImages]
      }));
    };
    
    processFiles();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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

      // Validate packages
      const validPackages = formData.packages.filter(pkg => pkg.price && pkg.duration);
      if (validPackages.length === 0) {
        throw new Error('Please add at least one package with price and duration');
      }

      // Prepare service data without images for now (for faster upload)
      const serviceData = {
        ...formData,
        packages: validPackages,
        images: [] // Skip images for now to make uploads instant
      };

      console.log('🔧 Saving service data:', serviceData);
      let response;
      if (service) {
        console.log('🔧 Updating service:', service._id);
        response = await servicesAPI.update(service._id, serviceData);
      } else {
        console.log('🔧 Creating new service');
        response = await servicesAPI.create(serviceData);
      }

      console.log('🔧 Service save response:', response.data);
      
      if (response.data.success) {
        setSuccess(service ? 'Service updated successfully!' : 'Service created successfully!');
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again with smaller images or check your connection.');
      } else if (error.message.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.');
      } else if (error.message.includes('timeout')) {
        setError('Request timeout. Please try again with smaller images.');
      } else {
        setError(error.message || 'Failed to save service');
      }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] shadow-xl rounded-2xl border border-[#2a2a2a]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {service ? 'Edit Service' : 'Create New Service'}
              </h3>
              <p className="text-gray-400 mt-1">
                {service ? 'Update your service information' : 'Add a new service to your portfolio'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#5D38DE]" />
                  Basic Information
                </h4>
                
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
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:border-[#5D38DE] focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:border-[#5D38DE] focus:outline-none transition-colors"
                    placeholder="Describe your service in detail..."
                    required
                  />
                </div>
              </div>

              {/* Packages */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#5D38DE]" />
                  Service Packages
                </h4>
                
                {formData.packages.map((pkg, index) => (
                  <div key={index} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                    <h5 className="text-md font-medium text-white mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#5D38DE] rounded-full"></div>
                      {pkg.name} Package
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none transition-colors"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={pkg.duration}
                          onChange={(e) => handlePackageChange(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none transition-colors"
                          placeholder="e.g., 30 days"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Calls/Sessions
                        </label>
                        <input
                          type="number"
                          value={pkg.calls}
                          onChange={(e) => handlePackageChange(index, 'calls', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none transition-colors"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Features
                      </label>
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none transition-colors"
                            placeholder="Enter a feature"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index, featureIndex)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addFeature(index)}
                        className="flex items-center gap-2 text-[#5D38DE] hover:text-[#4a2bb8] transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#5D38DE]" />
                  Service Images
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5D38DE] file:text-white hover:file:bg-[#4a2bb8] transition-colors"
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.base64 || (typeof image === 'string' ? image : URL.createObjectURL(image))}
                          alt={`Service ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {loading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading images...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                    <div 
                      className="bg-[#5D38DE] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

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

              {/* Footer */}
              <div className="flex gap-4 pt-6 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#5D38DE] hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
