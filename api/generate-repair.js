export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { customerName, jobType, description } = req.body

    // Validate request
    if (!customerName || !jobType || !description) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, jobType, description',
      })
    }

    // Get API key from environment variable
    const metaApiKey = process.env.META_AI_API_KEY
    if (!metaApiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Create prompt for generating repair description
    const prompt = `Generate a professional repair job description for:
Customer: ${customerName}
Job Type: ${jobType}
Description: ${description}

Please provide a detailed, professional description suitable for an invoice.`

    // Call Meta AI API
    const response = await fetch('https://api.meta.com/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${metaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Meta AI API error: ${response.statusText}`)
    }

    const data = await response.json()

    return res.status(200).json({
      success: true,
      repairDescription: data.choices?.[0]?.text || data.message || '',
    })
  } catch (error) {
    console.error('Repair generation error:', error)
    return res.status(500).json({
      error: 'Failed to generate repair description',
      message: error.message,
    })
  }
}
