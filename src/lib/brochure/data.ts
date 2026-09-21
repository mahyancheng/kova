/**
 * Brochure swatch + finish datasets, lifted verbatim from the client's
 * supplied HTML mockups (the `FABRICS` / `FIN` tables in each page's
 * script, plus the swatch library markup).
 *
 * These live here rather than in i18n on purpose: they are product names
 * and hex values, not translatable prose. The BM dictionary already keeps
 * fabric names in English ("Pivot Beige", "W206 Mahogany Teak"), so
 * duplicating them per-language would only invite the two copies to drift.
 *
 * `hex` is the mockup's swatch colour. The site's own photographic fabric
 * library still lives in lib/configurator/types.ts — it drives the /configurator
 * route and the quote prefill; `configuratorName` links a brochure swatch
 * back to that catalogue entry where the two refer to the same fabric.
 */

export type Swatch = {
  /** Name shown under the dot. */
  name: string;
  /** Small uppercase label under the name — the collection or material. */
  sub: string;
  hex: string;
  /** Matching `Fabric.name` in lib/configurator/types.ts, when one exists. */
  configuratorName?: string;
};

export type SwatchGroup = {
  /** Collection heading, e.g. "Cenza · sunscreen weave". */
  label: string;
  /** Weave/grain hint drawn over the dot. */
  dot: "weave" | "sheer" | "slat" | "wood";
  items: Swatch[];
};

/* ------------------------------------------------------------------ *
 * Roller
 * ------------------------------------------------------------------ */

/** Demo fabrics, keyed by opacity — the roller mockup's `FABRICS` table. */
export const ROLLER_DEMO_FABRICS = {
  sunscreen: [
    { name: "Cenza Charcoal Grey", hex: "#4A4E55", configuratorName: "Cenza Charcoal Grey" },
    { name: "Cenza Linen Stone", hex: "#9A938A", configuratorName: "Cenza Linen Stone" },
    { name: "Cenza Pale Yellow", hex: "#DCC36A", configuratorName: "Cenza Pale Yellow" },
    { name: "Cenza Red Apricot", hex: "#BC4F36", configuratorName: "Cenza Red Apricot" },
  ],
  dimout: [
    { name: "Denver Cream", hex: "#DCC9A8", configuratorName: "Denver Cream" },
    { name: "Denver Beige", hex: "#C0AC91", configuratorName: "Denver Beige" },
    { name: "Denver Grey", hex: "#82827D", configuratorName: "Denver Grey" },
    { name: "Denver Graphite", hex: "#4A4843", configuratorName: "Denver Graphite" },
    { name: "Shiro Champagne", hex: "#CFB789", configuratorName: "Shiro Champagne" },
    { name: "Shiro Mink", hex: "#A0907E", configuratorName: "Shiro Mink" },
    { name: "Shiro Burgundy", hex: "#6B2D2A", configuratorName: "Shiro Burgundy" },
  ],
  blackout: [
    { name: "Moma Charcoal", hex: "#2F2D2A", configuratorName: "Moma Blackout Charcoal" },
    { name: "Dernise Black", hex: "#1F1E1B", configuratorName: "Dernise Black" },
  ],
} as const satisfies Record<string, readonly { name: string; hex: string; configuratorName?: string }[]>;

export type RollerOpacityId = keyof typeof ROLLER_DEMO_FABRICS;

export const ROLLER_SWATCH_GROUPS: SwatchGroup[] = [
  {
    label: "Cenza · sunscreen weave",
    dot: "weave",
    items: [
      { name: "Charcoal Grey", sub: "Cenza", hex: "#4A4E55", configuratorName: "Cenza Charcoal Grey" },
      { name: "Linen Stone", sub: "Cenza", hex: "#9A938A", configuratorName: "Cenza Linen Stone" },
      { name: "Pale Yellow", sub: "Cenza", hex: "#DCC36A", configuratorName: "Cenza Pale Yellow" },
      { name: "Red Apricot", sub: "Cenza", hex: "#BC4F36", configuratorName: "Cenza Red Apricot" },
    ],
  },
  {
    label: "Denver · dim-out",
    dot: "weave",
    items: [
      { name: "Cream", sub: "Denver", hex: "#DCC9A8", configuratorName: "Denver Cream" },
      { name: "Beige", sub: "Denver", hex: "#C0AC91", configuratorName: "Denver Beige" },
      { name: "Grey", sub: "Denver", hex: "#82827D", configuratorName: "Denver Grey" },
      { name: "Graphite", sub: "Denver", hex: "#4A4843", configuratorName: "Denver Graphite" },
    ],
  },
  {
    label: "Shiro · dim-out, textured",
    dot: "weave",
    items: [
      { name: "Champagne", sub: "Shiro", hex: "#CFB789", configuratorName: "Shiro Champagne" },
      { name: "Mink", sub: "Shiro", hex: "#A0907E", configuratorName: "Shiro Mink" },
      { name: "Burgundy", sub: "Shiro", hex: "#6B2D2A", configuratorName: "Shiro Burgundy" },
    ],
  },
  {
    label: "Blackout",
    dot: "weave",
    items: [
      { name: "Moma Charcoal", sub: "Blackout", hex: "#2F2D2A", configuratorName: "Moma Blackout Charcoal" },
      { name: "Dernise Black", sub: "Blackout", hex: "#1F1E1B", configuratorName: "Dernise Black" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Venetian
 * ------------------------------------------------------------------ */

/** The venetian mockup's `FIN` table — finishes per material. */
export const VENETIAN_FINISHES = {
  alu: [
    { name: "Brushed Alloy", hex: "#B8BBBD" },
    { name: "Alpine White", hex: "#E8E4DA" },
    { name: "Champagne", hex: "#C9B99A" },
    { name: "Smoked Pewter", hex: "#6E7175" },
    { name: "Matte Black", hex: "#2B2B2C" },
  ],
  wood: [
    { name: "W101 Alpine White", hex: "#E8E4DA", configuratorName: "W101 Alpine White" },
    { name: "W301 Pearl River", hex: "#D2CCC0", configuratorName: "W301 Pearl River" },
    { name: "W302 Agate Grey", hex: "#8E8B85", configuratorName: "W302 Agate Grey" },
    { name: "W206 Mahogany Teak", hex: "#7A4B2C", configuratorName: "W206 Mahogany Teak" },
  ],
} as const satisfies Record<string, readonly { name: string; hex: string; configuratorName?: string }[]>;

export type VenetianMaterialId = keyof typeof VENETIAN_FINISHES;

export const VENETIAN_SWATCH_GROUPS: SwatchGroup[] = [
  {
    label: "W-series · timber & faux-timber",
    dot: "wood",
    items: [
      { name: "W101 Alpine White", sub: "Timber", hex: "#E8E4DA", configuratorName: "W101 Alpine White" },
      { name: "W301 Pearl River", sub: "Timber", hex: "#D2CCC0", configuratorName: "W301 Pearl River" },
      { name: "W302 Agate Grey", sub: "Timber", hex: "#8E8B85", configuratorName: "W302 Agate Grey" },
      { name: "W206 Mahogany Teak", sub: "Timber", hex: "#7A4B2C", configuratorName: "W206 Mahogany Teak" },
    ],
  },
  {
    label: "Aluminium",
    dot: "slat",
    items: [
      { name: "Brushed Alloy", sub: "Aluminium", hex: "#B8BBBD" },
      { name: "Alpine White", sub: "Aluminium", hex: "#E8E4DA" },
      { name: "Champagne", sub: "Aluminium", hex: "#C9B99A" },
      { name: "Smoked Pewter", sub: "Aluminium", hex: "#6E7175" },
      { name: "Matte Black", sub: "Aluminium", hex: "#2B2B2C" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * VertiSheer
 * ------------------------------------------------------------------ */

/** The vertisheer mockup's `FABRICS` array — the Pivot collection. */
export const VERTISHEER_DEMO_FABRICS = [
  { name: "Pivot White", hex: "#EDE9DF", configuratorName: "Pivot White" },
  { name: "Pivot Silver", hex: "#B9B7B0", configuratorName: "Pivot Silver" },
  { name: "Pivot Beige", hex: "#CBB89C", configuratorName: "Pivot Beige" },
  { name: "Pivot Ginger", hex: "#B57A4E", configuratorName: "Pivot Ginger" },
  { name: "Pivot Anchor", hex: "#4A4A48", configuratorName: "Pivot Anchor" },
] as const;

export const VERTISHEER_SWATCH_GROUPS: SwatchGroup[] = [
  {
    label: "Pivot · VertiSheer",
    dot: "sheer",
    items: [
      { name: "Pivot White", sub: "Sheer", hex: "#EDE9DF", configuratorName: "Pivot White" },
      { name: "Pivot Silver", sub: "Sheer", hex: "#B9B7B0", configuratorName: "Pivot Silver" },
      { name: "Pivot Beige", sub: "Sheer", hex: "#CBB89C", configuratorName: "Pivot Beige" },
      { name: "Pivot Ginger", sub: "Sheer", hex: "#B57A4E", configuratorName: "Pivot Ginger" },
      { name: "Pivot Anchor", sub: "Sheer", hex: "#4A4A48", configuratorName: "Pivot Anchor" },
    ],
  },
];

/** Multiply a hex colour by `m`, clamped — the mockups' `shade()` / `sh()`. */
export function shade(hex: string, m: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, Math.round(r * m))},${Math.min(255, Math.round(g * m))},${Math.min(255, Math.round(b * m))})`;
}
