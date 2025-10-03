const TIMEOUT_MS = 60000;

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { model, prompt, parameters } = body;
    if (!model || !prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing model or prompt' }) };
    }

    // Collect tokens from environment variables HF_TOKEN_1..HF_TOKEN_4
    const tokens = [];
    for (let i = 1; i <= 8; i++) {
      const name = `HF_TOKEN_${i}`;
      if (process.env[name]) tokens.push(process.env[name]);
    }

    if (tokens.length === 0) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No HF tokens configured on server' }) };
    }

    // Try tokens in sequence until one succeeds.
    let lastError = null;
    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: prompt, parameters: parameters || {} }),
          signal: controller.signal
        });

        clearTimeout(id);

        const text = await res.text();
        // if not ok, try next token for 401/429/5xx
        if (!res.ok) {
          lastError = `HF ${res.status}: ${text}`;
          if (res.status === 401 || res.status === 429 || res.status >= 500) {
            continue;
          }
          return { statusCode: 502, body: JSON.stringify({ error: `HF Error: ${res.status}`, details: text }) };
        }

        // Success: return raw body (string) and status 200
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: text
        };
      } catch (err) {
        lastError = String(err?.message || err);
        // continue to next token
        continue;
      }
    }

    return { statusCode: 502, body: JSON.stringify({ error: 'All HF tokens failed', details: lastError }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err?.message || err) }) };
  }
};
