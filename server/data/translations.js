// Translation phrase pairs per level (FR ↔ EN)
// Used by Translation generator. Each item: { fr, en, alts: [optional alternative correct EN] }

export const TRANSLATIONS = {
  B1: [
    { fr: "J'aime apprendre l'anglais.",          en: "I like learning English.",            alts: ["I like to learn English."] },
    { fr: "Elle habite à Paris.",                 en: "She lives in Paris.",                 alts: [] },
    { fr: "Nous travaillons ensemble.",           en: "We work together.",                   alts: [] },
    { fr: "Il parle trois langues.",              en: "He speaks three languages.",          alts: [] },
    { fr: "Je prépare le dîner.",                 en: "I am preparing dinner.",              alts: ["I prepare dinner.", "I'm preparing dinner."] },
    { fr: "Elle a un nouveau travail.",           en: "She has a new job.",                  alts: [] },
    { fr: "Mon ami arrive demain.",               en: "My friend arrives tomorrow.",         alts: ["My friend is arriving tomorrow."] },
    { fr: "Le train part à neuf heures.",         en: "The train leaves at nine.",           alts: ["The train leaves at nine o'clock."] },
    { fr: "Je dois finir ce projet.",             en: "I have to finish this project.",      alts: ["I must finish this project."] },
    { fr: "Tu peux m'aider ?",                    en: "Can you help me?",                    alts: ["Could you help me?"] },
    { fr: "Il fait beau aujourd'hui.",            en: "The weather is nice today.",          alts: ["It's nice today.", "It is nice today."] },
    { fr: "Je suis fatigué ce soir.",             en: "I am tired tonight.",                 alts: ["I'm tired tonight."] },
    { fr: "Nous voyageons en Espagne.",           en: "We travel to Spain.",                 alts: ["We are traveling to Spain.", "We're traveling to Spain."] },
    { fr: "Combien ça coûte ?",                   en: "How much does it cost?",              alts: ["How much is it?"] },
    { fr: "J'achète du pain au marché.",          en: "I buy bread at the market.",          alts: [] },
    { fr: "Mes parents vivent à la campagne.",    en: "My parents live in the countryside.", alts: [] },
    { fr: "Elle aime les chiens.",                en: "She likes dogs.",                     alts: [] },
    { fr: "Le café est trop chaud.",              en: "The coffee is too hot.",              alts: [] },
    { fr: "Je n'ai pas le temps.",                en: "I don't have time.",                  alts: ["I have no time.", "I do not have time."] },
    { fr: "Il étudie l'histoire.",                en: "He studies history.",                 alts: [] },
  ],

  B2: [
    { fr: "J'essaie d'améliorer mon vocabulaire.",      en: "I am trying to improve my vocabulary.", alts: ["I'm trying to improve my vocabulary.", "I try to improve my vocabulary."] },
    { fr: "Cette approche est très efficace.",          en: "This approach is very efficient.",       alts: [] },
    { fr: "Nous avons atteint nos objectifs.",          en: "We have reached our goals.",             alts: ["We've reached our goals.", "We achieved our goals."] },
    { fr: "Il faut prendre une décision rapidement.",   en: "We need to make a decision quickly.",    alts: ["We must make a decision quickly."] },
    { fr: "Je préfère travailler en équipe.",           en: "I prefer working in a team.",            alts: ["I prefer to work in a team."] },
    { fr: "Cette opportunité est unique.",              en: "This opportunity is unique.",            alts: [] },
    { fr: "Il a expliqué le problème clairement.",      en: "He explained the problem clearly.",     alts: [] },
    { fr: "Nous devons respecter le délai.",            en: "We must respect the deadline.",          alts: ["We have to respect the deadline.", "We need to respect the deadline."] },
    { fr: "Le rapport contient des informations utiles.",en: "The report contains useful information.",alts: [] },
    { fr: "Elle a une grande expérience du domaine.",   en: "She has a lot of experience in the field.", alts: ["She has extensive experience in the field."] },
    { fr: "Nous sommes ouverts à toute suggestion.",    en: "We are open to any suggestion.",         alts: ["We're open to any suggestion."] },
    { fr: "Il vaut mieux planifier à l'avance.",        en: "It is better to plan ahead.",            alts: ["It's better to plan ahead."] },
    { fr: "Cette solution résout le problème.",         en: "This solution solves the problem.",      alts: [] },
    { fr: "Le résultat dépasse nos attentes.",          en: "The result exceeds our expectations.",   alts: [] },
    { fr: "Sans son aide, j'aurais échoué.",            en: "Without his help, I would have failed.", alts: ["Without her help, I would have failed."] },
  ],

  'B2+': [
    { fr: "Cette stratégie nous donne un avantage clair.", en: "This strategy gives us a clear advantage.", alts: [] },
    { fr: "Il a une approche pragmatique du problème.",    en: "He has a pragmatic approach to the problem.", alts: [] },
    { fr: "Nous itérons sur la conception chaque semaine.",en: "We iterate on the design every week.",      alts: [] },
    { fr: "Sa présentation était très convaincante.",      en: "Her presentation was very compelling.",      alts: ["His presentation was very compelling."] },
    { fr: "Nous devons anticiper les difficultés.",        en: "We must anticipate the difficulties.",        alts: ["We need to anticipate the difficulties."] },
    { fr: "Cette décision a des conséquences profondes.",  en: "This decision has profound consequences.",    alts: [] },
    { fr: "L'équipe défend une cause juste.",              en: "The team advocates for a just cause.",        alts: [] },
    { fr: "Il faut atténuer les risques avant le déploiement.", en: "We must mitigate the risks before deployment.", alts: ["We have to mitigate the risks before deployment."] },
    { fr: "Sa contribution est tout à fait significative.",en: "Her contribution is quite significant.",     alts: ["His contribution is quite significant."] },
    { fr: "Cette donnée illustre une tendance claire.",    en: "This data illustrates a clear trend.",        alts: [] },
    { fr: "Le consensus s'est formé rapidement.",          en: "The consensus formed quickly.",               alts: [] },
    { fr: "Cela renforce notre confiance dans le projet.", en: "This reinforces our confidence in the project.", alts: [] },
  ],

  C1: [
    { fr: "Sa maîtrise du sujet est impressionnante.",     en: "Her command of the subject is impressive.",   alts: ["His command of the subject is impressive."] },
    { fr: "Nous devons scruter chaque détail.",            en: "We must scrutinize every detail.",            alts: [] },
    { fr: "Cet événement a galvanisé toute l'équipe.",     en: "This event galvanized the whole team.",       alts: [] },
    { fr: "C'est l'incarnation même du leadership.",       en: "She is the epitome of leadership.",           alts: ["He is the epitome of leadership."] },
    { fr: "Les preuves corroborent sa thèse.",             en: "The evidence corroborates her thesis.",       alts: ["The evidence corroborates his thesis."] },
    { fr: "L'aplomb avec lequel elle a répondu m'a marqué.", en: "The aplomb with which she replied struck me.", alts: ["The aplomb with which he replied struck me."] },
    { fr: "Ce paradoxe mérite une analyse approfondie.",   en: "This paradox deserves a thorough analysis.",  alts: [] },
    { fr: "Sa tenacité a fait toute la différence.",       en: "Her tenacity made all the difference.",       alts: ["His tenacity made all the difference."] },
    { fr: "Le résultat fut sans précédent.",               en: "The result was unprecedented.",               alts: [] },
    { fr: "C'est un moment charnière de notre histoire.",  en: "It is a pivotal moment in our history.",      alts: ["It's a pivotal moment in our history."] },
  ],
}

export function translationsForLevel(level) {
  return TRANSLATIONS[level] || TRANSLATIONS.B1
}
