import { useState, useRef, useEffect } from 'react'

export default function Listen({ exercise, onAnswer, locked }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setVal('')
    setSubmitted(false)
    // auto-play once on mount
    const t = setTimeout(() => speak(), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    const text = exercise.audioText || ''
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.92
    u.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const speakSlow = () => {
    if (!('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(exercise.audioText || '')
    u.lang = 'en-US'
    u.rate = 0.6
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const submit = () => {
    if (locked || submitted || !val.trim()) return
    setSubmitted(true)
    onAnswer(val.trim())
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="ex-wrap fade-in">
      <div className="ex-prompt">{exercise.prompt}</div>
      <div style={{ display:'flex', gap:10, justifyContent:'center', padding:'10px 0' }}>
        <button className="btn btn-gold" onClick={speak} type="button" style={{ width:64, height:64, borderRadius:'50%', fontSize:24, padding:0 }}>🔊</button>
        <button className="btn btn-glass" onClick={speakSlow} type="button" style={{ width:64, height:64, borderRadius:'50%', fontSize:22, padding:0 }}>🐢</button>
      </div>
      <input
        ref={inputRef}
        className="input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={onKey}
        disabled={locked || submitted}
        placeholder="Type what you hear…"
        autoCapitalize="none"
        autoCorrect="off"
      />
      <button className="btn btn-gold" onClick={submit} disabled={locked || submitted || !val.trim()}>
        Check Answer
      </button>
    </div>
  )
}
