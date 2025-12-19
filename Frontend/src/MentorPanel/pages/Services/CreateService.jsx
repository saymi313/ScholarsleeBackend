import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/ServicesComponents/ServiceForm';
import Sidebar from '../../components/Shared/Sidebar';
import TopBar from '../../components/Shared/TopBar';

const CreateService = () => {
  const navigate = useNavigate();

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
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create New Service</h1>
              <p className="text-gray-400">Add a new mentorship service to your portfolio</p>
            </div>
          </div>

          {/* Service Form */}
          <div className="max-w-4xl">
            <ServiceForm isEdit={false} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateService;
