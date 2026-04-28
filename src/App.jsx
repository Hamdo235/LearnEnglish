import { useState, useEffect, useRef } from 'react'

/* ============================================================
   FLUENTSHIFT — Personal B2→C1 English Learning Platform
   Stack: React + Vite + Anthropic Claude API + Web Speech API
   ============================================================ */

// ─── GLOBAL STYLES ───────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

:root {
  --bg:     #07080F;
  --bg2:    rgba(22, 24, 38, 0.55);
  --bg3:    rgba(34, 37, 56, 0.55);
  --gold:   #D4B75C;
  --gold2:  #F0D37A;
  --cream:  #F2EFE8;
  --dim:    #9A9383;
  --green:  #5FC794;
  --red:    #EA6C6C;
  --blue:   #6FB1EC;
  --violet: #A48BE6;
  --sw:     250px;
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

/* ── AURORA BACKGROUND ── */
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
.main  { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
.main::-webkit-scrollbar { width: 4px; }
.main::-webkit-scrollbar-thumb { background: rgba(212,183,92,.2); border-radius: 2px; }
.wrap  { max-width: 860px; margin: 0 auto; padding: 28px 22px 40px; min-height: 100%; }

/* ── LIQUID GLASS ── */
.glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.10),
    inset 0 -1px 0 rgba(0,0,0,0.20),
    0 10px 40px rgba(0,0,0,0.35);
  border-radius: var(--radius);
}
.glass-strong {
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.14),
    inset 0 -1px 0 rgba(0,0,0,0.30),
    0 20px 60px rgba(0,0,0,0.45);
  border-radius: var(--radius);
}
.glass-gold {
  background: linear-gradient(135deg, rgba(212,183,92,0.14), rgba(212,183,92,0.04));
  backdrop-filter: blur(26px) saturate(180%);
  -webkit-backdrop-filter: blur(26px) saturate(180%);
  border: 1px solid rgba(212,183,92,0.28);
  box-shadow:
    inset 0 1px 0 rgba(240,211,122,0.25),
    0 12px 40px rgba(212,183,92,0.12);
  border-radius: var(--radius);
}

/* ── SIDEBAR (desktop) ── */
.sidebar  { width: var(--sw); display: flex; flex-direction: column; flex-shrink: 0; padding: 14px 12px; gap: 10px; position: relative; z-index: 2; }
.sidebar-inner { flex: 1; display: flex; flex-direction: column; padding: 16px 12px; min-height: 0; }
.logo     { padding: 6px 8px 16px; border-bottom: 1px solid rgba(255,255,255,.06); margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
.logo-icon{ width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #0C0D14; box-shadow: 0 6px 18px rgba(212,183,92,0.35); }
.logo-main{ font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--cream); letter-spacing: .2px; }
.logo-sub { font-size: 9px; color: var(--dim); letter-spacing: 1.8px; text-transform: uppercase; margin-top: 1px; }
.nav      { flex: 1; overflow-y: auto; padding: 4px 2px; }
.nav::-webkit-scrollbar { width: 0; }
.nav-lbl  { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.6px; padding: 0 10px; margin: 10px 0 6px; }
.nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 12px; cursor: pointer; transition: all .24s var(--ease); margin-bottom: 2px; font-size: 13.5px; font-weight: 500; color: #BFB7A5; border: 1px solid transparent; position: relative; }
.nav-item:hover  { background: rgba(255,255,255,.04); color: var(--cream); }
.nav-item.active {
  background: linear-gradient(135deg, rgba(212,183,92,0.16), rgba(212,183,92,0.05));
  border-color: rgba(212,183,92,0.28);
  color: var(--gold2);
  box-shadow: inset 0 1px 0 rgba(240,211,122,0.22), 0 6px 18px rgba(212,183,92,0.10);
}
.nav-icon { font-size: 15px; width: 20px; text-align: center; }
.s-foot   { padding: 10px 0 0; border-top: 1px solid rgba(255,255,255,.06); margin-top: 6px; }
.t-row    { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06); }
.t-lbl    { font-size: 10px; color: var(--dim); }
.t-val    { font-size: 12.5px; font-weight: 600; color: var(--gold2); }
.tog      { width: 38px; height: 22px; border-radius: 11px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); cursor: pointer; position: relative; transition: all .25s var(--ease); flex-shrink: 0; }
.tog.on   { background: linear-gradient(135deg, var(--gold), var(--gold2)); border-color: rgba(240,211,122,0.5); }
.tog-k    { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--cream); transition: transform .25s var(--ease); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
.tog.on .tog-k { transform: translateX(16px); }

/* ── MOBILE TOP BAR ── */
.topbar   { display: none; height: calc(var(--topbar-h) + var(--safe-top)); padding: var(--safe-top) 14px 0; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(7,8,15,0.85), rgba(7,8,15,0.55)); backdrop-filter: blur(22px) saturate(180%); -webkit-backdrop-filter: blur(22px) saturate(180%); border-bottom: 1px solid rgba(255,255,255,0.06); }
.tb-title { display: flex; align-items: center; gap: 10px; }
.tb-title .logo-main { font-size: 17px; }
.tb-mode  { font-size: 11px; padding: 6px 10px; border-radius: 99px; background: rgba(255,255,255,.06); color: var(--dim); border: 1px solid rgba(255,255,255,.08); cursor: pointer; }
.tb-mode.on { background: linear-gradient(135deg, rgba(111,177,236,0.15), rgba(111,177,236,0.05)); color: var(--blue); border-color: rgba(111,177,236,0.25); }

/* ── MOBILE BOTTOM NAV ── */
.bottomnav { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; padding: 8px 10px calc(8px + var(--safe-bot)); }
.bn-inner  { display: flex; justify-content: space-around; align-items: center; padding: 8px; border-radius: 22px; background: linear-gradient(180deg, rgba(18,20,32,0.72), rgba(12,14,22,0.75)); backdrop-filter: blur(28px) saturate(200%); -webkit-backdrop-filter: blur(28px) saturate(200%); border: 1px solid rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.5); }
.bn-item   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 4px; border-radius: 14px; cursor: pointer; color: var(--dim); font-size: 10px; font-weight: 600; letter-spacing: .2px; transition: all .22s var(--ease); }
.bn-item.active { background: linear-gradient(135deg, rgba(212,183,92,0.18), rgba(212,183,92,0.05)); color: var(--gold2); box-shadow: inset 0 1px 0 rgba(240,211,122,0.25); }
.bn-icon   { font-size: 19px; line-height: 1; }

/* ── CARDS ── */
.card {
  padding: 18px; border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 30px rgba(0,0,0,0.30);
}
.card-gold {
  background: linear-gradient(135deg, rgba(212,183,92,0.14), rgba(212,183,92,0.04));
  border-color: rgba(212,183,92,0.28);
  box-shadow: inset 0 1px 0 rgba(240,211,122,0.22), 0 12px 40px rgba(212,183,92,0.12);
}
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

/* ── MODULE HEADER ── */
.mhd    { margin-bottom: 22px; }
.mtitle { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: var(--cream); margin-bottom: 4px; letter-spacing: -0.3px; }
.msub   { font-size: 13.5px; color: var(--dim); }

/* ── STATS ── */
.stat     { padding: 16px 14px; text-align: center; border-radius: var(--radius-sm); }
.stat-val { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--cream); line-height: 1; margin-bottom: 4px; }
.stat-lbl { font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; }

/* ── PROGRESS BAR ── */
.pbar  { background: rgba(255,255,255,.06); border-radius: 99px; height: 8px; overflow: hidden; margin-top: 8px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.3); }
.pfill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 99px; transition: width .7s var(--ease); box-shadow: 0 0 12px rgba(240,211,122,0.35); position: relative; }
.pfill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent); animation: shimmer 2.4s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

/* ── BUTTONS ── */
.btn {
  padding: 11px 20px; border-radius: 12px; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600;
  transition: all .22s var(--ease); position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.btn:active { transform: scale(0.97); }
.btn-gold   { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #0C0D14; box-shadow: 0 8px 22px rgba(212,183,92,0.32), inset 0 1px 0 rgba(255,255,255,0.35); }
.btn-gold:hover    { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(212,183,92,0.42), inset 0 1px 0 rgba(255,255,255,0.45); }
.btn-gold:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-glass  { background: rgba(255,255,255,0.06); color: var(--cream); border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.btn-glass:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.18); }
.btn-out    { background: transparent; color: var(--dim); border: 1px solid rgba(255,255,255,0.10); }
.btn-out:hover { border-color: rgba(212,183,92,0.5); color: var(--gold2); }
.btn-red    { background: rgba(234,108,108,.12); color: var(--red); border: 1px solid rgba(234,108,108,.25); }

/* ── BADGES / TAGS ── */
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; background: linear-gradient(135deg, rgba(212,183,92,0.18), rgba(212,183,92,0.05)); border: 1px solid rgba(212,183,92,0.35); border-radius: 99px; font-size: 11px; font-weight: 600; color: var(--gold2); letter-spacing: .3px; }
.tag   { font-size: 10px; padding: 3px 9px; border-radius: 99px; font-weight: 600; background: rgba(212,183,92,.10); color: var(--gold2); border: 1px solid rgba(212,183,92,.20); letter-spacing: .2px; }
.tag-blue { background: rgba(111,177,236,.08); color: var(--blue); border-color: rgba(111,177,236,.22); }
.tag-violet { background: rgba(164,139,230,.08); color: var(--violet); border-color: rgba(164,139,230,.22); }
.tag-green { background: rgba(95,199,148,.08); color: var(--green); border-color: rgba(95,199,148,.22); }
.tag-dim  { background: rgba(255,255,255,.04); color: var(--dim); border-color: rgba(255,255,255,.08); }
.tech-badge { padding: 4px 10px; background: linear-gradient(135deg, rgba(111,177,236,0.12), rgba(111,177,236,0.04)); border: 1px solid rgba(111,177,236,.25); border-radius: 99px; font-size: 10.5px; color: var(--blue); font-weight: 600; }

/* ── CHAT ── */
.chat-wrap { display: flex; flex-direction: column; height: calc(100dvh - 165px); }
.chat-msgs { flex: 1; overflow-y: auto; padding: 12px 2px; display: flex; flex-direction: column; gap: 12px; }
.chat-msgs::-webkit-scrollbar { width: 3px; }
.chat-msgs::-webkit-scrollbar-thumb { background: rgba(212,183,92,.18); border-radius: 2px; }
.msg      { max-width: 82%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.65; animation: msgIn .3s var(--ease); }
@keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.msg.user { background: linear-gradient(135deg, rgba(212,183,92,0.22), rgba(212,183,92,0.08)); border: 1px solid rgba(212,183,92,0.25); align-self: flex-end; border-bottom-right-radius: 6px; color: var(--cream); }
.msg.ai   { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); align-self: flex-start; border-bottom-left-radius: 6px; }
.msg-lbl  { font-size: 10px; color: var(--gold2); margin-bottom: 5px; font-weight: 700; letter-spacing: .5px; }
.chat-row { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
.chat-in  { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 14px; padding: 12px 16px; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 14px; resize: none; outline: none; transition: all .22s var(--ease); min-height: 46px; max-height: 120px; }
.chat-in:focus { border-color: rgba(212,183,92,0.4); background: rgba(255,255,255,0.06); }
.chat-in::placeholder { color: var(--dim); }

/* ── TEXTAREA ── */
.ta { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 14px; padding: 14px 16px; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; resize: vertical; outline: none; transition: all .22s var(--ease); }
.ta:focus { border-color: rgba(212,183,92,0.4); background: rgba(255,255,255,0.06); }
.ta::placeholder { color: var(--dim); }

/* ── FLASHCARD ── */
.flashcard { aspect-ratio: 1.55; display: flex; align-items: center; justify-content: center; flex-direction: column; cursor: pointer; padding: 30px 22px; text-align: center; user-select: none; transition: transform .3s var(--ease); position: relative; overflow: hidden; }
.flashcard::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 10%, rgba(240,211,122,0.18), transparent 60%); pointer-events: none; }
.flashcard:active { transform: scale(0.985); }
.fc-word { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; background: linear-gradient(135deg, var(--gold), var(--gold2)); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 10px; letter-spacing: -0.5px; }
.fc-hint { font-size: 10.5px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.4px; margin-top: 14px; }
.fc-def  { font-size: 16px; color: var(--cream); line-height: 1.55; margin-bottom: 10px; }
.fc-ex   { font-style: italic; font-size: 12.5px; color: var(--dim); }

/* ── GRAMMAR OPTIONS ── */
.opt { width: 100%; text-align: left; padding: 14px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500; transition: all .22s var(--ease); margin-bottom: 9px; }
.opt:hover:not(:disabled) { border-color: rgba(212,183,92,0.35); background: rgba(212,183,92,0.06); transform: translateX(2px); }
.opt.ok  { background: linear-gradient(135deg, rgba(95,199,148,0.14), rgba(95,199,148,0.04)); border-color: rgba(95,199,148,0.5); color: var(--green); }
.opt.bad { background: linear-gradient(135deg, rgba(234,108,108,0.12), rgba(234,108,108,0.03)); border-color: rgba(234,108,108,0.4); color: var(--red); }

/* ── MIC BUTTON ── */
.mic-btn { width: 78px; height: 78px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 26px; transition: all .25s var(--ease); background: linear-gradient(135deg, var(--gold), var(--gold2)); box-shadow: 0 12px 32px rgba(212,183,92,0.45), inset 0 1px 0 rgba(255,255,255,0.4); color: #0C0D14; }
.mic-btn:active { transform: scale(0.94); }
.mic-btn.rec { animation: pulse 1.5s infinite; background: linear-gradient(135deg, var(--red), #FF8080); box-shadow: 0 12px 32px rgba(234,108,108,0.5); color: #fff; }
@keyframes pulse { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(234,108,108,.45), 0 12px 32px rgba(234,108,108,0.5); } 50% { transform: scale(1.06); box-shadow: 0 0 0 16px rgba(234,108,108,0), 0 12px 32px rgba(234,108,108,0.5); } }

/* ── LOADING DOTS ── */
.dots span { animation: blink 1.4s infinite; font-size: 22px; color: var(--gold2); }
.dots span:nth-child(2) { animation-delay: .2s; }
.dots span:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,80%,100% { opacity: 0; } 40% { opacity: 1; } }

/* ── CHALLENGE ROW ── */
.c-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: var(--radius-sm); cursor: pointer; transition: all .22s var(--ease); margin-bottom: 9px; }
.c-row:hover { transform: translateX(3px); }

/* ── INPUT ── */
.inp { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 10px; padding: 9px 13px; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: all .2s var(--ease); }
.inp:focus { border-color: rgba(212,183,92,0.4); background: rgba(255,255,255,0.06); }

/* ── LEVEL CHIP ── */
.lvl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px; font-size: 11px; font-weight: 700; letter-spacing: .4px; }
.lvl-B1   { background: rgba(95,199,148,.12); color: var(--green);  border: 1px solid rgba(95,199,148,.3); }
.lvl-B2   { background: rgba(111,177,236,.12); color: var(--blue);   border: 1px solid rgba(111,177,236,.3); }
.lvl-B2plus { background: rgba(212,183,92,.14); color: var(--gold2); border: 1px solid rgba(212,183,92,.3); }
.lvl-C1   { background: rgba(164,139,230,.14); color: var(--violet); border: 1px solid rgba(164,139,230,.3); }

/* ── ANIMATIONS ── */
.fade-in { animation: fadeIn .4s var(--ease); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── RESPONSIVE ── */
@media (max-width: 820px) {
  .sidebar { display: none; }
  .topbar  { display: flex; }
  .bottomnav { display: block; }
  .wrap { padding: 16px 14px calc(var(--nav-h) + var(--safe-bot) + 30px); max-width: 100%; }
  .mtitle { font-size: 24px; }
  .g3 { grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .stat { padding: 12px 8px; }
  .stat-val { font-size: 22px; }
  .stat-lbl { font-size: 9px; }
  .card { padding: 16px; }
  .chat-wrap { height: calc(100dvh - var(--topbar-h) - var(--nav-h) - var(--safe-bot) - var(--safe-top) - 100px); }
  .msg { max-width: 88%; font-size: 13.5px; }
  .fc-word { font-size: 30px; }
  .flashcard { aspect-ratio: 1.3; padding: 22px 16px; }
  .btn { padding: 12px 18px; font-size: 14px; }
}
@media (max-width: 380px) {
  .g3 { grid-template-columns: 1fr 1fr; }
  .g3 .stat:last-child { grid-column: span 2; }
  .bn-item { font-size: 9px; }
  .bn-icon { font-size: 17px; }
}
`

// ─── DATA ────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', ic: '⚡', lb: 'Dashboard' },
  { id: 'tutor',     ic: '🤖', lb: 'AI Tutor' },
  { id: 'speaking',  ic: '🎤', lb: 'Speaking Lab' },
  { id: 'writing',   ic: '✍️', lb: 'Writing Workshop' },
  { id: 'vocab',     ic: '📚', lb: 'Vocabulary Vault' },
  { id: 'grammar',   ic: '🎯', lb: 'Grammar Gym' },
  { id: 'reading',   ic: '📖', lb: 'Reading Room' },
  { id: 'settings',  ic: '⚙️', lb: 'Settings' },
]

const VOCAB = [
  // ── B1 ──
  { id:101, lv:'B1', w:'Improve',    p:'verb',  d:'Make or become better',                     e:'I want to improve my English every day.',             c:'General' },
  { id:102, lv:'B1', w:'Confident',  p:'adj',   d:'Feeling sure about your abilities',         e:'She felt confident before the interview.',            c:'Comm'    },
  { id:103, lv:'B1', w:'Achieve',    p:'verb',  d:'Succeed in doing something with effort',    e:'He achieved his goal of learning two languages.',     c:'General' },
  { id:104, lv:'B1', w:'Schedule',   p:'noun/verb', d:'A plan of events/times; to plan something', e:'Let\'s schedule a meeting tomorrow.',             c:'Pro'     },
  { id:105, lv:'B1', w:'Deadline',   p:'noun',  d:'The latest time to finish something',       e:'The deadline for this task is Friday.',               c:'Pro'     },
  { id:106, lv:'B1', w:'Manage',     p:'verb',  d:'Succeed in doing; be in charge of',          e:'I manage to study 30 minutes every morning.',         c:'Pro'     },
  { id:107, lv:'B1', w:'Available',  p:'adj',   d:'Free to be used or obtained',                e:'Are you available tomorrow at 3pm?',                  c:'Pro'     },
  { id:108, lv:'B1', w:'Issue',      p:'noun',  d:'A problem or important topic',               e:'We found an issue with the login page.',              c:'General' },
  // ── B2 ──
  { id:1,  lv:'B2',  w:'Leverage',   p:'verb/noun', d:'Use something to maximum advantage',              e:'We can leverage AI tools to boost productivity.',         c:'Pro'   },
  { id:2,  lv:'B2',  w:'Concise',    p:'adj',       d:'Giving information clearly using few words',       e:'Write concise commit messages for team clarity.',         c:'Writing'},
  { id:3,  lv:'B2',  w:'Insight',    p:'noun',      d:'Deep understanding of a complex situation',        e:'The performance metrics gave us key insights.',           c:'Pro'   },
  { id:4,  lv:'B2',  w:'Proactive',  p:'adj',       d:'Acting in anticipation of future problems',        e:'Be proactive about documenting your code.',               c:'Pro'   },
  { id:5,  lv:'B2',  w:'Deploy',     p:'verb',      d:'Put into use; (tech) release software to production', e:'We\'ll deploy the new version on Friday evening.',     c:'Tech'  },
  { id:6,  lv:'B2',  w:'Seamless',   p:'adj',       d:'Smooth and continuous, without interruptions',     e:'The UX should be seamless across all devices.',           c:'Tech'  },
  // ── B2+ ──
  { id:7,  lv:'B2+', w:'Pragmatic',  p:'adj',       d:'Dealing with things practically and realistically', e:'A pragmatic approach to debugging saves hours.',         c:'Pro'   },
  { id:8,  lv:'B2+', w:'Articulate', p:'verb/adj',  d:'Express ideas clearly; able to speak well',        e:'Being articulate in meetings is essential.',              c:'Comm'  },
  { id:9,  lv:'B2+', w:'Iterate',    p:'verb',      d:'Repeat a process to achieve a refined result',     e:'We iterated on the design based on user feedback.',       c:'Tech'  },
  { id:10, lv:'B2+', w:'Bottleneck', p:'noun',      d:'A point of congestion slowing a process down',     e:'The database queries are the bottleneck in our app.',     c:'Tech'  },
  { id:11, lv:'B2+', w:'Advocate',   p:'verb/noun', d:'Publicly recommend or support something',          e:'She advocates for better developer onboarding.',          c:'Pro'   },
  { id:12, lv:'B2+', w:'Streamline', p:'verb',      d:'Make a process simpler and more efficient',        e:'We streamlined the deployment pipeline.',                 c:'Tech'  },
  // ── C1 ──
  { id:13, lv:'C1',  w:'Eloquent',   p:'adj',       d:'Fluent, persuasive and well-expressed',            e:'She gave an eloquent presentation to the board.',         c:'Comm'  },
  { id:14, lv:'C1',  w:'Nuance',     p:'noun',      d:'A subtle difference in meaning or expression',     e:'Understanding the nuances of English takes time.',        c:'Adv'   },
  { id:15, lv:'C1',  w:'Mitigate',   p:'verb',      d:'Make something less severe or harmful',            e:'We mitigate risk through thorough code reviews.',         c:'Pro'   },
  { id:16, lv:'C1',  w:'Discerning', p:'adj',       d:'Showing good judgment, especially about quality',   e:'A discerning eye catches bugs others miss.',              c:'Adv'   },
  { id:17, lv:'C1',  w:'Paradigm',   p:'noun',      d:'A typical example or pattern of something',        e:'Functional programming is a powerful paradigm.',          c:'Tech'  },
  { id:18, lv:'C1',  w:'Compelling', p:'adj',       d:'Evoking strong interest or admiration',            e:'He built a compelling case for refactoring.',             c:'Adv'   },
]

const GRAMMAR = [
  // ── B1 ──
  { id:101, lv:'B1', topic:'Present Simple vs Continuous', q:'Choose the correct form:', s:'I usually ___ coffee in the morning.',
    opts:['drink','am drinking','drinks','drinking'], ok:0,
    exp:'✅ Use present simple for habits ("usually", "always", "every day"). Present continuous is for actions happening now.' },
  { id:102, lv:'B1', topic:'Simple Past', q:'Choose the past form:', s:'Yesterday I ___ to the cinema.',
    opts:['go','going','went','gone'], ok:2,
    exp:'✅ "Go" is irregular. Simple past: go → went → gone (past participle).' },
  { id:103, lv:'B1', topic:'Future with "going to"', q:'Choose the correct option:', s:'Look at those clouds! It ___ rain.',
    opts:['will','is going to','goes to','would'], ok:1,
    exp:'✅ Use "going to" for predictions based on present evidence (you can see the clouds). "Will" = decisions made now.' },
  { id:104, lv:'B1', topic:'Comparatives', q:'Complete the sentence:', s:'English is ___ than I thought.',
    opts:['easy','more easy','easier','most easy'], ok:2,
    exp:'✅ Short adjectives take "-er": easy → easier. Long ones take "more": more difficult.' },
  { id:105, lv:'B1', topic:'Countable vs Uncountable', q:'Choose the correct word:', s:'How ___ sugar do you want?',
    opts:['many','much','few','a lot'], ok:1,
    exp:'✅ "Much" is used with uncountable nouns (sugar, water, time). "Many" is used with countable ones (people, books).' },
  { id:106, lv:'B1', topic:'Prepositions of time', q:'Complete with the correct preposition:', s:'The meeting is ___ Monday ___ 3 p.m.',
    opts:['in / at','on / at','on / in','at / on'], ok:1,
    exp:'✅ "On" for days (on Monday), "at" for exact times (at 3 p.m.), "in" for months/years.' },
  // ── B2 ──
  { id:1, lv:'B2',  topic:'Present Perfect vs Simple Past', q:'Which sentence is correct?',  s:'',
    opts:['I have finished the project yesterday.','I finished the project yesterday.','I finish the project yesterday.','I was finishing the project.'], ok:1,
    exp:'✅ Use simple past with specific time markers like "yesterday". Present perfect has no specific time reference.' },
  { id:2, lv:'B2',  topic:'Prepositions', q:'Choose the correct preposition:', s:'I\'ve been working ___ this project for three weeks.',
    opts:['in','at','on','for'], ok:2,
    exp:'✅ "Work on" = work on a task/project. "Work in" = a place/field. "Work for" = a company/person.' },
  { id:3, lv:'B2',  topic:'Articles', q:'Fill in the blank:', s:'___ engineer I met at the conference was very experienced.',
    opts:['A','An','The','(none)'], ok:2,
    exp:'✅ "The" = specific, already-identified person. "An engineer" = any engineer; "The engineer" = the specific one you both know.' },
  { id:4, lv:'B2',  topic:'Modal Verbs', q:'Choose the correct modal:', s:'You ___ submit the report by Friday. It\'s mandatory.',
    opts:['might','could','must','would'], ok:2,
    exp:'✅ "Must" = obligation/necessity. "Might" = possibility, "Could" = ability, "Would" = conditional/polite.' },
  // ── B2+ ──
  { id:5, lv:'B2+', topic:'Second Conditional', q:'Complete the sentence:', s:'If I ___ more time, I would learn three languages.',
    opts:['have','had','has','will have'], ok:1,
    exp:'✅ Use "had" in second conditionals for hypothetical present situations. Structure: If + past simple → would + base verb.' },
  { id:6, lv:'B2+', topic:'Passive Voice', q:'Correct passive form of "The team built the app last week"?', s:'',
    opts:['The app was build by the team.','The app was built by the team.','The app were built by the team.','The app has been build by the team.'], ok:1,
    exp:'✅ Passive: Subject + was/were + past participle. "Built" is the past participle of "build".' },
  { id:7, lv:'B2+', topic:'Relative Clauses', q:'Which sentence uses the correct relative pronoun?', s:'',
    opts:['The bug which I reported was fixed.','The bug what I reported was fixed.','The bug who I reported was fixed.','The bug where I reported was fixed.'], ok:0,
    exp:'✅ Use "which" or "that" for things, "who" for people, "where" for places.' },
  { id:8, lv:'B2+', topic:'Reported Speech', q:'Convert: She said "I am working on a new feature"', s:'',
    opts:['She said she is working on a new feature.','She said she was working on a new feature.','She said she working on a new feature.','She said she has worked on a new feature.'], ok:1,
    exp:'✅ In reported speech, present continuous → past continuous (am/is → was).' },
  // ── C1 ──
  { id:9, lv:'C1',  topic:'Third Conditional', q:'Complete:', s:'If we ___ the tests earlier, we ___ the production bug.',
    opts:['ran / would catch','had run / would have caught','run / would have caught','would run / caught'], ok:1,
    exp:'✅ Third conditional = unreal past: If + past perfect → would have + past participle.' },
  { id:10, lv:'C1', topic:'Inversion', q:'Formal inversion — which is correct?', s:'',
    opts:['Never I have seen such code.','Never have I seen such code.','Never I seen such code.','Never did I have seen such code.'], ok:1,
    exp:'✅ Negative adverbs ("never", "rarely", "seldom") at the start trigger subject-auxiliary inversion.' },
  { id:11, lv:'C1', topic:'Subjunctive (it is essential that...)', q:'Choose the correct form:', s:'It is essential that the deployment ___ reviewed before Friday.',
    opts:['is','was','be','were'], ok:2,
    exp:'✅ After "it is essential/important/crucial that", use the base verb (subjunctive): "be reviewed".' },
  { id:12, lv:'C1', topic:'Participle Clauses', q:'Rewrite using participle clause:', s:'"Because he was tired, he left early."',
    opts:['Being tired, he left early.','Been tired, he left early.','Tired being, he left early.','He being tired, left early.'], ok:0,
    exp:'✅ Participle clauses shorten adverbial clauses: "Being tired, ..." = "Because he was tired, ...".' },
]

// ─── LEVEL / ADAPTIVE DIFFICULTY ─────────────────────────────
const LEVELS = ['B1', 'B2', 'B2+', 'C1']
const LEVEL_THRESHOLDS = { B1: 0, B2: 200, 'B2+': 600, C1: 1200 }
const LEVEL_MAX_XP = 1200

function computeLevel(xp) {
  if (xp >= LEVEL_THRESHOLDS.C1)    return 'C1'
  if (xp >= LEVEL_THRESHOLDS['B2+']) return 'B2+'
  if (xp >= LEVEL_THRESHOLDS.B2)    return 'B2'
  return 'B1'
}

function nextLevelThreshold(lv) {
  if (lv === 'B1')  return LEVEL_THRESHOLDS.B2
  if (lv === 'B2')  return LEVEL_THRESHOLDS['B2+']
  if (lv === 'B2+') return LEVEL_THRESHOLDS.C1
  return LEVEL_THRESHOLDS.C1
}

function levelKey(lv) {
  return lv === 'B2+' ? 'B2plus' : lv
}

function levelIndex(lv) { return LEVELS.indexOf(lv) }

// Pick next item adapted to current level & session streak
function pickAdaptive(items, currentLevel, sessionStreak, seenIds) {
  // streak >= 3 correct → bump up one tier, streak <= -2 → drop one tier
  let targetIdx = levelIndex(currentLevel)
  if (targetIdx < 0) targetIdx = 0
  if (sessionStreak >= 3 && targetIdx < LEVELS.length - 1) targetIdx += 1
  if (sessionStreak <= -2 && targetIdx > 0) targetIdx -= 1
  const target = LEVELS[targetIdx]
  const pool = items.filter(i => i.lv === target && !seenIds.includes(i.id))
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)]
  // fallback: try nearby levels (one down, one up) before going wild
  const tryIdx = [targetIdx - 1, targetIdx + 1].filter(i => i >= 0 && i < LEVELS.length)
  for (const i of tryIdx) {
    const fb = items.filter(it => it.lv === LEVELS[i] && !seenIds.includes(it.id))
    if (fb.length) return fb[Math.floor(Math.random() * fb.length)]
  }
  const any = items.filter(i => !seenIds.includes(i.id))
  if (any.length) return any[Math.floor(Math.random() * any.length)]
  return null
}

const READING = [
  { id:1, title:'The Rise of Remote-First Engineering', lvl:'B2', rt:'3 min', cat:'Tech',
    body:`Remote work has transformed from a rare privilege into a standard expectation across the tech industry. What began as an emergency adaptation has evolved into a deliberate organizational strategy used by companies from startups to Fortune 500 giants.

Engineering teams adapted remarkably well to distributed environments. The nature of software development — centered on code, text, and digital communication — makes it uniquely suited to asynchronous collaboration. Tools like GitHub, Slack, and Notion became the new office, enabling teams across time zones to build complex systems together.

However, remote work introduces its own challenges. For francophone developers entering international teams, strong English communication becomes a prerequisite. The ability to write clear pull request descriptions, articulate problems in Slack threads, and participate confidently in video standups directly impacts career growth.

Companies responded by investing in documentation culture and async-first practices. Rather than relying on hallway conversations, high-performing teams codify decisions, write detailed design documents, and maintain comprehensive wikis.

The engineers who thrive share one trait: they communicate with clarity and precision — in writing and speech alike.`,
    qs:[
      { q:'What made engineering teams well-suited to remote work?',                          h:'Think about the nature of software development.' },
      { q:'What English skills are mentioned as important for francophone developers?',        h:'Look at the third paragraph.' },
      { q:'What does "documentation culture" mean in this context?',                          h:'Second-to-last paragraph.' },
    ]},
  { id:2, title:'Why Soft Skills Are Now Hard Requirements in Tech', lvl:'B2/C1', rt:'4 min', cat:'Career',
    body:`There is a persistent myth in technology: that technical excellence alone is sufficient for career advancement. The assumption that a developer who writes elegant code will naturally rise through organizational hierarchies has been steadily dismantled by evidence to the contrary.

The most sought-after engineers today combine deep technical expertise with the ability to communicate complex ideas to non-technical stakeholders. They explain architectural decisions to product managers, negotiate deadlines with clarity, and mentor junior colleagues with precision.

Language fluency plays a central role. In multinational companies, English functions as the shared medium through which collaboration happens and professional reputations are built. A developer with average technical skills but exceptional communication will frequently outpace a technically superior colleague who struggles to express ideas clearly.

This shift has profound implications for developers in French-speaking regions who aspire to international careers. The barrier is not talent — African engineers consistently demonstrate exceptional problem-solving ability. The barrier is often linguistic confidence: the hesitation to speak in meetings, the reluctance to post in English-language forums.

The good news is that language, unlike raw intelligence, is entirely learnable. Every articulate English speaker was once a beginner.`,
    qs:[
      { q:'What myth does the author challenge in this article?',                h:'First paragraph.' },
      { q:'What role does English play in multinational tech companies?',         h:'Third paragraph.' },
      { q:'What is the real barrier for African engineers, according to the text?',h:'Fourth paragraph.' },
    ]},
]

// ─── API CALL ────────────────────────────────────────────────
async function callAI(messages, system) {
  const model = import.meta.env.VITE_OLLAMA_MODEL || 'qwen2.5:1.5b'
  const res = await fetch('/api/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        ...messages,
      ],
    }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `Ollama error (${res.status})`)
  }

  const data = await res.json()
  const text = data?.message?.content
  if (!text) throw new Error('Ollama returned an empty response')
  return text
}

// ─── SIDEBAR (desktop) ───────────────────────────────────────
function Sidebar({ active, setActive, tech, setTech, level }) {
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
            <div key={n.id} className={`nav-item ${active === n.id ? 'active' : ''}`} onClick={() => setActive(n.id)}>
              <span className="nav-icon">{n.ic}</span>
              <span>{n.lb}</span>
            </div>
          ))}
        </nav>
        <div className="s-foot">
          <div className="t-row" style={{ marginBottom: 8 }}>
            <div>
              <div className="t-lbl">Current Level</div>
              <div className="t-val">
                <span className={`lvl-chip lvl-${levelKey(level)}`}>{level}</span>
              </div>
            </div>
          </div>
          <div className="t-row">
            <div>
              <div className="t-lbl">Mode</div>
              <div className="t-val">{tech ? '💻 Tech' : '🌍 General'}</div>
            </div>
            <div className={`tog ${tech ? 'on' : ''}`} onClick={() => setTech(!tech)}>
              <div className="tog-k" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── MOBILE TOP BAR ──────────────────────────────────────────
function TopBar({ tech, setTech, level }) {
  return (
    <div className="topbar">
      <div className="tb-title">
        <div className="logo-icon" style={{ width:28, height:28, fontSize:15, borderRadius:8 }}>⚡</div>
        <div>
          <div className="logo-main">FluentShift</div>
          <div className="logo-sub" style={{ fontSize:8 }}>{level} · B1 → C1</div>
        </div>
      </div>
      <div className={`tb-mode ${tech ? 'on' : ''}`} onClick={() => setTech(!tech)}>
        {tech ? '💻 Tech' : '🌍 General'}
      </div>
    </div>
  )
}

// ─── MOBILE BOTTOM NAV ───────────────────────────────────────
function BottomNav({ active, setActive }) {
  // 5 main items on mobile to save space
  const items = NAV.filter(n => ['dashboard','tutor','vocab','grammar','settings'].includes(n.id))
  return (
    <div className="bottomnav">
      <div className="bn-inner">
        {items.map(n => (
          <div
            key={n.id}
            className={`bn-item ${active === n.id ? 'active' : ''}`}
            onClick={() => setActive(n.id)}>
            <span className="bn-icon">{n.ic}</span>
            <span>{n.lb.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard({ stats, tech, setActive }) {
  const xpPct = Math.min((stats.xp / LEVEL_MAX_XP) * 100, 100)
  const lvl = computeLevel(stats.xp)
  const nextTarget = nextLevelThreshold(lvl)
  const toNext = Math.max(0, nextTarget - stats.xp)

  const challenges = [
    { ic: '🤖', lb: 'Have a 5-min AI conversation',      mod: 'tutor',    xp: 50, color: 'var(--blue)' },
    { ic: '✍️', lb: 'Write a short paragraph (50+ words)', mod: 'writing',  xp: 40, color: 'var(--violet)' },
    { ic: '🎤', lb: 'Record yourself speaking',           mod: 'speaking', xp: 30, color: 'var(--red)' },
    { ic: '📚', lb: 'Study 5 vocabulary cards',           mod: 'vocab',    xp: 25, color: 'var(--gold2)' },
  ]
  return (
    <div className="wrap fade-in">
      <div className="mhd">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
          <div className="mtitle">Good day 👋</div>
          {tech && <span className="tech-badge">💻 Tech ON</span>}
        </div>
        <div className="msub">Your English journey from B1 to C1. Keep pushing.</div>
      </div>

      {/* Level Hero */}
      <div className="glass-gold card" style={{ marginBottom:18, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(240,211,122,0.25), transparent 70%)', filter:'blur(20px)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, position:'relative' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--dim)', marginBottom:8, letterSpacing:1, textTransform:'uppercase' }}>Current Level</div>
            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
              <span className={`lvl-chip lvl-${levelKey(lvl)}`} style={{ fontSize:14, padding:'7px 14px' }}>📊 {lvl}</span>
              <span style={{ fontSize:12, color:'var(--dim)' }}>→ Target: C1</span>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, background:'linear-gradient(135deg, var(--gold), var(--gold2))', WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent', lineHeight:1 }}>{stats.xp}</div>
            <div style={{ fontSize:10, color:'var(--dim)', marginTop:3, letterSpacing:.5 }}>XP</div>
          </div>
        </div>
        <div className="pbar" style={{ height:10 }}>
          <div className="pfill" style={{ width: xpPct + '%' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7 }}>
          {LEVELS.map(l => (
            <span key={l} style={{ fontSize:10.5, color: l === lvl ? 'var(--gold2)' : 'var(--dim)', fontWeight: l === lvl ? 700 : 500 }}>{l}</span>
          ))}
        </div>
        {toNext > 0 && (
          <div style={{ marginTop:10, fontSize:11.5, color:'var(--dim)' }}>
            <strong style={{ color:'var(--cream)' }}>{toNext} XP</strong> until next level
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="g3" style={{ marginBottom:18 }}>
        <div className="glass stat">
          <div className="stat-val" style={{ color:'var(--red)' }}>🔥 {stats.streak}</div>
          <div className="stat-lbl">Day Streak</div>
        </div>
        <div className="glass stat">
          <div className="stat-val">{stats.msgs}</div>
          <div className="stat-lbl">Messages</div>
        </div>
        <div className="glass stat">
          <div className="stat-val">{stats.words}</div>
          <div className="stat-lbl">Words</div>
        </div>
      </div>

      {/* Challenges */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'var(--cream)' }}>Today's Challenges</div>
        <span className="tag">Daily</span>
      </div>
      {challenges.map((c, i) => (
        <div key={i} className="glass c-row" onClick={() => setActive(c.mod)}>
          <div style={{ display:'flex', alignItems:'center', gap:13 }}>
            <div style={{ width:38, height:38, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, background:`linear-gradient(135deg, ${c.color}22, ${c.color}08)`, border:`1px solid ${c.color}33` }}>{c.ic}</div>
            <span style={{ fontSize:13.5, color:'var(--cream)', fontWeight:500 }}>{c.lb}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontSize:12, color:'var(--gold2)', fontWeight:700 }}>+{c.xp}</span>
            <span style={{ color:'var(--dim)' }}>→</span>
          </div>
        </div>
      ))}

      {/* Tip */}
      <div className="glass card" style={{ marginTop:16, borderColor:'rgba(111,177,236,.22)' }}>
        <div style={{ fontSize:10, color:'var(--blue)', marginBottom:6, fontWeight:700, letterSpacing:1 }}>💡 TODAY'S TIP</div>
        <div style={{ fontSize:13.5, color:'var(--cream)', lineHeight:1.7 }}>
          The fastest path to C1: <strong>think in English</strong>. When you open your laptop,
          narrate mentally — "I'm opening VS Code. I need to fix this bug." Small habit, huge results.
        </div>
      </div>
    </div>
  )
}

// ─── AI TUTOR ────────────────────────────────────────────────
function AITutor({ tech, addXP, setStats }) {
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    content: 'Hello Yakhoub! I\'m your FluentShift AI tutor 🎯\n\nTalk to me about anything — your studies, tech, your goals, or what you did today. I\'ll help you express yourself more naturally and correct mistakes along the way.\n\nWhat\'s on your mind?'
  }])
  const [inp, setInp] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const SYS = `You are FluentShift AI, a world-class English tutor. Your student is Yakhoub, a B2-level French-speaking IT student targeting C1 fluency.

Rules:
- ALWAYS respond in English only — never French, even if they write in French
- Be warm, engaging, and encouraging
- Gently correct grammar by modeling the correct form: "Great point! By the way, we'd say '...' instead of '...' because..."
- Keep responses 2-3 paragraphs max
- Naturally introduce useful vocabulary in context
- Ask follow-up questions to keep the conversation flowing
- Celebrate effort genuinely
${tech ? '\nTECH TRACK: Focus on technical English — PR descriptions, standup meetings, documentation, client emails. Use IT industry examples.' : ''}

Your mission: Help Yakhoub think, write, speak and read like a confident C1 English professional.`

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async () => {
    if (!inp.trim() || loading) return
    const txt = inp.trim(); setInp('')
    const next = [...msgs, { role: 'user', content: txt }]
    setMsgs(next); setLoading(true)
    setStats(p => ({ ...p, msgs: p.msgs + 1 }))
    try {
      const api = next
        .filter((_, i) => !(i === 0 && next[0].role === 'assistant'))
        .map(m => ({ role: m.role, content: m.content }))
      const res = await callAI(api, SYS)
      setMsgs(p => [...p, { role: 'assistant', content: res }])
      addXP(10)
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: 'Connection issue — please check your API key in .env and try again.' }])
    } finally { setLoading(false) }
  }

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="wrap" style={{ height:'100vh', display:'flex', flexDirection:'column', paddingBottom:14 }}>
      <div className="mhd" style={{ marginBottom:14, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div className="mtitle">AI Tutor</div>
          {tech && <span className="tech-badge">💻 Tech</span>}
        </div>
        <div className="msub">Practice English conversation. I correct mistakes naturally.</div>
      </div>
      <div className="chat-wrap" style={{ flex:1, overflow:'hidden' }}>
        <div className="chat-msgs" style={{ flex:1 }}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>
              {m.role === 'assistant' && <div className="msg-lbl">✦ FLUENTSHIFT AI</div>}
              <div style={{ whiteSpace:'pre-wrap' }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="msg-lbl">✦ FLUENTSHIFT AI</div>
              <div className="dots"><span>•</span><span>•</span><span>•</span></div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="chat-row" style={{ flexShrink:0 }}>
          <textarea className="chat-in" placeholder="Write in English — don't worry about mistakes..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={onKey} rows={1} />
          <button className="btn btn-gold" onClick={send} disabled={!inp.trim() || loading} style={{ alignSelf:'flex-end', height:44, minWidth:54 }}>
            {loading ? '...' : '→'}
          </button>
        </div>
        <div style={{ fontSize:10, color:'var(--dim)', textAlign:'center', marginTop:6 }}>
          Enter to send · Shift+Enter for new line · +10 XP per message
        </div>
      </div>
    </div>
  )
}

// ─── SPEAKING LAB ────────────────────────────────────────────
function SpeakingLab({ tech, addXP }) {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const recRef = useRef(null)

  const prompts = tech
    ? ['Describe a recent technical problem you solved','Explain what a REST API is to a non-technical person','Talk about your experience with a programming language','Describe your ideal development workflow']
    : ['Tell me about your goals for this year','Describe your typical day as a student','What are the biggest challenges of learning English?','Where do you see yourself in five years?']

  useEffect(() => { setPrompt(prompts[Math.floor(Math.random() * prompts.length)]); setTranscript(''); setFeedback('') }, [tech])

  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setTranscript('Speech recognition requires Chrome browser. Please open in Chrome.'); return }
    const r = new SR(); r.lang = 'en-US'; r.continuous = true; r.interimResults = true
    r.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript + ' '; if (t) setTranscript(t.trim()) }
    r.onerror = () => setRecording(false)
    r.start(); recRef.current = r; setRecording(true); setTranscript(''); setFeedback('')
  }

  const stopRec = () => { recRef.current?.stop(); setRecording(false) }

  const getFB = async () => {
    if (!transcript.trim()) return; setLoading(true)
    try {
      const res = await callAI(
        [{ role:'user', content:`Prompt: "${prompt}"\n\nTranscript: "${transcript}"\n\nProvide:\n1) Assessment (fluency/grammar/vocabulary)\n2) 2-3 specific corrections\n3) Improved version of what they said\n4) Score /10 with encouragement` }],
        `You are an expert English speaking coach evaluating a B2-level French-speaking student. Be constructive, specific, and encouraging.${tech ? ' Focus on professional/technical English.' : ''}`
      )
      setFeedback(res); addXP(30)
    } catch { setFeedback('Could not get feedback. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="wrap">
      <div className="mhd">
        <div className="mtitle">Speaking Lab</div>
        <div className="msub">Record yourself speaking. Get detailed AI feedback on fluency and grammar.</div>
      </div>
      <div className="card card-gold" style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:'var(--gold)', marginBottom:6, fontWeight:600 }}>YOUR PROMPT</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--cream)', lineHeight:1.5, marginBottom:10 }}>"{prompt}"</div>
        <button className="btn btn-out" style={{ fontSize:11 }} onClick={() => { setPrompt(prompts[Math.floor(Math.random() * prompts.length)]); setTranscript(''); setFeedback('') }}>↻ New Prompt</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginBottom:20 }}>
        <button className={`mic-btn ${recording ? 'rec' : ''}`} onClick={recording ? stopRec : startRec}>
          {recording ? '⏹' : '🎤'}
        </button>
        <div style={{ fontSize:12, color:'var(--dim)' }}>{recording ? '🔴 Recording... click to stop' : 'Click the mic to start recording'}</div>
      </div>
      {transcript && (
        <div className="card" style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:'var(--dim)', marginBottom:6, fontWeight:600 }}>YOUR TRANSCRIPT</div>
          <div style={{ fontSize:13, color:'var(--cream)', lineHeight:1.7, marginBottom:12 }}>{transcript}</div>
          <button className="btn btn-gold" onClick={getFB} disabled={loading}>{loading ? 'Analyzing...' : '✦ Get AI Feedback (+30 XP)'}</button>
        </div>
      )}
      {feedback && (
        <div className="card" style={{ borderColor:'rgba(76,175,129,.22)', background:'rgba(76,175,129,.04)' }}>
          <div style={{ fontSize:10, color:'var(--green)', marginBottom:8, fontWeight:600 }}>✦ AI FEEDBACK</div>
          <div style={{ fontSize:13, color:'var(--cream)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{feedback}</div>
        </div>
      )}
    </div>
  )
}

// ─── WRITING WORKSHOP ────────────────────────────────────────
function Writing({ tech, addXP }) {
  const [txt, setTxt] = useState('')
  const [fb, setFb] = useState('')
  const [loading, setLoading] = useState(false)
  const prompts = tech
    ? ['Write a professional email explaining a 2-day project delay to your manager.','Write a pull request description for a bug fix in an authentication module.','Write a brief technical spec for a simple REST API endpoint.','Draft a Slack message to your team about a planned database maintenance.']
    : ['Write about a place you\'ve always wanted to visit and why.','Describe a person who has significantly influenced your life.','Write about the pros and cons of social media for students.','Describe your ideal career in 10 years.']
  const [pr, setPr] = useState(prompts[0])
  useEffect(() => { setPr(prompts[0]); setTxt(''); setFb('') }, [tech])
  const wc = txt.trim() ? txt.trim().split(/\s+/).length : 0

  const submit = async () => {
    if (wc < 30 || loading) return; setLoading(true)
    try {
      const res = await callAI(
        [{ role:'user', content:`Prompt: "${pr}"\n\nStudent text:\n"${txt}"\n\nProvide:\n1) Overall assessment\n2) Grammar corrections with examples\n3) Vocabulary improvements\n4) Structure feedback\n5) Improved version\n6) Score /10` }],
        `Expert English writing coach helping a B2 French-speaking student reach C1.${tech ? ' Focus on professional technical writing.' : ' Focus on expressive, clear prose.'}`
      )
      setFb(res); addXP(40)
    } catch { setFb('Could not get feedback. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="wrap">
      <div className="mhd">
        <div className="mtitle">Writing Workshop</div>
        <div className="msub">Write in English. Get detailed AI correction and improvement tips.</div>
      </div>
      <div className="card" style={{ marginBottom:14, borderColor:'rgba(201,168,76,.22)' }}>
        <div style={{ fontSize:10, color:'var(--gold)', marginBottom:5, fontWeight:600 }}>PROMPT</div>
        <div style={{ fontSize:14, color:'var(--cream)', lineHeight:1.6, marginBottom:10 }}>{pr}</div>
        <button className="btn btn-out" style={{ fontSize:11 }} onClick={() => { setPr(prompts[Math.floor(Math.random() * prompts.length)]); setTxt(''); setFb('') }}>↻ Different Prompt</button>
      </div>
      <textarea className="ta" placeholder="Start writing in English here... (minimum 30 words)" value={txt} onChange={e => setTxt(e.target.value)} style={{ marginBottom:8, minHeight:160 }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <span style={{ fontSize:12, color: wc >= 30 ? 'var(--green)' : 'var(--dim)' }}>{wc} words {wc < 30 ? `(${30 - wc} more)` : '✓'}</span>
        <button className="btn btn-gold" onClick={submit} disabled={loading || wc < 30}>{loading ? 'Analyzing...' : '✦ Get Feedback (+40 XP)'}</button>
      </div>
      {fb && (
        <div className="card" style={{ borderColor:'rgba(76,175,129,.2)', background:'rgba(76,175,129,.04)' }}>
          <div style={{ fontSize:10, color:'var(--green)', marginBottom:7, fontWeight:600 }}>✦ WRITING FEEDBACK</div>
          <div style={{ fontSize:13, color:'var(--cream)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{fb}</div>
        </div>
      )}
    </div>
  )
}

// ─── VOCABULARY VAULT (adaptive) ─────────────────────────────
function Vocab({ addXP, setStats, level }) {
  const SESSION_SIZE = 8
  const [seen, setSeen] = useState([])
  const [streak, setStreak] = useState(0)
  const [current, setCurrent] = useState(() => pickAdaptive(VOCAB, level, 0, []))
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [done, setDone] = useState(false)

  const advance = (newStreak, newSeen) => {
    if (newSeen.length >= SESSION_SIZE) { setDone(true); return }
    const nxt = pickAdaptive(VOCAB, level, newStreak, newSeen)
    if (!nxt) { setDone(true); return }
    setCurrent(nxt); setFlipped(false)
  }

  const onKnow = () => {
    if (!current) return
    setKnown(p => [...p, current.id]); addXP(5); setStats(p => ({ ...p, words: p.words + 1 }))
    const ns = streak + 1, ss = [...seen, current.id]
    setStreak(ns); setSeen(ss); advance(ns, ss)
  }
  const onSkip = () => {
    if (!current) return
    const ns = Math.max(streak - 1, -3), ss = [...seen, current.id]
    setStreak(ns); setSeen(ss); advance(ns, ss)
  }
  const reset = () => {
    setSeen([]); setStreak(0); setKnown([]); setDone(false); setFlipped(false)
    setCurrent(pickAdaptive(VOCAB, level, 0, []))
  }

  if (done || !current) return (
    <div className="wrap fade-in">
      <div className="mhd"><div className="mtitle">Vocabulary Vault</div></div>
      <div className="glass-gold card" style={{ textAlign:'center', padding:36 }}>
        <div style={{ fontSize:46, marginBottom:14 }}>🎉</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--gold2)', marginBottom:10 }}>Session Complete!</div>
        <div style={{ color:'var(--dim)', marginBottom:22, fontSize:14 }}>
          ✅ Known: <strong style={{ color:'var(--green)' }}>{known.length}</strong> · 📚 Reviewed: <strong style={{ color:'var(--cream)' }}>{seen.length}</strong>
        </div>
        <button className="btn btn-gold" onClick={reset}>Start Again</button>
      </div>
    </div>
  )

  const progress = (seen.length / SESSION_SIZE) * 100
  return (
    <div className="wrap fade-in">
      <div className="mhd">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
          <div>
            <div className="mtitle">Vocabulary Vault</div>
            <div className="msub">Adaptive flashcards. Tap to reveal.</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <span className={`lvl-chip lvl-${levelKey(current.lv)}`}>{current.lv}</span>
            <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{seen.length + 1} / {SESSION_SIZE}</div>
          </div>
        </div>
        <div className="pbar" style={{ marginTop:12 }}><div className="pfill" style={{ width: progress + '%' }} /></div>
      </div>

      <div className="glass-strong flashcard" onClick={() => setFlipped(!flipped)} style={{ marginBottom:16 }}>
        {!flipped ? (
          <>
            <div className="fc-word">{current.w}</div>
            <div style={{ display:'flex', gap:6 }}>
              <span className="tag">{current.c}</span>
              <span className={`lvl-chip lvl-${levelKey(current.lv)}`} style={{ fontSize:10 }}>{current.lv}</span>
            </div>
            <div className="fc-hint">Tap to reveal</div>
          </>
        ) : (
          <>
            <div style={{ fontSize:10, color:'var(--gold2)', marginBottom:8, fontWeight:700, letterSpacing:.6 }}>{current.p.toUpperCase()} · {current.c.toUpperCase()}</div>
            <div className="fc-def">{current.d}</div>
            <div className="fc-ex">"{current.e}"</div>
          </>
        )}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button className="btn btn-glass" style={{ flex:1 }} onClick={onSkip}>🔁 Still Learning</button>
        <button className="btn btn-gold" style={{ flex:1 }} onClick={onKnow}>✓ I Know This · +5</button>
      </div>

      {Math.abs(streak) >= 2 && (
        <div style={{ textAlign:'center', marginTop:14, fontSize:11, color: streak > 0 ? 'var(--green)' : 'var(--red)' }}>
          {streak >= 3 ? '🚀 Difficulty increasing…' : streak <= -2 ? '📉 Easing difficulty…' : ''}
        </div>
      )}
    </div>
  )
}

// ─── GRAMMAR GYM (adaptive) ──────────────────────────────────
function Grammar({ addXP, level }) {
  const SESSION_SIZE = 6
  const [seen, setSeen] = useState([])
  const [streak, setStreak] = useState(0)
  const [q, setQ] = useState(() => pickAdaptive(GRAMMAR, level, 0, []))
  const [sel, setSel] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const answer = i => {
    if (sel !== null || !q) return
    setSel(i)
    if (i === q.ok) { setScore(p => p + 1); addXP(20); setStreak(s => s + 1) }
    else { setStreak(s => Math.max(s - 1, -3)) }
  }

  const next = () => {
    if (!q) return
    const ss = [...seen, q.id]
    setSeen(ss); setSel(null)
    if (ss.length >= SESSION_SIZE) { setDone(true); return }
    const nxt = pickAdaptive(GRAMMAR, level, streak, ss)
    if (!nxt) { setDone(true); return }
    setQ(nxt)
  }

  const reset = () => {
    setSeen([]); setStreak(0); setSel(null); setScore(0); setDone(false)
    setQ(pickAdaptive(GRAMMAR, level, 0, []))
  }

  if (done || !q) {
    const total = seen.length || 1
    const p = Math.round((score / total) * 100)
    return (
      <div className="wrap fade-in">
        <div className="mhd"><div className="mtitle">Grammar Gym</div></div>
        <div className="glass-gold card" style={{ textAlign:'center', padding:36 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>{p >= 80 ? '🏆' : p >= 60 ? '💪' : '📚'}</div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, color:'var(--gold2)', marginBottom:8 }}>{score} / {total}</div>
          <div style={{ fontSize:14, color:'var(--dim)', marginBottom:22, lineHeight:1.6 }}>
            {p >= 80 ? "Excellent! Your grammar is strong." : p >= 60 ? "Good effort! Keep practicing." : "Keep going — grammar takes time to master."}
          </div>
          <button className="btn btn-gold" onClick={reset}>Try Again</button>
        </div>
      </div>
    )
  }

  const progress = (seen.length / SESSION_SIZE) * 100
  return (
    <div className="wrap fade-in">
      <div className="mhd">
        <div style={{ display:'flex', justifyContent:'space-between', gap:10, alignItems:'flex-start' }}>
          <div>
            <div className="mtitle">Grammar Gym</div>
            <div className="msub">{q.topic}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <span className={`lvl-chip lvl-${levelKey(q.lv)}`}>{q.lv}</span>
            <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{seen.length + 1} / {SESSION_SIZE}</div>
          </div>
        </div>
        <div className="pbar" style={{ marginTop:12 }}><div className="pfill" style={{ width: progress + '%' }} /></div>
      </div>

      <div className="glass card" style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, color:'var(--dim)', marginBottom:8, letterSpacing:.5, textTransform:'uppercase', fontWeight:600 }}>{q.q}</div>
        {q.s && <div style={{ fontFamily:'Playfair Display,serif', fontSize:19, color:'var(--cream)', lineHeight:1.5 }}>{q.s}</div>}
      </div>

      {q.opts.map((o, i) => (
        <button key={i} className={`opt ${sel !== null ? (i === q.ok ? 'ok' : sel === i ? 'bad' : '') : ''}`} onClick={() => answer(i)} disabled={sel !== null}>
          <span style={{ opacity:.6, marginRight:8, fontWeight:700 }}>{String.fromCharCode(65 + i)}.</span>{o}
        </button>
      ))}

      {sel !== null && (
        <div className="fade-in">
          <div className="glass card" style={{ marginBottom:12, marginTop:8, borderColor: sel === q.ok ? 'rgba(95,199,148,.3)' : 'rgba(234,108,108,.3)' }}>
            <div style={{ fontSize:13.5, color:'var(--cream)', lineHeight:1.7 }}>{q.exp}</div>
          </div>
          <button className="btn btn-gold" onClick={next} style={{ width:'100%' }}>
            {seen.length + 1 < SESSION_SIZE ? 'Next Question →' : 'See Results'}
          </button>
          {Math.abs(streak) >= 2 && (
            <div style={{ textAlign:'center', marginTop:12, fontSize:11, color: streak > 0 ? 'var(--green)' : 'var(--red)' }}>
              {streak >= 3 ? '🚀 Difficulty increasing…' : streak <= -2 ? '📉 Easing difficulty…' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── READING ROOM ────────────────────────────────────────────
function ReadingRoom({ addXP }) {
  const [sel, setSel] = useState(null)
  const [ans, setAns] = useState({})
  const [fb, setFb] = useState('')
  const [loading, setLoading] = useState(false)
  const [subm, setSubm] = useState(false)

  const submit = async () => {
    if (!sel) return; setLoading(true)
    const t = READING.find(r => r.id === sel)
    const at = t.qs.map((q, i) => `Q${i + 1}: ${q.q}\nA: ${ans[i] || '(no answer)'}`).join('\n\n')
    try {
      const res = await callAI(
        [{ role:'user', content:`Article: "${t.title}"\n\nAnswers:\n${at}\n\nEvaluate each answer: correct/complete? Provide the ideal answer and feedback. End with overall comprehension score and a tip.` }],
        'You are an English reading comprehension teacher evaluating a B2 student. Be encouraging and educational.'
      )
      setFb(res); setSubm(true); addXP(35)
    } catch { setFb('Could not evaluate. Please try again.') }
    finally { setLoading(false) }
  }

  if (!sel) return (
    <div className="wrap">
      <div className="mhd"><div className="mtitle">Reading Room</div><div className="msub">Read B2/C1 texts and answer comprehension questions to earn XP.</div></div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {READING.map(t => (
          <div key={t.id} className="card" style={{ cursor:'pointer', transition:'border-color .18s' }}
            onClick={() => setSel(t.id)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.28)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.1)'}>
            <div style={{ display:'flex', gap:7, marginBottom:8 }}>
              <span className="tag">{t.lvl}</span>
              <span className="tag tag-blue">{t.cat}</span>
              <span className="tag tag-dim">{t.rt}</span>
            </div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:'var(--cream)', marginBottom:6 }}>{t.title}</div>
            <div style={{ fontSize:12, color:'var(--dim)', lineHeight:1.5 }}>{t.body.substring(0, 110)}...</div>
          </div>
        ))}
      </div>
    </div>
  )

  const t = READING.find(r => r.id === sel)
  return (
    <div className="wrap">
      <div className="mhd">
        <button className="btn btn-out" style={{ marginBottom:10, fontSize:11 }} onClick={() => { setSel(null); setAns({}); setFb(''); setSubm(false) }}>← Back</button>
        <div style={{ display:'flex', gap:7, marginBottom:8 }}>
          <span className="tag">{t.lvl}</span>
          <span className="tag tag-blue">{t.cat}</span>
        </div>
        <div className="mtitle" style={{ fontSize:22 }}>{t.title}</div>
      </div>
      <div className="card" style={{ marginBottom:18 }}>
        <div style={{ fontSize:14, color:'var(--cream)', lineHeight:1.85, whiteSpace:'pre-wrap' }}>{t.body}</div>
      </div>
      <div style={{ fontSize:14, fontWeight:600, color:'var(--cream)', marginBottom:12 }}>Comprehension Questions</div>
      {t.qs.map((q, i) => (
        <div key={i} style={{ marginBottom:14 }}>
          <div style={{ fontSize:13, color:'var(--cream)', marginBottom:5 }}><strong>{i + 1}.</strong> {q.q}</div>
          <div style={{ fontSize:11, color:'var(--dim)', marginBottom:5, fontStyle:'italic' }}>💡 {q.h}</div>
          <textarea className="ta" style={{ minHeight:70, fontSize:13 }} placeholder="Write your answer..." value={ans[i] || ''} onChange={e => setAns(p => ({ ...p, [i]: e.target.value }))} disabled={subm} />
        </div>
      ))}
      {!subm && <button className="btn btn-gold" onClick={submit} disabled={loading} style={{ width:'100%', marginBottom:14 }}>{loading ? 'Evaluating...' : '✦ Submit Answers (+35 XP)'}</button>}
      {fb && (
        <div className="card" style={{ borderColor:'rgba(76,175,129,.2)', background:'rgba(76,175,129,.04)' }}>
          <div style={{ fontSize:10, color:'var(--green)', marginBottom:7, fontWeight:600 }}>✦ COMPREHENSION FEEDBACK</div>
          <div style={{ fontSize:13, color:'var(--cream)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{fb}</div>
        </div>
      )}
    </div>
  )
}

// ─── SETTINGS ────────────────────────────────────────────────
function Settings({ tech, setTech, stats, setStats }) {
  const reset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      const fresh = { streak:1, msgs:0, words:0, xp:0 }
      setStats(fresh)
      localStorage.setItem('fs_stats', JSON.stringify(fresh))
    }
  }
  return (
    <div className="wrap">
      <div className="mhd"><div className="mtitle">Settings</div><div className="msub">Customize your learning experience.</div></div>
      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)', marginBottom:4 }}>Learning Track</div>
        <div style={{ fontSize:12, color:'var(--dim)', marginBottom:12 }}>Switch between general English and technical English for IT professionals.</div>
        <div className="t-row" style={{ marginBottom:0 }}>
          <div>
            <div className="t-val">{tech ? '💻 Tech Track (IT / Numérique)' : '🌍 General English'}</div>
            <div className="t-lbl" style={{ marginTop:2 }}>{tech ? 'Documentation, PRs, standups, tech writing' : 'Everyday communication, professional fluency'}</div>
          </div>
          <div className={`tog ${tech ? 'on' : ''}`} onClick={() => setTech(!tech)}><div className="tog-k" /></div>
        </div>
      </div>
      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)', marginBottom:10 }}>Your Stats</div>
        <div className="g2">
          {[['⚡ XP', stats.xp], ['🔥 Streak', stats.streak + ' days'], ['💬 Messages', stats.msgs], ['📚 Words', stats.words]].map(([l, v]) => (
            <div key={l} style={{ background:'var(--bg3)', borderRadius:9, padding:'12px 14px' }}>
              <div style={{ fontSize:11, color:'var(--dim)', marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:18, fontWeight:600, color:'var(--cream)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ borderColor:'rgba(224,92,92,.18)' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)', marginBottom:4 }}>Danger Zone</div>
        <div style={{ fontSize:12, color:'var(--dim)', marginBottom:10 }}>Reset all learning progress, XP, and streaks.</div>
        <button className="btn btn-red" onClick={reset}>Reset All Progress</button>
      </div>
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('dashboard')
  const [tech, setTech] = useState(false)
  const [stats, setStats] = useState(() => {
    try { const s = localStorage.getItem('fs_stats'); return s ? JSON.parse(s) : { streak:1, msgs:0, words:0, xp:0 } }
    catch { return { streak:1, msgs:0, words:0, xp:0 } }
  })

  useEffect(() => { localStorage.setItem('fs_stats', JSON.stringify(stats)) }, [stats])

  const addXP = n => setStats(p => ({ ...p, xp: p.xp + n }))
  const level = computeLevel(stats.xp)

  const renderModule = () => {
    switch (active) {
      case 'dashboard': return <Dashboard stats={stats} tech={tech} setActive={setActive} />
      case 'tutor':     return <AITutor    tech={tech} addXP={addXP} setStats={setStats} />
      case 'speaking':  return <SpeakingLab tech={tech} addXP={addXP} />
      case 'writing':   return <Writing    tech={tech} addXP={addXP} />
      case 'vocab':     return <Vocab      addXP={addXP} setStats={setStats} level={level} />
      case 'grammar':   return <Grammar    addXP={addXP} level={level} />
      case 'reading':   return <ReadingRoom addXP={addXP} />
      case 'settings':  return <Settings   tech={tech} setTech={setTech} stats={stats} setStats={setStats} />
      default:          return null
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="aurora" />
      <div className="app">
        <Sidebar active={active} setActive={setActive} tech={tech} setTech={setTech} level={level} />
        <main className="main">
          <TopBar tech={tech} setTech={setTech} level={level} />
          {renderModule()}
        </main>
        <BottomNav active={active} setActive={setActive} />
      </div>
    </>
  )
}
