import { useEffect, useState } from 'react'
import { api } from '../api.js'
import MCQ from './exercises/MCQ.jsx'
import Typed from './exercises/Typed.jsx'
import Reorder from './exercises/Reorder.jsx'
import Listen from './exercises/Listen.jsx'
import { playCorrect, playWrong } from '../lib/sounds.js'

const BRANCHES = [
  { id: 'vocabulary',  icon: '📚', label: 'Vocabulary',     color: 'var(--gold2)',  desc: 'Learn new words' },
  { id: 'grammar',     icon: '🎯', label: 'Grammar',        color: 'var(--blue)',   desc: 'Master grammar rules' },
  { id: 'sentence',    icon: '🧱', label: 'Sentence Build', color: 'var(--violet)', desc: 'Reorder words' },
  { id: 'translation', icon: '🔄', label: 'Translation',    color: 'var(--green)',  desc: 'FR ↔ EN' },
  { id: 'listening',   icon: '👂', label: 'Listening',      color: 'var(--red)',    desc: 'Hear & type' },
  { id: 'conjugation', icon: '⚡', label: 'Conjugation',    color: 'var(--gold)',   desc: 'Verb forms drill' },
]

const GOALS = [
  { label: '5',  value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '∞',  value: Infinity },
]

export default function Practice({ level }) {
  const [branch,   setBranch]   = useState(null)
  const [goal,     setGoal]     = useState(null)      // null = not chosen yet
  const [ex,       setEx]       = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [streak,   setStreak]   = useState(0)
  const [count,    setCount]    = useState(0)
  const [correct,  setCorrect]  = useState(0)
  const [done,     setDone]     = useState(false)

  useEffect(() => {
    if (branch && goal !== null) loadNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, goal])

  const loadNext = async () => {
    setEx(null); setFeedback(null)
    try {
      const e = await api.practice(branch, level)
      setEx(e)
    } catch (err) { setEx({ error: err.message }) }
  }

  const handleAnswer = async (answer) => {
    if (!ex) return
    try {
      const r = await api.check(ex.id, answer)
      setFeedback(r)
      const newCount = count + 1
      setCount(newCount)
      if (r.correct) { setStreak(s => s + 1); setCorrect(c => c + 1); playCorrect() }
      else            { setStreak(0); playWrong() }
      // auto-finish when finite goal reached
      if (goal !== Infinity && newCount >= goal) {
        setTimeout(() => setDone(true), 1200)
      }
    } catch {
      setFeedback({ correct: false, explanation: 'Connection error.' })
    }
  }

  const reset = () => {
    setBranch(null); setGoal(null); setEx(null); setFeedback(null)
    setStreak(0); setCount(0); setCorrect(0); setDone(false)
  }

  // ── Branch picker ──────────────────────────────────────────
  if (!branch) {
    return (
      <div className="wrap fade-in">
        <div className="mhd">
          <div className="mtitle">Free Practice</div>
          <div className="msub">Pick a branch — exercises generate on the fly, infinitely.</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {BRANCHES.map(b => (
            <div key={b.id} className="card" onClick={() => setBranch(b.id)} style={{ cursor:'pointer', textAlign:'center', padding:'22px 14px' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>{b.icon}</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color: b.color, marginBottom:4 }}>{b.label}</div>
              <div style={{ fontSize:11, color:'var(--dim)' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Goal picker ────────────────────────────────────────────
  if (goal === null) {
    const br = BRANCHES.find(b => b.id === branch)
    return (
      <div className="wrap fade-in">
        <div className="mhd">
          <div style={{ fontSize:34, marginBottom:6 }}>{br?.icon}</div>
          <div className="mtitle">{br?.label}</div>
          <div className="msub">How many exercises for this session?</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:320, margin:'0 auto' }}>
          {GOALS.map(g => (
            <button key={g.value} className="btn btn-glass" style={{ fontSize:22, fontWeight:700, padding:'20px 0' }}
              onClick={() => { setCount(0); setCorrect(0); setStreak(0); setDone(false); setGoal(g.value) }}>
              {g.label}
            </button>
          ))}
        </div>
        <button className="btn btn-glass" style={{ marginTop:20, width:'100%', opacity:.7 }} onClick={() => setBranch(null)}>← Back</button>
      </div>
    )
  }

  // ── Mini result screen ─────────────────────────────────────
  if (done) {
    const br = BRANCHES.find(b => b.id === branch)
    const accuracy = count ? Math.round(correct / count * 100) : 0
    return (
      <div className="wrap fade-in">
        <div className="glass-strong card" style={{ textAlign:'center', padding:36 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>{br?.icon}</div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--gold2)', marginBottom:6 }}>
            Session Complete!
          </div>
          <div style={{ fontSize:15, color:'var(--dim)', marginBottom:14 }}>{br?.label}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:20 }}>
            <StatBox label="Done" value={count} />
            <StatBox label="Correct" value={correct} />
            <StatBox label="Accuracy" value={`${accuracy}%`} />
          </div>
          <div style={{ fontSize:13, color:'var(--gold)', fontWeight:600, marginBottom:18 }}>
            {accuracy >= 90 ? '🔥 Outstanding!' : accuracy >= 70 ? '👍 Well done!' : '📚 Keep practising!'}
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button className="btn btn-glass" onClick={reset}>Change Branch</button>
            <button className="btn btn-gold" onClick={() => { setCount(0); setCorrect(0); setStreak(0); setDone(false); loadNext() }}>Again →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active practice ────────────────────────────────────────
  const br = BRANCHES.find(b => b.id === branch)
  const progPct = goal !== Infinity ? Math.min((count / goal) * 100, 100) : null

  return (
    <div>
      <div className="lesson-topbar">
        <button className="lesson-close" onClick={reset}>✕</button>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3, justifyContent:'center' }}>
          <span style={{ fontSize:11, color:'var(--dim)', fontWeight:600, textTransform:'uppercase', letterSpacing:.6 }}>
            {br?.label} {goal !== Infinity ? `— ${count}/${goal}` : ''}
          </span>
          {progPct !== null && (
            <div className="pbar" style={{ height:4 }}>
              <div className="pfill" style={{ width: `${progPct}%` }} />
            </div>
          )}
        </div>
        <div style={{ fontSize:12, color:'var(--gold2)', fontWeight:700 }}>🔥 {streak}</div>
      </div>

      <div className="wrap" style={{ paddingTop:8 }}>
        {ex?.error && <div className="feedback bad">Error: {ex.error}</div>}
        {!ex && !ex?.error && <div style={{ textAlign:'center', color:'var(--dim)', padding:32 }}>Loading…</div>}
        {ex && !ex.error && (
          <ExerciseRenderer
            key={ex.id}
            exercise={ex}
            onAnswer={handleAnswer}
            locked={!!feedback}
            result={feedback ? { correctIndex: ex.correctIndex, ...feedback } : null}
          />
        )}
        {feedback && (
          <div className={`feedback ${feedback.correct ? 'ok' : 'bad'} fade-in`}>
            <div style={{ fontWeight:700, marginBottom:6 }}>
              {feedback.correct ? `✓ Correct! +${feedback.xpEarned || 10} XP` : '✗ Not quite.'}
            </div>
            <div style={{ color:'var(--cream)' }}>{feedback.explanation}</div>
            {!feedback.correct && feedback.correctAnswer && (
              <div style={{ marginTop:6, color:'var(--dim)', fontSize:12.5 }}>
                Answer: <strong style={{ color:'var(--cream)' }}>{feedback.correctAnswer}</strong>
              </div>
            )}
          </div>
        )}
        {feedback && !done && (
          <button className="btn btn-gold" onClick={loadNext} style={{ width:'100%', marginTop:12 }}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 0' }}>
      <div style={{ fontSize:22, fontWeight:700, color:'var(--gold2)' }}>{value}</div>
      <div style={{ fontSize:11, color:'var(--dim)', marginTop:2 }}>{label}</div>
    </div>
  )
}

function ExerciseRenderer({ exercise, onAnswer, locked, result }) {
  switch (exercise.type) {
    case 'mcq':     return <MCQ     exercise={exercise} onAnswer={onAnswer} locked={locked} result={result} />
    case 'typed':   return <Typed   exercise={exercise} onAnswer={onAnswer} locked={locked} />
    case 'reorder': return <Reorder exercise={exercise} onAnswer={onAnswer} locked={locked} result={result} />
    case 'listen':  return <Listen  exercise={exercise} onAnswer={onAnswer} locked={locked} />
    default:        return <div>Unknown: {exercise.type}</div>
  }
}
