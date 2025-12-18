type DeltaCallback = (delta: string) => void;

// Lightweight SSE reader for OpenAI-compatible streaming responses
function parseSSE(chunk: string, onDelta: DeltaCallback) {
  const events = chunk
    .split('\n\n')
    .map((e) => e.trim())
    .filter(Boolean);
  for (const evt of events) {
    if (!evt.startsWith('data:')) continue;
    const data = evt.replace(/^data:\s*/, '');
    if (data === '[DONE]') return; // end
    try {
      const json = JSON.parse(data);
      const delta = json?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta.length) onDelta(delta);
    } catch {
      // ignore malformed chunks
    }
  }
}

/**
 * Streams a chat completion from Gemini via the OpenAI-compatible endpoint
 * using fetch + SSE parsing (no external SDK required).
 */
export function streamGeminiChat(
  systemPrompt: string,
  userPrompt: string,
  onDelta: DeltaCallback
): { cancel: () => void } {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string;
  const base = (import.meta as any).env?.VITE_OPENAI_BASE || 'https://generativelanguage.googleapis.com/v1beta/openai/';

  const controller = new AbortController();
  (async () => {
    const res = await fetch(`${base}chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-pro',
        reasoning_effort: 'high',
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!res.ok || !res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // Process complete SSE events
      const lastSep = buffer.lastIndexOf('\n\n');
      if (lastSep !== -1) {
        const complete = buffer.slice(0, lastSep);
        buffer = buffer.slice(lastSep + 2);
        parseSSE(complete, onDelta);
      }
    }
    if (buffer) parseSSE(buffer, onDelta);
  })().catch(() => {
    /* ignore */
  });

  return {
    cancel: () => controller.abort(),
  };
}


