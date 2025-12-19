"use client"
import { useState } from "react"
import { User, Star, Users, Briefcase, Trophy, ChevronDown } from "lucide-react"

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const tabs = [
    { id: "background", label: "Background", icon: User },
    { id: "recommendations", label: "Recommendations", icon: Star },
    { id: "connections", label: "Connections", icon: Users },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "success-story", label: "Success Story", icon: Trophy },
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="mt-6 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#242424] transition-colors"
        >
          <div className="flex items-center gap-3">
            {activeTabData && (
              <>
                <activeTabData.icon className="w-5 h-5 text-[#5D38DE]" />
                <span className="font-medium text-white">{activeTabData.label}</span>
              </>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {isDropdownOpen && (
          <div className="border-t border-[#2a2a2a]">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#242424] transition-colors ${
                    activeTab === tab.id ? "bg-[#242424] text-[#5D38DE]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Desktop Horizontal Tabs */}
      <div className="hidden md:block p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#5D38DE] text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-[#242424]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TabNavigation
