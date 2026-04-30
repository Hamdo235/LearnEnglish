// Web Audio API sound engine — zero dependencies, ~20 lines of synthesis
let _ctx = null
function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function tone({ freq = 440, type = 'sine', dur = 0.15, gain = 0.25, detune = 0, delay = 0 }) {
  try {
    const ac = ctx()
    const osc = ac.createOscillator()
    const g   = ac.createGain()
    osc.connect(g)
    g.connect(ac.destination)
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    const t = ac.currentTime + delay
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.01)
  } catch {}
}

// ✓ Correct — two ascending tones
export function playCorrect() {
  tone({ freq: 783.99, type: 'sine', dur: 0.12, gain: 0.22 })
  tone({ freq: 1046.5, type: 'sine', dur: 0.14, gain: 0.18, delay: 0.09 })
}

// ✗ Wrong — low dull thump
export function playWrong() {
  tone({ freq: 180, type: 'triangle', dur: 0.28, gain: 0.30 })
  tone({ freq: 120, type: 'sine',     dur: 0.20, gain: 0.20, delay: 0.05 })
}

// 🏆 Level-up — 4-note fanfare
export function playLevelUp() {
  const seq = [523.25, 659.25, 783.99, 1046.5]
  seq.forEach((f, i) => tone({ freq: f, type: 'sine', dur: 0.22, gain: 0.22, delay: i * 0.11 }))
}

// 🖱 Click — light tick
export function playClick() {
  tone({ freq: 900, type: 'sine', dur: 0.04, gain: 0.12 })
}
