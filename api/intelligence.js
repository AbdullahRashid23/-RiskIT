export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, userPrompt } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const MODEL_ID = "gemini-2.0-flash-exp";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { 
        responseMimeType: "application/json", 
        temperature: 0.1,
        maxOutputTokens: 2048
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Gemini API error', 
        details: errorData 
      });
    }

    const result = await response.json();
    
    if (!result.candidates || result.candidates.length === 0) {
      console.error('Empty candidates array:', result);
      return res.status(500).json({ 
        error: 'Model returned empty response',
        usageMetadata: result.usageMetadata 
      });
    }

    const candidate = result.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('Empty content:', candidate);
      return res.status(500).json({ 
        error: 'Model returned empty content',
        finishReason: candidate.finishReason 
      });
    }

    let textContent = candidate.content.parts[0].text || '';
    
    // Remove markdown code blocks
    textContent = textContent.replace(/``````/g, '').trim();
    
    if (!textContent) {
      console.error('Empty text content');
      return res.status(500).json({ 
        error: 'Model returned empty text',
        candidate: candidate 
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(textContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw text:', textContent);
      return res.status(500).json({ 
        error: 'Failed to parse JSON response',
        rawText: textContent.substring(0, 500)
      });
    }
    
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
