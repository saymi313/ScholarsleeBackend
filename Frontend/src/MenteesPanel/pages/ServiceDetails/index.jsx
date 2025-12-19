import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumb from "../../components/ServiceDetailsComponents/Breadcrumb"
import ServiceHeader from "../../components/ServiceDetailsComponents/ServiceHeader"
import RatingSummary from "../../components/ServiceDetailsComponents/RatingSummary"
import Overview from "../../components/ServiceDetailsComponents/Overview"
import Features from "../../components/ServiceDetailsComponents/Features"
import PricingSlidePanel from "../../components/ServiceDetailsComponents/PricingSlidePanel"
import MentorProfile from "../../components/ServiceDetailsComponents/MentorProfile"
import PackagesComparison from "../../components/ServiceDetailsComponents/PackagesComparision"
import CommentForm from "../../components/ServiceDetailsComponents/CommentForm"
import FeedbackList from "../../components/ServiceDetailsComponents/FeedbackList"
import RelatedServices from "../../components/ServiceDetailsComponents/RelatedServices"
import BookingModal from "../../components/BookingComponents/BookingModal"
import Header from "../../components/Shared/Header"
import { menteeServicesAPI } from "../../../utils/api"

export default function ServiceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedPackageId, setSelectedPackageId] = useState(null)

  useEffect(() => {
    if (id) {
      loadService()
    }
  }, [id])

  const loadService = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔍 Loading service with ID:', id)
      const response = await menteeServicesAPI.getById(id)
      console.log('📡 Service API response:', response)
      
      if (response.data && response.data.success) {
        console.log('✅ Service data found:', response.data.data.service)
        const fetchedService = response.data.data.service
        setService(fetchedService)
        if (fetchedService?.packages?.length) {
          setSelectedPackageId(fetchedService.packages[0]._id)
        }
      } else {
        console.log('❌ Service not found:', response.data?.message)
        setError(response.data?.message || 'Service not found')
      }
    } catch (error) {
      console.error('❌ Error loading service:', error)
      setError('Failed to load service')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmitted = async () => {
    // Refresh feedbacks list
    setRefreshTrigger(prev => prev + 1)
    
    // Reload service to get updated rating
    if (service?._id) {
      try {
        const response = await menteeServicesAPI.getById(service._id)
        if (response.data && response.data.success) {
          setService(response.data.data.service)
        }
      } catch (error) {
        console.error('Error reloading service:', error)
      }
    }
  }

  console.log('🔍 ServiceDetails - Current service state:', service)
  console.log('🔍 ServiceDetails - Loading state:', loading)
  console.log('🔍 ServiceDetails - Error state:', error)

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D38DE]"></div>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/mentees/services')}
              className="px-4 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4] transition-colors"
            >
              Back to Services
            </button>
          </div>
        </main>
      </>
    )
  }

  if (!service) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/mentees/services')}
              className="px-4 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4] transition-colors"
            >
              Back to Services
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
    <Header />
    <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Design brand color */}
      <style>{`:root { --brand: #5D38DE; }`}</style>

      <div className="space-y-4">
        <Breadcrumb service={service} />
        <ServiceHeader service={service} />
        <RatingSummary service={service} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Overview service={service} />
          <Features service={service} />
          <MentorProfile service={service} />
          <PackagesComparison service={service} />
          <CommentForm 
            service={service} 
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
          <FeedbackList 
            serviceId={service._id} 
            refreshTrigger={refreshTrigger}
          />
          <RelatedServices service={service} />
        </div>

        <div className="lg:col-span-1">
          <PricingSlidePanel
            service={service}
            onBookNow={() => setShowBookingModal(true)}
            selectedPackageId={selectedPackageId}
            onPackageSelect={setSelectedPackageId}
          />
        </div>
      </div>
    </main>

    {/* Booking Modal */}
    <BookingModal 
      isOpen={showBookingModal}
      onClose={() => setShowBookingModal(false)}
      service={service}
      selectedPackage={service.packages?.find(pkg => pkg._id === selectedPackageId)}
      onSuccess={(booking) => {
        console.log('Booking created successfully:', booking);
        setShowBookingModal(false);
        // Optionally redirect to bookings page
        navigate('/mentees/bookings');
      }}
    />
    </>
  )
}
