"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, DollarSign, Eye, MoreVertical } from "lucide-react"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import ServiceModal from "../../components/ServicesComponents/ServiceModal"
import DeleteServiceModal from "../../components/ServicesComponents/DeleteServiceModal"
import { servicesAPI } from "../../../utils/api"

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  })

  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    loadServices()
  }, [filters])

  const loadServices = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🔧 Loading mentor services...')
      const response = await servicesAPI.getAll(filters)
      console.log('🔧 Services response:', response.data)

      if (response.data.success) {
        setServices(response.data.data.services || [])
        setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0 })
      } else {
        setError(response.data.message || 'Failed to load services')
      }
    } catch (error) {
      console.error('Error loading services:', error)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = () => {
    setSelectedService(null)
    setIsServiceModalOpen(true)
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setIsServiceModalOpen(true)
  }

  const handleDeleteService = (service) => {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  const handleServiceSuccess = () => {
    // Optimistic update - remove service from UI immediately if deleting
    if (selectedService && isDeleteModalOpen) {
      setServices(prev => prev.filter(s => s._id !== selectedService._id))
    }
    // Also refresh from server to ensure consistency
    loadServices()
  }

  const formatPrice = (packages) => {
    if (!packages || packages.length === 0) return 'N/A'
    const minPrice = Math.min(...packages.map(pkg => pkg.price))
    const maxPrice = Math.max(...packages.map(pkg => pkg.price))
    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'rejected': return 'bg-red-500'
      case 'draft': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved'
      case 'pending': return 'Pending'
      case 'rejected': return 'Rejected'
      case 'draft': return 'Draft'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0f0f0f]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading services...</div>
            </div>
          </main>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Services</h1>
              <p className="text-gray-400">Manage your mentorship services and packages</p>
            </div>
            <button
              onClick={handleCreateService}
              className="flex items-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:border-[#5D38DE] focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
              <p className="text-gray-400 text-center mb-6">
                Create your first service to start offering mentorship
              </p>
              <button
                onClick={handleCreateService}
                className="flex items-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#5D38DE] transition-all duration-300"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>

                  {/* Service Image */}
                  <div className="relative aspect-[16/9] bg-[#5D38DE]">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-70"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/50 text-4xl">📚</div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-[#5D38DE] transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {service.description}
                    </p>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">
                          {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#5D38DE]" />
                        <div>
                          <div className="text-xs text-gray-400">Starting at</div>
                          <div className="text-lg font-bold text-white">{formatPrice(service.packages)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#5D38DE] hover:bg-[#4a2bb8] text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.current === 1}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-400">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.current === pagination.pages}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        onSuccess={handleServiceSuccess}
      />

      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        service={selectedService}
        onSuccess={handleServiceSuccess}
      />
    </div>
  )
}

export default Services