import { useEffect, useState, useRef } from 'react'
import { api } from '../api.js'
import { levelKey } from '../lib/levels.js'

export default function Path({ onLessonStart, refreshKey }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const currentRef = useRef(null)

  useEffect(() => {
    let alive = true
    api.path()
      .then(d => { if (alive) setData(d) })
      .catch(e => { if (alive) setError(e.message) })
    return () => { alive = false }
  }, [refreshKey])

  // scroll to current lesson
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [data])

  if (error) return (
    <div className="wrap"><div className="card" style={{ padding:24, color:'var(--red)' }}>Error: {error}</div></div>
  )
  if (!data) return (
    <div className="wrap"><div className="card" style={{ padding:24, color:'var(--dim)' }}>Loading path…</div></div>
  )

  // find first incomplete lesson across all unlocked units → "current"
  let firstIncompleteId = null
  for (const u of data.units) {
    if (!u.unlocked) break
    const incomplete = u.lessons.find(l => !l.completed)
    if (incomplete) { firstIncompleteId = incomplete.id; break }
  }

  return (
    <div className="wrap">
      <div className="mhd">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
          <div>
            <div className="mtitle">Your Journey</div>
            <div className="msub">B1 → C1 · choose a lesson and start practicing.</div>
          </div>
          <span className={`lvl-chip lvl-${levelKey(data.currentLevel)}`} style={{ fontSize:13, padding:'7px 14px' }}>
            📊 {data.currentLevel}
          </span>
        </div>
      </div>
      <div className="path-wrap">
        {data.units.map((unit, ui) => (
          <div key={unit.id} className="unit-block">
            <div className={`unit-banner ${!unit.unlocked ? 'locked' : ''}`}>
              <div className="unit-banner-meta">
                <span style={{ fontSize:18 }}>{!unit.unlocked ? '🔒' : unit.allDone ? '✅' : '✨'}</span>
                <div>
                  <div className="unit-title">{unit.title}</div>
                  <div style={{ fontSize:11, color:'var(--dim)', marginTop:2 }}>{unit.level} · Unit {ui % 4 + 1}</div>
                </div>
              </div>
              <span className={`lvl-chip lvl-${levelKey(unit.level)}`}>{unit.level}</span>
            </div>
            {unit.lessons.map((l, li) => {
              const isCurrent = l.id === firstIncompleteId
              const status = !unit.unlocked ? 'locked' : l.completed ? 'completed' : isCurrent ? 'current' : 'unlocked'
              const offset = li % 2 === 0 ? -55 : 55  // serpentine
              return (
                <div key={l.id} className="lesson-row">
                  <div
                    ref={isCurrent ? currentRef : null}
                    className={`lesson-node ${status}`}
                    style={{ marginLeft: offset }}
                    onClick={() => unit.unlocked && onLessonStart(l.id)}
                    title={l.title}
                  >
                    {l.completed && (
                      <div className="stars">
                        {[0,1,2].map(i => (
                          <span key={i} style={{ color: i < (l.stars || 0) ? '#FFD773' : 'rgba(255,255,255,0.18)' }}>★</span>
                        ))}
                      </div>
                    )}
                    <span>{l.branchInfo?.icon || '✦'}</span>
                    <div className="ln-label">{l.title}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
