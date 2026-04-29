// CEFR level configuration & XP thresholds
export const LEVELS = ['B1', 'B2', 'B2+', 'C1']

export const LEVEL_THRESHOLDS = {
  B1: 0,
  B2: 300,
  'B2+': 800,
  C1: 1500,
}

export const LEVEL_MAX_XP = 1500

export function computeLevel(xp) {
  if (xp >= LEVEL_THRESHOLDS.C1) return 'C1'
  if (xp >= LEVEL_THRESHOLDS['B2+']) return 'B2+'
  if (xp >= LEVEL_THRESHOLDS.B2) return 'B2'
  return 'B1'
}

export function nextThreshold(lv) {
  if (lv === 'B1') return LEVEL_THRESHOLDS.B2
  if (lv === 'B2') return LEVEL_THRESHOLDS['B2+']
  if (lv === 'B2+') return LEVEL_THRESHOLDS.C1
  return LEVEL_THRESHOLDS.C1
}

export function levelIndex(lv) {
  return LEVELS.indexOf(lv)
}
