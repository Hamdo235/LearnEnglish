// Global stylesheet, injected once via <style> in App.jsx.
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

:root {
  --bg:     #07080F;
  --gold:   #D4B75C;
  --gold2:  #F0D37A;
  --cream:  #F2EFE8;
  --dim:    #9A9383;
  --green:  #5FC794;
  --red:    #EA6C6C;
  --blue:   #6FB1EC;
  --violet: #A48BE6;
  --radius: 18px;
  --radius-sm: 12px;
  --nav-h: 70px;
  --topbar-h: 56px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bot: env(safe-area-inset-bottom, 0px);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

html, body, #root {
  height: 100%;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--cream);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body { min-height: 100dvh; }

/* ── AURORA ── */
.aurora {
  position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
  background:
    radial-gradient(1200px 700px at 10% -10%, rgba(212,183,92,0.20), transparent 60%),
    radial-gradient(900px 600px at 100% 10%, rgba(164,139,230,0.18), transparent 60%),
    radial-gradient(700px 500px at 50% 110%, rgba(111,177,236,0.12), transparent 60%),
    linear-gradient(180deg, #07080F 0%, #0A0C18 100%);
}
.aurora::before, .aurora::after {
  content: ''; position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5; mix-blend-mode: screen;
}
.aurora::before { width: 620px; height: 620px; top: -160px; left: -120px; background: radial-gradient(circle, #D4B75C 0%, transparent 60%); animation: drift 22s ease-in-out infinite; }
.aurora::after  { width: 520px; height: 520px; bottom: -180px; right: -120px; background: radial-gradient(circle, #A48BE6 0%, transparent 60%); animation: drift2 28s ease-in-out infinite; }
@keyframes drift  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(80px, 60px) scale(1.1); } }
@keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px, -50px) scale(1.08); } }

/* ── LAYOUT ── */
.app   { position: relative; display: flex; height: 100dvh; z-index: 1; }
.main  { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; min-width: 0; }
.main::-webkit-scrollbar { width: 4px; }
.main::-webkit-scrollbar-thumb { background: rgba(212,183,92,.2); border-radius: 2px; }
.wrap  { max-width: 880px; margin: 0 auto; padding: 24px 22px 40px; min-height: 100%; }

/* ── GLASS ── */
.glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.20), 0 10px 40px rgba(0,0,0,0.35);
  border-radius: var(--radius);
}
.glass-strong {
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 20px 60px rgba(0,0,0,0.45);
  border-radius: var(--radius);
}
.glass-gold {
  background: linear-gradient(135deg, rgba(212,183,92,0.14), rgba(212,183,92,0.04));
  backdrop-filter: blur(26px) saturate(180%);
  -webkit-backdrop-filter: blur(26px) saturate(180%);
  border: 1px solid rgba(212,183,92,0.28);
  box-shadow: inset 0 1px 0 rgba(240,211,122,0.25), 0 12px 40px rgba(212,183,92,0.12);
  border-radius: var(--radius);
}

/* ── SIDEBAR ── */
.sidebar  { width: 250px; display: flex; flex-direction: column; flex-shrink: 0; padding: 14px 12px; gap: 10px; position: relative; z-index: 2; }
.sidebar-inner { flex: 1; display: flex; flex-direction: column; padding: 16px 12px; min-height: 0; }
.logo     { padding: 6px 8px 16px; border-bottom: 1px solid rgba(255,255,255,.06); margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
.logo-icon{ width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #0C0D14; box-shadow: 0 6px 18px rgba(212,183,92,0.35); }
.logo-main{ font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--cream); }
.logo-sub { font-size: 9px; color: var(--dim); letter-spacing: 1.8px; text-transform: uppercase; margin-top: 1px; }
.nav      { flex: 1; overflow-y: auto; padding: 4px 2px; }
.nav::-webkit-scrollbar { width: 0; }
.nav-lbl  { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.6px; padding: 0 10px; margin: 10px 0 6px; }
.nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 12px; cursor: pointer; transition: all .24s var(--ease); margin-bottom: 2px; font-size: 13.5px; font-weight: 500; color: #BFB7A5; border: 1px solid transparent; }
.nav-item:hover  { background: rgba(255,255,255,.04); color: var(--cream); }
.nav-item.active { background: linear-gradient(135deg, rgba(212,183,92,0.16), rgba(212,183,92,0.05)); border-color: rgba(212,183,92,0.28); color: var(--gold2); box-shadow: inset 0 1px 0 rgba(240,211,122,0.22); }
.nav-icon { font-size: 15px; width: 20px; text-align: center; }
.s-foot   { padding: 10px 0 0; border-top: 1px solid rgba(255,255,255,.06); margin-top: 6px; }
.t-row    { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06); }
.t-lbl    { font-size: 10px; color: var(--dim); }
.t-val    { font-size: 12.5px; font-weight: 600; color: var(--gold2); }

/* ── TOP BAR ── */
.topbar   { display: none; height: calc(var(--topbar-h) + var(--safe-top)); padding: var(--safe-top) 14px 0; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(7,8,15,0.85), rgba(7,8,15,0.55)); backdrop-filter: blur(22px) saturate(180%); -webkit-backdrop-filter: blur(22px) saturate(180%); border-bottom: 1px solid rgba(255,255,255,0.06); }
.tb-title { display: flex; align-items: center; gap: 10px; }
.tb-title .logo-main { font-size: 17px; }
.tb-stat { display: flex; gap: 8px; align-items: center; }

/* ── BOTTOM NAV ── */
.bottomnav { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; padding: 8px 10px calc(8px + var(--safe-bot)); }
.bn-inner  { display: flex; justify-content: space-around; align-items: center; padding: 8px; border-radius: 22px; background: linear-gradient(180deg, rgba(18,20,32,0.72), rgba(12,14,22,0.75)); backdrop-filter: blur(28px) saturate(200%); -webkit-backdrop-filter: blur(28px) saturate(200%); border: 1px solid rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.5); }
.bn-item   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 4px; border-radius: 14px; cursor: pointer; color: var(--dim); font-size: 10px; font-weight: 600; transition: all .22s var(--ease); }
.bn-item.active { background: linear-gradient(135deg, rgba(212,183,92,0.18), rgba(212,183,92,0.05)); color: var(--gold2); box-shadow: inset 0 1px 0 rgba(240,211,122,0.25); }
.bn-icon   { font-size: 19px; line-height: 1; }

/* ── CARDS / HEADERS ── */
.card { padding: 18px; border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 30px rgba(0,0,0,0.30);
}
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.mhd    { margin-bottom: 22px; }
.mtitle { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: var(--cream); margin-bottom: 4px; letter-spacing: -0.3px; }
.msub   { font-size: 13.5px; color: var(--dim); }

/* ── STATS ── */
.stat     { padding: 16px 14px; text-align: center; border-radius: var(--radius-sm); }
.stat-val { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--cream); line-height: 1; margin-bottom: 4px; }
.stat-lbl { font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; }

/* ── PROGRESS BAR ── */
.pbar  { background: rgba(255,255,255,.06); border-radius: 99px; height: 8px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.3); }
.pfill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 99px; transition: width .7s var(--ease); box-shadow: 0 0 12px rgba(240,211,122,0.35); position: relative; }
.pfill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent); animation: shimmer 2.4s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

/* ── BUTTONS ── */
.btn { padding: 12px 20px; border-radius: 14px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; transition: all .22s var(--ease); display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
.btn-gold   { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #0C0D14; box-shadow: 0 8px 22px rgba(212,183,92,0.32), inset 0 1px 0 rgba(255,255,255,0.35); }
.btn-gold:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(212,183,92,0.42); }
.btn-glass  { background: rgba(255,255,255,0.06); color: var(--cream); border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.btn-glass:hover:not(:disabled) { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.18); }
.btn-out { background: transparent; color: var(--dim); border: 1px solid rgba(255,255,255,0.10); }
.btn-out:hover:not(:disabled) { border-color: rgba(212,183,92,0.5); color: var(--gold2); }

/* ── BADGES / CHIPS ── */
.lvl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px; font-size: 11px; font-weight: 700; letter-spacing: .4px; }
.lvl-B1 { background: rgba(95,199,148,.12); color: var(--green); border: 1px solid rgba(95,199,148,.3); }
.lvl-B2 { background: rgba(111,177,236,.12); color: var(--blue); border: 1px solid rgba(111,177,236,.3); }
.lvl-B2plus { background: rgba(212,183,92,.14); color: var(--gold2); border: 1px solid rgba(212,183,92,.3); }
.lvl-C1 { background: rgba(164,139,230,.14); color: var(--violet); border: 1px solid rgba(164,139,230,.3); }
.tag { font-size: 10px; padding: 3px 9px; border-radius: 99px; font-weight: 600; background: rgba(212,183,92,.10); color: var(--gold2); border: 1px solid rgba(212,183,92,.20); }

/* ── DUOLINGO-STYLE PATH ── */
.path-wrap { position: relative; padding: 24px 0 60px; }
.unit-block { margin-bottom: 36px; position: relative; }
.unit-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-radius: 16px; margin-bottom: 22px;
  background: linear-gradient(135deg, rgba(212,183,92,0.16), rgba(212,183,92,0.05));
  border: 1px solid rgba(212,183,92,0.25);
  box-shadow: inset 0 1px 0 rgba(240,211,122,0.18), 0 8px 24px rgba(0,0,0,.3);
  font-weight: 700; gap: 8px;
}
.unit-banner.locked { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: var(--dim); }
.unit-banner-meta { display: flex; align-items: center; gap: 10px; }
.unit-title { font-family: 'Playfair Display', serif; font-size: 18px; }

/* path nodes laid in a serpentine pattern */
.lesson-row { display: flex; justify-content: center; padding: 8px 0; position: relative; }
.lesson-row::before {
  content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 220px; height: 2px; background: rgba(255,255,255,0.06); z-index: 0; pointer-events: none;
}
.lesson-node {
  width: 84px; height: 84px; border-radius: 50%; cursor: pointer; position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center; flex-direction: column;
  transition: all .25s var(--ease); user-select: none;
  font-size: 28px;
}
.lesson-node:active:not(.locked) { transform: scale(0.94); }
.lesson-node.locked { cursor: not-allowed; opacity: 0.45; }
.lesson-node .ln-label { position: absolute; bottom: -22px; font-size: 10.5px; color: var(--dim); white-space: nowrap; font-weight: 600; letter-spacing: .3px; }
.lesson-node.completed { background: linear-gradient(135deg, var(--green), #8FE6B8); box-shadow: 0 8px 24px rgba(95,199,148,0.4), inset 0 2px 0 rgba(255,255,255,0.4); }
.lesson-node.current   {
  background: linear-gradient(135deg, var(--gold), var(--gold2));
  box-shadow: 0 0 0 0 rgba(240,211,122,0.4), 0 12px 28px rgba(212,183,92,0.5), inset 0 2px 0 rgba(255,255,255,0.4);
  animation: lessonPulse 2s infinite;
}
.lesson-node.locked    { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
.lesson-node.unlocked  { background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04)); border: 1px solid rgba(255,255,255,0.15); }
@keyframes lessonPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(240,211,122,0.5), 0 12px 28px rgba(212,183,92,0.5); } 50% { box-shadow: 0 0 0 14px rgba(240,211,122,0), 0 12px 28px rgba(212,183,92,0.5); } }

.stars { display: flex; gap: 2px; position: absolute; top: -8px; right: 50%; transform: translateX(50%); font-size: 11px; }

/* ── EXERCISE ── */
.ex-wrap { display: flex; flex-direction: column; gap: 16px; padding: 22px 0; }
.ex-prompt { font-size: 12px; color: var(--dim); letter-spacing: .8px; text-transform: uppercase; font-weight: 700; }
.ex-question { font-family: 'Playfair Display', serif; font-size: 26px; line-height: 1.4; color: var(--cream); }
.ex-sub { font-size: 11px; color: var(--gold2); font-weight: 700; letter-spacing: .4px; }

.opt {
  width: 100%; text-align: left; padding: 14px 18px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; cursor: pointer; color: var(--cream);
  font-family: inherit; font-size: 14.5px; font-weight: 500;
  transition: all .22s var(--ease); margin-bottom: 9px;
}
.opt:hover:not(:disabled) { border-color: rgba(212,183,92,0.35); background: rgba(212,183,92,0.06); transform: translateX(2px); }
.opt.ok { background: linear-gradient(135deg, rgba(95,199,148,0.16), rgba(95,199,148,0.04)); border-color: rgba(95,199,148,0.5); color: var(--green); }
.opt.bad { background: linear-gradient(135deg, rgba(234,108,108,0.14), rgba(234,108,108,0.03)); border-color: rgba(234,108,108,0.4); color: var(--red); }

.input {
  width: 100%; padding: 14px 16px; border-radius: 14px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
  color: var(--cream); font-family: inherit; font-size: 16px;
  outline: none; transition: all .22s var(--ease);
}
.input:focus { border-color: rgba(212,183,92,0.5); background: rgba(255,255,255,0.06); }

/* ── REORDER ── */
.token-pool, .token-line {
  display: flex; flex-wrap: wrap; gap: 8px;
  min-height: 60px; padding: 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px dashed rgba(255,255,255,0.08);
}
.token-line { background: linear-gradient(135deg, rgba(212,183,92,0.06), rgba(212,183,92,0.02)); border-color: rgba(212,183,92,0.18); border-style: solid; }
.token {
  padding: 8px 14px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.14);
  cursor: pointer; user-select: none; font-size: 14px; font-weight: 500;
  transition: all .18s var(--ease);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.2);
}
.token:active { transform: scale(0.95); }

/* ── RESULT ── */
.feedback { padding: 14px 16px; border-radius: 14px; margin-top: 4px; font-size: 13.5px; line-height: 1.6; }
.feedback.ok  { background: linear-gradient(135deg, rgba(95,199,148,0.14), rgba(95,199,148,0.04)); border: 1px solid rgba(95,199,148,0.35); }
.feedback.bad { background: linear-gradient(135deg, rgba(234,108,108,0.10), rgba(234,108,108,0.03)); border: 1px solid rgba(234,108,108,0.30); }

/* ── HEADER PROGRESS BAR (lesson) ── */
.lesson-topbar { display: flex; align-items: center; gap: 12px; padding: 16px 22px 8px; }
.lesson-topbar .pbar { flex: 1; }
.lesson-close { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); cursor: pointer; color: var(--dim); font-size: 16px; }

/* ── ANIMATIONS ── */
.fade-in { animation: fadeIn .35s var(--ease); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.slide-in { animation: slideIn .4s var(--ease); }
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

/* ── RESPONSIVE ── */
@media (max-width: 820px) {
  .sidebar { display: none; }
  .topbar  { display: flex; }
  .bottomnav { display: block; }
  .wrap { padding: 14px 14px calc(var(--nav-h) + var(--safe-bot) + 30px); }
  .mtitle { font-size: 24px; }
  .stat { padding: 12px 8px; }
  .stat-val { font-size: 20px; }
  .ex-question { font-size: 22px; }
  .lesson-node { width: 72px; height: 72px; font-size: 24px; }
}
@media (max-width: 380px) {
  .g3 { grid-template-columns: 1fr 1fr; }
  .lesson-node { width: 64px; height: 64px; font-size: 22px; }
}
`
