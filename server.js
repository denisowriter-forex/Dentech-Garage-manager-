import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() })
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const metaApiKey = process.env.META_AI_API_KEY
    if (!metaApiKey) {
      console.error('META_AI_API_KEY not configured')
      return res.status(500).json({ error: 'API key not configured' })
    }

    const messages = conversationHistory || []
    messages.push({ role: 'user', content: message })

    // Call Meta AI API
    const response = await fetch('https://api.meta.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metaApiKey}`,
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
    console.error('Chat error:', error)
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    })
  }
})

// AI endpoint with context types
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, type = 'general' } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const metaApiKey = process.env.META_AI_API_KEY
    if (!metaApiKey) {
      console.error('META_AI_API_KEY not configured')
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Build system prompt based on type
    let systemPrompt = 'You are a helpful AI assistant for a garage management system.'

    if (type === 'repair') {
      systemPrompt =
        'You are an expert garage mechanic. Generate professional, detailed repair descriptions suitable for invoices and job quotes.'
    } else if (type === 'invoice') {
      systemPrompt =
        'You are an accounting expert. Help generate professional invoice descriptions and summaries.'
    } else if (type === 'customer-communication') {
      systemPrompt =
        'You are a professional customer service representative. Help draft professional customer communications.'
    }

    // Call Meta AI API
    const response = await fetch('https://api.meta.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama-3-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1500,
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
    })
  } catch (error) {
    console.error('AI error:', error)
    return res.status(500).json({
      error: 'Failed to generate AI response',
      message: error.message,
    })
  }
})

// Generate repair description endpoint
app.post('/api/generate-repair', async (req, res) => {
  try {
    const { customerName, jobType, description } = req.body

    if (!customerName || !jobType || !description) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, jobType, description',
      })
    }

    const metaApiKey = process.env.META_AI_API_KEY
    if (!metaApiKey) {
      console.error('META_AI_API_KEY not configured')
      return res.status(500).json({ error: 'API key not configured' })
    }

    const prompt = `Generate a professional repair job description for:
Customer: ${customerName}
Job Type: ${jobType}
Description: ${description}

Please provide a detailed, professional description suitable for an invoice.`

    // Call Meta AI API
    const response = await fetch('https://api.meta.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama-3-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert garage mechanic. Generate professional, detailed repair descriptions suitable for invoices and job quotes.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Meta AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const repairDescription = data.choices?.[0]?.message?.content || data.message || ''

    return res.status(200).json({
      success: true,
      repairDescription: repairDescription,
    })
  } catch (error) {
    console.error('Repair generation error:', error)
    return res.status(500).json({
      error: 'Failed to generate repair description',
      message: error.message,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 CORS enabled for: ${FRONTEND_URL}`)
  console.log(`🔐 Meta AI API Key: ${process.env.META_AI_API_KEY ? '✅ Configured' : '❌ Missing'}`)
})
