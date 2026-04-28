# FluentShift ⚡
### Plateforme personnelle B2 → C1 — Powered by Claude AI

---

## Structure du projet

```
fluentshift/
├── src/
│   ├── main.jsx       ← point d'entrée React
│   └── App.jsx        ← TOUTE la plateforme (8 modules)
├── index.html
├── package.json       ← dépendances npm
├── vite.config.js     ← config du serveur
├── .env.example       ← modèle pour ta clé API
└── README.md
```

---

## Installation (5 minutes)

### Étape 1 — Vérifier Node.js
```bash
node --version
```
Il faut Node.js 18+. Si pas installé : https://nodejs.org

### Étape 2 — Installer les dépendances
```bash
cd fluentshift
npm install
```

### Étape 3 — Ajouter ta clé API Anthropic
```bash
# Renommer le fichier
cp .env.example .env
```
Ouvrir `.env` et remplacer la valeur :
```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-ta-vraie-cle-ici
```
Obtenir ta clé ici : https://console.anthropic.com

### Étape 4 — Lancer l'app
```bash
npm run dev
```
Ouvrir **http://localhost:5173** dans **Chrome** (obligatoire pour le Speaking Lab).

---

## Les 8 modules

| Module | Description | XP gagné |
|---|---|---|
| ⚡ Dashboard | Niveau B2→C1, XP, streak, défis journaliers | — |
| 🤖 AI Tutor | Conversation avec Claude, correction naturelle des erreurs | +10/message |
| 🎤 Speaking Lab | Micro → transcription → feedback AI sur ta fluidité | +30 |
| ✍️ Writing Workshop | Écris en anglais → correction grammaire + style | +40 |
| 📚 Vocabulary Vault | Flashcards spaced repetition, mots B2→C1 | +5/mot |
| 🎯 Grammar Gym | Exercices interactifs avec explications | +20/question |
| 📖 Reading Room | Textes B2/C1 + questions de compréhension | +35 |
| ⚙️ Settings | Toggle General ↔ Tech Track, reset progrès | — |

**Tech Track** : toggle dans la sidebar → tous les modules passent en mode IT anglais (PRs, standups, documentation, emails pros).

---

## Requirements matériel

```
✅ Core i7 11th gen + 16GB RAM + GPU intégrée = SUFFISANT
✅ Pas de LLM local — l'IA tourne via l'API Anthropic (internet)
✅ Pas de GPU nécessaire — speech = Web Speech API du navigateur
⚠️  Speaking Lab = Chrome obligatoire
```

---

## Dépendances (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0"
  }
}
```
**Note** : pas de `requirements.txt` — c'est du JavaScript, pas Python. L'équivalent c'est `package.json`.

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| Speaking Lab ne fonctionne pas | Utiliser Chrome (pas Firefox/Safari) |
| AI Tutor ne répond pas | Vérifier la clé dans `.env` |
| "API key invalid" | La clé doit commencer par `sk-ant-` |
| Page blanche au démarrage | `npm install` puis relancer `npm run dev` |
| Progrès perdus | localStorage effacé — Settings → voir XP |
