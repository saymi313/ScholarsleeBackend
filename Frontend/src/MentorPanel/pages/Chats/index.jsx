import React from "react"
import Sidebar from "../../components/Shared/Sidebar"
import ChatsSidebar from "../../components/ChatsComponents/ChatsSidebar"
import ChatEmpty from "../../components/ChatsComponents/ChatEmpty"
import ChatHeader from "../../components/ChatsComponents/ChatHeader"
import MessageBubble from "../../components/ChatsComponents/MessageBubble"
import ChatInput from "../../components/ChatsComponents/ChatInput"
import DeliveryStatusModal from "../../components/ChatsComponents/DeliveryStatusModal"
import FeatureComingSoonModal from "../../components/ChatsComponents/FeatureCommingSoonModal"
import ChatsPage from "../../../shared/components/ChatsPage"

export default function Chats() {
  return (
    <ChatsPage
      theme="dark"
      Sidebar={Sidebar}
      ChatsSidebar={ChatsSidebar}
      ChatEmpty={ChatEmpty}
      ChatHeader={ChatHeader}
      MessageBubble={MessageBubble}
      ChatInput={ChatInput}
      DeliveryStatusModal={DeliveryStatusModal}
      FeatureComingSoonModal={FeatureComingSoonModal}
    />
  )
}
