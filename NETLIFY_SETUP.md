Netlify deployment & serverless proxy setup

1. Netlify settings

- Base directory: . (repo root)
- Build command: npm run build
- Publish directory: dist/fusion-angular-tailwind-starter
- Functions directory: netlify/functions

2. Environment variables (set in Netlify Site > Site settings > Build & deploy > Environment)

- HF_TOKEN_1 = <your hf token>
- HF_TOKEN_2 = <your hf token>
- HF_TOKEN_3 = <your hf token>
- HF_TOKEN_4 = <your hf token>
  (you can add up to HF_TOKEN_8; the function will try them in order)

3. Serverless proxy endpoint

- A serverless function is provided at: /.netlify/functions/hf-proxy
- Call it via POST with JSON body: { "model": "gpt2", "prompt": "Summarize...", "parameters": { "max_new_tokens": 200 } }
- Example curl:
  curl -X POST $SITE_URL/.netlify/functions/hf-proxy \
   -H "Content-Type: application/json" \
   -d '{"model":"gpt2","prompt":"Hello world","parameters":{}}'

4. Client integration

- For security, use the proxy instead of calling Hugging Face directly from the browser. Example fetch from client:
  const resp = await fetch('/.netlify/functions/hf-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ model, prompt, parameters }) });
  const data = await resp.json();

5. Notes

- Do NOT commit tokens to the repo. Use Netlify environment variables.
- The proxy tries HF_TOKEN_1..HF_TOKEN_8 in order and returns the first successful response.
- If you need streaming or websocket support, we can extend the function or use a dedicated server.

Need me to wire the client code to call this proxy instead of calling Hugging Face directly? Reply Yes to continue.
