const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Chat endpoint - for conversational AI
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
      throw new Error('Failed to send message')
    }

    return await response.json()
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

// General AI endpoint - for various types of AI responses
export const generateAIResponse = async (prompt, type = 'general') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        type, // 'general', 'repair', 'invoice', 'customer-communication'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    return await response.json()
  } catch (error) {
    console.error('AI error:', error)
    throw error
  }
}

// Generate professional repair descriptions
export const generateRepairDescription = async (
  customerName,
  jobType,
  description
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-repair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName,
        jobType,
        description,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate repair description')
    }

    return await response.json()
  } catch (error) {
    console.error('Repair generation error:', error)
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
