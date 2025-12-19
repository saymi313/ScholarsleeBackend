"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, Clock, DollarSign, X } from "lucide-react"
import { profileAPI } from "../../../utils/api"

const ServicesTab = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileAPI.mentor.get()
        if (res.data?.success) {
          const svcs = res.data.data.profile?.services || []
          const mapped = svcs.map((s) => ({
            id: s._id,
            title: s.title,
            description: s.description,
            price: Array.isArray(s.packages) && s.packages[0]?.price ? s.packages[0].price : 0,
            rating: s.rating || 0,
            reviews: s.totalReviews || 0,
            deliveryTime: s.packages && s.packages[0]?.duration ? s.packages[0].duration : '',
            category: s.category || '',
            status: s.status || 'Active'
          }))
          setServices(mapped)
        }
      } catch {}
    }
    load()
  }, [])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    overview: "",
    features: [],
    packages: {
      basic: { price: "", features: [], duration: "", calls: "" },
      standard: { price: "", features: [], duration: "", calls: "" },
      premium: { price: "", features: [], duration: "", calls: "" }
    },
    deliveryTime: "",
    category: "Writing",
    mentorBio: "",
    images: [],
    rating: 5.0,
    reviews: 0
  })
  const [newFeature, setNewFeature] = useState("")
  const [editingPackage, setEditingPackage] = useState(null)

  const deleteService = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((service) => service.id !== id))
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setNewService({
        ...newService,
        features: [...newService.features, newFeature.trim()]
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index) => {
    setNewService({
      ...newService,
      features: newService.features.filter((_, i) => i !== index)
    })
  }

  const addPackageFeature = (packageType, feature) => {
    if (feature.trim()) {
      setNewService({
        ...newService,
        packages: {
          ...newService.packages,
          [packageType]: {
            ...newService.packages[packageType],
            features: [...newService.packages[packageType].features, feature.trim()]
          }
        }
      })
    }
  }

  const removePackageFeature = (packageType, index) => {
    setNewService({
      ...newService,
      packages: {
        ...newService.packages,
        [packageType]: {
          ...newService.packages[packageType],
          features: newService.packages[packageType].features.filter((_, i) => i !== index)
        }
      }
    })
  }

  const handleAddService = () => {
    if (newService.title && newService.description && newService.overview) {
      const service = {
        id: Date.now(),
        title: newService.title,
        description: newService.description,
        overview: newService.overview,
        features: newService.features,
        packages: newService.packages,
        deliveryTime: newService.deliveryTime,
        category: newService.category,
        mentorBio: newService.mentorBio,
        images: newService.images,
        rating: newService.rating,
        reviews: newService.reviews,
        status: "Active"
      }
      setServices([...services, service])
      resetForm()
      setShowAddModal(false)
    } else {
      alert("Please fill in all required fields (Title, Description, Overview)")
    }
  }

  const resetForm = () => {
    setNewService({
      title: "",
      description: "",
      overview: "",
      features: [],
      packages: {
        basic: { price: "", features: [], duration: "", calls: "" },
        standard: { price: "", features: [], duration: "", calls: "" },
        premium: { price: "", features: [], duration: "", calls: "" }
      },
      deliveryTime: "",
      category: "Writing",
      mentorBio: "",
      images: [],
      rating: 5.0,
      reviews: 0
    })
    setNewFeature("")
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setNewService({
      title: service.title || "",
      description: service.description || "",
      overview: service.overview || "",
      features: service.features || [],
      packages: service.packages || {
        basic: { price: "", features: [], duration: "", calls: "" },
        standard: { price: "", features: [], duration: "", calls: "" },
        premium: { price: "", features: [], duration: "", calls: "" }
      },
      deliveryTime: service.deliveryTime || "",
      category: service.category || "Writing",
      mentorBio: service.mentorBio || "",
      images: service.images || [],
      rating: service.rating || 5.0,
      reviews: service.reviews || 0
    })
    setShowAddModal(true)
  }

  const handleUpdateService = () => {
    if (newService.title && newService.description && newService.overview) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              title: newService.title,
              description: newService.description,
              overview: newService.overview,
              features: newService.features,
              packages: newService.packages,
              deliveryTime: newService.deliveryTime,
              category: newService.category,
              mentorBio: newService.mentorBio,
              images: newService.images,
              rating: newService.rating,
              reviews: newService.reviews
            }
          : service
      ))
      setEditingService(null)
      resetForm()
      setShowAddModal(false)
    } else {
      alert("Please fill in all required fields (Title, Description, Overview)")
    }
  }

  const handleCancelModal = () => {
    setShowAddModal(false)
    setEditingService(null)
    resetForm()
  }

  return (
    <div className="space-y-6 min-w-0">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">My Services</h2>
          <p className="text-gray-400 text-sm sm:text-base">Manage your service offerings and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#5D38DE] text-white rounded-xl hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a] hover:border-[#5D38DE]/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 sm:px-3 py-1 bg-[#5D38DE]/20 text-[#5D38DE] text-xs font-semibold rounded-full whitespace-nowrap">
                    {service.category}
                  </span>
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      service.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 break-words">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed break-words">{service.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="font-semibold">{service.rating}</span>
                <span className="text-gray-400">({service.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{service.deliveryTime}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE] flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400">Starting at</div>
                  <div className="text-lg sm:text-xl font-bold text-white break-all">Rs {service.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2 justify-end sm:justify-start">
                <button 
                  onClick={() => handleEditService(service)}
                  className="p-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Service Form (shown when showAddModal is true) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#2a2a2a] max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleCancelModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-[#242424] text-gray-400 rounded-lg hover:bg-[#2a2a2a] hover:text-white transition-colors border border-[#3a3a3a]"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 pr-10 sm:pr-12">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-[#3a3a3a] pb-2">Basic Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Service Title *</label>
                  <input
                    type="text"
                    value={newService.title}
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                    className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., SOP Writing & Review"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Short Description *</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[80px] resize-none text-sm sm:text-base"
                    placeholder="Brief description of your service..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Overview *</label>
                  <textarea
                    value={newService.overview}
                    onChange={(e) => setNewService({...newService, overview: e.target.value})}
                    className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none text-sm sm:text-base"
                    placeholder="Detailed overview of what you offer..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select 
                      value={newService.category}
                      onChange={(e) => setNewService({...newService, category: e.target.value})}
                      className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    >
                      <option value="Writing">Writing</option>
                      <option value="Mentoring">Mentoring</option>
                      <option value="Career">Career</option>
                      <option value="Technical">Technical</option>
                      <option value="Study Abroad">Study Abroad</option>
                      <option value="Visa">Visa</option>
                      <option value="Interview Prep">Interview Prep</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Time</label>
                    <input
                      type="text"
                      value={newService.deliveryTime}
                      onChange={(e) => setNewService({...newService, deliveryTime: e.target.value})}
                      className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                      placeholder="3-5 days"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-[#3a3a3a] pb-2">Service Features</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button
                    onClick={addFeature}
                    className="px-4 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {newService.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#242424] rounded-lg p-3">
                      <span className="text-white">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Pricing */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-[#3a3a3a] pb-2">Package Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['basic', 'standard', 'premium'].map((packageType) => (
                    <div key={packageType} className="bg-[#242424] rounded-lg p-4 border border-[#3a3a3a]">
                      <h5 className="text-white font-semibold mb-3 capitalize">{packageType} Package</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Price (Rs)</label>
                          <input
                            type="number"
                            value={newService.packages[packageType].price}
                            onChange={(e) => setNewService({
                              ...newService,
                              packages: {
                                ...newService.packages,
                                [packageType]: {
                                  ...newService.packages[packageType],
                                  price: e.target.value
                                }
                              }
                            })}
                            className="w-full bg-[#1a1a1a] text-white rounded p-2 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm"
                            placeholder="5000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Duration</label>
                          <input
                            type="text"
                            value={newService.packages[packageType].duration}
                            onChange={(e) => setNewService({
                              ...newService,
                              packages: {
                                ...newService.packages,
                                [packageType]: {
                                  ...newService.packages[packageType],
                                  duration: e.target.value
                                }
                              }
                            })}
                            className="w-full bg-[#1a1a1a] text-white rounded p-2 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm"
                            placeholder="7 days"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Calls/Meetings</label>
                          <input
                            type="text"
                            value={newService.packages[packageType].calls}
                            onChange={(e) => setNewService({
                              ...newService,
                              packages: {
                                ...newService.packages,
                                [packageType]: {
                                  ...newService.packages[packageType],
                                  calls: e.target.value
                                }
                              }
                            })}
                            className="w-full bg-[#1a1a1a] text-white rounded p-2 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm"
                            placeholder="1 call"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Features</label>
                          <div className="space-y-1">
                            {newService.packages[packageType].features.map((feature, index) => (
                              <div key={index} className="flex items-center justify-between bg-[#1a1a1a] rounded p-1">
                                <span className="text-white text-xs">{feature}</span>
                                <button
                                  onClick={() => removePackageFeature(packageType, index)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <input
                              type="text"
                              className="w-full bg-[#1a1a1a] text-white rounded p-1 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-xs"
                              placeholder="Add feature..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addPackageFeature(packageType, e.target.value)
                                  e.target.value = ''
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Bio */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-[#3a3a3a] pb-2">Mentor Bio for Service</h4>
                <textarea
                  value={newService.mentorBio}
                  onChange={(e) => setNewService({...newService, mentorBio: e.target.value})}
                  className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[100px] resize-none"
                  placeholder="Brief bio about yourself for this specific service..."
                />
              </div>

              {/* Service Images */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-[#3a3a3a] pb-2">Service Images</h4>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-[#242424] text-white rounded-lg border border-[#3a3a3a] hover:bg-[#2a2a2a] cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          setNewService(prev => ({ ...prev, images: [...(prev.images || []), reader.result] }))
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-400">PNG, JPG up to ~2MB</span>
                </div>
                {newService.images && newService.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {newService.images.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img src={src} alt={`service-${idx}`} className="w-full h-28 object-cover rounded-lg border border-[#3a3a3a]" />
                        <button
                          className="absolute top-2 right-2 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                          onClick={() => setNewService(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={editingService ? handleUpdateService : handleAddService}
                className="flex-1 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
              >
                {editingService ? "Update Service" : "Add Service"}
              </button>
              <button
                onClick={handleCancelModal}
                className="flex-1 px-6 py-3 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesTab
