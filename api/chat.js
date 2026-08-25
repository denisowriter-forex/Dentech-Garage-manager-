export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory } = req.body

    // Validate request
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get API key from environment variable (server-side only)
    const modelApiKey = process.env.MODEL_API_KEY
    if (!modelApiKey) {
      console.error('MODEL_API_KEY not configured')
      return res.status(500).json({ error: 'API configuration error' })
    }

    // Prepare messages for Meta Model API (Anthropic-compatible format)
    const messages = conversationHistory || []
    messages.push({ role: 'user', content: message })

    // Call Meta Model API with Anthropic-compatible request
    const response = await fetch('https://api.meta.ai/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'muse-spark-1.2',
        max_tokens: 1024,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Meta Model API error:', response.status, errorData)
      return res.status(response.status).json({
        error: 'Failed to get response from AI model',
      })
    }

    const data = await response.json()

    // Parse Anthropic-compatible response format
    // Expected: { content: [{ type: 'text', text: '...' }], ... }
    let aiResponse = ''
    if (data.content && Array.isArray(data.content)) {
      const textBlock = data.content.find((block) => block.type === 'text')
      aiResponse = textBlock?.text || ''
    }

    if (!aiResponse) {
      console.error('Unexpected API response format:', data)
      return res.status(500).json({
        error: 'Invalid response format from AI model',
      })
    }

    // Return response with conversation history
    return res.status(200).json({
      success: true,
      response: aiResponse,
      messages: [...messages, { role: 'assistant', content: aiResponse }],
    })
  } catch (error) {
    console.error('Chat API error:', error.message)
    return res.status(500).json({
      error: 'Failed to process chat message',
      // Never expose API key or sensitive details
    })
  }
}
