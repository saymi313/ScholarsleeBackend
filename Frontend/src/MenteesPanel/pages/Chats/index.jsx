import React from "react"
import Header from "../../components/Shared/Header"
import ChatsSidebar from "../../components/ChatsComponents/ChatsSidebar"
import ChatEmpty from "../../components/ChatsComponents/ChatEmpty"
import ChatHeader from "../../components/ChatsComponents/ChatHeader"
import MessageBubble from "../../components/ChatsComponents/MessageBubble"
import ChatInput from "../../components/ChatsComponents/ChatInput"
import DeliveryStatusModal from "../../components/ChatsComponents/DeliveryStatusModal"
import FeatureComingSoonModal from "../../components/ChatsComponents/FeatureComingSoonModal"
import ChatsPage from "../../../shared/components/ChatsPage"
import { chatAPI } from "../../../shared/api/chatAPI"

// Custom Header wrapper for mentee
const MenteeHeader = () => <Header />

// Custom conversation creation handler for mentee
const createConversationWithMentor = async (mentorId, mentorName, mentorAvatar, { setCreatingConversation, setSelectedChatId, setSearchParams }) => {
  try {
    setCreatingConversation(true)
    
    const response = await chatAPI.getOrCreateConversation(mentorId)
    
    if (response.data.success && response.data.data.conversationId) {
      setSelectedChatId(response.data.data.conversationId)
      setSearchParams({})
    } else {
      console.error('Failed to create conversation:', response.data.message)
    }
  } catch (error) {
    console.error('Error creating conversation:', error)
  } finally {
    setCreatingConversation(false)
  }
}

export default function Chats() {
  return (
    <ChatsPage
      theme="light"
      Sidebar={MenteeHeader}
      ChatsSidebar={ChatsSidebar}
      ChatEmpty={ChatEmpty}
      ChatHeader={ChatHeader}
      MessageBubble={MessageBubble}
      ChatInput={ChatInput}
      DeliveryStatusModal={DeliveryStatusModal}
      FeatureComingSoonModal={FeatureComingSoonModal}
      onCreateConversation={createConversationWithMentor}
    />
  )
}


