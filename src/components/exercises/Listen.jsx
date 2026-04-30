import { useState, useRef, useEffect } from 'react'

function getBestEnVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  return (
    voices.find(v => v.lang === 'en-US' && v.localService) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en')) ||
    null
  )
}

function hasEnVoice() {
  if (!('speechSynthesis' in window)) return false
  return !!getBestEnVoice()
}

export default function Listen({ exercise, onAnswer, locked }) {
  const [val, setVal]             = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [voiceOk, setVoiceOk]     = useState(true)
  const inputRef                  = useRef(null)

  useEffect(() => {
    const check = () => setVoiceOk(hasEnVoice())
    check()
    window.speechSynthesis?.addEventListener('voiceschanged', check)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', check)
  }, [])

  useEffect(() => {
    setVal('')
    setSubmitted(false)
    const t = setTimeout(() => speak(), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  const buildUtterance = (rate = 0.92) => {
    const u = new SpeechSynthesisUtterance(exercise.audioText || '')
    u.lang = 'en-US'
    u.rate = rate
    u.pitch = 1
    const voice = getBestEnVoice()
    if (voice) u.voice = voice
    return u
  }

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(buildUtterance(0.92))
  }

  const speakSlow = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(buildUtterance(0.60))
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
      {!voiceOk && (
        <div className="voice-warning">
          ⚠️ No English voice found on this device. Audio may be silent — type what you'd expect to hear based on the sentence shown below.
          <div style={{ marginTop:6, fontStyle:'italic', opacity:.9 }}>"{exercise.audioText}"</div>
        </div>
      )}
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
