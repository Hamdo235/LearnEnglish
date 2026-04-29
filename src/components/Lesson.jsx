import { useEffect, useState } from 'react'
import { api } from '../api.js'
import MCQ from './exercises/MCQ.jsx'
import Typed from './exercises/Typed.jsx'
import Reorder from './exercises/Reorder.jsx'
import Listen from './exercises/Listen.jsx'

export default function Lesson({ lessonId, onExit, onComplete }) {
  const [data, setData] = useState(null)
  const [idx, setIdx] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setData(null); setIdx(0); setFeedback(null); setScore(0); setDone(false); setError(null)
    api.lesson(lessonId)
      .then(d => { if (alive) setData(d) })
      .catch(e => { if (alive) setError(e.message) })
    return () => { alive = false }
  }, [lessonId])

  if (error) return (
    <div className="wrap">
      <div className="card" style={{ textAlign:'center', padding:32 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
        <div style={{ color:'var(--red)', marginBottom:12 }}>Could not load lesson: {error}</div>
        <button className="btn btn-glass" onClick={onExit}>Go Back</button>
      </div>
    </div>
  )

  if (!data) return (
    <div className="wrap">
      <div className="card" style={{ textAlign:'center', padding:32, color:'var(--dim)' }}>Loading lesson…</div>
    </div>
  )

  if (done) {
    const total = data.total
    const ratio = score / total
    const stars = ratio >= 1 ? 3 : ratio >= 0.8 ? 2 : ratio >= 0.5 ? 1 : 0
    const xpEarned = score * 12 // approximate display
    return (
      <div className="wrap fade-in">
        <div className="glass-strong card" style={{ textAlign:'center', padding:36 }}>
          <div style={{ fontSize:56, marginBottom:6 }}>{stars >= 3 ? '🏆' : stars >= 2 ? '⭐' : stars >= 1 ? '👏' : '📚'}</div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:30, color:'var(--gold2)', marginBottom:6 }}>
            {score} / {total}
          </div>
          <div style={{ fontSize:18, marginBottom:18 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? 'var(--gold2)' : 'rgba(255,255,255,0.15)', fontSize:28 }}>★</span>
            ))}
          </div>
          <div style={{ fontSize:13.5, color:'var(--dim)', marginBottom:22, lineHeight:1.6 }}>
            {ratio >= 1 ? "Perfect! You crushed it." : ratio >= 0.8 ? "Great work — keep going." : ratio >= 0.5 ? "Solid effort. Practice makes perfect." : "Don't give up — try again!"}
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button className="btn btn-glass" onClick={onExit}>Back to Path</button>
            <button className="btn btn-gold" onClick={() => onComplete && onComplete()}>Continue</button>
          </div>
        </div>
      </div>
    )
  }

  const ex = data.exercises[idx]
  const progress = ((idx + (feedback ? 1 : 0)) / data.total) * 100

  const handleAnswer = async (answer) => {
    try {
      const res = await api.check(ex.id, answer)
      setFeedback(res)
      if (res.correct) setScore(s => s + 1)
    } catch (e) {
      setFeedback({ correct: false, explanation: 'Connection error. Try again.' })
    }
  }

  const handleNext = async () => {
    setFeedback(null)
    if (idx + 1 >= data.total) {
      // finalize
      const finalScore = score
      try {
        await api.completeLesson(lessonId, finalScore, data.total)
      } catch {}
      setDone(true)
    } else {
      setIdx(i => i + 1)
    }
  }

  return (
    <div>
      <div className="lesson-topbar">
        <button className="lesson-close" onClick={onExit} aria-label="Close lesson">✕</button>
        <div className="pbar"><div className="pfill" style={{ width: progress + '%' }} /></div>
        <div style={{ fontSize:12, color:'var(--dim)', fontWeight:600, minWidth:36, textAlign:'right' }}>
          {idx + 1}/{data.total}
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 8 }}>
        <ExerciseRenderer
          key={ex.id}
          exercise={ex}
          onAnswer={handleAnswer}
          locked={!!feedback}
          result={feedback ? { correctIndex: data.exercises[idx].correctIndex, ...feedback } : null}
        />
        {feedback && (
          <div className={`feedback ${feedback.correct ? 'ok' : 'bad'} fade-in`}>
            <div style={{ fontWeight:700, marginBottom:6 }}>
              {feedback.correct ? '✓ Correct!' : '✗ Not quite.'}
              {feedback.correct && feedback.xpEarned ? ` +${feedback.xpEarned} XP` : ''}
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
          <button className="btn btn-gold" onClick={handleNext} style={{ width:'100%', marginTop:12 }}>
            {idx + 1 >= data.total ? 'Finish Lesson' : 'Continue →'}
          </button>
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
    default:        return <div>Unknown exercise type: {exercise.type}</div>
  }
}
