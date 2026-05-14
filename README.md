# SprintifAI — Frontend

SprintifAI is an enterprise productivity platform that turns every meeting into measurable business outcomes. It captures discussions, extracts decisions, assigns tasks with deadlines, and syncs everything to your team's calendar — so meetings end with execution, not just conversation.

This repository contains the frontend application.

---

## Overview

Organizations spend countless hours in meetings, yet most discussions end without clear decisions, ownership, or follow-through. SprintifAI fixes this by providing a single, AI-powered workspace where teams schedule, host, and manage meetings — then automatically convert them into structured summaries, decisions, and actionable tasks.

The frontend delivers:

- A unified workspace combining meetings, files, AI chat, calendar, and email
- AI-generated meeting summaries, decisions, and task extraction
- Calendar-synced execution so action items don't get lost
- A modern, accessible, localized (EN + AR/RTL) UI
- Light + dark themes with system detection

---

## Core features

| Feature | Route | Status |
|---|---|---|
| **Landing** | `/` | Full marketing page, GSAP-driven |
| **Auth** | `/login`, `/signup`, `/forgot-password` | Mock — demo account below |
| **Files** | `/app` | List/grid views, search, filters, upload, preview drawer |
| **Meeting** | `/app/meeting` | VideoSDK integration; reads token from auth store |
| **Calendar** | `/app/calendar` | FullCalendar + custom event form with preset color swatches |
| **Chat AI** | `/app/chat` | Streaming mock responses with citations & conversation history |
| **Inbox** | `/app/gmail` | Three-pane inbox with AI thread summaries, compose, labels |

---

## Tech stack

| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | UI framework |
| **Vite 7** | Dev & build tooling |
| **Tailwind CSS v4** | Styling (token-driven via `@theme inline`) |
| **shadcn/ui** | Component primitives (re-skinned, zinc base) |
| **GSAP + ScrollTrigger** | Animations |
| **react-router-dom v7** | Routing |
| **Zustand v5** | State management (per feature) |
| **react-hook-form + Zod** | Forms & validation |
| **i18next** | Internationalization (EN + AR/RTL) |
| **FullCalendar v6** | Calendar feature |
| **VideoSDK** | Meeting feature |
| **sonner** | Toasts |
| **lucide-react** | Icons |
| **Geist + Geist Mono** | Typography (self-hosted) |

---

## Project setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
VITE_VIDEOSDK_TOKEN=<your_videosdk_token>   # optional for dev; production reads from auth backend
```

### 3. Run the dev server

```bash
pnpm dev
```

### 4. Demo account

The app runs against mocked services. Use these credentials on the login page:

```
Email:    demo@sprintifai.com
Password: Sprintif@2026
```

The login screen has a **"Use demo account"** button that auto-fills these.

---

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Type-check + build for production |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Run ESLint |

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `?` | Shortcuts help |
| `G` then `F` | Files |
| `G` then `C` | Calendar |
| `G` then `M` | Meeting |
| `G` then `A` | Chat AI |
| `G` then `I` | Inbox |
| `G` then `H` | Landing |

---

## Documentation

- **`AGENTS.md`** — conventions, naming, styling rules, anti-patterns
- **`src/shared/theme/README.md`** — design tokens & theme system
- **`src/shared/i18n/README.md`** — adding strings, languages, RTL

---

## Project structure

```
src/
├── App.tsx                — RouterProvider + Toaster
├── main.tsx               — Providers (Theme → Language → Auth → App)
├── index.css              — Tailwind + design tokens
├── components/ui/         — shadcn primitives (re-skinned, zinc base)
├── features/              — auth, files, chat, calendar, meeting, gmail, landing
├── pages/                 — thin route wrappers
├── shared/
│   ├── components/        — PageHeader, EmptyState, SectionCard, Logo, etc.
│   ├── i18n/              — i18next + EN/AR locales
│   ├── layout/            — AppLayout, PublicLayout, CommandPalette, etc.
│   ├── router/            — Router + ProtectedRoute + RedirectIfAuthenticated
│   └── theme/             — ThemeProvider
└── lib/utils.ts           — cn() helper
```

See `AGENTS.md` for the full layout and conventions.

---

## Switching from mock to real backend

Every feature isolates its data layer in a `mock/` folder. When the real API ships:

1. Replace the relevant `mock/<feature>Service.ts` file with real API calls.
2. Optionally swap the hook (e.g., `useMockChat` → `useChat` from `@ai-sdk/react`).
3. Nothing else changes — the type contracts stay identical.

`authStore.user.videoSdkToken` is already wired through to the meeting feature, so the real backend just needs to return a token in the login response.
