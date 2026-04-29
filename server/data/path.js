// Skill tree: per level, a list of units, each with multiple lessons.
// Each lesson is a "pod" focused on one branch (vocabulary, grammar, sentence, translation, listening, conjugation).
// User must complete lessons in order; finishing a unit unlocks the next.

export const BRANCHES = {
  vocabulary:     { label: 'Vocabulary',     icon: '📚', color: 'gold'   },
  grammar:        { label: 'Grammar',        icon: '🎯', color: 'blue'   },
  sentence:       { label: 'Sentence Build', icon: '🧱', color: 'violet' },
  translation:    { label: 'Translation',    icon: '🔄', color: 'green'  },
  listening:      { label: 'Listening',      icon: '👂', color: 'red'    },
  conjugation:    { label: 'Conjugation',    icon: '⚡', color: 'gold'   },
}

// helpers
const lesson = (id, branch, title) => ({ id, branch, title })

// Each unit = 5 lessons mixing branches at the same level.
function makeUnits(level, prefix) {
  return [
    {
      id: `${prefix}-u1`,
      title: 'Foundations',
      level,
      lessons: [
        lesson(`${prefix}-u1-l1`, 'vocabulary',  'Core Words I'),
        lesson(`${prefix}-u1-l2`, 'grammar',     'Basic Patterns'),
        lesson(`${prefix}-u1-l3`, 'sentence',    'Build Sentences'),
        lesson(`${prefix}-u1-l4`, 'conjugation', 'Verb Forms'),
        lesson(`${prefix}-u1-l5`, 'listening',   'Hear & Type'),
      ],
    },
    {
      id: `${prefix}-u2`,
      title: 'Daily Practice',
      level,
      lessons: [
        lesson(`${prefix}-u2-l1`, 'translation', 'FR → EN'),
        lesson(`${prefix}-u2-l2`, 'vocabulary',  'Core Words II'),
        lesson(`${prefix}-u2-l3`, 'grammar',     'Tense Drill'),
        lesson(`${prefix}-u2-l4`, 'sentence',    'Word Order'),
        lesson(`${prefix}-u2-l5`, 'listening',   'Quick Dictation'),
      ],
    },
    {
      id: `${prefix}-u3`,
      title: 'Stretch & Master',
      level,
      lessons: [
        lesson(`${prefix}-u3-l1`, 'conjugation', 'Mixed Tenses'),
        lesson(`${prefix}-u3-l2`, 'vocabulary',  'Advanced Words'),
        lesson(`${prefix}-u3-l3`, 'translation', 'Tricky Phrases'),
        lesson(`${prefix}-u3-l4`, 'grammar',     'Edge Cases'),
        lesson(`${prefix}-u3-l5`, 'sentence',    'Complex Builds'),
      ],
    },
    {
      id: `${prefix}-u4`,
      title: 'Final Push',
      level,
      isCheckpoint: true,
      lessons: [
        lesson(`${prefix}-u4-l1`, 'vocabulary',  'Review Sprint'),
        lesson(`${prefix}-u4-l2`, 'grammar',     'Mixed Quiz'),
        lesson(`${prefix}-u4-l3`, 'listening',   'Speed Listening'),
        lesson(`${prefix}-u4-l4`, 'translation', 'Mixed Translation'),
        lesson(`${prefix}-u4-l5`, 'sentence',    'Boss Lesson'),
      ],
    },
  ]
}

export const PATH = [
  ...makeUnits('B1',    'b1'),
  ...makeUnits('B2',    'b2'),
  ...makeUnits('B2+',   'b2p'),
  ...makeUnits('C1',    'c1'),
]

// Flat lesson list for quick lookup
export const LESSONS = PATH.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, level: u.level })))

export function getLesson(id) {
  return LESSONS.find(l => l.id === id)
}

export function unitOfLesson(lessonId) {
  return PATH.find(u => u.lessons.some(l => l.id === lessonId))
}

// Default lessons-per-session
export const EXERCISES_PER_LESSON = 6
