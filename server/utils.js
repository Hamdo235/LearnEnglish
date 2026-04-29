// Common utilities used by generators

export const sample = arr => arr[Math.floor(Math.random() * arr.length)]

export function sampleN(arr, n) {
  if (n >= arr.length) return shuffle([...arr])
  const used = new Set()
  const out = []
  while (out.length < n) {
    const i = Math.floor(Math.random() * arr.length)
    if (!used.has(i)) { used.add(i); out.push(arr[i]) }
  }
  return out
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// Normalize a typed answer for forgiving comparison
export function normalize(s) {
  if (typeof s !== 'string') return ''
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/[.,!?;:'"`’()\[\]{}—–-]/g, ' ')           // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

// Levenshtein distance — for forgiving typo tolerance
export function levenshtein(a, b) {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }
  return dp[a.length][b.length]
}

// Allow minor typos: ≤1 char diff for short answers, ≤2 for longer ones
export function fuzzyMatch(input, target) {
  const a = normalize(input)
  const b = normalize(target)
  if (a === b) return true
  const tolerance = Math.max(1, Math.floor(b.length / 12))
  return levenshtein(a, b) <= tolerance
}

export function fuzzyMatchAny(input, candidates) {
  return candidates.some(c => fuzzyMatch(input, c))
}
