import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HFModelService {
  // Tokens are stored in localStorage as JSON array under key 'hf_tokens'
  getTokens(): string[] {
    try {
      const raw = localStorage.getItem('hf_tokens');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.filter(Boolean);
      return [];
    } catch (e) {
      return [];
    }
  }

  saveTokens(tokens: string[]) {
    localStorage.setItem('hf_tokens', JSON.stringify(tokens));
  }

  getActiveTokenIndex(): number {
    const idx = Number(localStorage.getItem('hf_token_index'));
    return Number.isFinite(idx) ? idx : 0;
  }

  setActiveTokenIndex(i: number) {
    localStorage.setItem('hf_token_index', String(i));
  }

  // Try calling the Hugging Face inference endpoint with rotation across tokens
  async generate(model: string, prompt: string, options: any = {}): Promise<{ text?: string; error?: string }>{
    const tokens = this.getTokens();
    if (!tokens || tokens.length === 0) return { error: 'No Hugging Face token configured.' };

    // Prepare body for text generation API
    const body: any = { inputs: prompt, parameters: { max_new_tokens: options.maxTokens || 256, do_sample: false } };

    // Attempt using tokens in round-robin starting from active index
    let idx = this.getActiveTokenIndex() || 0;
    for (let attempt = 0; attempt < tokens.length; attempt++) {
      const token = tokens[idx % tokens.length];
      try {
        const resp = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (resp.status === 503) {
          // model loading or unavailable -> try next token
          idx = idx + 1;
          continue;
        }

        if (!resp.ok) {
          // rotate token on auth error or rate limit and try next
          const status = resp.status;
          if (status === 401 || status === 429 || status >= 500) {
            idx = idx + 1;
            continue;
          }
          const text = await resp.text();
          return { error: `HF Error: ${status} ${text}` };
        }

        // Response could be JSON array for text-generation
        const json = await resp.json();
        // Some models return array of {generated_text}
        if (Array.isArray(json) && json.length > 0 && json[0].generated_text) {
          // Save next token index for rotation
          this.setActiveTokenIndex((idx + 1) % tokens.length);
          return { text: json[0].generated_text };
        }
        // Other models may return text field
        if (json?.generated_text) {
          this.setActiveTokenIndex((idx + 1) % tokens.length);
          return { text: json.generated_text };
        }
        // Text response fallback
        if (typeof json === 'string') {
          this.setActiveTokenIndex((idx + 1) % tokens.length);
          return { text: json };
        }

        // If model uses text generation v2, it may return different structure; try to stringify
        this.setActiveTokenIndex((idx + 1) % tokens.length);
        return { text: JSON.stringify(json) };
      } catch (err: any) {
        // network error - rotate and try next
        idx = idx + 1;
        continue;
      }
    }

    return { error: 'All Hugging Face tokens failed or model unavailable.' };
  }
}
