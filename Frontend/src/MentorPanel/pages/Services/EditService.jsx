import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/ServicesComponents/ServiceForm';
import { servicesAPI } from '../../../utils/api';
import Sidebar from '../../components/Shared/Sidebar';
import TopBar from '../../components/Shared/TopBar';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      console.log('🔧 Loading service for edit:', id);
      const response = await servicesAPI.getById(id);
      console.log('🔧 Edit service response:', response.data);
      
      if (response.data.success) {
        setService(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load service');
      }
    } catch (error) {
      console.error('Error loading service:', error);
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0f0f0f]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading service...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#0f0f0f]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">{error}</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex h-screen bg-[#0f0f0f]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Service not found</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/mentor/services')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Services
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Edit Service</h1>
              <p className="text-gray-400">Update your service information and packages</p>
            </div>
          </div>

          {/* Service Form */}
          <div className="max-w-4xl">
            {service ? (
              <ServiceForm isEdit={true} service={service} />
            ) : (
              <div className="text-white">Loading service data...</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditService;
