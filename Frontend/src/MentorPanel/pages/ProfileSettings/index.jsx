"use client"

import { useState } from "react"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import ProfileHeader from "../../components/ProfileSettingsComponents/ProfileHeader"
import TabNavigation from "../../components/ProfileSettingsComponents/TabNavigation"
import BackgroundTab from "../../components/ProfileSettingsComponents/BackgroundTab"
import RecommendationsTab from "../../components/ProfileSettingsComponents/RecommendationsTab"
import ConnectionsTab from "../../components/ProfileSettingsComponents/ConnectionsTab"

import SuccessStoryTab from "../../components/ProfileSettingsComponents/SuccessStoryTab"
import WalletTab from "../../components/ProfileSettingsComponents/WalletTab"

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("background")

  const renderTabContent = () => {
    switch (activeTab) {
      case "background":
        return <BackgroundTab />
      case "recommendations":
        return <RecommendationsTab />
      case "connections":
        return <ConnectionsTab />

      case "success-story":
        return <SuccessStoryTab />
      case "wallet":
        return <WalletTab />
      default:
        return <BackgroundTab />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-['Poppins'] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto min-w-0">
            <ProfileHeader />
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4 sm:mt-6 min-w-0">{renderTabContent()}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileSettings
