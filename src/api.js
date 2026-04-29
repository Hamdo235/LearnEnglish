// Thin wrappers around backend endpoints
const BASE = '/api'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  health: () => req('/health'),
  progress: () => req('/progress'),
  resetProgress: () => req('/progress/reset', { method: 'POST' }),
  path: () => req('/path'),
  lesson: (id) => req(`/lesson/${id}`),
  practice: (branch, level) => req(`/practice/${branch}${level ? `?level=${encodeURIComponent(level)}` : ''}`),
  check: (exerciseId, answer) => req('/check', {
    method: 'POST',
    body: JSON.stringify({ exerciseId, answer }),
  }),
  completeLesson: (id, score, total) => req(`/lesson/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ score, total }),
  }),
}
