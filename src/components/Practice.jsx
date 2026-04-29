import { useEffect, useState } from 'react'
import { api } from '../api.js'
import MCQ from './exercises/MCQ.jsx'
import Typed from './exercises/Typed.jsx'
import Reorder from './exercises/Reorder.jsx'
import Listen from './exercises/Listen.jsx'

const BRANCHES = [
  { id: 'vocabulary',  icon: '📚', label: 'Vocabulary',     color: 'var(--gold2)',  desc: 'Learn new words' },
  { id: 'grammar',     icon: '🎯', label: 'Grammar',        color: 'var(--blue)',   desc: 'Master grammar rules' },
  { id: 'sentence',    icon: '🧱', label: 'Sentence Build', color: 'var(--violet)', desc: 'Reorder words' },
  { id: 'translation', icon: '🔄', label: 'Translation',    color: 'var(--green)',  desc: 'FR ↔ EN' },
  { id: 'listening',   icon: '👂', label: 'Listening',      color: 'var(--red)',    desc: 'Hear & type' },
  { id: 'conjugation', icon: '⚡', label: 'Conjugation',    color: 'var(--gold)',   desc: 'Verb forms drill' },
]

export default function Practice({ level }) {
  const [branch, setBranch] = useState(null)
  const [ex, setEx] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [streak, setStreak] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (branch) loadNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch])

  const loadNext = async () => {
    setEx(null); setFeedback(null)
    try {
      const e = await api.practice(branch, level)
      setEx(e)
    } catch (err) { setEx({ error: err.message }) }
  }

  const handleAnswer = async (answer) => {
    try {
      const r = await api.check(ex.id, answer)
      setFeedback(r)
      setCount(c => c + 1)
      if (r.correct) setStreak(s => s + 1)
      else setStreak(0)
    } catch {
      setFeedback({ correct: false, explanation: 'Connection error.' })
    }
  }

  if (!branch) {
    return (
      <div className="wrap fade-in">
        <div className="mhd">
          <div className="mtitle">Free Practice</div>
          <div className="msub">Pick a branch — exercises generate on the fly, infinitely.</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {BRANCHES.map(b => (
            <div key={b.id} className="card" onClick={() => { setStreak(0); setCount(0); setBranch(b.id) }} style={{ cursor:'pointer', textAlign:'center', padding:'22px 14px' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>{b.icon}</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color: b.color, marginBottom:4 }}>{b.label}</div>
              <div style={{ fontSize:11, color:'var(--dim)' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="lesson-topbar">
        <button className="lesson-close" onClick={() => setBranch(null)}>✕</button>
        <div style={{ flex:1, display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'var(--dim)', fontWeight:600, textTransform:'uppercase', letterSpacing:.6 }}>
            {BRANCHES.find(b => b.id === branch)?.label}
          </span>
        </div>
        <div style={{ fontSize:12, color:'var(--gold2)', fontWeight:700 }}>🔥 {streak}</div>
      </div>
      <div className="wrap" style={{ paddingTop:8 }}>
        {ex?.error && <div className="feedback bad">Error: {ex.error}</div>}
        {ex && !ex.error && (
          <ExerciseRenderer
            key={ex.id}
            exercise={ex}
            onAnswer={handleAnswer}
            locked={!!feedback}
            result={feedback}
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
        {feedback && (
          <button className="btn btn-gold" onClick={loadNext} style={{ width:'100%', marginTop:12 }}>
            Next →
          </button>
        )}
        {count > 0 && !feedback && (
          <div style={{ textAlign:'center', marginTop:16, fontSize:12, color:'var(--dim)' }}>
            Answered: {count}
          </div>
        )}
      </div>
    </div>
  )
}

function ExerciseRenderer({ exercise, onAnswer, locked, result }) {
  switch (exercise.type) {
    case 'mcq':     return <MCQ exercise={exercise} onAnswer={onAnswer} locked={locked} result={result} />
    case 'typed':   return <Typed exercise={exercise} onAnswer={onAnswer} locked={locked} />
    case 'reorder': return <Reorder exercise={exercise} onAnswer={onAnswer} locked={locked} />
    case 'listen':  return <Listen exercise={exercise} onAnswer={onAnswer} locked={locked} />
    default:        return <div>Unknown: {exercise.type}</div>
  }
}
