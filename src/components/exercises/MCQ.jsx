import { useState } from 'react'

export default function MCQ({ exercise, onAnswer, locked, result }) {
  const [picked, setPicked] = useState(null)

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
            else if (picked === i) cls += ' bad'
          } else if (picked === i) {
            cls += ' ok'
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={locked || picked !== null}>
              <span style={{ opacity:.55, marginRight:10, fontWeight:700 }}>{String.fromCharCode(65 + i)}.</span>{o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
