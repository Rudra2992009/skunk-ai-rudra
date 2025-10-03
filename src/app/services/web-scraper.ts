export async function scrapeUrl(url: string, timeout = 10000): Promise<{ title?: string; text?: string; error?: string }> {
  try {
    // Basic URL validation
    const parsed = new URL(url);
    // Only accept http(s)
    if (!/^https?:$/.test(parsed.protocol)) {
      return { error: 'Only HTTP/HTTPS URLs are supported.' };
    }

    // Timeout wrapper
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const resp = await fetch(url, { signal: controller.signal, mode: 'cors' });
    clearTimeout(id);

    if (!resp.ok) return { error: `Fetch failed: ${resp.status} ${resp.statusText}` };

    const html = await resp.text();

    // Parse HTML using DOMParser (available in browser)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = doc.querySelector('title')?.textContent?.trim() || parsed.hostname;

    // Heuristic: prefer <article>, then <main>, then all <p>
    let text = '';
    const article = doc.querySelector('article');
    const main = doc.querySelector('main');
    const source = article || main;

    if (source) {
      const paragraphs = Array.from(source.querySelectorAll('p'));
      text = paragraphs.map((p) => p.textContent?.trim() || '').filter(Boolean).join('\n\n');
    } else {
      const paragraphs = Array.from(doc.body.querySelectorAll('p'));
      if (paragraphs.length > 0) text = paragraphs.map((p) => p.textContent?.trim() || '').filter(Boolean).join('\n\n');
      else {
        // Fallback: extract visible text nodes from body (limit size)
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
        const chunks: string[] = [];
        let node: Node | null = walker.nextNode();
        while (node && chunks.join(' ').length < 20000) {
          const t = node.textContent?.trim();
          if (t && t.length > 20) chunks.push(t);
          node = walker.nextNode();
        }
        text = chunks.join('\n\n');
      }
    }

    // Limit output length
    if (text.length > 20000) text = text.slice(0, 20000) + '\n\n...truncated...';

    return { title, text };
  } catch (err: any) {
    if (err?.name === 'AbortError') return { error: 'Request timed out (possible CORS or slow response).' };
    return { error: String(err?.message || err) };
  }
}
