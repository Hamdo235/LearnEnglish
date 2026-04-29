// Sentence templates for Sentence Builder & Listening generators.
// Use {placeholders} that are replaced from pools below.
// Each template has level + minimum length safety.

export const TEMPLATES = {
  B1: [
    { pat: "{subj} {verb_s} {obj} {when}.",            slots: ['subj','verb_s','obj','when'] },
    { pat: "{subj} {verb_s} to {place} {when}.",       slots: ['subj','verb_s','place','when'] },
    { pat: "{subj} {dont} like {nounpl}.",             slots: ['subj','dont','nounpl'] },
    { pat: "{subj} {past} {obj} yesterday.",           slots: ['subj','past','obj'] },
    { pat: "{subj} {is} going to {verb} {obj}.",       slots: ['subj','is','verb','obj'] },
    { pat: "Can {subj_low} {verb} {obj}?",             slots: ['subj_low','verb','obj'] },
    { pat: "{subj} {is} {adj} today.",                 slots: ['subj','is','adj'] },
    { pat: "There {is} a {adj} {noun} on the table.",  slots: ['is','adj','noun'] },
    { pat: "{subj} {verb_s} every {timeunit}.",        slots: ['subj','verb_s','timeunit'] },
    { pat: "{subj} {is} {ing} the {noun} now.",        slots: ['subj','is','ing','noun'] },
  ],
  B2: [
    { pat: "{subj} {has} already {pp} the {noun}.",                       slots: ['subj','has','pp','noun'] },
    { pat: "If {subj_low} {past}, {subj_low} would {verb} the {noun}.",   slots: ['subj_low','past','verb','noun'] },
    { pat: "{subj} {is} {ing} on a new {noun} this week.",                slots: ['subj','is','ing','noun'] },
    { pat: "The team has been {ing} for several hours.",                  slots: ['ing'] },
    { pat: "{subj} should consider {ing} the {noun}.",                    slots: ['subj','ing','noun'] },
    { pat: "{subj} prefer to {verb} during the morning.",                 slots: ['subj','verb'] },
    { pat: "We need to streamline the {noun} as soon as possible.",       slots: ['noun'] },
    { pat: "{subj} {has} just {pp} an important {noun}.",                 slots: ['subj','has','pp','noun'] },
    { pat: "By next year, {subj_low} will have {pp} the {noun}.",         slots: ['subj_low','pp','noun'] },
    { pat: "{subj} suggested {ing} a different approach.",                slots: ['subj','ing'] },
  ],
  'B2+': [
    { pat: "{subj} would have {pp} the {noun} if there had been time.",   slots: ['subj','pp','noun'] },
    { pat: "Had {subj_low} {pp} the {noun}, the result would be different.", slots: ['subj_low','pp','noun'] },
    { pat: "{subj} {is} known to {verb} under pressure.",                 slots: ['subj','is','verb'] },
    { pat: "The {noun}, having been {pp}, was now ready.",                slots: ['noun','pp'] },
    { pat: "It is essential that {subj_low} {verb} the {noun} carefully.",slots: ['subj_low','verb','noun'] },
    { pat: "{subj} {has} been {ing} this {noun} for years.",              slots: ['subj','has','ing','noun'] },
    { pat: "Despite {ing} the {noun}, {subj_low} kept improving.",        slots: ['ing','noun','subj_low'] },
    { pat: "{subj} not only {past} the {noun}, but also exceeded expectations.", slots: ['subj','past','noun'] },
  ],
  C1: [
    { pat: "Never before had {subj_low} {pp} such a {adj} {noun}.",       slots: ['subj_low','pp','adj','noun'] },
    { pat: "Were {subj_low} to {verb} the {noun}, the outcome would shift.", slots: ['subj_low','verb','noun'] },
    { pat: "Scarcely had {subj_low} {pp} the {noun} when the call came.", slots: ['subj_low','pp','noun'] },
    { pat: "The {noun}, scrutinized by experts, proved to be {adj}.",     slots: ['noun','adj'] },
    { pat: "{subj} would sooner {verb} the {noun} than abandon the plan.", slots: ['subj','verb','noun'] },
    { pat: "Should {subj_low} {verb} the {noun}, it would epitomize success.", slots: ['subj_low','verb','noun'] },
  ],
}

// Slot pools (level-aware where it matters)
export const POOLS = {
  subj:    ['I', 'You', 'She', 'He', 'We', 'They'],
  subj_low:['I', 'you', 'she', 'he', 'we', 'they'],
  is_for:  { I:'am', You:'are', She:'is', He:'is', We:'are', They:'are' },
  has_for: { I:'have', You:'have', She:'has', He:'has', We:'have', They:'have' },
  dont_for:{ I:"don't", You:"don't", She:"doesn't", He:"doesn't", We:"don't", They:"don't" },

  // generic pools for nouns/places/timewords (level-agnostic, kept simple)
  obj:      ['coffee', 'a book', 'the news', 'a meeting', 'my friend', 'the car', 'the plan', 'a song', 'a movie', 'an email', 'the report', 'a photo'],
  noun:     ['book', 'meeting', 'project', 'plan', 'idea', 'team', 'email', 'task', 'article', 'design', 'feature', 'report'],
  nounpl:   ['mornings', 'crowds', 'delays', 'meetings', 'spicy foods', 'long emails', 'noisy places'],
  place:    ['the office', 'the gym', 'school', 'the park', 'the library', 'work', 'the restaurant', 'the airport'],
  when:     ['every day', 'on Mondays', 'in the morning', 'after lunch', 'this evening', 'during the weekend'],
  timeunit: ['day', 'morning', 'week', 'weekend', 'evening', 'Monday', 'Friday'],
  adj:      ['ready', 'important', 'beautiful', 'tired', 'happy', 'busy', 'crowded', 'efficient', 'concise', 'compelling', 'meticulous', 'pivotal'],
}

export function templatesForLevel(level) {
  return TEMPLATES[level] || TEMPLATES.B1
}
