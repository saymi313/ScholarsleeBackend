import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CheckoutProvider } from './context/CheckoutContext'
import AppRoutes from './MenteesPanel/Routes/Routes'
import AdminRoutes from './AdminPanel/Routes/Routes'
import MentorRouter from './MentorPanel/Routes/Routes'
import AdminLogin from './AdminPanel/pages/Login'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import SelectRole from './pages/SelectRole'
import VerifyEmail from './pages/VerifyEmail'
import MentorPendingApproval from './pages/MentorPendingApproval'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'

function App() {
  return (
    <AuthProvider>
      <CheckoutProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Google OAuth callback route */}
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            {/* Role selection for new Google OAuth users */}
            <Route path="/select-role" element={<SelectRole />} />
            {/* Email verification */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Mentor pending approval page */}
            <Route path="/mentor-pending-approval" element={<MentorPendingApproval />} />
            {/* Admin login route - separate from protected admin routes */}
            <Route path="/xyz/admin/authenticate" element={<AdminLogin />} />
            {/* Mentor routes first to avoid catch-all conflicts */}
            <Route path="/mentor/*" element={<MentorRouter />} />
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            {/* Stripe payment redirects */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            {/* All other routes handled by MenteesPanel */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Router>
      </CheckoutProvider>
    </AuthProvider>
  )
}

export default App
