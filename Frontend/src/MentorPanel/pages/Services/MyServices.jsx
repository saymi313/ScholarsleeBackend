import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceList from '../../components/ServicesComponents/ServiceList';
import Sidebar from '../../components/Shared/Sidebar';
import TopBar from '../../components/Shared/TopBar';

const MyServices = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <ServiceList />
        </main>
      </div>
    </div>
  );
};

export default MyServices;
