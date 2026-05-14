# i18n — Internationalization

Powered by `react-i18next` with two supported languages: **English** (default) and **Arabic** (RTL).

## Structure

```
src/shared/i18n/
├── index.ts                   — i18next config + Language helpers
├── resources.ts               — Bundles all locale JSON
├── LanguageProvider.tsx       — React provider; syncs <html lang> + dir
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── landing.json
    │   ├── auth.json
    │   ├── files.json
    │   ├── chat.json
    │   ├── calendar.json
    │   ├── meeting.json
    │   ├── gmail.json
    │   └── errors.json
    └── ar/
        └── (same 9 namespaces)
```

## Usage

### In components

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("files");          // feature-specific
  const { t: tc } = useTranslation();             // common (default ns)

  return (
    <button aria-label={tc("actions.save")}>
      {t("actions.upload")}
    </button>
  );
}
```

### Cross-namespace lookup

```tsx
t("auth:login.title")     // explicit namespace prefix
t("common:actions.save")  // same
```

### Pluralization

Use `count` interpolation; i18next selects the right plural form:

```tsx
t("table.messages", { count: thread.messages.length });
```

In EN locale:

```json
"messages_one": "{{count}} message",
"messages_other": "{{count}} messages"
```

In AR locale (full ICU):

```json
"messages_one": "رسالة واحدة",
"messages_two": "رسالتان",
"messages_few": "{{count}} رسائل",
"messages_many": "{{count}} رسالة",
"messages_other": "{{count}} رسالة"
```

### Interpolation

```tsx
t("preview.sharedBy", { name: "Priya" });
```

```json
"sharedBy": "Shared by {{name}}"
```

### Dates & numbers

Use `Intl.DateTimeFormat` with the current language:

```tsx
import { useLanguage } from "@/shared/i18n/LanguageProvider";

const { language } = useLanguage();
new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(date);
```

## Language provider

```tsx
const { language, direction, isRtl, setLanguage } = useLanguage();
```

- Persists choice to `localStorage` under `sprintifai.lang`
- Auto-detects on first load (`i18next-browser-languagedetector`)
- Updates `<html lang>` and `<html dir>` reactively
- FOUC prevention: inline script in `index.html` sets `dir` before React mounts

## RTL — automatic when you use logical properties

✅ Do:

```tsx
<div className="ps-4 pe-2 ms-auto border-s">…</div>
```

❌ Don't:

```tsx
<div className="pl-4 pr-2 ml-auto border-l">…</div>
```

For icons that should mirror in RTL (arrows, send, forward), add `.rtl-flip`:

```tsx
<ArrowRight className="size-4 rtl-flip" />
```

For Sheet (drawer) components that need to flip side:

```tsx
const { isRtl } = useLanguage();
<SheetContent side={isRtl ? "left" : "right"}>…</SheetContent>
```

## Adding a string

1. Add the key + EN value to the relevant namespace JSON in `locales/en/<ns>.json`
2. Add the AR translation to `locales/ar/<ns>.json` (mirror the structure exactly)
3. For plurals: include `_one`, `_other` at minimum (EN); add `_two`, `_few`, `_many` for AR
4. Use via `t('key.path')` in your component

## Adding a new namespace

1. Create `locales/en/<name>.json` and `locales/ar/<name>.json`
2. Import both in `resources.ts` and add them to the `resources` object
3. Add the namespace string to the `namespaces` array in `resources.ts`

## Adding a new language

1. Create `locales/<lang>/` with all 9 namespace JSONs
2. Add the language code to `SUPPORTED_LANGUAGES` in `index.ts`
3. If RTL: add to `RTL_LANGUAGES`
4. Add the entry to `LANGUAGE_LABELS` in `src/shared/components/LanguageSwitcher.tsx`
5. Update the FOUC script in `index.html` (`supported` array + `rtl` array)

## Anti-patterns

- ❌ Hardcoded user-facing strings (`"Save"`, `"Files"`)
- ❌ Concatenated translations (`{t("hello")} {name}`) — use interpolation
- ❌ Assumed left/right (use `start`/`end`)
- ❌ Forgetting to mirror an icon that signals direction (add `.rtl-flip`)
