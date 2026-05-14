# AGENTS.md — SprintifAI Frontend

Conventions and operating instructions for AI agents (and human contributors) working on this codebase. Read this **before** touching anything.

---

## 1. Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Vite dev server |
| `pnpm build` | `tsc -b && vite build` — produces `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint |

**Run `pnpm exec tsc -b` and `pnpm exec vite build` before committing** anything non-trivial. The build must pass with **zero TypeScript errors**.

---

## 2. Tech stack (locked)

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** with `@theme inline` token blocks in `src/index.css`
- **shadcn/ui** (New York style, **zinc** base) — primitives in `src/components/ui/`
- **react-router-dom v7** (data router) — `src/shared/router/`
- **Zustand v5** for state management (per feature)
- **react-hook-form** + **Zod** for forms
- **react-i18next** for i18n (EN + AR/RTL)
- **GSAP 3** + **@gsap/react** for animation
- **sonner** for toasts
- **lucide-react** for icons (always `strokeWidth={1.6}`)
- **Geist** + **Geist Mono** fonts (self-hosted in `public/fonts/`)
- **FullCalendar v6** for the calendar feature
- **VideoSDK** for meetings

Banned: Inter font, `@headlessui/react` for new code (legacy meeting feature only), Material UI, Bootstrap.

---

## 3. Project structure

```
src/
├── App.tsx                       — RouterProvider + Toaster
├── main.tsx                      — Providers in this exact order:
│                                   Theme → Language → Auth → App
├── index.css                     — Tailwind + ALL design tokens
├── components/
│   └── ui/                       — shadcn primitives (zinc base, re-skinned)
├── features/                     — feature folders, one per domain
│   ├── auth/
│   ├── files/
│   ├── chat/
│   ├── calendar/
│   ├── meeting/                  — VideoSDK shell (legacy .jsx, to be migrated)
│   ├── gmail/
│   └── landing/
├── pages/                        — thin route wrappers that compose feature pages
├── lib/
│   └── utils.ts                  — cn() helper
├── hooks/                        — global hooks (use-mobile, use-media-query)
└── shared/
    ├── assets/brand/             — Logo SVGs
    ├── components/               — PageHeader, EmptyState, SectionCard,
    │                               EyebrowTag, ThemeToggle, LanguageSwitcher, Logo
    ├── hooks/                    — useGlobalShortcuts
    ├── i18n/                     — i18next config + locale files
    ├── layout/                   — AppLayout, PublicLayout, AppSidebar,
    │                               MobileNavSheet, UserMenu,
    │                               CommandPalette, ShortcutsDialog,
    │                               RouteTransition
    ├── router/                   — Router, ProtectedRoute, RedirectIfAuthenticated
    └── theme/                    — ThemeProvider (light/dark/system)
```

### Each feature folder follows this shape

```
features/<feature>/
├── components/         — feature-scoped UI
├── pages/              — entry pages composed of components/
├── types/              — feature type definitions
├── mock/               — mock data services (single point of change for real API)
├── store/              — Zustand stores
└── hooks/              — feature-specific hooks
```

---

## 4. Naming conventions

- **Folders**: `kebab-case` for multi-word, `lowercase` for single-word (`features/files/`, NOT `features/Files/`)
- **Files**:
  - React components: `PascalCase.tsx` (e.g., `FileRow.tsx`)
  - Hooks: `useCamelCase.ts` (e.g., `useFiles.ts`)
  - Stores: `<noun>Store.ts` (e.g., `filesStore.ts`)
  - Utilities: `kebab-case.ts` (e.g., `file-meta.ts`)
- **Components**: `PascalCase`
- **Hooks**: `useCamelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types**: `PascalCase`; interfaces and type aliases both fine, prefer `type` for unions/intersections.
- **i18n keys**: `camelCase`, namespaced by feature (`files`, `chat`, `auth`, etc.)
- **CSS classes** (utility soup): Use Tailwind classes; group by purpose with line breaks inside `cn()` calls.

---

## 5. Styling rules

### Token-first
- **Never** hardcode hex colors. Always use semantic tokens (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Brand gradient (`text-brand-gradient`, `bg-brand-mesh`) is reserved for **hero moments only**: logo, hero headings, final CTA panel, auth brand panel.
- AI surfaces use `bg-ai-tint` + `text-ai` + `ring-ai/20`.
- No "Lila" (AI-purple) as a global UI color. Brand badge gradient is a deliberate accent moment.

### Custom easings only
Never use `transition-all`, `linear`, or `ease-in-out`. Always:

- `cubic-bezier(0.32, 0.72, 0, 1)` — soft (for hover/press)
- `cubic-bezier(0.16, 1, 0.3, 1)` — quart (for entry)
- Custom GSAP easings: `power2.out`, `power3.out`, `power4.out`, `sine.inOut`

Use the tokens: `var(--ease-out-soft)`, `var(--ease-out-quart)`, `var(--ease-spring)`, `var(--duration-fast/base/slow/cinematic)`.

### Patterns to follow
- **Double-bezel cards**: outer shell + concentric inner core. See `<SectionCard>`.
- **Diffusion shadows**: wide, soft, tinted to bg. Use `.shadow-diffusion` / `.shadow-diffusion-lg`.
- **Hairline borders**: `border border-border` only. Never `border-2`+.
- **Tactile press**: `active:scale-[0.98]` (already in Button primitive).
- **Min-height for viewports**: ALWAYS `min-h-[100dvh]`. **Never `h-screen`** (iOS Safari bug).
- **Use logical properties** for spacing (`ps-*`, `pe-*`, `ms-*`, `me-*`, `border-s`, `border-e`) so RTL works automatically.
- **Icons that flip with direction**: add `.rtl-flip` class to arrows, send icons, forwards/replies.

### Anti-patterns (don't)
- `h-screen` — use `min-h-[100dvh]`
- `transition-all duration-300` — be explicit and use custom easings
- Hardcoded `#ffffff`, `#000`, `text-skyblue-500`, etc. — use tokens
- Putting glow shadows on buttons (no neon)
- Centered-text-over-dark-image heroes (banned by design system)
- 3-equal-card feature rows (banned — use zig-zag or asymmetric)
- `text-[24px]` arbitrary values — use the type scale tokens

---

## 6. Animation (GSAP)

- Always `gsap.registerPlugin(useGSAP)` (and `ScrollTrigger` if used).
- Always wrap in `useGSAP(() => { ... }, { scope: ref })` — never raw `useEffect`.
- Always wrap motion in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch that returns early.
- Animate only `transform` and `opacity` (or `autoAlpha`). Never `top`/`left`/`width`/`height`.
- ScrollTriggers must be on **top-level** tweens/timelines, not nested inside parent timelines.

---

## 7. State management

- **Local state**: `useState` / `useReducer`.
- **Cross-component, scoped to a feature**: feature-local Zustand store (e.g., `filesStore`, `gmailStore`, `chatStore`).
- **Global state**: only `authStore` (with `persist` middleware for localStorage), theme, language.
- **No Redux**. No Context for state — only for app-level providers (Theme, Language, Auth).

---

## 8. Data layer / mock services

Every feature has a `mock/` folder that exposes the **same API surface** the real backend will expose. Components import from `mock/` via hooks (`useFiles`, `useThreads`, `useMockChat`).

**When the real backend ships:**
1. Swap the `mock/<service>.ts` file.
2. Optionally swap the hook (e.g., `useMockChat` → `useChat` from `@ai-sdk/react`).
3. Nothing else changes.

All mock services simulate realistic latency (typically 200–1200ms) so loading states look real. **In-memory only** — refresh wipes data. The one exception: `authStore` persists to `localStorage` so refresh keeps you signed in.

**Demo account** (mock auth):
- Email: `demo@sprintifai.com`
- Password: `Sprintif@2026`

---

## 9. Routing

- `/` — Landing (public)
- `/login`, `/signup`, `/forgot-password` — wrapped in `<RedirectIfAuthenticated>` (signed-in users bounce to `/app`)
- `/app/*` — wrapped in `<ProtectedRoute>` (unauthed users → `/login?from=<original>`)
- `/chat` → redirects to `/app/chat` (legacy alias)
- `*` — 404 page

The `videoSdkToken` flows through `authStore.user.videoSdkToken`. `meeting/api.js` reads from the store first, falls back to `VITE_VIDEOSDK_TOKEN`.

---

## 10. i18n

- Two languages: **English** (default) and **Arabic** (RTL).
- Namespaces per feature: `common`, `landing`, `auth`, `files`, `chat`, `calendar`, `meeting`, `gmail`, `errors`.
- All user-facing strings must use `t('namespace.key')`.
- Use `useTranslation('files')` for feature-specific namespace; `useTranslation()` (no arg) for `common`.
- Arabic gets full ICU pluralization: `_one`, `_two`, `_few`, `_many`, `_other`.
- Date/number formatting via `Intl.DateTimeFormat` (locale comes from `useLanguage().language`).
- RTL is automatic if you use logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`).

See `src/shared/i18n/README.md` for full details.

---

## 11. Auth

- `useAuthStore` is the source of truth.
- Selectors: `selectUser`, `selectIsAuthenticated`, `selectAuthStatus`, `selectVideoSdkToken`.
- `useAuth()` hook for components that need most of the store.
- `<ProtectedRoute>` and `<RedirectIfAuthenticated>` wrap router branches.
- `<AuthProvider>` blocks render until persisted state has rehydrated (prevents flash-of-redirect).

---

## 12. Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `?` | Shortcuts help dialog |
| `G` then `F` | Files |
| `G` then `C` | Calendar |
| `G` then `M` | Meeting |
| `G` then `A` | Chat AI |
| `G` then `I` | Inbox |
| `G` then `H` | Landing |

All registered in `src/shared/hooks/useGlobalShortcuts.ts`. Honors input focus (no hijacking while typing).

---

## 13. Accessibility

- **Skip link** at the top of `AppLayout` jumps to `#main-content`.
- All buttons have `aria-label` if icon-only.
- All form inputs paired with `<Label>` and have `aria-invalid` / `aria-describedby` for error state.
- All animations honor `prefers-reduced-motion` via `gsap.matchMedia()`.
- Focus rings are `ring-2 ring-ring` with offset; never removed without a `focus-visible` replacement.
- Color contrast: foreground/background pairs from the token system are AA-compliant in both light and dark themes.

---

## 14. Commit conventions

- Use conventional commits: `feat(scope): description`, `fix(scope): description`, `refactor(scope): description`, `docs(scope): description`, `chore(scope): description`.
- **Never** commit without running `pnpm exec tsc -b` and `pnpm exec vite build` first.
- **Never** commit `.env` or any file containing real secrets.
- **Never** commit if there are new TypeScript errors.

---

## 15. Common pitfalls / known issues

- **Meeting feature is `.jsx` (legacy)**: `src/features/meeting/` still has hand-rolled icons and 800+ line components. Don't touch unless rewriting the whole feature. The `// @ts-expect-error` in `src/pages/Meeting.tsx` is intentional.
- **`@headlessui/react`** is still installed solely for the meeting feature. Don't import it in new code.
- **`hero-video-dialog.tsx`** under `components/ui/` is currently orphan — kept for the future meeting preview redesign.
- **Bundle size warning**: Vite warns about >500 KB chunks. Code-splitting is a future optimization; not blocking.

---

## 16. Quick reference — most important files

| File | What it does |
|---|---|
| `src/index.css` | All design tokens, fonts, base layer |
| `src/main.tsx` | Provider stack (read top-down) |
| `src/shared/router/index.tsx` | All routes |
| `src/shared/i18n/index.ts` | i18next setup |
| `src/shared/i18n/resources.ts` | Locale bundling |
| `src/features/auth/store/authStore.ts` | Auth state |
| `src/features/auth/mock/mockAuth.ts` | Demo account + auth mock |
| `src/features/meeting/api.js` | VideoSDK token resolution |
| `components.json` | shadcn config (zinc base) |
| `eslint.config.js` | Lint config |

---

## 17. When in doubt

Read the existing similar feature first. Calendar, Files, Chat, and Gmail are the four reference implementations:

- **Form-heavy?** Look at `features/calendar/components/event/EventForm.tsx`.
- **List + detail pane?** Look at `features/gmail/`.
- **Streaming / AI?** Look at `features/chat/hooks/useMockChat.ts`.
- **Search + filter + view toggle?** Look at `features/files/components/FilesToolbar.tsx`.

Match their conventions exactly. Consistency > novelty.
