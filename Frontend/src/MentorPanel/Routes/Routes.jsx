import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Services from '../pages/Services'
import Chats from '../pages/Chats'
import Meetings from '../pages/Meetings'
import GoogleMeetCallback from '../pages/Meetings/GoogleMeetCallback'
import Revenue from '../pages/Revenue'
import Badges from '../pages/Badges'
import ProfileSettings from '../pages/ProfileSettings'
import Wallet from '../pages/Wallet'

const MentorRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="services" element={<Services />} />
      <Route path="chats" element={<Chats />} />
      <Route path="meetings" element={<Meetings />} />
      <Route path="google-meet/callback" element={<GoogleMeetCallback />} />
      <Route path="revenue" element={<Revenue />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="badges" element={<Badges />} />
      <Route path="settings" element={<ProfileSettings />} />
      {/* Default redirect for /mentor to /mentor/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}

export default MentorRouter

