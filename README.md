# Allo Koli (MVP)

![Release Version](https://img.shields.io/github/v/release/your-repo/your-project)

## 1. Présentation

Allo Koli est une plateforme SaaS no-code permettant de créer en 5 minutes un agent vocal IA multilingue, capable de répondre à l’oral à vos clients. L’agent est automatiquement attribué à un numéro Twilio et s’appuie sur les dernières avancées en ASR, NLP et TTS.

## 2. Fonctionnalités principales

- Création rapide d’un agent vocal IA multilingue sans code
- Attribution automatique d’un numéro Twilio pour recevoir des appels
- Compréhension et génération de réponses vocales grâce à :
  - ASR (reconnaissance vocale) via Whisper
  - NLP (compréhension et génération de texte) via LangChain
  - TTS (synthèse vocale) via ElevenLabs
- Interface web simple pour configurer et tester son agent

## 3. Stack technique utilisée

- **Monorepo PNPM** (gestion des dépendances et workspaces)
- **Frontend** : Next.js, TypeScript, Tailwind CSS
- **Gateway** : Node.js, Fastify, TypeScript
- **Packages** :
  - `asr` : intégration Whisper (OpenAI)
  - `nlp` : intégration LangChain
  - `tts` : intégration ElevenLabs
- **Twilio** : gestion des appels téléphoniques et attribution de numéros

## 4. Démarrage local (dev setup)

Prérequis :

- Node.js >= 18
- PNPM

Installation :

```bash
pnpm install
```

### Script de développement Vite

Un script `dev` est disponible pour lancer Vite en mode développement :

```bash
pnpm dev
```

## 5. Démo rapide en local

Lancez le frontend et la gateway en mode développement :

```bash
pnpm dev
```

Attribuez un numéro Twilio (voir documentation interne), puis appelez ce numéro pour tester l’agent vocal IA.

## 6. Structure du monorepo

```
allokoli-monorepo/
├── apps/
│   ├── frontend/   # Interface web (Next.js)
│   └── gateway/    # API et intégration Twilio
├── packages/
│   ├── asr/        # Reconnaissance vocale (Whisper)
│   ├── nlp/        # Traitement du langage (LangChain)
│   └── tts/        # Synthèse vocale (ElevenLabs)
├── README.md
└── PROGRESS.md
```

## 7. Suivi de progression

Consultez le suivi d’avancement dans [PROGRESS.md](./PROGRESS.md).

## 8. Prochaine étape

Préparation de la version bêta et onboarding des premiers clients testeurs.
