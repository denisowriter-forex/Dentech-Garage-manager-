const API_BASE_URL = '/api'

// Chat endpoint - for conversational AI with conversation history
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

// Helper function for error handling
export const handleApiError = (error) => {
  if (error instanceof TypeError) {
    return 'Network error. Please check your connection.'
  }
  return error.message || 'An error occurred. Please try again.'
}
