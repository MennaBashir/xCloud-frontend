# SprintifAI — Design & Architecture

A living reference for how this product is built. Read this **before** changing structure, routes, design tokens, or animation patterns. Every claim in this document maps to real files in the repo; if reality drifts, this document is wrong and should be updated.

---

## 1. What this product is

SprintifAI is an enterprise workspace that turns every meeting into a clear summary, named decisions, and assigned tasks — synced to the team's calendar. Five product surfaces live behind one auth wall:

| Surface | Route | Feature folder |
|---|---|---|
| Files (workspace home) | `/app` (index) | `features/files/` |
| Meeting | `/app/meeting` | `features/meeting/` |
| Calendar | `/app/calendar` | `features/calendar/` |
| Chat AI | `/app/chat` | `features/chat/` |
| Inbox (Gmail) | `/app/gmail` | `features/gmail/` |
| Notifications | `/app/notifications` | `features/notifications/` |

Plus a public marketing landing (`/`) and an auth shell (`/login`, `/signup`, `/forgot-password`).

---

## 2. Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19** + **TypeScript** + **Vite 7** | Modern, fast HMR, server-component-ready when needed |
| Styling | **Tailwind CSS v4** with `@theme inline` blocks in `src/index.css` | Single source of design tokens via CSS custom properties |
| Primitives | **shadcn/ui** (New York style, zinc base) — `src/components/ui/` | Customised heavily; never used in default state |
| Routing | **react-router-dom v7** (data router) — `src/shared/router/` | Nested layouts + guarded routes |
| State | **Zustand v5** — per-feature stores | No Redux. No Context for state — Context only for app providers |
| Forms | **react-hook-form** + **Zod** | Schemas live in `features/<x>/schemas/` |
| i18n | **react-i18next** — `src/shared/i18n/` | EN + AR (RTL). Per-feature namespace JSON files |
| Animation (UI) | **Framer Motion v12** (`motion/react`) | Spring physics, `layoutId`, `whileInView`, `AnimatePresence` |
| Animation (scroll) | **GSAP 3** + **@gsap/react** | Pinned scroll, scrubbed timelines, page-level scrolltelling |
| Calendar | **FullCalendar v6** | Battle-tested, plugin ecosystem |
| Meetings | **VideoSDK** (`@videosdk.live/react-sdk`) | Real-time video, screen share, recording |
| Toasts | **sonner** | Mounted once in `App.tsx` |
| Icons | **lucide-react** at `strokeWidth={1.6}` (premium accents 1.7–1.8) | Consistent stroke weight is mandatory |
| Fonts | **Geist** (Latin) + **IBM Plex Sans Arabic** (Arabic), self-hosted in `public/fonts/` | Arabic glyphs unicode-range scoped so English sessions pay zero cost |

**Banned in new code:** Inter font, `@headlessui/react` (only the legacy meeting feature uses it), Material UI, Bootstrap, pure black (`#000`), 3-equal-card layouts, `h-screen`, gradient text on large headers.

---

## 3. Top-level file map

```
src/
├── App.tsx                       — RouterProvider + Toaster (mounted once)
├── main.tsx                      — Provider stack (Theme → Language → Auth → App)
├── index.css                     — Tailwind v4 import + ALL design tokens (@theme inline)
│
├── components/
│   └── ui/                       — 33 shadcn primitives, customised (zinc base)
│
├── features/                     — One folder per product domain
│   ├── auth/                     — Login, signup, forgot-password, mock JWT, AuthProvider
│   ├── files/                    — Files workspace (index of /app)
│   ├── chat/                     — Chat AI, streaming via useMockChat
│   ├── calendar/                 — FullCalendar v6 wrapper
│   ├── meeting/                  — VideoSDK shell (legacy .jsx in places)
│   ├── gmail/                    — Inbox (label "Gmail" internally, "Inbox" in UI)
│   ├── notifications/            — Bell drawer + page
│   └── landing/                  — Marketing landing (public)
│
├── pages/                        — Thin route wrappers that compose feature pages
│   ├── Landing.tsx               — Composes landing sections
│   ├── Calendar.tsx              — CalendarPage shell
│   └── NotFound.tsx              — 404
│
├── hooks/                        — Global hooks (use-mobile, use-media-query)
├── lib/utils.ts                  — cn() helper
│
└── shared/
    ├── assets/brand/             — Logo SVGs
    ├── components/               — Cross-feature UI (PageHeader, EmptyState, etc.)
    ├── hooks/                    — useGlobalShortcuts, useListReveal
    ├── i18n/                     — i18next setup + 10 locale namespaces × 2 languages
    ├── layout/                   — AppLayout, PublicLayout, AppSidebar, CommandPalette, etc.
    ├── router/                   — Router, ProtectedRoute, RedirectIfAuthenticated
    └── theme/                    — ThemeProvider (light/dark)
```

### Per-feature folder shape

Every feature follows the same shape — discover one, you've discovered them all:

```
features/<feature>/
├── components/      — Feature-scoped UI
├── pages/           — Entry pages (composed of components/)
├── types/           — Feature type definitions
├── mock/            — Mock data services (single point of API swap)
├── store/           — Zustand stores
├── hooks/           — Feature-specific hooks
└── schemas/         — Zod schemas (only where forms exist)
```

---

## 4. Provider stack (exact order — do not reorder)

From `src/main.tsx`, outer to inner:

```
StrictMode
  └─ ThemeProvider (defaultTheme="dark")
       └─ LanguageProvider
            └─ AuthProvider
                 └─ App
                      └─ RouterProvider
                      └─ Toaster (sonner)
```

**Why this order matters:**
- **Theme** must wrap everything so `dark` class is on `<html>` before any descendant paints (prevents FOUC).
- **Language** must wrap Auth so authenticated screens can localize errors/toasts.
- **Auth** must wrap App so route guards (`ProtectedRoute`) read store state after rehydration.
- `AuthProvider` **blocks render until persisted state has rehydrated** — prevents flash-of-redirect.

### Theme
- File: `src/shared/theme/ThemeProvider.tsx`
- API: `useTheme(): { theme, resolvedTheme, setTheme }`
- Two themes only: `"light" | "dark"`. Default is `"dark"`.
- Persisted to `localStorage` under `sprintifai.theme`.
- Legacy `"system"` storage values migrate silently to `"dark"`.
- FOUC prevented via inline `<script>` in `index.html` that reads localStorage and sets `<html class="dark">` before any React mount.

### Language
- File: `src/shared/i18n/LanguageProvider.tsx`
- API: `useLanguage(): { language, setLanguage, isRtl }`
- Two languages: **English** (default) and **Arabic** (RTL).
- Persisted to `localStorage` under `sprintifai.lang`.
- RTL switches `dir="rtl"` on `<html>`. All padding/margin uses logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`) so layout flips automatically.
- Directional icons (arrows, send, reply, forward) flip via the `.rtl-flip` class (`transform: scaleX(-1)` in `[dir="rtl"]`).

### Auth
- Source of truth: `useAuthStore` (`features/auth/store/authStore.ts`) with `persist` middleware (localStorage).
- Provider gate: `features/auth/AuthProvider.tsx` blocks children until rehydration completes.
- Selectors exported: `selectUser`, `selectIsAuthenticated`, `selectAuthStatus`, `selectVideoSdkToken`.
- Convenience hook: `useAuth()`.
- **Demo account (mock)**:
  - Email: `demo@sprintifai.com`
  - Password: `Sprintif@2026`

---

## 5. Routing & layouts

All routes in `src/shared/router/index.tsx` using react-router-dom v7 data router.

### Route tree

```
/                          — PublicLayout
  └─ /                     — LandingPage

/login                     — RedirectIfAuthenticated (bounces to /app if signed in)
/signup                    — RedirectIfAuthenticated
/forgot-password           — RedirectIfAuthenticated

/app                       — ProtectedRoute → AppLayout (sidebar + main)
  ├─ /app                  — FilesPage (index)
  ├─ /app/calendar         — CalendarPage
  ├─ /app/gmail            — GmailPage
  ├─ /app/meeting          — MeetingPage
  ├─ /app/chat             — ChatPage
  └─ /app/notifications    — NotificationsPage

/chat                      — Navigate to /app/chat (legacy alias)
*                          — NotFoundPage
```

### Layouts

- **`PublicLayout`** (`shared/layout/PublicLayout.tsx`) — wraps `/`. No chrome; the landing brings its own navbar + footer.
- **`AppLayout`** (`shared/layout/AppLayout.tsx`) — wraps `/app/*`. Contains:
  - Skip-link to `#main-content` (accessibility)
  - Persistent left `AppSidebar` (lg+) / `MobileNavSheet` (<lg)
  - Top user area: `UserMenu`, theme/language switchers
  - Mounts `CommandPalette`, `ShortcutsDialog`, `RouteTransition`
  - Mounts `useGlobalShortcuts()` once
- **`RouteTransition`** — wraps the `<Outlet />` and animates page changes with `motion/react` fade-up.

### Guards

- **`ProtectedRoute`** — reads `selectIsAuthenticated`. If false, redirects to `/login?from=<original>`.
- **`RedirectIfAuthenticated`** — inverse: if signed in, redirects to `/app`.

---

## 6. Design tokens (the system)

All tokens are CSS custom properties declared in `src/index.css` inside `@theme inline` blocks and `:root` / `.dark` blocks. **Never hardcode hex colors.** Always use semantic tokens.

### 6.1 Color philosophy

- **Neutral zinc base** (warmer than slate, not pure black). Off-black backgrounds, never `#000000`.
- **One high-contrast accent**: electric blue (`--ai` / `--ring`). Saturation kept below 80%.
- **Brand-gradient** (indigo → violet, via `--brand-from` → `--brand-to`) is reserved for **hero moments only**: logo, hero accent underline, auth brand panel, final CTA accent line.
- **AI surfaces** use `bg-ai-tint` + `text-ai` + `ring-ai/20`.

### 6.2 Surface tokens

| Token | Purpose |
|---|---|
| `--background` | Page background |
| `--surface` | Subtle off-background |
| `--surface-elevated` | Cards, popovers above surface |
| `--surface-muted` | Header rows, subtle insets |
| `--card`, `--popover` | Component-specific surfaces |

### 6.3 Text tokens

| Token | Purpose |
|---|---|
| `--foreground` | Primary text |
| `--muted-foreground` | Secondary text |
| `--card-foreground`, `--popover-foreground` | Inside those surfaces |

### 6.4 Border & ring tokens

| Token | Purpose |
|---|---|
| `--border` | Hairline default |
| `--border-strong` | Hover / emphasis |
| `--ring` | Focus ring (electric blue) |
| `--input` | Input border |

### 6.5 Accent tokens

| Token | Purpose |
|---|---|
| `--primary` | Buttons, active states |
| `--secondary` | Less-prominent buttons |
| `--accent` | Hover surface |
| `--destructive` | Delete, error |
| `--success` | Confirm, done |
| `--warning` | Alert |
| `--ai`, `--ai-foreground`, `--ai-tint` | AI-related UI (Chat, summaries, "From meeting" callouts) |
| `--brand-from`, `--brand-to` | Gradient stops (indigo, violet) — hero moments only |

### 6.6 Typography scale

12 steps, declared in `--text-*`:

| Token | Size |
|---|---|
| `--text-display-2xl` | 4.5rem (72px) |
| `--text-display-xl` | 3.75rem (60px) |
| `--text-display-lg` | 3rem (48px) |
| `--text-display-md` | 2.25rem (36px) |
| `--text-display-sm` | 1.875rem (30px) |
| `--text-heading-lg` | 1.5rem (24px) |
| `--text-heading-md` | 1.25rem (20px) |
| `--text-heading-sm` | 1.125rem (18px) |
| `--text-body-lg` | 1.0625rem (17px) |
| `--text-body-md` | 1rem (16px) |
| `--text-body-sm` | 0.875rem (14px) |
| `--text-body-xs` | 0.8125rem (13px) |
| `--text-caption` | 0.75rem (12px) |
| `--text-micro` | 0.6875rem (11px) |

**Fonts:**
- `--font-sans` → Geist + IBM Plex Sans Arabic (unicode-range scoped) + fallback stack
- `--font-mono` → Geist Mono
- `--font-display` → same as sans

**RTL refinements** (auto-applied via `[dir="rtl"]`):
- Body line-height bumped to 1.65 (Arabic needs more breathing room)
- Headings drop negative letter-spacing (Arabic doesn't benefit from tight tracking)

### 6.7 Radius scale

| Token | Value |
|---|---|
| `--radius-xs` | 6px |
| `--radius-sm` | 8px |
| `--radius-md` | 10px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-2xl` | 20px |
| `--radius-3xl` | 32px |
| `--radius-full` | 9999px |

### 6.8 Motion tokens

| Token | Value |
|---|---|
| `--ease-out-soft` | `cubic-bezier(0.32, 0.72, 0, 1)` — hover, press |
| `--ease-out-quart` | `cubic-bezier(0.16, 1, 0.3, 1)` — entry, reveal |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot |
| `--duration-fast` | 180ms |
| `--duration-base` | 280ms |
| `--duration-slow` | 480ms |
| `--duration-cinematic` | 800ms |

### 6.9 Breakpoints

| Token | Value | Purpose |
|---|---|---|
| `--breakpoint-xs` | 420px | Tiny phones / large smartwatches |
| `sm` | 640px | Tailwind default |
| `md` | 768px | Tailwind default |
| `lg` | 1024px | Tailwind default |
| `xl` | 1280px | Tailwind default |

### 6.10 Premium utilities (declared in `index.css`)

| Class | What |
|---|---|
| `.text-brand-gradient` | Indigo→violet gradient text fill |
| `.bg-brand-mesh` | Radial gradient mesh background |
| `.ring-hairline` | Inner highlight + hairline outer ring |
| `.shadow-diffusion` / `.shadow-diffusion-lg` | Soft, wide, tinted-to-bg shadow |
| `.surface-glass` | Refraction-grade glass effect |
| `.bg-grain` | Fixed grain overlay (`pointer-events: none`) |
| `.rtl-flip` | `transform: scaleX(-1)` only in RTL |
| `.ambient-pulse` | 3.2s breathing brightness loop for AI glyphs |
| `.spotlight-border` | Cursor-aware radial-mask border glow (used on bento cards) |
| `.skeleton-shimmer` | Travelling highlight for skeletons |

### 6.11 Custom keyframes

| Keyframe | Used by |
|---|---|
| `ambient-pulse` | AI sparkle icons |
| `skeleton-shimmer` | Skeleton loaders |
| `avatar-pop` | Hero trust avatar squircles |
| `mobile-menu-in` | Landing navbar mobile sheet drop |
| `menu-link-in` | Mobile menu staggered link reveal |

---

## 7. Design language — the patterns that make this product feel premium

### 7.1 Double-Bezel (nested enclosure)

Premium cards are never flat. They use a two-layer architecture:

- **Outer shell**: subtle background (`bg-foreground/[0.035]`), hairline ring (`ring-1 ring-inset ring-border`), padding `p-1.5` to `p-2`, large outer radius (`rounded-[2rem]`).
- **Inner core**: actual content. Distinct background (`bg-card`), inner highlight (`shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]`), mathematically-smaller radius (`rounded-[calc(2rem-0.375rem)]`) for concentric curves.

Used by: Hero mockup, MotionBento cards, Features hero mockup + 2×2 bento, FinalCta card, FinalCta mini-mockup, Footer brand block (lg+).

### 7.2 Diffusion shadow

Soft, wide, tinted to the background hue. Pattern:

```
shadow-[0_1px_2px_oklch(0_0_0/0.04),0_20px_40px_-22px_oklch(0_0_0/0.12)]
```

Bigger version for hero moments:

```
shadow-[0_1px_2px_oklch(0_0_0/0.04),0_40px_80px_-30px_oklch(0_0_0/0.22)]
```

Never use generic `shadow-md` / `shadow-lg`. Never tint shadows neon — keep them low opacity.

### 7.3 Hairline borders

`border border-border` only. Never `border-2`+. Borders separate, they don't decorate.

### 7.4 Tactile press

Every interactive element has `active:scale-[0.98]` (already baked into the Button primitive). On magnetic CTAs, the button also pulls slightly toward the cursor and scales down on press.

### 7.5 Custom easings only

**Banned:** `transition-all`, `linear`, `ease-in-out`. **Required:**
- `cubic-bezier(0.32, 0.72, 0, 1)` — soft (hover/press)
- `cubic-bezier(0.16, 1, 0.3, 1)` — quart (entry/reveal)
- GSAP: `power2.out`, `power3.out`, `power4.out`, `sine.inOut`
- Framer: `type: "spring", stiffness: 100-380, damping: 14-32`

Use the CSS tokens: `var(--ease-out-soft)`, `var(--ease-out-quart)`, `var(--ease-spring)`, `var(--duration-fast/base/slow/cinematic)`.

### 7.6 Viewport stability

**Always `min-h-[100dvh]`. Never `h-screen`.** iOS Safari changes viewport height when the address bar collapses, causing layout jumps. `dvh` (dynamic viewport height) prevents this.

### 7.7 Logical properties

Always `ps-*`, `pe-*`, `ms-*`, `me-*`, `border-s`, `border-e`. Never `pl-*` / `pr-*`. This makes RTL work automatically without per-component branches.

### 7.8 Anti-patterns (never do)

- `h-screen` (use `min-h-[100dvh]`)
- `transition-all duration-300` (be explicit, use custom easings)
- Hardcoded `#ffffff`, `#000`, `text-skyblue-500` (use tokens)
- Neon glow `box-shadow` on buttons
- Centered-text-over-dark-image heroes
- 3-equal-card feature rows (use zig-zag or 2×2 bento)
- `text-[24px]` arbitrary type sizes (use scale tokens)
- `text-brand-gradient` on large headers (banned — use a 3-5px accent line instead)
- Emojis anywhere (use Lucide icons)
- Generic names ("John Doe", "Acme Corp")
- Fake round numbers (`99.99%`, `50%`)
- `href="#"` dead links
- `useState` for hover physics or continuous animation (use Framer `useMotionValue`)

---

## 8. State management

### 8.1 Decision tree

| Scope | Tool |
|---|---|
| Local UI state (open/closed, hover, input value) | `useState` / `useReducer` |
| Cross-component within a single feature | Feature-local Zustand store |
| Global, persisted across reloads | `authStore` (only) |
| App-level providers (theme, language) | React Context (not for state — for stable identities) |

**No Redux. No global Context for state.**

### 8.2 Store inventory

| Store | File | Persisted? | Purpose |
|---|---|---|---|
| `useAuthStore` | `features/auth/store/authStore.ts` | Yes (localStorage) | User, JWT, VideoSDK token, hydration status |
| `useFilesStore` | `features/files/store/filesStore.ts` | No | Files list state, filters, view mode |
| `useChatStore` | `features/chat/store/chatStore.ts` | No | Conversations, active conversation, streaming flag |
| `useGmailStore` | `features/gmail/store/gmailStore.ts` | No | Folder, query, selectedThreadId, composeOpen |
| `useMeetingStore` | `features/meeting/store/meetingStore.ts` | No | Mic/cam state, participant name, autoRecord |
| `useNotificationsStore` | `features/notifications/store/notificationsStore.ts` | No | Notifications list, unread count |
| `useCommandPalette` | `shared/layout/command-palette-store.ts` | No | Palette open/close |
| `useShortcutsStore` | `shared/layout/shortcuts-store.ts` | No | Shortcuts dialog open/close |

### 8.3 Store conventions

- File name: `<noun>Store.ts` (camelCase, e.g. `filesStore.ts`).
- Hook name: `use<Noun>Store` (e.g. `useFilesStore`).
- Selectors exported separately: `selectUser`, `selectIsAuthenticated`, `selectActiveConversation`, etc. — keep components subscribed only to the slice they need.
- All store mutations live in the store. Components never set state directly with mutable references.

---

## 9. Data layer (mock-first)

Every feature has a `mock/` folder exposing the same API surface the real backend will expose. Components consume mock services via hooks (`useFiles`, `useThreads`, `useMockChat`, etc.).

### 9.1 Mock services

| Feature | Mock file |
|---|---|
| Auth | `features/auth/mock/mockAuth.ts` |
| Files | `features/files/mock/mockFilesService.ts` |
| Chat | `features/chat/mock/mockChatService.ts` + `models.ts` |
| Gmail | `features/gmail/mock/mockGmailService.ts` |
| Notifications | `features/notifications/mock/mockNotificationsService.ts` |
| Meeting | VideoSDK direct integration, no mock service file (token resolution in `features/meeting/api.js`) |

All mock services:
- Simulate realistic latency (200–1200ms) so loading states look real
- Store data **in-memory only** — refresh wipes everything
- One exception: `authStore` persists to localStorage so refresh keeps the user signed in

### 9.2 Backend swap path

When the real backend ships:

1. Replace the file in `features/<x>/mock/<service>.ts` with a real fetch-based client.
2. (Optional) Replace the hook (`useMockChat` → `useChat` from `@ai-sdk/react`).
3. **Nothing else changes.** Components import from the hook, not the mock.

This is the most important architectural decision in the codebase. Honor it.

---

## 10. i18n architecture

### 10.1 Setup

- File: `src/shared/i18n/index.ts` — i18next config with language detector.
- Resources bundled in `src/shared/i18n/resources.ts`.
- Two languages: `en` (default), `ar` (RTL).
- Persisted to `localStorage` under `sprintifai.lang`.

### 10.2 Namespaces (one JSON per feature, per language)

| Namespace | Used by |
|---|---|
| `common` | App-wide actions, nav labels, time helpers, accessibility strings |
| `landing` | Public marketing landing |
| `auth` | Login/signup/forgot-password copy |
| `files` | Files workspace |
| `chat` | Chat AI |
| `calendar` | Calendar |
| `meeting` | VideoSDK meeting UI |
| `gmail` | Inbox / Gmail |
| `notifications` | Notifications page + bell |
| `errors` | Error messages |

### 10.3 Usage rules

- All user-facing strings must use `t('namespace.key')`.
- Use `useTranslation('files')` for a feature-specific namespace; `useTranslation()` (no arg) for `common`.
- Keys are `camelCase`, **namespaced by feature**.
- Arabic gets full ICU pluralization (`_one`, `_two`, `_few`, `_many`, `_other`).
- Date/number formatting via `Intl.DateTimeFormat` (locale from `useLanguage().language`).
- RTL is **automatic** if you use logical properties.

### 10.4 Arabic typography

- Font: **IBM Plex Sans Arabic**, self-hosted in `public/fonts/` (Thin → Bold, 7 weights as TTF).
- Each `@font-face` is **`unicode-range` scoped** to Arabic blocks (`U+0600-06FF`, `U+0750-077F`, etc.) so English-only sessions don't download the files.
- Latin glyphs continue to use Geist; Arabic glyphs fall through to IBM Plex Sans Arabic.
- See `src/shared/i18n/README.md` for full details.

---

## 11. Animation philosophy

### 11.1 The two engines (never mixed in one component tree)

| Engine | Used for | Where |
|---|---|---|
| **Framer Motion v12** (`motion/react`) | UI/component interactions, perpetual micro-motion, magnetic hover, layout transitions | Hero magnetic CTA, Hero tilt mockup, MotionBento cards, Features bento, FinalCta entry, LandingNavbar mobile sheet |
| **GSAP 3** + ScrollTrigger | Scroll-bound timelines, pinned scrub, page-level scrolltelling | Hero entry timeline + underline draw, Features section reveals (where applicable), FinalCta scroll reveal |

**Rule:** Within a single component tree, pick one. Never both. The two have conflicting transform stacks.

### 11.2 Required disciplines

- **Hardware-accelerated only.** Animate `transform` and `opacity` (and `filter: blur(...)` for reveal blur). Never `top`/`left`/`width`/`height`.
- **`will-change: transform`** only on elements that are actively animating; never as a default.
- **Reduced motion is mandatory.** Every animation block must wrap GSAP in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch that returns early. Framer Motion honors `prefers-reduced-motion` natively.
- **Continuous loops live in memo'd leaf components.** Never trigger re-renders in a parent due to perpetual animation.
- **Spring physics.** No linear easing on interactive feedback. Defaults: `stiffness: 100-380`, `damping: 14-32`, `mass: 0.4-0.7`.
- **No `window.addEventListener('scroll')`.** Use ScrollTrigger (GSAP) or IntersectionObserver. Scroll listeners cause continuous reflows on mobile.
- **`backdrop-blur` only on fixed/sticky elements.** Never on scrolling containers — GPU repaint death.

### 11.3 Patterns in use

| Pattern | Implementation | Example |
|---|---|---|
| Magnetic hover | Framer `useMotionValue` + `useSpring` + `useTransform` | `features/landing/components/hero/HeroMagneticCta.tsx` |
| Parallax tilt | Framer transforms with `transformPerspective: 1200` | `features/landing/components/hero/HeroTiltMockup.tsx` |
| Layout sliding indicator | Framer `layoutId` shared element | Landing navbar active pill |
| Scroll-spy | IntersectionObserver | Landing navbar `useEffect` |
| Pinned scrub timeline | GSAP ScrollTrigger `scrub: 0.6, pin: true` | (formerly in HowItWorks — removed) |
| Smooth-scroll | `scrollIntoView({ behavior: "smooth" })` with reduced-motion fallback | Landing navbar section links |
| Body scroll lock | `document.body.style.overflow = "hidden"` | Mobile menu open state |
| List re-order | Framer `layout` + `layoutId` per item | MotionBento Intelligent List card |
| Typewriter | `useEffect` interval cycling phases | MotionBento Command Input card |
| Overshoot badge | Framer `AnimatePresence` + spring with `stiffness: 320, damping: 14` | MotionBento Live Status card, Features Inbox card |
| SVG underline draw-in | GSAP `strokeDashoffset` tween | Hero "outcome" accent |
| Cursor-aware spotlight border | CSS variables + radial-gradient mask | `.spotlight-border` utility |

---

## 12. Landing page composition

File map:

```
features/landing/components/
├── layout/
│   ├── LandingNavbar.tsx      — Floating pill nav + scroll-spy + section links
│   └── LandingFooter.tsx      — Single-line minimal footer
├── hero/
│   ├── HeroMagneticCta.tsx    — Primary CTA with magnetic pull
│   ├── HeroTiltMockup.tsx     — Double-Bezel + parallax tilt wrapper
│   └── HeroTrustAvatars.tsx   — 5 squircle SVG-initial avatars
└── sections/
    ├── Hero.tsx               — Centered hero with SVG underline accent
    ├── MotionBento.tsx        — 3-card bento with perpetual motion
    ├── Features.tsx           — 1 hero zig-zag + 2x2 bento
    └── FinalCta.tsx           — Light split panel, no dark island
```

Composed in `src/pages/Landing.tsx`:

```
LandingNavbar → Hero → MotionBento → Features → FinalCta → LandingFooter
```

### 12.1 Section IDs (for navbar smooth-scroll)

| Section | `id` | scroll-mt |
|---|---|---|
| Hero | `#hero` | `scroll-mt-24` |
| MotionBento | `#motion-bento` | `scroll-mt-24` |
| Features | `#features` | `scroll-mt-24` |
| FinalCta | `#get-started` | `scroll-mt-24` |

### 12.2 LandingNavbar features

- Floating pill (`fixed inset-x-0 top-3 sm:top-4 z-40`).
- Glass effect intensifies on scroll past 24px (`backdrop-blur-md → -xl`).
- Three desktop pill links: Features / Live / Start.
- **Active indicator** uses Framer `layoutId="nav-active-pill"` — physically slides between pills.
- **Scroll-spy** via single IntersectionObserver (`rootMargin: "-20% 0px -60% 0px"`).
- **Smooth-scroll handler** overrides default anchor jump; respects `prefers-reduced-motion`; works cross-route (navigates to `/` first if on auth pages).
- **Mobile menu** (`<lg`): Fluid-Island hamburger morph (two lines rotate into X), `AnimatePresence` drop, staggered link reveal, body scroll lock when open, active row has breathing AI dot.

### 12.3 Hero features

- Centered layout (deliberately overriding the high-variance directive — premium polish makes it work).
- Live pill eyebrow with breathing dot: `"Live · 1,247 meetings recapped today"`.
- H1 with **SVG hand-drawn-feel underline** under the last word ("outcome") — `stroke-dasharray` draw-in over 1.1s. No text-fill gradient.
- Magnetic primary CTA + outline secondary CTA.
- 5-avatar trust row with composed entrance (`avatar-pop` keyframe staggered 70ms).
- Mockup wrapped in Double-Bezel with parallax tilt on `lg+` only.

### 12.4 MotionBento — the perpetual motion section

Three memo'd leaf cards, each with infinite micro-motion:

1. **Intelligent List** — 4 tasks auto-re-sort every 2.6s using Framer `layout` + `layoutId` with spring physics. Simulates AI re-prioritisation.
2. **Command Input** — typewriter cycle through 4 prompts: typing → thinking (shimmer lines) → answer pill → deleting → next prompt.
3. **Live Status** — breathing "now" dot + overshoot badge that pops in every 3.2s reading "Recap ready".

Every card uses Double-Bezel + spotlight border on hover. Labels live outside-and-below per the bento paradigm.

### 12.5 Features section

- **Top: Meetings as hero zig-zag** — wider mockup with live transcript, "Speaking" badge, 3-up metrics strip.
- **Bottom: 2×2 asymmetric bento** for Chat AI / Calendar / Files / Inbox. Each card has its own perpetual micro-motion (chat cursor blink, calendar pulsing now-dot, files shimmer line, inbox spring-overshoot badge every 3s).

### 12.6 FinalCta

- **No dark island.** Same `bg-card` surface as the rest of the page, Double-Bezel shell.
- 60/40 asymmetric split: copy left, AI Recap mini-mockup right.
- Brand-gradient appears only as a 4px draw-in accent line under the H2.
- Uses the same `HeroMagneticCta` for primary action.

### 12.7 LandingFooter (minimal)

One centered horizontal row, mono font:

```
© 2026 SprintifAI · Meetings that ship outcomes · team@sprintifai.com
```

With a brand-gradient hairline at the top edge. No link farm.

---

## 13. App shell (`/app/*`)

### 13.1 AppLayout structure

`src/shared/layout/AppLayout.tsx` composes:

```
┌─────────────────────────────────────────────────────────────────┐
│ <a href="#main-content"> Skip to main </a>                      │
├──────────┬──────────────────────────────────────────────────────┤
│          │  Top: page header (via PageHeader shared component)  │
│ AppSide  │                                                       │
│   bar    │  <main id="main-content"> RouteTransition + Outlet   │
│ (lg+)    │                                                       │
│          │                                                       │
└──────────┴──────────────────────────────────────────────────────┘
+ MobileNavSheet (<lg)
+ CommandPalette (always mounted, opens via ⌘K)
+ ShortcutsDialog (always mounted, opens via ?)
+ useGlobalShortcuts() — registered once
```

### 13.2 Sidebar navigation

Items in `AppSidebar.tsx`:
- Files — `/app`
- Calendar — `/app/calendar`
- Inbox — `/app/gmail`
- Meeting — `/app/meeting`
- Chat AI — `/app/chat`
- Notifications — `/app/notifications`

Each item shows the lucide icon, label (i18n), and an active indicator when the current route matches.

### 13.3 Command palette

- File: `shared/layout/CommandPalette.tsx`
- Trigger: ⌘K / Ctrl+K (handled inside the palette via `window.addEventListener("keydown")` in its own effect)
- Contains: Navigation entries (Home, Files, Meeting, Calendar, Chat, Inbox, Notifications), theme entries (Light, Dark), language entries (English, Arabic)
- Uses `cmdk` library, customised to match design tokens

### 13.4 Keyboard shortcuts

Registered in `src/shared/hooks/useGlobalShortcuts.ts` once per AppLayout mount:

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `?` | Shortcuts help dialog |
| `g` then `f` | Files |
| `g` then `c` | Calendar |
| `g` then `m` | Meeting |
| `g` then `a` | Chat AI |
| `g` then `i` | Inbox |
| `g` then `h` | Landing |

The `g` leader has an 800ms timeout. Honors input focus — does **not** hijack when typing in `<input>`, `<textarea>`, `<select>`, or `contentEditable` elements.

### 13.5 RouteTransition

`shared/layout/RouteTransition.tsx` wraps the `<Outlet />` with a `motion/react` fade-up between routes. Uses location pathname as the key so AnimatePresence picks up changes.

---

## 14. Feature deep-dives

### 14.1 Auth (`features/auth/`)

- **Pages**: `LoginPage`, `SignupPage`, `ForgotPasswordPage`. All wrapped in `AuthLayout` which provides the split (form panel + brand panel).
- **Forms**: react-hook-form + Zod schemas in `schemas/`.
- **Store**: `authStore.ts` — user, status (`"idle" | "loading" | "authenticated" | "unauthenticated"`), VideoSDK token. Persisted via `zustand/middleware`.
- **Mock**: `mockAuth.ts` exposes `login(email, password)`, `signup(...)`, `requestPasswordReset(...)`. Demo account hardcoded.
- **Provider**: `AuthProvider.tsx` blocks render until `useAuthStore.persist.hasHydrated()` resolves — eliminates the flash-of-redirect on cold load.

### 14.2 Files (`features/files/`) — the workspace home

- Route: `/app` (index).
- **Components**: `FilesToolbar`, `FileRow`, `FilesEmptyState`, `FileKindIcon`.
- **Reference for**: search + filter + view toggle patterns.
- Toolbar exposes: search input, kind filter, view mode (grid/list), sort.
- `FileRow` is mobile-tightened (drops the size column on `<sm`, mobile meta strip, `min-h-[52px]` on mobile).

### 14.3 Chat (`features/chat/`) — AI streaming

- Route: `/app/chat`.
- **Layout**: collapsible left sidebar (`ConversationSidebar`) + main column with `MessageList` + `ChatInput`.
- **Mobile**: sidebar becomes a left-side `Sheet` triggered by a hamburger button in the chat header. Sheet auto-closes when the active conversation changes (via `useEffect` watching `activeConversationId`).
- **Streaming**: `useMockChat.ts` hook simulates token-by-token streaming with realistic pacing. When the real backend ships, swap this hook for `useChat` from `@ai-sdk/react` — components stay unchanged.
- **ChatInput**: auto-resizing textarea, send on Enter (Shift+Enter = newline), stop button when streaming, safe-area padding for iOS home indicator (`pb-[max(1rem,env(safe-area-inset-bottom))]`).

### 14.4 Calendar (`features/calendar/`)

- Route: `/app/calendar`.
- Wraps **FullCalendar v6** with custom styling overrides in `styles/`.
- **EventForm** (`components/event/EventForm.tsx`) is the reference implementation for form-heavy UI in this codebase.
- **`ResponsiveModal`** (`components/ui/ResponsiveModal.tsx`) — on `< 1200px` collapses the events list panel into a floating-action-button + Sheet. FAB sits bottom-end with safe-area padding.

### 14.5 Meeting (`features/meeting/`) — VideoSDK shell

- Route: `/app/meeting`.
- **Legacy `.jsx` files** present — not migrated to TypeScript yet. Don't touch unless rewriting the whole feature.
- Token resolution: `features/meeting/api.js` reads `videoSdkToken` from `authStore.user`, falls back to `VITE_VIDEOSDK_TOKEN` env var.
- **`PreJoinScreen.tsx`** — modern TypeScript surface, mic/cam toggles + device pickers + auto-record toggle. Device pickers wrap to their own row on `<sm`.
- `// @ts-expect-error` in `src/pages/Meeting.tsx` is intentional (legacy types).

### 14.6 Gmail (`features/gmail/`) — Inbox

- Route: `/app/gmail`. Label in nav: "Inbox" (i18n).
- **Layout**: left folder rail (`FolderRail`) + thread list + thread view (`ThreadView`). Reference for list+detail-pane patterns.
- **Mobile**:
  - Folder rail hidden, replaced with horizontal scrollable `MobileFolderPills` above the thread list
  - Single-pane navigation: if `selectedThreadId` is set, only `ThreadView` renders (with a "← Inbox" back button); otherwise only the list renders
  - `ComposeDrawer` footer uses safe-area padding
- **AI features**: thread summarization (`summarizeThread()` mock), AI Summary card with `Sparkles` glyph and `ambient-pulse` animation.

### 14.7 Notifications (`features/notifications/`)

- Route: `/app/notifications`.
- Notifications store supports filtering by kind (`"meeting" | "calendar" | "files" | "chat" | "gmail" | "system"`).
- Simulated arrival via `useSimulatedArrival.ts` — periodically pushes a new notification to demo the unread badge.

### 14.8 Landing (`features/landing/`)

See **Section 12** for full landing composition. No store, no mock data — fully static + animation-heavy.

---

## 15. Naming conventions

| Thing | Convention |
|---|---|
| Folders (multi-word) | `kebab-case` (e.g. `features/files/`) |
| Folders (single word) | `lowercase` (e.g. `features/auth/`) |
| React components (file + export) | `PascalCase.tsx` (e.g. `FileRow.tsx`) |
| Hooks (file) | `useCamelCase.ts` (e.g. `useFiles.ts`) |
| Stores (file) | `<noun>Store.ts` (e.g. `filesStore.ts`) |
| Utilities (file) | `kebab-case.ts` (e.g. `file-meta.ts`) |
| Components (export) | `PascalCase` |
| Hooks (export) | `useCamelCase` |
| Constants (export) | `SCREAMING_SNAKE_CASE` |
| Types | `PascalCase` (prefer `type` for unions/intersections; `interface` for object shapes is fine) |
| i18n keys | `camelCase`, namespaced by feature |
| CSS class composition | Group by purpose using `cn()` with line breaks |

---

## 16. Accessibility

- **Skip link** at the top of `AppLayout` jumps to `#main-content`.
- **All icon-only buttons** have `aria-label`.
- **Form inputs** are paired with `<Label>` and have `aria-invalid` / `aria-describedby` for error state.
- **Animations honor `prefers-reduced-motion`** via `gsap.matchMedia()` and Framer Motion's built-in respect for the user preference.
- **Focus rings**: `ring-2 ring-ring` with `ring-offset-2 ring-offset-background`. Never removed without a `focus-visible:` replacement.
- **Color contrast**: foreground/background pairs from the token system are AA-compliant in both themes.
- **`aria-current="true"`** on active nav items (landing pill nav uses this).

---

## 17. Performance guardrails

1. **GPU-safe animations only.** Animate `transform`, `opacity`, `filter: blur(...)`. Never layout-triggering properties.
2. **`will-change: transform`** only on actively-animating elements. Never as a default.
3. **`backdrop-blur`** restricted to fixed/sticky surfaces (navbar). Never on scrolling content.
4. **Grain/noise overlays** only on fixed, `pointer-events: none` pseudo-elements.
5. **No `window.addEventListener('scroll')`** — use ScrollTrigger or IntersectionObserver.
6. **Memoize perpetual animations** in tiny client-component leaves. Never re-render a parent because of a child's animation tick.
7. **Code-split** is a future optimization. Current bundle: ~2.45 MB / ~710 KB gz. The Vite >500 KB warning is documented and accepted.

---

## 18. Build, lint, and quality gates

| Command | Purpose |
|---|---|
| `pnpm dev` | Vite dev server |
| `pnpm build` | `tsc -b && vite build` — produces `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint |

**Before every non-trivial commit:**
- `pnpm exec tsc -b` must pass with **zero TypeScript errors**.
- `pnpm exec vite build` must succeed.
- `pnpm lint` must have **zero errors** (warnings on shadcn primitives + Provider files are pre-existing and accepted).
- Never commit `.env` or secrets.

**Commit message format**: conventional commits (`feat(scope):`, `fix(scope):`, `refactor(scope):`, etc.).

---

## 19. Known issues / debt

| Issue | Status |
|---|---|
| `features/meeting/` has legacy `.jsx` files (hand-rolled icons, 800+ line components) | Don't touch unless rewriting the feature whole |
| `@headlessui/react` still in dependencies | Only used by legacy meeting. Don't import in new code. |
| `hero-video-dialog.tsx` under `components/ui/` is orphan | Kept for future meeting preview redesign |
| Vite >500 KB chunk warning | Code-splitting is a future optimization; not blocking |
| `Pure` annotation warnings from `@videosdk.live/react-sdk` | Library issue, harmless |

---

## 20. Reference implementations

When in doubt, read these first:

| Pattern | Reference |
|---|---|
| Form-heavy UI | `features/calendar/components/event/EventForm.tsx` |
| List + detail pane | `features/gmail/` (entire feature) |
| Streaming / AI | `features/chat/hooks/useMockChat.ts` |
| Search + filter + view toggle | `features/files/components/FilesToolbar.tsx` |
| Magnetic CTA | `features/landing/components/hero/HeroMagneticCta.tsx` |
| Parallax tilt | `features/landing/components/hero/HeroTiltMockup.tsx` |
| Perpetual micro-motion in cards | `features/landing/components/sections/MotionBento.tsx` |
| Spotlight border | `.spotlight-border` utility in `src/index.css` |
| Double-Bezel | `MotionBento.tsx` `BentoShell`, `Features.tsx` `DoubleBezel`, `FinalCta.tsx` outer card |
| GSAP scroll timeline | `features/landing/components/sections/Hero.tsx` |
| IntersectionObserver scroll-spy | `features/landing/components/layout/LandingNavbar.tsx` |

---

## 21. When in doubt

Match the convention. Consistency beats novelty.

If you find yourself fighting the design system, the system is right and you're wrong — until you can argue for the exception in plain prose. Then update this document.
