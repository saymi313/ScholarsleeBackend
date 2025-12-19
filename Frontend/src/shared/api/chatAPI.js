import api from '../../utils/api';

/**
 * Centralized Chat API module
 * All chat-related API calls should go through this module
 */
export const chatAPI = {
  /**
   * Get all conversations for the current user
   * @returns {Promise} API response with conversations array
   */
  getConversations: () => api.get('/chat/conversations'),

  /**
   * Get or create a conversation with a participant
   * @param {string} participantId - ID of the other participant
   * @returns {Promise} API response with conversation data
   */
  getOrCreateConversation: (participantId) => 
    api.post('/chat/conversations', { participantId }),

  /**
   * Get messages in a conversation
   * @param {string} conversationId - ID of the conversation
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise} API response with messages array
   */
  getMessages: (conversationId, params = {}) => 
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),

  /**
   * Send a message
   * @param {Object} messageData - Message data (conversationId, content, messageType, replyTo)
   * @returns {Promise} API response with sent message
   */
  sendMessage: (messageData) => 
    api.post('/chat/messages', messageData),

  /**
   * Delete a single message
   * @param {string} messageId - ID of the message to delete
   * @param {boolean} deleteForEveryone - Whether to delete for everyone or just self
   * @returns {Promise} API response
   */
  deleteMessage: (messageId, deleteForEveryone = false) => 
    api.delete(`/chat/messages/${messageId}`, { data: { deleteForEveryone } }),

  /**
   * Delete all messages in a conversation (clear chat)
   * @param {string} conversationId - ID of the conversation
   * @returns {Promise} API response
   */
  deleteAllMessages: (conversationId) => 
    api.delete(`/chat/conversations/${conversationId}/messages`),

  /**
   * Update conversation settings (pin, mute, archive, block)
   * @param {string} conversationId - ID of the conversation
   * @param {Object} settings - Settings object (isPinned, isMuted, isArchived, isBlocked)
   * @returns {Promise} API response
   */
  updateSettings: (conversationId, settings) => 
    api.put(`/chat/conversations/${conversationId}/settings`, settings),

  /**
   * Mark messages as read in a conversation
   * @param {string} conversationId - ID of the conversation
   * @returns {Promise} API response
   */
  markAsRead: (conversationId) => 
    api.put(`/chat/conversations/${conversationId}/read`),
};

export default chatAPI;

