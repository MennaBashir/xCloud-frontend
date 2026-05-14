# Theme — Design Tokens

All design tokens live in `src/index.css`. The system uses OKLCH-based semantic tokens with full light + dark support.

## Provider

`<ThemeProvider>` in `src/shared/theme/ThemeProvider.tsx` wraps the app and exposes:

```tsx
const { theme, resolvedTheme, setTheme } = useTheme();
```

- `theme`: `"light" | "dark"` — user's stored choice (defaults to `"dark"`)
- `resolvedTheme`: `"light" | "dark"` — same as `theme`; kept for API stability
- Persisted to `localStorage` under `sprintifai.theme`
- Legacy `"system"` values migrate silently to `"dark"`
- FOUC prevented via inline script in `index.html`

## Token reference

### Surfaces
| Token | Purpose |
|---|---|
| `--background` | Page background |
| `--surface` | Subtle off-background |
| `--surface-elevated` | Cards, popovers above surface |
| `--surface-muted` | Header rows, subtle insets |
| `--card`, `--popover` | Component-specific surfaces |

### Text
| Token | Purpose |
|---|---|
| `--foreground` | Primary text |
| `--muted-foreground` | Secondary text |
| `--card-foreground`, `--popover-foreground` | Inside those surfaces |

### Borders & rings
| Token | Purpose |
|---|---|
| `--border` | Hairline default |
| `--border-strong` | Hover / emphasis |
| `--ring` | Focus ring (electric blue) |
| `--input` | Input border |

### Accents
| Token | Purpose |
|---|---|
| `--primary` | Buttons, active states |
| `--secondary` | Less-prominent buttons |
| `--accent` | Hover surface |
| `--destructive` | Delete, error |
| `--success` | Confirm, done |
| `--warning` | Alert |

### AI accent
| Token | Purpose |
|---|---|
| `--ai` | AI feature color (electric blue) |
| `--ai-foreground` | Text on AI surface |
| `--ai-tint` | Very subtle blue wash |

Reserved for AI-related UI: Chat, AI summary cards, "From meeting" callouts, suggestion cards.

### Brand gradient
| Token | Purpose |
|---|---|
| `--brand-from` | Gradient stop (indigo) |
| `--brand-to` | Gradient stop (violet) |

Used only in: logo, hero h1 second line, auth brand panel, final CTA panel. Never on standard UI.

### Typography
| Token | Value |
|---|---|
| `--font-sans` | Geist (Latin) + IBM Plex Sans Arabic (Arabic glyphs) |
| `--font-mono` | Geist Mono |
| `--font-display` | Geist (same family) |

Type scale: `--text-display-2xl` (72px) → `--text-micro` (11px). 12 steps.

### Radius
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

### Motion
| Token | Value |
|---|---|
| `--ease-out-soft` | `cubic-bezier(0.32, 0.72, 0, 1)` |
| `--ease-out-quart` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--duration-fast` | 180ms |
| `--duration-base` | 280ms |
| `--duration-slow` | 480ms |
| `--duration-cinematic` | 800ms |

## Premium utilities

| Class | What |
|---|---|
| `.text-brand-gradient` | Indigo→violet gradient text fill |
| `.bg-brand-mesh` | Radial gradient mesh background |
| `.ring-hairline` | Inner highlight + hairline outer ring |
| `.shadow-diffusion` | Soft, wide, tinted-to-bg shadow |
| `.shadow-diffusion-lg` | Same, larger spread |
| `.surface-glass` | Refraction-grade glass effect |
| `.bg-grain` | Fixed grain overlay (pointer-events: none) |
| `.rtl-flip` | `transform: scaleX(-1)` only in RTL |

## Adding a new token

1. Add to the `@theme inline` block in `src/index.css` (the mapping layer)
2. Add value vars in `:root` (light) **and** `.dark` (dark) blocks
3. Use it via Tailwind utility class (e.g. `bg-my-new-token`)

## Anti-patterns

- ❌ Hardcoded hex colors (`#fff`, `#000`, `#3b82f6`)
- ❌ Skyblue references (`text-skyblue-500`, `bg-skyblue-50`) — those are legacy aliases that will be removed
- ❌ Pure black (`#000`) — use `oklch(0.14 0.005 255)` via `--background` in dark mode
- ❌ Glow box-shadows — use `.shadow-diffusion`
