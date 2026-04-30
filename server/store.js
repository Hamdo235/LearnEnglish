// Simple file-based persistence for single-user state.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, 'progress.json')

const CURRENT_VERSION = 2

const DEFAULT_STATE = {
  version: CURRENT_VERSION,
  xp: 0,
  streak: 1,
  lastSeenDate: null,
  completedLessons: {},   // { lessonId: { stars: 1-3, completedAt, score } }
  dailyXP: {},            // { "YYYY-MM-DD": xp }
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

function migrate(state) {
  if (!state.version) {
    // v0 → v1: add dailyXP
    state.version = 1
    state.dailyXP = {}
  }
  if (state.version < 2) {
    // v1 → v2: ensure all branches exist in byBranch
    const branches = ['vocabulary','grammar','sentence','translation','listening','conjugation']
    state.stats = state.stats || {}
    state.stats.byBranch = state.stats.byBranch || {}
    for (const b of branches) {
      state.stats.byBranch[b] = state.stats.byBranch[b] || { correct: 0, total: 0 }
    }
    state.version = 2
  }
  return state
}

let cache = null

export async function load() {
  if (cache) return cache
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    cache = migrate({ ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...parsed })
    await save(cache)
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
