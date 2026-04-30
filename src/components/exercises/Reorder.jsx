import { useState, useEffect, useRef } from 'react'

function haptic(ms = 30) {
  try { navigator.vibrate && navigator.vibrate(ms) } catch {}
}

export default function Reorder({ exercise, onAnswer, locked, result }) {
  const [pool, setPool]         = useState(() => exercise.tokens || [])
  const [line, setLine]         = useState([])
  const [submitted, setSubmitted] = useState(false)
  const autoCheck               = useRef(false)

  useEffect(() => {
    setPool(exercise.tokens || [])
    setLine([])
    setSubmitted(false)
    autoCheck.current = false
  }, [exercise.id])

  // auto-submit when pool is drained (all tokens placed)
  useEffect(() => {
    if (!autoCheck.current && pool.length === 0 && line.length > 0 && !submitted && !locked) {
      autoCheck.current = true
      doSubmit(line)
    }
  }, [pool, line])

  const doSubmit = (currentLine) => {
    setSubmitted(true)
    haptic(40)
    onAnswer(currentLine.map(t => t.id))
  }

  const moveToLine = (token) => {
    if (locked || submitted) return
    haptic(20)
    setPool(p => p.filter(t => t.id !== token.id))
    setLine(l => [...l, token])
  }

  const moveToPool = (token) => {
    if (locked || submitted) return
    haptic(20)
    setLine(l => l.filter(t => t.id !== token.id))
    setPool(p => [...p, token])
  }

  const submit = () => {
    if (locked || submitted || line.length === 0) return
    doSubmit(line)
  }

  // Token color after submit
  function tokenCls(token, idx) {
    if (!submitted || !result) return 'token token-anim'
    const correct    = result.correct
    const order      = exercise.correctOrder || []
    const inCorrectPos = order[idx] === token.id
    if (correct)         return 'token token-ok'
    if (inCorrectPos)    return 'token token-ok'
    const shouldBeHere = order[idx] !== undefined
    if (shouldBeHere)    return 'token token-bad'
    return 'token token-warn'
  }

  return (
    <div className="ex-wrap fade-in">
      <div className="ex-prompt">{exercise.prompt}</div>

      <div className="token-line">
        {line.length === 0 && (
          <div style={{ color:'var(--dim)', fontSize:13, fontStyle:'italic', alignSelf:'center', padding:'6px 4px' }}>
            Tap words below to build your sentence…
          </div>
        )}
        {line.map((t, i) => (
          <div key={t.id} className={tokenCls(t, i)} onClick={() => moveToPool(t)}>{t.word}</div>
        ))}
      </div>

      <div className="token-pool">
        {pool.map(t => (
          <div key={t.id} className="token token-anim" onClick={() => moveToLine(t)}>{t.word}</div>
        ))}
      </div>

      {!submitted && (
        <button className="btn btn-gold" onClick={submit} disabled={line.length === 0 || submitted}>
          Check Answer
        </button>
      )}
    </div>
  )
}
