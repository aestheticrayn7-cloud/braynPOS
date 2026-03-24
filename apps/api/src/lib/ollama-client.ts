// apps/api/src/lib/ollama-client.ts

const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434'
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || 'llama3'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Communicates with local Ollama for chat completions (streaming support).
 */
export async function* chat(messages: ChatMessage[]) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

  try {
    const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
        stream: true,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`Ollama chat failed: ${response.status}`)
    if (!response.body) throw new Error('No response body from Ollama')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const json = JSON.parse(line)
          if (json.message?.content) {
            yield json.message.content
          }
          if (json.done) return
        } catch (e) {
          // Ignore partial JSON chunks
        }
      }
    }
  } catch (err) {
    console.error('[OllamaChat] Error:', err)
    throw err
  }
}
