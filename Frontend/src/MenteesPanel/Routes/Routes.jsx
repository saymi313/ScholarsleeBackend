import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from "../pages/LandingPage"
import Footer from '../components/Shared/Footer'
import MentorPage from '../pages/MentorPage'
import MentorDetails from '../pages/MentorDetails'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import ServicesPage from '../pages/Services'
import PricingPage from '../pages/Pricing'
import ServiceDetailsPage from '../pages/ServiceDetails'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUp'
import ForgotPasswordPage from '../pages/ForgotPassword'
import ProfilePage from '../pages/Profile'
import ChatsPage from '../pages/Chats'
import BookingsAndMeetingsPage from '../pages/BookingsAndMeetings'
import RedirectToBookings from '../components/Shared/RedirectToBookings'
import VerifyEmailPage from '../pages/VerifyEmail'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <LandingPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/profile" element={
        <>
          <ProfilePage />
          <Footer />
        </>
      } />
      <Route path="/home" element={
        <>
          <LandingPage />
          <Footer />
        </>
      } />
      <Route path="/mentees" element={
        <>
          <LandingPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/home" element={
        <>
          <LandingPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/mentors" element={
        <>
          <MentorPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/mentor" element={<Navigate to="/mentees/mentors" replace />} />
      <Route path="/mentees/mentor-details/:id" element={
        <>
          <MentorDetails />
          <Footer />
        </>
      } />
      <Route path="/about" element={
        <>
          <AboutPage />
          <Footer />
        </>
      } />
      <Route path="/contact" element={
        <>
          <ContactPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/services" element={
        <>
          <ServicesPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/service-details" element={
        <>
          <ServiceDetailsPage />
          <Footer />
        </>
      } />
      <Route path="/mentees/service-details/:id" element={
        <>
          <ServiceDetailsPage />
          <Footer />
        </>
      } />
      {/* New Pretty URL Route for Services */}
      <Route path="/service-details/:mentorSlug/:serviceSlug" element={
        <>
          <ServiceDetailsPage />
          <Footer />
        </>
      } />
      <Route path="/service-details/:id" element={
        <>
          <ServiceDetailsPage />
          <Footer />
        </>
      } />

      <Route path="/mentees/chats" element={<ChatsPage />} />
      <Route path="/mentees/bookings" element={
        <>
          <BookingsAndMeetingsPage />
        </>
      } />
      <Route path="/mentees/meetings" element={<RedirectToBookings />} />

      <Route path="/pricings" element={
        <>
          <PricingPage />
          <Footer />
        </>
      } />
      <Route path="/login" element={
        <>
          <LoginPage />

        </>
      } />
      <Route path="/mentees/login" element={
        <>
          <LoginPage />
        </>
      } />
      <Route path="/signup" element={
        <>
          <SignUpPage />
        </>
      } />
      <Route path="/forgot-password" element={
        <>
          <ForgotPasswordPage />
        </>
      } />
      <Route path="/verify-email" element={
        <>
          <VerifyEmailPage />
        </>
      } />

    </Routes>
  )
}

export default AppRoutes
