import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { servicesAPI } from '../../../utils/api';

const DeleteServiceModal = ({ isOpen, onClose, service, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!service) return;

    setLoading(true);
    setError('');

    try {
      const response = await servicesAPI.delete(service._id);
      
      if (response.data && response.data.success) {
        console.log('✅ Delete successful');
        // Close modal immediately
        onClose();
        // Call success callback to refresh the list
        onSuccess && onSuccess();
      } else {
        console.log('❌ Delete failed:', response.data);
        setError(response.data?.message || 'Failed to delete service');
        setLoading(false); // Stop loading on error
      }
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      setError(error.message || 'Failed to delete service');
      setLoading(false); // Stop loading on error
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] shadow-xl rounded-2xl border border-[#2a2a2a]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Service</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">"{service.title}"</span>? 
                This action cannot be undone and will permanently remove the service from your portfolio.
              </p>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Service Details:</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p><span className="text-gray-300">Category:</span> {service.category}</p>
                  <p><span className="text-gray-300">Packages:</span> {service.packages?.length || 0} packages</p>
                  <p><span className="text-gray-300">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      service.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                      service.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                      service.status === 'rejected' ? 'bg-red-600/20 text-red-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {service.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
