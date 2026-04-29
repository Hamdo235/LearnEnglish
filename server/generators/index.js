import { sample, sampleN, shuffle, uid } from '../utils.js'
import { wordsAt, wordsUpTo } from '../data/words.js'
import { VERBS, SUBJECTS, TENSES, verbsForLevel, tensesForLevel } from '../data/verbs.js'
import { translationsForLevel } from '../data/translations.js'
import { templatesForLevel, POOLS } from '../data/templates.js'
import { generateGrammar } from '../data/grammar.js'

// ─── 1. VOCABULARY ───────────────────────────────────────────
// MCQ: word → translation (FR), or definition.
export function genVocabulary(level) {
  const pool = wordsAt(level)
  if (pool.length < 4) {
    // mix levels if not enough at this level
    const wider = wordsUpTo(level)
    return buildVocabMCQ(sample(wider), wider)
  }
  return buildVocabMCQ(sample(pool), pool)
}

function buildVocabMCQ(target, pool) {
  const distractors = sampleN(pool.filter(w => w.en !== target.en), 3)
  const mode = Math.random() > 0.5 ? 'fr' : 'def'
  const correct = mode === 'fr' ? target.fr : target.def
  const options = shuffle([correct, ...distractors.map(d => mode === 'fr' ? d.fr : d.def)])
  return {
    id: uid(),
    type: 'mcq',
    branch: 'vocabulary',
    prompt: mode === 'fr' ? `What is the French translation of:` : `What does this word mean?`,
    question: target.en,
    sub: target.pos,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `✅ "${target.en}" (${target.pos}) — ${target.def}. Example: "${target.ex}"`,
    xp: 10,
  }
}

// ─── 2. GRAMMAR ──────────────────────────────────────────────
export function genGrammar(level) {
  const g = generateGrammar(level)
  return {
    id: uid(),
    type: 'mcq',
    branch: 'grammar',
    prompt: g.prompt,
    question: g.sentence,
    sub: g.topic,
    options: g.options,
    correctIndex: g.correctIndex,
    explanation: g.explanation,
    xp: 15,
  }
}

// ─── 3. SENTENCE BUILDER ─────────────────────────────────────
// Generate a sentence from a template, then ask user to reorder shuffled words.
export function genSentence(level) {
  const tpl = sample(templatesForLevel(level))
  const sentence = fillTemplate(tpl)
  const words = sentence.replace(/\s+/g, ' ').trim().split(' ')
  const tokens = words.map((w, i) => ({ id: i, word: w }))
  const shuffled = shuffle(tokens)
  return {
    id: uid(),
    type: 'reorder',
    branch: 'sentence',
    prompt: 'Reorder the words to form a correct sentence:',
    question: '',
    tokens: shuffled,
    correctOrder: tokens.map(t => t.id),     // canonical order
    correctSentence: sentence,
    explanation: `✅ Correct sentence: "${sentence}"`,
    xp: 15,
  }
}

function fillTemplate(tpl) {
  let s = tpl.pat
  // pick consistent subject for placeholders that depend on it
  const subjPick = sample(POOLS.subj)
  const subjLow = subjPick.toLowerCase() === 'i' ? 'I' : subjPick.toLowerCase()
  const v = sample(VERBS.filter(vv => ['B1','B2','B2+'].includes(vv.level)))
  const repl = {
    subj: subjPick,
    subj_low: subjLow,
    is: POOLS.is_for[subjPick],
    has: POOLS.has_for[subjPick],
    dont: POOLS.dont_for[subjPick],
    verb: v.base,
    verb_s: subjPick === 'I' || subjPick === 'You' || subjPick === 'We' || subjPick === 'They' ? v.base : v.third,
    past: v.past,
    pp: v.pp,
    ing: v.ing,
    obj: sample(POOLS.obj),
    noun: sample(POOLS.noun),
    nounpl: sample(POOLS.nounpl),
    place: sample(POOLS.place),
    when: sample(POOLS.when),
    timeunit: sample(POOLS.timeunit),
    adj: sample(POOLS.adj),
  }
  for (const [k, val] of Object.entries(repl)) {
    s = s.split(`{${k}}`).join(val)
  }
  return s
}

// ─── 4. TRANSLATION ──────────────────────────────────────────
// Either FR → EN typed, or EN → FR multiple choice.
export function genTranslation(level) {
  const pool = translationsForLevel(level)
  const t = sample(pool)
  const mode = Math.random() > 0.5 ? 'typed' : 'mcq'
  if (mode === 'typed') {
    return {
      id: uid(),
      type: 'typed',
      branch: 'translation',
      prompt: 'Translate into English:',
      question: t.fr,
      acceptedAnswers: [t.en, ...(t.alts || [])],
      explanation: `✅ "${t.en}"`,
      xp: 18,
    }
  }
  const distractors = sampleN(pool.filter(x => x.en !== t.en), 3).map(x => x.fr)
  const options = shuffle([t.fr, ...distractors])
  return {
    id: uid(),
    type: 'mcq',
    branch: 'translation',
    prompt: 'Choose the correct French translation:',
    question: t.en,
    options,
    correctIndex: options.indexOf(t.fr),
    explanation: `✅ "${t.en}" → "${t.fr}"`,
    xp: 12,
  }
}

// ─── 5. LISTENING ────────────────────────────────────────────
// Frontend uses Web Speech API to read `audioText`. User types what they hear.
export function genListening(level) {
  const tpl = sample(templatesForLevel(level))
  const sentence = fillTemplate(tpl)
  return {
    id: uid(),
    type: 'listen',
    branch: 'listening',
    prompt: 'Listen and type what you hear:',
    question: '',
    audioText: sentence,
    acceptedAnswers: [sentence],
    explanation: `✅ "${sentence}"`,
    xp: 18,
  }
}

// ─── 6. CONJUGATION ──────────────────────────────────────────
// Ask user to type the correct verb form for a given subject + tense.
export function genConjugation(level) {
  const verbs = verbsForLevel(level)
  const tenses = tensesForLevel(level)
  const verb = sample(verbs)
  const subj = sample(SUBJECTS)
  const tense = sample(tenses)
  const correct = tense.build(verb, subj)
  // also include an MCQ variant 50% of the time (faster on mobile)
  if (Math.random() > 0.5) {
    const wrongs = []
    // generate plausible wrongs with other tenses
    const others = tenses.filter(t => t.id !== tense.id)
    while (wrongs.length < 3 && others.length) {
      const t = others.splice(Math.floor(Math.random() * others.length), 1)[0]
      const w = t.build(verb, subj)
      if (w !== correct && !wrongs.includes(w)) wrongs.push(w)
    }
    while (wrongs.length < 3) wrongs.push(verb.base + ' (typo)')
    const options = shuffle([correct, ...wrongs])
    return {
      id: uid(),
      type: 'mcq',
      branch: 'conjugation',
      prompt: `Choose the correct form (${tense.label}):`,
      question: `${subj.word} ___ (${verb.base})`,
      sub: tense.label,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `✅ ${tense.label}: ${subj.word} ${correct}.`,
      xp: 15,
    }
  }
  return {
    id: uid(),
    type: 'typed',
    branch: 'conjugation',
    prompt: `Conjugate "${verb.base}" — ${tense.label}:`,
    question: `${subj.word} ___`,
    acceptedAnswers: [`${subj.word} ${correct}`, correct],
    sub: tense.label,
    explanation: `✅ ${tense.label}: ${subj.word} ${correct}.`,
    xp: 18,
  }
}

// ─── DISPATCHER ──────────────────────────────────────────────
const GEN_BY_BRANCH = {
  vocabulary:  genVocabulary,
  grammar:     genGrammar,
  sentence:    genSentence,
  translation: genTranslation,
  listening:   genListening,
  conjugation: genConjugation,
}

export function generateFor(branch, level) {
  const fn = GEN_BY_BRANCH[branch] || genVocabulary
  return fn(level)
}

// generate a mixed batch (used for boss lessons / checkpoints)
export function generateMixed(level, n = 6) {
  const branches = ['vocabulary','grammar','sentence','translation','conjugation','listening']
  const out = []
  for (let i = 0; i < n; i++) {
    out.push(generateFor(sample(branches), level))
  }
  return out
}
