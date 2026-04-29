// Grammar exercise patterns — produce infinite variations
// Each pattern is a function that returns { topic, prompt, sentence, options, correctIndex, explanation }

import { VERBS, SUBJECTS } from './verbs.js'

const sample = arr => arr[Math.floor(Math.random() * arr.length)]
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a,b) => a[0]-b[0]).map(v => v[1])

function buildOptions(correct, distractors, fillerPool = []) {
  // Ensure 4 unique options: correct + 3 unique distractors that don't equal correct
  const seen = new Set([correct])
  const uniq = []
  for (const d of distractors) {
    if (!seen.has(d)) { seen.add(d); uniq.push(d) }
  }
  // Top up from fillerPool if we don't have 3 distractors
  for (const f of fillerPool) {
    if (uniq.length >= 3) break
    if (!seen.has(f)) { seen.add(f); uniq.push(f) }
  }
  // Last resort: fabricate variants
  let n = 1
  while (uniq.length < 3) {
    const fab = `${correct} (alt${n++})`
    if (!seen.has(fab)) { seen.add(fab); uniq.push(fab) }
  }
  const all = shuffle([correct, ...uniq.slice(0, 3)])
  return { options: all, correctIndex: all.indexOf(correct) }
}

// ──────────────────────────────────────────────────────────────
// B1 patterns
// ──────────────────────────────────────────────────────────────
function presentSimpleVsContinuous() {
  const subj = sample(SUBJECTS)
  const verb = sample(VERBS.filter(v => v.level === 'B1'))
  const time = sample(['every day', 'usually', 'on Mondays', 'every morning'])
  const correct = subj.isThird ? verb.third : verb.base
  const wrong1 = `${subj.person === '1s' ? 'am' : subj.isThird ? 'is' : 'are'} ${verb.ing}`
  const wrong2 = verb.ing
  const wrong3 = verb.past
  const { options, correctIndex } = buildOptions(correct, [wrong1, wrong2, wrong3])
  return {
    topic: 'Present Simple vs Continuous',
    prompt: 'Choose the correct verb form:',
    sentence: `${subj.word} ___ ${time}.`,
    options, correctIndex,
    explanation: `✅ Use the present simple for habits ("${time}"). Form: ${subj.word} ${correct}.`,
  }
}

function pastSimpleIrregular() {
  const irregulars = VERBS.filter(v => v.past !== `${v.base}ed` && v.past !== `${v.base}d` && v.level === 'B1')
  const verb = sample(irregulars)
  const subj = sample(SUBJECTS)
  const correct = verb.past
  // primary distractors: a "wrong regular" variant + base form + pp
  const regularStub = verb.base.endsWith('e') ? `${verb.base}d` : `${verb.base}ed`
  const wrong = [regularStub, verb.base]
  if (verb.pp !== verb.past) wrong.push(verb.pp)
  // fillerPool: random past forms from other irregular verbs (always plausible)
  const filler = irregulars.filter(v => v !== verb).map(v => v.past)
  const { options, correctIndex } = buildOptions(correct, wrong, filler)
  return {
    topic: 'Simple Past — Irregular Verbs',
    prompt: 'Choose the correct past form:',
    sentence: `Yesterday, ${subj.word === 'I' ? 'I' : subj.word} ___ very early.`,
    options, correctIndex,
    explanation: `✅ "${verb.base}" is irregular. Past simple: ${verb.base} → ${verb.past} → ${verb.pp}.`,
  }
}

function comparativeForm() {
  const adjs = [
    { base: 'easy', comp: 'easier' },
    { base: 'big', comp: 'bigger' },
    { base: 'happy', comp: 'happier' },
    { base: 'fast', comp: 'faster' },
    { base: 'small', comp: 'smaller' },
    { base: 'cold', comp: 'colder' },
    { base: 'hot', comp: 'hotter' },
    { base: 'difficult', comp: 'more difficult' },
    { base: 'interesting', comp: 'more interesting' },
    { base: 'expensive', comp: 'more expensive' },
  ]
  const a = sample(adjs)
  const correct = a.comp
  const wrong1 = a.comp.includes('more') ? `${a.base}er` : `more ${a.base}`
  const wrong2 = `most ${a.base}`
  const wrong3 = a.base
  const { options, correctIndex } = buildOptions(correct, [wrong1, wrong2, wrong3])
  return {
    topic: 'Comparatives',
    prompt: 'Choose the correct comparative form:',
    sentence: `This task is ___ than I expected.`,
    options, correctIndex,
    explanation: `✅ Short adjectives take "-er" (${a.base.length <= 6 && !a.comp.includes('more') ? a.base + ' → ' + a.comp : 'most regular short adjectives'}). Long ones use "more" (e.g. more difficult).`,
  }
}

function prepositionsOfTime() {
  const items = [
    { ctx: 'The meeting is ___ Monday.',         correct: 'on',  wrong: ['in', 'at', 'by'] },
    { ctx: 'My birthday is ___ June.',           correct: 'in',  wrong: ['on', 'at', 'to'] },
    { ctx: 'I wake up ___ 7 a.m.',               correct: 'at',  wrong: ['on', 'in', 'by'] },
    { ctx: 'She was born ___ 1995.',             correct: 'in',  wrong: ['on', 'at', 'during'] },
    { ctx: 'Class starts ___ 9 o\'clock.',       correct: 'at',  wrong: ['in', 'on', 'by'] },
    { ctx: 'We go skiing ___ winter.',           correct: 'in',  wrong: ['on', 'at', 'to'] },
    { ctx: 'I\'ll see you ___ Friday evening.',  correct: 'on',  wrong: ['in', 'at', 'by'] },
  ]
  const it = sample(items)
  const { options, correctIndex } = buildOptions(it.correct, it.wrong)
  return {
    topic: 'Prepositions of Time',
    prompt: 'Choose the correct preposition:',
    sentence: it.ctx,
    options, correctIndex,
    explanation: `✅ "on" for days, "at" for exact times, "in" for months/years/seasons.`,
  }
}

function countableUncountable() {
  const items = [
    { word: 'sugar', uncount: true },
    { word: 'water', uncount: true },
    { word: 'time', uncount: true },
    { word: 'money', uncount: true },
    { word: 'people', uncount: false },
    { word: 'books', uncount: false },
    { word: 'friends', uncount: false },
    { word: 'apples', uncount: false },
  ]
  const it = sample(items)
  const correct = it.uncount ? 'much' : 'many'
  const { options, correctIndex } = buildOptions(correct, ['little', 'few', 'a lot'])
  return {
    topic: 'Countable / Uncountable',
    prompt: 'Choose the correct quantifier:',
    sentence: `How ___ ${it.word} do you have?`,
    options, correctIndex,
    explanation: `✅ "much" with uncountables (sugar, water, time), "many" with countables (people, books).`,
  }
}

// ──────────────────────────────────────────────────────────────
// B2 patterns
// ──────────────────────────────────────────────────────────────
function presentPerfectVsPast() {
  const verb = sample(VERBS.filter(v => v.level === 'B1' || v.level === 'B2'))
  const subj = sample(SUBJECTS)
  const usePerfect = Math.random() > 0.5
  if (usePerfect) {
    const correct = `has${subj.isThird ? '' : ''} just ${verb.pp}`
    // simpler: just / already / yet trigger present perfect
    const opt = [
      `${subj.isThird ? 'has' : 'have'} just ${verb.pp}`,
      `just ${verb.past}`,
      `${verb.past} just`,
      `${subj.isThird ? 'is' : 'are'} just ${verb.ing}`,
    ]
    const { options, correctIndex } = buildOptions(opt[0], opt.slice(1))
    return {
      topic: 'Present Perfect vs Simple Past',
      prompt: 'Choose the correct form:',
      sentence: `${subj.word} ___ the ${sample(['report','task','project','email'])}.`,
      options, correctIndex,
      explanation: `✅ "Just / already / yet" → present perfect (${subj.isThird ? 'has' : 'have'} + past participle).`,
    }
  } else {
    const correct = verb.past
    const wrong = [verb.pp, `${subj.isThird ? 'has' : 'have'} ${verb.pp}`, verb.ing]
    const { options, correctIndex } = buildOptions(correct, wrong)
    return {
      topic: 'Present Perfect vs Simple Past',
      prompt: 'Choose the correct form:',
      sentence: `${subj.word} ___ the ${sample(['report','task','project','email'])} yesterday.`,
      options, correctIndex,
      explanation: `✅ Specific past time ("yesterday") → simple past (${verb.past}).`,
    }
  }
}

function passiveVoice() {
  const verb = sample(VERBS.filter(v => ['B1','B2'].includes(v.level) && v.pp))
  const noun = sample(['app', 'report', 'feature', 'design', 'plan', 'document'])
  const correct = `was ${verb.pp}`
  const wrong = [`was ${verb.base}`, `were ${verb.pp}`, `has ${verb.pp}`]
  const { options, correctIndex } = buildOptions(correct, wrong)
  return {
    topic: 'Passive Voice',
    prompt: 'Choose the correct passive form:',
    sentence: `The ${noun} ___ by the team last week.`,
    options, correctIndex,
    explanation: `✅ Passive (singular subject, past): was + past participle. "${verb.pp}" is the past participle of "${verb.base}".`,
  }
}

function relativePronouns() {
  const items = [
    { ctx: 'The bug ___ I reported was fixed.',   correct: 'which', wrong: ['who','whose','where'] },
    { ctx: 'The engineer ___ wrote that wins.',   correct: 'who',   wrong: ['which','whose','where'] },
    { ctx: 'The office ___ we work is downtown.', correct: 'where', wrong: ['which','who','whose'] },
    { ctx: "The man ___ car broke down is calm.", correct: 'whose', wrong: ['who','which','where'] },
  ]
  const it = sample(items)
  const { options, correctIndex } = buildOptions(it.correct, it.wrong)
  return {
    topic: 'Relative Pronouns',
    prompt: 'Choose the correct relative pronoun:',
    sentence: it.ctx,
    options, correctIndex,
    explanation: `✅ who → people, which/that → things, where → places, whose → possession.`,
  }
}

// ──────────────────────────────────────────────────────────────
// B2+ patterns
// ──────────────────────────────────────────────────────────────
function thirdConditional() {
  const verbs = VERBS.filter(v => ['B1','B2','B2+'].includes(v.level))
  const v1 = sample(verbs)
  const v2 = sample(verbs)
  const correct = `had ${v1.pp} / would have ${v2.pp}`
  const wrong = [
    `${v1.past} / would ${v2.base}`,
    `${v1.base} / would have ${v2.pp}`,
    `would ${v1.base} / ${v2.past}`,
  ]
  const { options, correctIndex } = buildOptions(correct, wrong)
  return {
    topic: 'Third Conditional',
    prompt: 'Complete the third conditional:',
    sentence: `If we ___ the tests, we ___ the bug.`,
    options, correctIndex,
    explanation: `✅ Third conditional = unreal past: If + past perfect → would have + past participle.`,
  }
}

function reportedSpeech() {
  const items = [
    { ctx: '"I am working." → He said he ___ working.',                   correct: 'was', wrong: ['is','were','has been'] },
    { ctx: '"I will help you." → She said she ___ help me.',              correct: 'would', wrong: ['will','had','was'] },
    { ctx: '"I have finished." → They said they ___ finished.',           correct: 'had', wrong: ['have','were','would have'] },
    { ctx: '"I love coffee." → He said he ___ coffee.',                   correct: 'loved', wrong: ['loves','was loving','has loved'] },
  ]
  const it = sample(items)
  const { options, correctIndex } = buildOptions(it.correct, it.wrong)
  return {
    topic: 'Reported Speech',
    prompt: 'Choose the correct reported form:',
    sentence: it.ctx,
    options, correctIndex,
    explanation: `✅ In reported speech, present tenses shift back one step (am/is → was, will → would, have → had).`,
  }
}

// ──────────────────────────────────────────────────────────────
// C1 patterns
// ──────────────────────────────────────────────────────────────
function inversion() {
  const items = [
    { ctx: 'Never ___ such code in my life.',                correct: 'have I seen', wrong: ['I have seen','I saw','did I see'] },
    { ctx: 'Rarely ___ a more elegant solution.',            correct: 'have we found', wrong: ['we found','we have found','did we find'] },
    { ctx: 'Hardly ___ when the alarm rang.',                correct: 'had he arrived', wrong: ['he had arrived','he arrived','did he arrive'] },
    { ctx: 'Not only ___ the deadline, she also led the team.', correct: 'did she meet', wrong: ['she met','she did meet','meet she'] },
  ]
  const it = sample(items)
  const { options, correctIndex } = buildOptions(it.correct, it.wrong)
  return {
    topic: 'Inversion',
    prompt: 'Choose the correct inverted form:',
    sentence: it.ctx,
    options, correctIndex,
    explanation: `✅ Negative adverbs (never, rarely, hardly, not only) at sentence start → inversion (auxiliary + subject).`,
  }
}

function subjunctive() {
  const items = [
    { ctx: 'It is essential that he ___ the report on time.',           correct: 'submit', wrong: ['submits','submitted','is submitting'] },
    { ctx: 'They demanded that she ___ present at the meeting.',         correct: 'be',     wrong: ['is','was','were'] },
    { ctx: 'I suggest that the team ___ the design before Friday.',     correct: 'review', wrong: ['reviews','reviewed','is reviewing'] },
  ]
  const it = sample(items)
  const { options, correctIndex } = buildOptions(it.correct, it.wrong)
  return {
    topic: 'Subjunctive Mood',
    prompt: 'Choose the correct verb form:',
    sentence: it.ctx,
    options, correctIndex,
    explanation: `✅ After "essential / demand / suggest that...", use the bare verb (subjunctive): "submit", "be", "review".`,
  }
}

// ──────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────
export const PATTERNS = {
  B1:    [presentSimpleVsContinuous, pastSimpleIrregular, comparativeForm, prepositionsOfTime, countableUncountable],
  B2:    [presentSimpleVsContinuous, pastSimpleIrregular, presentPerfectVsPast, passiveVoice, relativePronouns, prepositionsOfTime],
  'B2+': [presentPerfectVsPast, passiveVoice, relativePronouns, thirdConditional, reportedSpeech],
  C1:    [thirdConditional, reportedSpeech, inversion, subjunctive],
}

export function generateGrammar(level) {
  const pool = PATTERNS[level] || PATTERNS.B1
  const fn = sample(pool)
  return fn()
}
