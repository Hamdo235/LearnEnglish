import { useState, useEffect } from 'react'

export default function Reorder({ exercise, onAnswer, locked }) {
  const [pool, setPool] = useState(() => exercise.tokens || [])
  const [line, setLine] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setPool(exercise.tokens || [])
    setLine([])
    setSubmitted(false)
  }, [exercise.id])

  const moveToLine = (token) => {
    if (locked || submitted) return
    setPool(p => p.filter(t => t.id !== token.id))
    setLine(l => [...l, token])
  }

  const moveToPool = (token) => {
    if (locked || submitted) return
    setLine(l => l.filter(t => t.id !== token.id))
    setPool(p => [...p, token])
  }

  const submit = () => {
    if (locked || submitted || line.length === 0) return
    setSubmitted(true)
    onAnswer(line.map(t => t.id))
  }

  const canSubmit = pool.length === 0 && line.length > 0

  return (
    <div className="ex-wrap fade-in">
      <div className="ex-prompt">{exercise.prompt}</div>
      <div className="token-line">
        {line.length === 0 && <div style={{ color:'var(--dim)', fontSize:13, fontStyle:'italic', alignSelf:'center', padding:'6px 4px' }}>Tap words below to build your sentence…</div>}
        {line.map(t => (
          <div key={t.id} className="token" onClick={() => moveToPool(t)}>{t.word}</div>
        ))}
      </div>
      <div className="token-pool">
        {pool.map(t => (
          <div key={t.id} className="token" onClick={() => moveToLine(t)}>{t.word}</div>
        ))}
      </div>
      <button className="btn btn-gold" onClick={submit} disabled={!canSubmit || submitted}>
        Check Answer
      </button>
    </div>
  )
}
