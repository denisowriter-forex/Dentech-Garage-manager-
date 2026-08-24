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

    // Get API key from environment variable
    const metaApiKey = process.env.META_AI_API_KEY
    if (!metaApiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Prepare messages for API
    const messages = conversationHistory || []
    messages.push({ role: 'user', content: message })

    // Call Meta AI API
    const response = await fetch('https://api.meta.com/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${metaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama-3-70b-instruct',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Meta AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || data.message || ''

    return res.status(200).json({
      success: true,
      response: aiResponse,
      messages: [...messages, { role: 'assistant', content: aiResponse }],
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    })
  }
}
