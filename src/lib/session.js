// Thin sessionStorage wrapper for lesson persistence
const KEY = 'fs_lesson'

export function saveSession(data) {
  try { sessionStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearSession() {
  try { sessionStorage.removeItem(KEY) } catch {}
}
