// Simple file-based persistence for single-user state.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, 'progress.json')

const DEFAULT_STATE = {
  xp: 0,
  streak: 1,
  lastSeenDate: null,
  completedLessons: {},   // { lessonId: { stars: 1-3, completedAt, score } }
  stats: {
    totalAnswers: 0,
    correctAnswers: 0,
    byBranch: {
      vocabulary:  { correct: 0, total: 0 },
      grammar:     { correct: 0, total: 0 },
      sentence:    { correct: 0, total: 0 },
      translation: { correct: 0, total: 0 },
      listening:   { correct: 0, total: 0 },
      conjugation: { correct: 0, total: 0 },
    },
  },
}

let cache = null

export async function load() {
  if (cache) return cache
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    cache = { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    cache = JSON.parse(JSON.stringify(DEFAULT_STATE))
    await save(cache)
  }
  return cache
}

export async function save(state) {
  cache = state
  await fs.writeFile(FILE, JSON.stringify(state, null, 2), 'utf-8')
  return state
}

export async function update(mutator) {
  const s = await load()
  const next = mutator({ ...s, stats: { ...s.stats, byBranch: { ...s.stats.byBranch } } }) || s
  return save(next)
}

export async function reset() {
  cache = JSON.parse(JSON.stringify(DEFAULT_STATE))
  await save(cache)
  return cache
}
