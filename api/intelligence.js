// pages/api/intelligence.js

export default async function handler(req, res) {
  // Basic CORS
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
    const { systemPrompt, userPrompt, mode, tickers } = req.body || {};

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Keys
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res
        .status(500)
        .json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (!finnhubKey) {
      return res
        .status(500)
        .json({ error: 'FINNHUB_API_KEY not configured on server' });
    }

    // ============================
    // 1) REAL MARKET DATA HELPERS
    // ============================

    async function getQuote(ticker) {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
        ticker
      )}&token=${finnhubKey}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Quote error for ${ticker} (${r.status})`);
      const q = await r.json();
      return {
        ticker,
        current: q.c,
        open: q.o,
        high: q.h,
        low: q.l,
        prevClose: q.pc,
      };
    }

    async function getProfile(ticker) {
      const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(
        ticker
      )}&token=${finnhubKey}`;
      const r = await fetch(url);
      if (!r.ok) return { ticker };
      const p = await r.json();
      return {
        ticker,
        name: p.name,
        exchange: p.exchange,
        country: p.country,
        sector: p.finnhubIndustry,
        ipo: p.ipo,
      };
    }

    async function getDailyCandles(ticker, count = 8) {
      const now = Math.floor(Date.now() / 1000);
      const from = now - 60 * 60 * 24 * (count + 5);
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(
        ticker
      )}&resolution=D&from=${from}&to=${now}&token=${finnhubKey}`;
      const r = await fetch(url);
      if (!r.ok) return { prices: [] };
      const c = await r.json();
      if (c.s !== 'ok' || !Array.isArray(c.c)) return { prices: [] };
      return { prices: c.c.slice(-count) };
    }

    function computeDiscreteMetrics(prices) {
      if (!prices || prices.length < 3) {
        return {
          trendScore: 50,
          volatilityScore: 50,
          returns: [],
          trend: Array(7).fill(50),
        };
      }

      const returns = [];
      for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }

      const totalR = (prices[prices.length - 1] - prices[0]) / prices[0];
      const trendScore = Math.max(
        0,
        Math.min(100, Math.round(totalR * 400 + 50))
      );

      let signChanges = 0;
      for (let i = 1; i < returns.length; i++) {
        if (returns[i] * returns[i - 1] < 0) signChanges++;
      }
      const maxSC = returns.length - 1 || 1;
      const vol = signChanges / maxSC;
      const volatilityScore = Math.max(
        0,
        Math.min(100, Math.round(vol * 100))
      );

      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const range = maxP - minP || 1;
      const trend = prices.map((p) =>
        Math.max(0, Math.min(100, Math.round(((p - minP) / range) * 100)))
      );

      return { trendScore, volatilityScore, returns, trend };
    }

    // Build model context from tickers
    let realDataContext = '';

    if (mode === 'architect' && Array.isArray(tickers) && tickers.length > 0) {
      const unique = [...new Set(tickers)].slice(0, 10);
      const detailed = [];
      for (const t of unique) {
        const [q, p, c] = await Promise.all([
          getQuote(t),
          getProfile(t),
          getDailyCandles(t, 7),
        ]);
        const m = computeDiscreteMetrics(c.prices);
        detailed.push({ ...q, ...p, ...m });
      }
      realDataContext =
        'REAL_MARKET_DATA_JSON = ' + JSON.stringify(detailed, null, 2);
    } else if (
      mode === 'comparator' &&
      Array.isArray(tickers) &&
      tickers.length === 2
    ) {
      const [a, b] = tickers;
      const [qa, pa, ca] = await Promise.all([
        getQuote(a),
        getProfile(a),
        getDailyCandles(a, 8),
      ]);
      const [qb, pb, cb] = await Promise.all([
        getQuote(b),
        getProfile(b),
        getDailyCandles(b, 8),
      ]);
      const ma = computeDiscreteMetrics(ca.prices);
      const mb = computeDiscreteMetrics(cb.prices);
      realDataContext =
        'NODE_ALPHA_REAL = ' +
        JSON.stringify({ ...qa, ...pa, ...ma }, null, 2) +
        '\n' +
        'NODE_BETA_REAL = ' +
        JSON.stringify({ ...qb, ...pb, ...mb }, null, 2);
    } else if (
      mode === 'pathfinder' &&
      Array.isArray(tickers) &&
      tickers.length === 1
    ) {
      const t = tickers[0];
      const [q, p, c] = await Promise.all([
        getQuote(t),
        getProfile(t),
        getDailyCandles(t, 8),
      ]);
      const m = computeDiscreteMetrics(c.prices);
      realDataContext =
        'NODE_REAL = ' + JSON.stringify({ ...q, ...p, ...m }, null, 2);
    }

    // ==============================
    // 2) CALL GEMINI WITH CONTEXT
    // ==============================

    const MODEL_ID = 'gemini-2.5-flash-preview-09-2025';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${geminiKey}`;

    const finalSystemPrompt =
      systemPrompt +
      '\n\nYou are given JSON context with real market data and discrete metrics.\n' +
      'Use ONLY that context for numeric reasoning. Do not invent numbers.\n\n' +
      realDataContext;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: finalSystemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({
        error: 'Gemini API error',
        details: errorData,
      });
    }

    const result = await response.json();

    if (!result.candidates || result.candidates.length === 0) {
      console.error('Empty candidates:', result);
      return res.status(500).json({
        error: 'Model returned empty response',
        usageMetadata: result.usageMetadata,
      });
    }

    const candidate = result.candidates[0];
    if (
      !candidate.content ||
      !candidate.content.parts ||
      candidate.content.parts.length === 0
    ) {
      console.error('Empty content:', candidate);
      return res.status(500).json({
        error: 'Model returned empty content',
        finishReason: candidate.finishReason,
      });
    }

    let textContent = candidate.content.parts[0].text || '';

    // Remove ```
    textContent = textContent
      .replace(/```json/gi, '')
      .replace(/```
      .trim();

    if (!textContent) {
      console.error('Empty text content');
      return res.status(500).json({
        error: 'Model returned empty text',
        candidate,
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(textContent);
    } catch (err) {
      console.error('JSON parse error:', err);
      console.error('Raw text:', textContent);
      return res.status(500).json({
        error: 'Failed to parse JSON response',
        rawText: textContent.substring(0, 500),
      });
    }

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
