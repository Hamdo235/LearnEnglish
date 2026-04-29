import { useState, useRef, useEffect } from 'react'

export default function Typed({ exercise, onAnswer, locked }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.focus()
  }, [exercise.id])

  const submit = () => {
    if (locked || submitted || !val.trim()) return
    setSubmitted(true)
    onAnswer(val.trim())
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="ex-wrap fade-in">
      <div className="ex-prompt">{exercise.prompt}</div>
      {exercise.sub && <div className="ex-sub">{exercise.sub}</div>}
      {exercise.question && <div className="ex-question">{exercise.question}</div>}
      <input
        ref={ref}
        className="input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={onKey}
        disabled={locked || submitted}
        placeholder="Type your answer…"
        autoCapitalize="none"
        autoCorrect="off"
      />
      <button className="btn btn-gold" onClick={submit} disabled={locked || submitted || !val.trim()}>
        Check Answer
      </button>
    </div>
  )
}
