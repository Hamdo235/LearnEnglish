// Verb conjugation tables — used by Conjugation & Sentence Builder generators
// Each verb has: base, third (3rd person singular present), past, pastParticiple, ing, fr (translation), level

export const VERBS = [
  // ── B1 ──
  { base: 'work',   third: 'works',   past: 'worked',  pp: 'worked',  ing: 'working',  fr: 'travailler', level: 'B1' },
  { base: 'live',   third: 'lives',   past: 'lived',   pp: 'lived',   ing: 'living',   fr: 'vivre',      level: 'B1' },
  { base: 'play',   third: 'plays',   past: 'played',  pp: 'played',  ing: 'playing',  fr: 'jouer',      level: 'B1' },
  { base: 'study',  third: 'studies', past: 'studied', pp: 'studied', ing: 'studying', fr: 'étudier',    level: 'B1' },
  { base: 'cook',   third: 'cooks',   past: 'cooked',  pp: 'cooked',  ing: 'cooking',  fr: 'cuisiner',   level: 'B1' },
  { base: 'travel', third: 'travels', past: 'traveled',pp: 'traveled',ing: 'traveling',fr: 'voyager',    level: 'B1' },
  { base: 'speak',  third: 'speaks',  past: 'spoke',   pp: 'spoken',  ing: 'speaking', fr: 'parler',     level: 'B1' },
  { base: 'eat',    third: 'eats',    past: 'ate',     pp: 'eaten',   ing: 'eating',   fr: 'manger',     level: 'B1' },
  { base: 'go',     third: 'goes',    past: 'went',    pp: 'gone',    ing: 'going',    fr: 'aller',      level: 'B1' },
  { base: 'come',   third: 'comes',   past: 'came',    pp: 'come',    ing: 'coming',   fr: 'venir',      level: 'B1' },
  { base: 'see',    third: 'sees',    past: 'saw',     pp: 'seen',    ing: 'seeing',   fr: 'voir',       level: 'B1' },
  { base: 'take',   third: 'takes',   past: 'took',    pp: 'taken',   ing: 'taking',   fr: 'prendre',    level: 'B1' },
  { base: 'make',   third: 'makes',   past: 'made',    pp: 'made',    ing: 'making',   fr: 'faire',      level: 'B1' },
  { base: 'give',   third: 'gives',   past: 'gave',    pp: 'given',   ing: 'giving',   fr: 'donner',     level: 'B1' },
  { base: 'find',   third: 'finds',   past: 'found',   pp: 'found',   ing: 'finding',  fr: 'trouver',    level: 'B1' },
  { base: 'buy',    third: 'buys',    past: 'bought',  pp: 'bought',  ing: 'buying',   fr: 'acheter',    level: 'B1' },
  { base: 'sell',   third: 'sells',   past: 'sold',    pp: 'sold',    ing: 'selling',  fr: 'vendre',     level: 'B1' },
  { base: 'write',  third: 'writes',  past: 'wrote',   pp: 'written', ing: 'writing',  fr: 'écrire',     level: 'B1' },
  { base: 'read',   third: 'reads',   past: 'read',    pp: 'read',    ing: 'reading',  fr: 'lire',       level: 'B1' },
  { base: 'meet',   third: 'meets',   past: 'met',     pp: 'met',     ing: 'meeting',  fr: 'rencontrer', level: 'B1' },

  // ── B2 ──
  { base: 'achieve',  third: 'achieves',  past: 'achieved',  pp: 'achieved',  ing: 'achieving',  fr: 'accomplir',   level: 'B2' },
  { base: 'develop',  third: 'develops',  past: 'developed', pp: 'developed', ing: 'developing', fr: 'développer',  level: 'B2' },
  { base: 'consider', third: 'considers', past: 'considered',pp: 'considered',ing: 'considering',fr: 'considérer',  level: 'B2' },
  { base: 'choose',   third: 'chooses',   past: 'chose',     pp: 'chosen',    ing: 'choosing',   fr: 'choisir',     level: 'B2' },
  { base: 'leave',    third: 'leaves',    past: 'left',      pp: 'left',      ing: 'leaving',    fr: 'partir',      level: 'B2' },
  { base: 'forget',   third: 'forgets',   past: 'forgot',    pp: 'forgotten', ing: 'forgetting', fr: 'oublier',     level: 'B2' },
  { base: 'break',    third: 'breaks',    past: 'broke',     pp: 'broken',    ing: 'breaking',   fr: 'casser',      level: 'B2' },
  { base: 'bring',    third: 'brings',    past: 'brought',   pp: 'brought',   ing: 'bringing',   fr: 'apporter',    level: 'B2' },
  { base: 'catch',    third: 'catches',   past: 'caught',    pp: 'caught',    ing: 'catching',   fr: 'attraper',    level: 'B2' },
  { base: 'think',    third: 'thinks',    past: 'thought',   pp: 'thought',   ing: 'thinking',   fr: 'penser',      level: 'B2' },
  { base: 'send',     third: 'sends',     past: 'sent',      pp: 'sent',      ing: 'sending',    fr: 'envoyer',     level: 'B2' },
  { base: 'spend',    third: 'spends',    past: 'spent',     pp: 'spent',     ing: 'spending',   fr: 'dépenser',    level: 'B2' },
  { base: 'understand',third:'understands',past:'understood',pp:'understood',ing:'understanding',fr:'comprendre',  level: 'B2' },
  { base: 'become',   third: 'becomes',   past: 'became',    pp: 'become',    ing: 'becoming',   fr: 'devenir',     level: 'B2' },
  { base: 'grow',     third: 'grows',     past: 'grew',      pp: 'grown',     ing: 'growing',    fr: 'grandir',     level: 'B2' },

  // ── B2+ ──
  { base: 'iterate',    third: 'iterates',    past: 'iterated',    pp: 'iterated',    ing: 'iterating',    fr: 'itérer',       level: 'B2+' },
  { base: 'mitigate',   third: 'mitigates',   past: 'mitigated',   pp: 'mitigated',   ing: 'mitigating',   fr: 'atténuer',     level: 'B2+' },
  { base: 'anticipate', third: 'anticipates', past: 'anticipated', pp: 'anticipated', ing: 'anticipating', fr: 'anticiper',    level: 'B2+' },
  { base: 'undertake',  third: 'undertakes',  past: 'undertook',   pp: 'undertaken',  ing: 'undertaking',  fr: 'entreprendre', level: 'B2+' },
  { base: 'overcome',   third: 'overcomes',   past: 'overcame',    pp: 'overcome',    ing: 'overcoming',   fr: 'surmonter',    level: 'B2+' },
  { base: 'reinforce',  third: 'reinforces',  past: 'reinforced',  pp: 'reinforced',  ing: 'reinforcing',  fr: 'renforcer',    level: 'B2+' },
  { base: 'undermine',  third: 'undermines',  past: 'undermined',  pp: 'undermined',  ing: 'undermining',  fr: 'saper',        level: 'B2+' },
  { base: 'demonstrate',third:'demonstrates', past:'demonstrated', pp:'demonstrated', ing:'demonstrating', fr:'démontrer',     level: 'B2+' },

  // ── C1 ──
  { base: 'scrutinize',  third: 'scrutinizes',  past: 'scrutinized',  pp: 'scrutinized',  ing: 'scrutinizing',  fr: 'scruter',     level: 'C1' },
  { base: 'corroborate', third: 'corroborates', past: 'corroborated', pp: 'corroborated', ing: 'corroborating', fr: 'corroborer', level: 'C1' },
  { base: 'galvanize',   third: 'galvanizes',   past: 'galvanized',   pp: 'galvanized',   ing: 'galvanizing',   fr: 'galvaniser', level: 'C1' },
  { base: 'epitomize',   third: 'epitomizes',   past: 'epitomized',   pp: 'epitomized',   ing: 'epitomizing',   fr: 'incarner',   level: 'C1' },
  { base: 'oscillate',   third: 'oscillates',   past: 'oscillated',   pp: 'oscillated',   ing: 'oscillating',   fr: 'osciller',   level: 'C1' },
  { base: 'extrapolate', third: 'extrapolates', past: 'extrapolated', pp: 'extrapolated', ing: 'extrapolating', fr: 'extrapoler',level: 'C1' },
]

export const SUBJECTS = [
  { word: 'I',    person: '1s', isThird: false },
  { word: 'You',  person: '2s', isThird: false },
  { word: 'He',   person: '3s', isThird: true  },
  { word: 'She',  person: '3s', isThird: true  },
  { word: 'We',   person: '1p', isThird: false },
  { word: 'They', person: '3p', isThird: false },
]

// Tense definitions: how to build the conjugated verb form
export const TENSES = [
  { id: 'present_simple',  label: 'Present Simple',     levels: ['B1','B2','B2+','C1'],
    build: (verb, subj) => subj.isThird ? verb.third : verb.base,
    aux: null },
  { id: 'present_continuous', label: 'Present Continuous', levels: ['B1','B2','B2+','C1'],
    build: (verb, subj) => `${be('present', subj)} ${verb.ing}`,
    aux: 'be' },
  { id: 'past_simple', label: 'Simple Past', levels: ['B1','B2','B2+','C1'],
    build: (verb) => verb.past,
    aux: null },
  { id: 'past_continuous', label: 'Past Continuous', levels: ['B2','B2+','C1'],
    build: (verb, subj) => `${be('past', subj)} ${verb.ing}`,
    aux: 'be' },
  { id: 'present_perfect', label: 'Present Perfect', levels: ['B2','B2+','C1'],
    build: (verb, subj) => `${have('present', subj)} ${verb.pp}`,
    aux: 'have' },
  { id: 'past_perfect', label: 'Past Perfect', levels: ['B2+','C1'],
    build: (verb) => `had ${verb.pp}`,
    aux: 'had' },
  { id: 'future_simple', label: 'Future (will)', levels: ['B1','B2','B2+','C1'],
    build: (verb) => `will ${verb.base}`,
    aux: 'will' },
  { id: 'conditional', label: 'Conditional (would)', levels: ['B2','B2+','C1'],
    build: (verb) => `would ${verb.base}`,
    aux: 'would' },
  { id: 'conditional_perfect', label: 'Conditional Perfect', levels: ['B2+','C1'],
    build: (verb) => `would have ${verb.pp}`,
    aux: 'would have' },
]

function be(time, subj) {
  if (time === 'present') {
    if (subj.person === '1s') return 'am'
    if (subj.isThird) return 'is'
    return 'are'
  }
  // past
  if (subj.person === '1s' || subj.isThird) return 'was'
  return 'were'
}

function have(time, subj) {
  if (time === 'present') return subj.isThird ? 'has' : 'have'
  return 'had'
}

export function verbsForLevel(level) {
  const idx = ['B1','B2','B2+','C1'].indexOf(level)
  return VERBS.filter(v => ['B1','B2','B2+','C1'].indexOf(v.level) <= idx)
}

export function tensesForLevel(level) {
  return TENSES.filter(t => t.levels.includes(level))
}
