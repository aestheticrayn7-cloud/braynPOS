
export const BACKOFF_OPTIONS = {
  attempts: 5,
  backoff: {
    type: 'custom' as const,
    delay: (attemptsMade: number) => {
      const base = 1000                          // 1 second base
      const cap = 30_000                         // max 30 seconds
      const delay = base * Math.pow(2, attemptsMade - 1)
      const jitter = Math.random() * (delay * 0.3) // ±30% jitter
      return Math.min(delay + jitter, cap)
    },
  },
}

export function isRetryableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message.toLowerCase()
  const retryable = [
    'connection timeout', 'econnrefused', 'etimedout',
    'too many connections', 'pool exhausted',
    'rate limit', 'service unavailable', '503', '429',
  ]
  const permanent = [
    'foreign key', 'unique constraint', 'not null',
    'invalid input', 'malformed', 'parse error',
  ]
  if (permanent.some(p => msg.includes(p))) return false
  if (retryable.some(r => msg.includes(r))) return true
  return true
}
