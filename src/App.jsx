import { useEffect, useState, useCallback } from 'react'
import { CSS } from './styles.js'
import { api } from './api.js'
import { levelKey } from './lib/levels.js'
import Path from './components/Path.jsx'
import Lesson from './components/Lesson.jsx'
import Practice from './components/Practice.jsx'
import Stats from './components/Stats.jsx'
import Settings from './components/Settings.jsx'

const NAV = [
  { id: 'path',     ic: '🗺️', lb: 'Journey'   },
  { id: 'practice', ic: '⚡', lb: 'Practice'  },
  { id: 'stats',    ic: '📊', lb: 'Progress'  },
  { id: 'settings', ic: '⚙️', lb: 'Settings'  },
]

export default function App() {
  const [view, setView] = useState('path')
  const [progress, setProgress] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const p = await api.progress()
      setProgress(p)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const onLessonStart = (id) => {
    setActiveLesson(id)
  }

  const onLessonExit = () => {
    setActiveLesson(null)
    refresh()
    setRefreshKey(k => k + 1)
  }

  const renderView = () => {
    if (activeLesson) {
      return <Lesson lessonId={activeLesson} onExit={onLessonExit} onComplete={onLessonExit} />
    }
    switch (view) {
      case 'path':     return <Path onLessonStart={onLessonStart} refreshKey={refreshKey} />
      case 'practice': return <Practice level={progress?.level} />
      case 'stats':    return <Stats progress={progress} />
      case 'settings': return <Settings onReset={() => { refresh(); setRefreshKey(k => k+1); setView('path') }} />
      default:         return <Path onLessonStart={onLessonStart} refreshKey={refreshKey} />
    }
  }

  if (error) {
    return (
      <>
        <style>{CSS}</style>
        <div className="aurora" />
        <div className="app">
          <main className="main">
            <div className="wrap">
              <div className="card" style={{ padding:24, textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
                <div style={{ color:'var(--red)', marginBottom:8, fontWeight:600 }}>Cannot reach backend</div>
                <div style={{ fontSize:13, color:'var(--dim)', marginBottom:14 }}>{error}</div>
                <div style={{ fontSize:12, color:'var(--dim)' }}>Make sure the backend is running on port 3001 — try <code style={{ color:'var(--gold2)' }}>npm run dev</code></div>
                <button className="btn btn-gold" onClick={refresh} style={{ marginTop:14 }}>Retry</button>
              </div>
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="aurora" />
      <div className="app">
        {!activeLesson && (
          <Sidebar view={view} setView={setView} progress={progress} />
        )}
        <main className="main">
          {!activeLesson && <TopBar progress={progress} />}
          {renderView()}
        </main>
        {!activeLesson && <BottomNav view={view} setView={setView} />}
      </div>
    </>
  )
}

function Sidebar({ view, setView, progress }) {
  return (
    <aside className="sidebar">
      <div className="glass-strong sidebar-inner">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-main">FluentShift</div>
            <div className="logo-sub">B1 → C1 Journey</div>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-lbl">Modules</div>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
              <span className="nav-icon">{n.ic}</span>
              <span>{n.lb}</span>
            </div>
          ))}
        </nav>
        <div className="s-foot">
          {progress && (
            <>
              <div className="t-row" style={{ marginBottom: 8 }}>
                <div>
                  <div className="t-lbl">Level</div>
                  <div className="t-val">
                    <span className={`lvl-chip lvl-${levelKey(progress.level)}`}>{progress.level}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="t-lbl">XP</div>
                  <div className="t-val">{progress.xp}</div>
                </div>
              </div>
              <div className="t-row">
                <div>
                  <div className="t-lbl">Streak</div>
                  <div className="t-val">🔥 {progress.streak}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

function TopBar({ progress }) {
  return (
    <div className="topbar">
      <div className="tb-title">
        <div className="logo-icon" style={{ width:30, height:30, fontSize:15, borderRadius:9 }}>⚡</div>
        <div>
          <div className="logo-main" style={{ fontSize:16 }}>FluentShift</div>
          {progress && (
            <div className="logo-sub" style={{ fontSize:8 }}>{progress.level} · {progress.xp} XP</div>
          )}
        </div>
      </div>
      {progress && (
        <div className="tb-stat">
          <span style={{ fontSize:13, fontWeight:700, color:'var(--red)' }}>🔥{progress.streak}</span>
          <span className={`lvl-chip lvl-${levelKey(progress.level)}`} style={{ fontSize:10 }}>{progress.level}</span>
        </div>
      )}
    </div>
  )
}

function BottomNav({ view, setView }) {
  return (
    <div className="bottomnav">
      <div className="bn-inner">
        {NAV.map(n => (
          <div key={n.id} className={`bn-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="bn-icon">{n.ic}</span>
            <span>{n.lb}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
