export const LEVELS = ['B1', 'B2', 'B2+', 'C1']

export function levelKey(lv) {
  return lv === 'B2+' ? 'B2plus' : lv
}

export function levelLabel(lv) {
  return lv
}
