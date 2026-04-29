import express from 'express'
import cors from 'cors'
import { generateFor, generateMixed } from './generators/index.js'
import { fuzzyMatch, fuzzyMatchAny } from './utils.js'
import { LEVELS, computeLevel, nextThreshold, LEVEL_MAX_XP } from './data/levels.js'
import { PATH, LESSONS, getLesson, BRANCHES, EXERCISES_PER_LESSON } from './data/path.js'
import * as store from './store.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3001

// In-memory cache of generated exercises (id → exercise) so the server can grade them
const exerciseCache = new Map()

function cacheExercise(ex) {
  exerciseCache.set(ex.id, ex)
  // limit cache size
  if (exerciseCache.size > 500) {
    const first = exerciseCache.keys().next().value
    exerciseCache.delete(first)
  }
  return ex
}

// strip server-only fields before sending to client
function publicEx(ex) {
  // eslint-disable-next-line no-unused-vars
  const { correctIndex, correctOrder, correctSentence, acceptedAnswers, explanation, ...pub } = ex
  return pub
}

// ─── HEALTH ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }))

// ─── PROGRESS ────────────────────────────────────────────────
app.get('/api/progress', async (req, res) => {
  const s = await store.load()
  // bump streak if last seen was yesterday or earlier
  const today = new Date().toISOString().slice(0, 10)
  if (s.lastSeenDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = s.lastSeenDate === yesterday ? (s.streak || 0) + 1 : 1
    await store.update(state => ({ ...state, lastSeenDate: today, streak: newStreak }))
  }
  const fresh = await store.load()
  res.json({
    ...fresh,
    level: computeLevel(fresh.xp),
    nextThreshold: nextThreshold(computeLevel(fresh.xp)),
    maxXP: LEVEL_MAX_XP,
  })
})

app.post('/api/progress/reset', async (req, res) => {
  const s = await store.reset()
  res.json(s)
})

// ─── PATH (skill tree) ───────────────────────────────────────
app.get('/api/path', async (req, res) => {
  const s = await store.load()
  const userLevel = computeLevel(s.xp)
  const userLevelIdx = LEVELS.indexOf(userLevel)

  // Determine which units are unlocked. A unit is unlocked when:
  // - its level is ≤ user's current level, OR
  // - the previous unit is fully completed
  const units = []
  let prevCompleted = true
  for (const unit of PATH) {
    const allowedByLevel = LEVELS.indexOf(unit.level) <= userLevelIdx
    const unlocked = allowedByLevel || prevCompleted
    const lessons = unit.lessons.map(l => {
      const done = !!s.completedLessons[l.id]
      return {
        ...l,
        completed: done,
        stars: s.completedLessons[l.id]?.stars || 0,
        branchInfo: BRANCHES[l.branch],
      }
    })
    const allDone = lessons.every(l => l.completed)
    units.push({ ...unit, unlocked, lessons, allDone })
    prevCompleted = allDone
  }
  res.json({ units, branches: BRANCHES, currentLevel: userLevel })
})

// ─── LESSON: serve N exercises for a lesson ──────────────────
app.get('/api/lesson/:lessonId', async (req, res) => {
  const lesson = getLesson(req.params.lessonId)
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' })
  const isBoss = lesson.id.endsWith('-l5') && lesson.id.includes('u4')
  const exercises = []
  for (let i = 0; i < EXERCISES_PER_LESSON; i++) {
    const ex = isBoss
      ? generateMixed(lesson.level, 1)[0]
      : generateFor(lesson.branch, lesson.level)
    cacheExercise(ex)
    exercises.push(publicEx(ex))
  }
  res.json({
    lesson,
    exercises,
    total: EXERCISES_PER_LESSON,
  })
})

// ─── PRACTICE: free-play single exercise of any branch ───────
app.get('/api/practice/:branch', async (req, res) => {
  const s = await store.load()
  const level = req.query.level || computeLevel(s.xp)
  const branch = req.params.branch
  if (!BRANCHES[branch]) return res.status(400).json({ error: 'Unknown branch' })
  const ex = generateFor(branch, level)
  cacheExercise(ex)
  res.json(publicEx(ex))
})

// ─── CHECK: validate an answer ───────────────────────────────
app.post('/api/check', async (req, res) => {
  const { exerciseId, answer } = req.body || {}
  const ex = exerciseCache.get(exerciseId)
  if (!ex) return res.status(404).json({ error: 'Exercise expired or not found' })

  let correct = false
  if (ex.type === 'mcq') {
    correct = Number(answer) === ex.correctIndex
  } else if (ex.type === 'typed' || ex.type === 'listen') {
    correct = fuzzyMatchAny(String(answer || ''), ex.acceptedAnswers || [])
  } else if (ex.type === 'reorder') {
    // answer = array of token ids in user's chosen order
    const userOrder = Array.isArray(answer) ? answer.map(Number) : []
    correct = JSON.stringify(userOrder) === JSON.stringify(ex.correctOrder)
  }

  // Persist stats
  await store.update(state => {
    const branch = ex.branch
    const bs = state.stats.byBranch[branch] || { correct: 0, total: 0 }
    state.stats.byBranch[branch] = {
      correct: bs.correct + (correct ? 1 : 0),
      total: bs.total + 1,
    }
    state.stats.totalAnswers += 1
    if (correct) {
      state.stats.correctAnswers += 1
      state.xp += ex.xp || 10
    }
    return state
  })

  res.json({
    correct,
    explanation: ex.explanation,
    correctAnswer:
      ex.type === 'mcq' ? ex.options[ex.correctIndex]
      : ex.type === 'reorder' ? ex.correctSentence
      : (ex.acceptedAnswers && ex.acceptedAnswers[0]) || null,
    xpEarned: correct ? (ex.xp || 10) : 0,
  })
})

// ─── COMPLETE LESSON ─────────────────────────────────────────
app.post('/api/lesson/:lessonId/complete', async (req, res) => {
  const { lessonId } = req.params
  const lesson = getLesson(lessonId)
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' })
  const { score = 0, total = EXERCISES_PER_LESSON } = req.body || {}
  // Stars: 1 if pass, 2 if ≥80%, 3 if 100%
  const ratio = total ? score / total : 0
  let stars = 0
  if (ratio >= 1) stars = 3
  else if (ratio >= 0.8) stars = 2
  else if (ratio >= 0.5) stars = 1

  await store.update(state => {
    const prev = state.completedLessons[lessonId]
    state.completedLessons[lessonId] = {
      stars: Math.max(prev?.stars || 0, stars),
      completedAt: new Date().toISOString(),
      score, total,
    }
    return state
  })
  const s = await store.load()
  res.json({ ok: true, stars, level: computeLevel(s.xp), xp: s.xp })
})

// ─── BRANCHES METADATA ───────────────────────────────────────
app.get('/api/branches', (req, res) => res.json(BRANCHES))

app.listen(PORT, () => {
  console.log(`✦ FluentShift backend on http://127.0.0.1:${PORT}`)
})
