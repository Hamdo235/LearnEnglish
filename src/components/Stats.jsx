import { levelKey, LEVELS } from '../lib/levels.js'

const BRANCHES = {
  vocabulary:  { icon:'📚', label:'Vocabulary',     color:'var(--gold2)'  },
  grammar:     { icon:'🎯', label:'Grammar',        color:'var(--blue)'   },
  sentence:    { icon:'🧱', label:'Sentence Build', color:'var(--violet)' },
  translation: { icon:'🔄', label:'Translation',    color:'var(--green)'  },
  listening:   { icon:'👂', label:'Listening',      color:'var(--red)'    },
  conjugation: { icon:'⚡', label:'Conjugation',    color:'var(--gold)'   },
}

export default function Stats({ progress }) {
  if (!progress) return <div className="wrap"><div className="card" style={{ padding:24, color:'var(--dim)' }}>Loading…</div></div>

  const xpPct = Math.min((progress.xp / progress.maxXP) * 100, 100)
  const totalAcc = progress.stats.totalAnswers
    ? Math.round((progress.stats.correctAnswers / progress.stats.totalAnswers) * 100)
    : 0
  const completed = Object.keys(progress.completedLessons || {}).length

  return (
    <div className="wrap fade-in">
      <div className="mhd">
        <div className="mtitle">Your Progress</div>
        <div className="msub">Track your journey toward C1.</div>
      </div>

      {/* Level Hero */}
      <div className="card" style={{ marginBottom:18, position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg, rgba(212,183,92,0.16), rgba(212,183,92,0.05))',
        borderColor:'rgba(212,183,92,0.28)' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(240,211,122,0.25), transparent 70%)', filter:'blur(20px)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, position:'relative' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--dim)', marginBottom:8, letterSpacing:1, textTransform:'uppercase' }}>Current Level</div>
            <span className={`lvl-chip lvl-${levelKey(progress.level)}`} style={{ fontSize:14, padding:'7px 14px' }}>
              📊 {progress.level}
            </span>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700,
              background:'linear-gradient(135deg, var(--gold), var(--gold2))',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent', lineHeight:1 }}>
              {progress.xp}
            </div>
            <div style={{ fontSize:10, color:'var(--dim)', marginTop:3 }}>XP</div>
          </div>
        </div>
        <div className="pbar"><div className="pfill" style={{ width: xpPct + '%' }} /></div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7 }}>
          {LEVELS.map(l => (
            <span key={l} style={{ fontSize:10.5, color: l === progress.level ? 'var(--gold2)' : 'var(--dim)', fontWeight: l === progress.level ? 700 : 500 }}>{l}</span>
          ))}
        </div>
        {progress.xp < progress.nextThreshold && (
          <div style={{ marginTop:10, fontSize:11.5, color:'var(--dim)' }}>
            <strong style={{ color:'var(--cream)' }}>{progress.nextThreshold - progress.xp} XP</strong> until next level
          </div>
        )}
      </div>

      {/* Top stats */}
      <div className="g3" style={{ marginBottom:18 }}>
        <div className="stat"><div className="stat-val" style={{ color:'var(--red)' }}>🔥 {progress.streak}</div><div className="stat-lbl">Streak</div></div>
        <div className="stat"><div className="stat-val">{completed}</div><div className="stat-lbl">Lessons</div></div>
        <div className="stat"><div className="stat-val">{totalAcc}%</div><div className="stat-lbl">Accuracy</div></div>
      </div>

      {/* Per-branch */}
      <div style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>By Branch</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {Object.entries(progress.stats.byBranch).map(([id, s]) => {
          const meta = BRANCHES[id]
          const acc = s.total ? Math.round((s.correct / s.total) * 100) : 0
          return (
            <div key={id} className="card" style={{ padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:20 }}>{meta?.icon}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--cream)' }}>{meta?.label}</span>
                </div>
                <div style={{ fontSize:12, color: meta?.color, fontWeight:700 }}>
                  {s.correct} / {s.total}{s.total ? ` · ${acc}%` : ''}
                </div>
              </div>
              <div className="pbar" style={{ height:6 }}>
                <div className="pfill" style={{ width: acc + '%', background: `linear-gradient(90deg, ${meta?.color}, var(--gold2))` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
