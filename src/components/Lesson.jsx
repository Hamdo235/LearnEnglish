import { useEffect, useState, useCallback, useRef } from 'react'
import { api } from '../api.js'
import MCQ from './exercises/MCQ.jsx'
import Typed from './exercises/Typed.jsx'
import Reorder from './exercises/Reorder.jsx'
import Listen from './exercises/Listen.jsx'
import { saveSession, loadSession, clearSession } from '../lib/session.js'
import { playCorrect, playWrong, playLevelUp } from '../lib/sounds.js'

// ── Confetti particles ────────────────────────────────────────
function Confetti() {
  const colors = ['#FFD700','#FF6B6B','#6BFFB8','#6BC5FF','#FF6BF5']
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:9999 }}>
      {Array.from({ length: 36 }).map((_, i) => {
        const left  = `${Math.random()*100}%`
        const color = colors[i % colors.length]
        const delay = `${(Math.random()*0.6).toFixed(2)}s`
        const size  = 8 + Math.floor(Math.random()*8)
        return (
          <div key={i} style={{
            position:'absolute', top:'-20px', left,
            width: size, height: size,
            background: color, borderRadius: Math.random()>0.5 ? '50%' : '2px',
            animation: `confetti-fall 1.6s ${delay} ease-in forwards`,
          }} />
        )
      })}
    </div>
  )
}

// ── Floating XP label ─────────────────────────────────────────
function XPFloat({ xp }) {
  return (
    <div style={{
      position:'fixed', bottom: 120, right: 24,
      fontFamily:'Playfair Display,serif', fontSize:22,
      color:'var(--gold2)', fontWeight:700,
      animation:'xp-float 1.2s ease-out forwards',
      pointerEvents:'none', zIndex:9998,
    }}>+{xp} XP</div>
  )
}

// ── Review Errors screen ──────────────────────────────────────
function ReviewErrors({ errors, onDone }) {
  const [ri, setRi]   = useState(0)
  const [flipped, setFlipped] = useState(false)
  if (!errors.length) { onDone(); return null }
  const err = errors[ri]
  return (
    <div className="wrap fade-in">
      <div className="card" style={{ textAlign:'center', padding:32 }}>
        <div style={{ fontSize:13, color:'var(--dim)', marginBottom:8 }}>
          Review errors — {ri + 1} / {errors.length}
        </div>
        <div style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>{err.exercise.prompt}</div>
        <div style={{ fontSize:15, marginBottom:16, color:'var(--cream)' }}>
          {err.exercise.question || err.exercise.sentence || err.exercise.audioText || '—'}
        </div>
        {!flipped ? (
          <button className="btn btn-glass" onClick={() => setFlipped(true)}>Show Answer</button>
        ) : (
          <>
            <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.07)', marginBottom:16, color:'var(--gold2)', fontWeight:600 }}>
              {err.correctAnswer}
            </div>
            <div style={{ fontSize:12.5, color:'var(--dim)', marginBottom:16 }}>{err.explanation}</div>
            <button className="btn btn-gold" onClick={() => { setFlipped(false); if (ri + 1 < errors.length) setRi(r => r + 1); else onDone() }}>
              {ri + 1 < errors.length ? 'Next →' : 'Finish Review'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Self-check overlay (for typed translations) ───────────────
function SelfCheck({ correctAnswer, explanation, onResult }) {
  return (
    <div className="self-check fade-in">
      <div style={{ fontWeight:700, marginBottom:6, fontSize:15 }}>Check your translation:</div>
      <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.10)', color:'var(--gold2)', fontWeight:600, marginBottom:8 }}>
        {correctAnswer}
      </div>
      {explanation && (
        <div style={{ fontSize:12.5, color:'var(--cream)', marginBottom:12 }}>{explanation}</div>
      )}
      <div style={{ display:'flex', gap:10 }}>
        <button className="btn btn-ok" onClick={() => onResult(true)} style={{ flex:1 }}>✓ I was right</button>
        <button className="btn btn-bad" onClick={() => onResult(false)} style={{ flex:1 }}>✗ I was wrong</button>
      </div>
    </div>
  )
}

// ── Main Lesson component ─────────────────────────────────────
export default function Lesson({ lessonId, onExit, onComplete }) {
  const [data,     setData]     = useState(null)
  const [idx,      setIdx]      = useState(0)
  const [feedback, setFeedback] = useState(null)   // server response
  const [selfCheck,setSelfCheck]= useState(false)  // waiting for user self-assessment
  const [score,    setScore]    = useState(0)
  const [errors,   setErrors]   = useState([])     // { exercise, correctAnswer, explanation }
  const [phase,    setPhase]    = useState('lesson') // 'lesson' | 'review' | 'done'
  const [xpFloat,  setXpFloat]  = useState(null)
  const [confetti, setConfetti] = useState(false)
  const [loadErr,  setLoadErr]  = useState(null)
  const totalXpRef              = useRef(0)

  // ── Load / restore session ──────────────────────────────────
  useEffect(() => {
    let alive = true
    setData(null); setIdx(0); setFeedback(null); setSelfCheck(false)
    setScore(0); setErrors([]); setPhase('lesson'); setLoadErr(null)
    totalXpRef.current = 0

    const saved = loadSession()
    if (saved?.lessonId === lessonId && saved.data) {
      if (alive) {
        setData(saved.data)
        setIdx(saved.idx || 0)
        setScore(saved.score || 0)
        setErrors(saved.errors || [])
        totalXpRef.current = saved.totalXp || 0
      }
      return
    }
    api.lesson(lessonId)
      .then(d => { if (alive) { setData(d); clearSession() } })
      .catch(e => { if (alive) setLoadErr(e.message) })
    return () => { alive = false }
  }, [lessonId])

  // ── Persist session on every state change ──────────────────
  useEffect(() => {
    if (!data || phase !== 'lesson') return
    saveSession({ lessonId, data, idx, score, errors, totalXp: totalXpRef.current })
  }, [lessonId, data, idx, score, errors, phase])

  // ── Space = Continue keyboard shortcut ─────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' && (feedback || selfCheck) && !selfCheck) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  // ── Answer handler ─────────────────────────────────────────
  const handleAnswer = async (answer) => {
    if (!data) return
    const ex = data.exercises[idx]
    try {
      const res = await api.check(ex.id, answer)
      // For typed translation → show self-check UI
      if (res.needsSelfCheck) {
        setFeedback(res)
        setSelfCheck(true)
        return
      }
      applyResult(res, ex)
    } catch {
      setFeedback({ correct: false, explanation: 'Connection error.' })
    }
  }

  const applyResult = (res, ex) => {
    setFeedback(res)
    setSelfCheck(false)
    if (res.correct) {
      setScore(s => s + 1)
      playCorrect()
      const xp = res.xpEarned || 10
      totalXpRef.current += xp
      setXpFloat(xp)
      setTimeout(() => setXpFloat(null), 1300)
    } else {
      playWrong()
      setErrors(prev => [...prev, {
        exercise: ex,
        correctAnswer: res.correctAnswer || '—',
        explanation: res.explanation || '',
      }])
    }
  }

  const handleSelfCheck = (wasRight) => {
    const ex = data.exercises[idx]
    applyResult({ ...feedback, correct: wasRight }, ex)
  }

  // ── Next exercise / finish ──────────────────────────────────
  const handleNext = useCallback(async () => {
    if (!data) return
    setFeedback(null)
    setSelfCheck(false)
    const nextIdx = idx + 1
    if (nextIdx >= data.total) {
      const finalScore = score + (feedback?.correct ? 0 : 0) // score already updated
      try { await api.completeLesson(lessonId, finalScore, data.total) } catch {}
      clearSession()
      // celebrate if ≥ 80%
      if (finalScore / data.total >= 0.8) {
        setConfetti(true)
        playLevelUp()
        setTimeout(() => setConfetti(false), 2000)
      }
      if (errors.length > 0) setPhase('review')
      else setPhase('done')
    } else {
      setIdx(nextIdx)
    }
  }, [data, idx, score, feedback, errors, lessonId])

  // ── Render guards ──────────────────────────────────────────
  if (loadErr) return (
    <div className="wrap">
      <div className="card" style={{ textAlign:'center', padding:32 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
        <div style={{ color:'var(--red)', marginBottom:12 }}>Could not load lesson: {loadErr}</div>
        <button className="btn btn-glass" onClick={onExit}>Go Back</button>
      </div>
    </div>
  )

  if (!data) return (
    <div className="wrap">
      <div className="card" style={{ textAlign:'center', padding:32, color:'var(--dim)' }}>Loading lesson…</div>
    </div>
  )

  // ── Review errors phase ────────────────────────────────────
  if (phase === 'review') {
    return (
      <>
        {confetti && <Confetti />}
        <div className="lesson-topbar">
          <button className="lesson-close" onClick={onExit} aria-label="Close">✕</button>
          <div style={{ flex:1, textAlign:'center', fontSize:13, color:'var(--dim)', fontWeight:600 }}>Review Errors</div>
        </div>
        <ReviewErrors errors={errors} onDone={() => setPhase('done')} />
      </>
    )
  }

  // ── Done phase ─────────────────────────────────────────────
  if (phase === 'done') {
    const total = data.total
    const ratio = score / total
    const stars = ratio >= 1 ? 3 : ratio >= 0.8 ? 2 : ratio >= 0.5 ? 1 : 0
    return (
      <div className="wrap fade-in">
        {confetti && <Confetti />}
        <div className="glass-strong card" style={{ textAlign:'center', padding:36 }}>
          <div style={{ fontSize:60, marginBottom:6 }}>
            {stars >= 3 ? '🏆' : stars >= 2 ? '⭐' : stars >= 1 ? '👏' : '📚'}
          </div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'var(--gold2)', marginBottom:4 }}>
            Lesson Complete!
          </div>
          <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>{score} / {total}</div>
          <div style={{ fontSize:20, marginBottom:18 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? 'var(--gold2)' : 'rgba(255,255,255,0.15)' }}>★</span>
            ))}
          </div>
          <div style={{ fontSize:13, color:'var(--gold)', marginBottom:6, fontWeight:600 }}>
            +{totalXpRef.current} XP earned
          </div>
          <div style={{ fontSize:13.5, color:'var(--dim)', marginBottom:22, lineHeight:1.6 }}>
            {ratio >= 1 ? 'Perfect! Absolutely flawless.' : ratio >= 0.8 ? 'Great work — keep the streak going!' : ratio >= 0.5 ? 'Solid effort. Practice makes perfect.' : "Don't give up — review and retry!"}
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button className="btn btn-glass" onClick={onExit}>Back to Path</button>
            <button className="btn btn-gold" onClick={() => onComplete?.()}>Continue →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active lesson ──────────────────────────────────────────
  const ex       = data.exercises[idx]
  const progress = ((idx + (feedback ? 1 : 0)) / data.total) * 100

  return (
    <div>
      {confetti && <Confetti />}
      {xpFloat !== null && <XPFloat xp={xpFloat} />}

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
          result={feedback ? { correctIndex: ex.correctIndex, ...feedback } : null}
        />

        {/* Self-check overlay for typed translations */}
        {selfCheck && feedback && (
          <SelfCheck
            correctAnswer={feedback.correctAnswer || '—'}
            explanation={feedback.explanation}
            onResult={handleSelfCheck}
          />
        )}

        {/* Regular feedback bar */}
        {feedback && !selfCheck && (
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

        {feedback && !selfCheck && (
          <button className="btn btn-gold" onClick={handleNext} style={{ width:'100%', marginTop:12 }}>
            {idx + 1 >= data.total ? 'Finish Lesson' : 'Continue →'}
            <span style={{ opacity:.5, fontSize:11, marginLeft:6 }}>Space</span>
          </button>
        )}
      </div>
    </div>
  )
}

function ExerciseRenderer({ exercise, onAnswer, locked, result }) {
  switch (exercise.type) {
    case 'mcq':     return <MCQ     exercise={exercise} onAnswer={onAnswer} locked={locked} result={result} />
    case 'typed':   return <Typed   exercise={exercise} onAnswer={onAnswer} locked={locked} />
    case 'reorder': return <Reorder exercise={exercise} onAnswer={onAnswer} locked={locked} result={result} />
    case 'listen':  return <Listen  exercise={exercise} onAnswer={onAnswer} locked={locked} />
    default:        return <div>Unknown exercise type: {exercise.type}</div>
  }
}
