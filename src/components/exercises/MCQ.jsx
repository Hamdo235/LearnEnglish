import { useState, useEffect } from 'react'

export default function MCQ({ exercise, onAnswer, locked, result }) {
  const [picked, setPicked] = useState(null)

  useEffect(() => { setPicked(null) }, [exercise?.id])

  useEffect(() => {
    const handler = (e) => {
      if (locked || picked !== null) return
      const n = parseInt(e.key)
      if (n >= 1 && n <= exercise.options.length) choose(n - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const choose = (i) => {
    if (locked || picked !== null) return
    setPicked(i)
    onAnswer(i)
  }

  const showResult = result !== null && result !== undefined

  return (
    <div className="ex-wrap fade-in">
      <div className="ex-prompt">{exercise.prompt}</div>
      {exercise.sub && <div className="ex-sub">{exercise.sub}</div>}
      {exercise.question && <div className="ex-question">{exercise.question}</div>}
      <div>
        {exercise.options.map((o, i) => {
          let cls = 'opt'
          if (showResult) {
            if (i === result.correctIndex) cls += ' ok'
            else if (picked === i && picked !== result.correctIndex) cls += ' bad'
          } else if (picked === i) {
            cls += ' selected'
          }
          const kbHint = !showResult && !picked && i < 9
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={locked || picked !== null}>
              <span className="opt-key">{kbHint ? i + 1 : String.fromCharCode(65 + i)+'.'}</span>
              {o}
            </button>
          )
        })}
      </div>
      {!showResult && picked === null && (
        <div className="kbd-hint">Press 1–{exercise.options.length} to select</div>
      )}
    </div>
  )
}
