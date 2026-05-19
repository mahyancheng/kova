# Kova Sun Shade

Marketing site for Kova Sun Shade — Roller Blinds, Venetian Blinds, and VertiSheer.
Built as a single-page Vite + React + TypeScript app with Tailwind v4.

The design language is "Anthropic meets Apple": warm cream background, serif
display type (Fraunces), brown accent, generous whitespace, sticky-scroll
product spotlights, and a tasteful floating quote CTA.

## Stack

- **Vite 6** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- Custom React Context i18n (no external i18n library)
- Pure SVG product illustrations (no image dependencies)

## Run locally

```bash
npm install
npm run dev      # http://127.0.0.1:5180
npm run build    # type-check + production bundle in ./dist
npm run preview  # serve the production build
```

## Project structure

```
src/
├── App.tsx                    # composes all sections + LangProvider
├── main.tsx
├── index.css                  # Tailwind v4 + design tokens
├── components/
│   ├── Nav.tsx                # fixed top nav with EN/BM toggle
│   ├── PromoBar.tsx           # dismissible "factory-direct" banner
│   ├── Hero.tsx               # oversized centered hero
│   ├── FactoryDirect.tsx      # supply-chain pitch + diagram
│   ├── Philosophy.tsx
│   ├── Collection.tsx         # 3 product cards
│   ├── Marquee.tsx
│   ├── ProductSpotlight.tsx   # Apple-style sticky-scroll product section
│   ├── Compare.tsx            # product comparison table
│   ├── Fabrics.tsx            # horizontal swipeable swatch library
│   ├── Spaces.tsx             # room-to-product pairings
│   ├── Process.tsx
│   ├── Contact.tsx            # form + studio info
│   ├── Footer.tsx
│   ├── StickyQuote.tsx        # floating "Get a quote" pill
│   ├── LanguageToggle.tsx
│   ├── ImageSlot.tsx          # placeholder/photo container
│   ├── Reveal.tsx             # IntersectionObserver-based scroll reveal
│   └── visuals/               # SVG product illustrations
├── hooks/
│   └── useInView.ts
└── lib/
    ├── utils.ts
    └── i18n/
        ├── index.tsx          # LangProvider + useT() hook
        ├── en.ts              # English dictionary (SEO-targeted copy)
        └── ms.ts              # Bahasa Malaysia dictionary
```

## Design tokens

Strict neutral palette — black, warm white, and brown only.

| Token | Value | Use |
| --- | --- | --- |
| `--color-cream` | `#F1EDE3` | page background |
| `--color-cream-light` | `#F7F4EB` | alt section background |
| `--color-ink` | `#1A1714` | primary text |
| `--color-clay` | `#8B5A3C` | brown accent (primary) |
| `--color-clay-deep` | `#5D3A1F` | hover/emphasis |
| `--color-clay-light` | `#C9986B` | brown on dark backgrounds |
| `--color-sand` | `#C9B392` | wheat-brown |

Typography: Fraunces (serif headlines, italic emphasis) + Inter (body).

## i18n

The site supports English and Bahasa Malaysia via a small custom Context-based
i18n layer in `src/lib/i18n/`. Default language is hard-coded to English on
first paint so SEO crawlers always see the English copy before any JS runs;
the user's manual choice is then persisted to `localStorage` under `kova-lang`.

To add a new string:

1. Add the key + English value to `src/lib/i18n/en.ts`
2. Add the matching Malay translation to `src/lib/i18n/ms.ts`
3. Read it in any component with `const t = useT(); t.someSection.someKey`

The `Dict` type is inferred from `en.ts`, so missing keys in `ms.ts` will
surface as TypeScript errors at build time.

## Adding real photography

Every photographable surface goes through `<ImageSlot>`. Find the slot, add
the `src` prop, and the SVG placeholder visual underneath automatically hides.

```tsx
<ImageSlot ratio="21/9" label="Hero" tone="sand" src="/photos/hero.jpg" />
```

Drop your photos into `public/photos/` (or any path served by Vite) and
reference them with absolute paths.

## Notes on SEO

Product feature titles, descriptions, "Perfect for" room lists, and product
taglines under `src/lib/i18n/en.ts > products` are the keyword-targeted copy.
Edit with care.
