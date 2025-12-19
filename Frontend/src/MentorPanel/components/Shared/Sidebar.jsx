"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { BarChart3, Briefcase, MessageSquare, Award, Users, DollarSign, Settings, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"

const Sidebar = ({ hideMobileMenu = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Handle sidebar collapse with delay
  const handleToggleCollapse = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    
    if (isCollapsed) {
      // Opening sidebar
      setIsCollapsed(false)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    } else {
      // Closing sidebar with delay
      setTimeout(() => {
        setIsCollapsed(true)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 200)
    }
  }

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/mentor/dashboard" },
    { icon: Briefcase, label: "Your Services", path: "/mentor/services" },
    { icon: MessageSquare, label: "Chats", path: "/mentor/chats" },
    { icon: Award, label: "Badges", path: "/mentor/badges" },
    { icon: Users, label: "Meetings", path: "/mentor/meetings" },
    { icon: DollarSign, label: "Revenue", path: "/mentor/revenue" },
    { icon: Settings, label: "Profile Settings", path: "/mentor/settings" },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false) // Close mobile menu after navigation
  }

  return (
    <>
      {/* Mobile menu button */}
      {!hideMobileMenu && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#242424] rounded-lg shadow-lg"
        >
          {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
        </button>
      )}


      {/* Overlay for mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64 bg-[#1a1a1a] border-r border-[#2a2a2a]
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          <div className={`mb-10 px-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 lg:opacity-100' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold text-white transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                Scholarslee
              </h2>
              
              {/* Desktop toggle button - next to Scholarslee */}
              <button
                onClick={handleToggleCollapse}
                disabled={isTransitioning}
                className="hidden lg:flex p-1.5 bg-[#242424] hover:bg-[#2a2a2a] rounded-lg transition-all duration-200 disabled:opacity-50 border border-[#2a2a2a] shadow-sm"
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
            
            {isCollapsed && (
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-8 h-8 bg-[#5D38DE] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                    transition-all duration-200
                    ${isCollapsed ? 'lg:justify-center' : ''}
                    ${
                      isActive
                        ? "bg-[#2d2d2d] text-white shadow-lg"
                        : "text-gray-400 hover:bg-[#242424] hover:text-white"
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} strokeWidth={2} />
                  <span className={`text-[15px] font-normal transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
