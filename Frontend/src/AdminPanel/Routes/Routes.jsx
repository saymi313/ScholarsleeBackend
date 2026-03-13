import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'
import ProtectedRoute from '../components/ProtectedRoute'
import { AdminStoreProvider } from '../state/AdminStore'
import Users from '../pages/Users'
import Dashboard from '../pages/Dashboard'
import Mentors from '../pages/Mentors'
import Services from '../pages/Services'
import Sessions from '../pages/Sessions'
import Reviews from '../pages/Reviews'
import Payments from '../pages/Payments'
import Notifications from '../pages/Notifications'
import Settings from '../pages/Settings'
import Logs from '../pages/Logs'
import Admins from '../pages/Admins'
import Payouts from '../pages/Payouts'

const Shell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <AdminStoreProvider>
      <div className="flex min-h-screen bg-[#0a0a0a] text-white font-['Poppins']">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onMenu={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminStoreProvider>
  )
}

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Shell><Dashboard /></Shell>} />
        <Route path="users" element={<Shell><Users /></Shell>} />
        <Route path="mentors" element={<Shell><Mentors /></Shell>} />
        <Route path="services" element={<Shell><Services /></Shell>} />
        <Route path="sessions" element={<Shell><Sessions /></Shell>} />
        <Route path="reviews" element={<Shell><Reviews /></Shell>} />
        <Route path="payments" element={<Shell><Payments /></Shell>} />
        <Route path="notifications" element={<Shell><Notifications /></Shell>} />
        <Route path="settings" element={<Shell><Settings /></Shell>} />
        <Route path="logs" element={<Shell><Logs /></Shell>} />
        <Route path="admins" element={<Shell><Admins /></Shell>} />
        <Route path="payouts" element={<Shell><Payouts /></Shell>} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  )
}


