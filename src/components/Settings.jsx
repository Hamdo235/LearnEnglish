import { useState } from 'react'
import { api } from '../api.js'

export default function Settings({ onReset }) {
  const [confirming, setConfirming] = useState(false)
  const [resetting, setResetting] = useState(false)

  const reset = async () => {
    setResetting(true)
    try {
      await api.resetProgress()
      onReset && onReset()
    } finally {
      setResetting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="wrap fade-in">
      <div className="mhd">
        <div className="mtitle">Settings</div>
        <div className="msub">Manage your account & data.</div>
      </div>

      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, color:'var(--dim)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:.6 }}>About</div>
        <div style={{ fontSize:14, lineHeight:1.7 }}>
          <strong style={{ color:'var(--gold2)' }}>FluentShift</strong> is a fully procedural English learning platform — no AI, no LLM, just deterministic exercises generated infinitely from rich data. Your progress is saved locally on the backend.
        </div>
      </div>

      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, color:'var(--dim)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:.6 }}>How it adapts</div>
        <div style={{ fontSize:14, lineHeight:1.7 }}>
          Your level (B1 → C1) is determined by accumulated XP. The skill tree unlocks units gradually, and exercises always match your current level. Each lesson generates fresh exercises every time — you'll rarely see the same item twice.
        </div>
      </div>

      <div className="card" style={{ borderColor:'rgba(234,108,108,0.25)' }}>
        <div style={{ fontSize:13, color:'var(--red)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:.6 }}>⚠ Danger Zone</div>
        <div style={{ fontSize:13.5, color:'var(--dim)', marginBottom:14, lineHeight:1.6 }}>
          Reset all progress. XP, streak, completed lessons, and stats will be wiped. Cannot be undone.
        </div>
        {!confirming ? (
          <button className="btn btn-glass" onClick={() => setConfirming(true)} style={{ color:'var(--red)' }}>Reset Progress</button>
        ) : (
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-glass" onClick={() => setConfirming(false)} disabled={resetting}>Cancel</button>
            <button className="btn btn-gold" onClick={reset} disabled={resetting} style={{ background:'linear-gradient(135deg, var(--red), #FF8080)', color:'white' }}>
              {resetting ? 'Resetting…' : 'Yes, reset everything'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
