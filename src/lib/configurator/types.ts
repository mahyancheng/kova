export type ProductId = "roller" | "venetian" | "vertisheer";

export type OpacityId =
  | "blackout"
  | "dim-out"
  | "sunscreen"
  | "light-filtering";

export type Fabric = {
  name: string;
  hex: string;
  /** Hex of the deeper fold/shadow colour for the same fabric. */
  shadowHex: string;
  /** Hex of the lighter highlight colour. */
  highlightHex: string;
  /**
   * Optional swatch image (URL relative to /public) — the circular fabric
   * sample photo that fills the swatch button. Falls back to flat hex if
   * the file is missing.
   */
  image?: string;
  /**
   * Optional full scene photo (URL relative to /public) — replaces the
   * illustrative SVG preview with a photograph of the actual material
   * installed in a room. Used for Venetian wood/faux-wood samples.
   */
  sceneImage?: string;
};

export type Configuration = {
  product: ProductId;
  fabric: Fabric;
  opacity: OpacityId;
};

/**
 * VertiSheer fabric library — dyed fabric panels, mostly neutral browns
 * and warm whites. Also acts as the generic fallback set.
 */
export const FABRICS: Fabric[] = [
  { name: "Linen Wheat", hex: "#D9C9A2", shadowHex: "#BFAA7C", highlightHex: "#EFE5CB" },
  { name: "Stone Mist", hex: "#C4BCA8", shadowHex: "#9F977F", highlightHex: "#E0D9C5" },
  { name: "Sandbar", hex: "#C8B68C", shadowHex: "#A99367", highlightHex: "#E1D4B0" },
  { name: "Bone", hex: "#EAE2CC", shadowHex: "#C9BFA1", highlightHex: "#F6F1DD" },
  { name: "Walnut", hex: "#8B5A3C", shadowHex: "#5D3A1F", highlightHex: "#B68463" },
  { name: "Tobacco", hex: "#A89072", shadowHex: "#7C684F", highlightHex: "#C5B49A" },
  { name: "Char", hex: "#3A382F", shadowHex: "#1F1E18", highlightHex: "#5C594D" },
  { name: "Inkwell", hex: "#2D2D2A", shadowHex: "#13130F", highlightHex: "#4A4A45" },
];

/**
 * Roller blind fabric library — 13 named fabrics from the Kova catalogue
 * spanning the Cenza, Denver, Dernise, Moma and Shiro lines. Each entry
 * carries the close-up swatch photo; scene previews will be added later
 * (until then the configurator falls back to the SVG room rendering).
 */
export const ROLLER_FABRICS: Fabric[] = [
  // Cenza — patterned weave
  { name: "Cenza Charcoal Grey", hex: "#4A4E55", shadowHex: "#2C2F34", highlightHex: "#6B6F76",
    image: "/textures/roller/cenza-charcoal-grey.webp",
    sceneImage: "/scenes/roller/cenza-charcoal-grey.webp" },
  { name: "Cenza Linen Stone",   hex: "#9A938A", shadowHex: "#736C63", highlightHex: "#B6AFA6",
    image: "/textures/roller/cenza-linen-stone.webp",
    sceneImage: "/scenes/roller/cenza-linen-stone.webp" },
  { name: "Cenza Pale Yellow",   hex: "#DCC36A", shadowHex: "#B19A48", highlightHex: "#EBD995",
    image: "/textures/roller/cenza-pale-yellow.webp",
    sceneImage: "/scenes/roller/cenza-pale-yellow.webp" },
  { name: "Cenza Red Apricot",   hex: "#BC4F36", shadowHex: "#8C3520", highlightHex: "#D27358",
    image: "/textures/roller/cenza-red-apricot.webp",
    sceneImage: "/scenes/roller/cenza-red-apricot.webp" },

  // Denver — woven plain
  { name: "Denver Cream",        hex: "#DCC9A8", shadowHex: "#B5A282", highlightHex: "#EEDFC2",
    image: "/textures/roller/denver-cream.webp",
    sceneImage: "/scenes/roller/denver-cream.webp" },
  { name: "Denver Beige",        hex: "#C0AC91", shadowHex: "#988568", highlightHex: "#D6C5AD",
    image: "/textures/roller/denver-beige.webp",
    sceneImage: "/scenes/roller/denver-beige.webp" },
  { name: "Denver Grey",         hex: "#82827D", shadowHex: "#5E5E5A", highlightHex: "#9F9F9A",
    image: "/textures/roller/denver-grey.webp",
    sceneImage: "/scenes/roller/denver-grey.webp" },
  { name: "Denver Graphite",     hex: "#4A4843", shadowHex: "#2C2A26", highlightHex: "#6B6963",
    image: "/textures/roller/denver-graphite.webp",
    sceneImage: "/scenes/roller/denver-graphite.webp" },

  // Shiro — soft texture
  { name: "Shiro Champagne",     hex: "#CFB789", shadowHex: "#A48E64", highlightHex: "#E1CDA8",
    image: "/textures/roller/shiro-champagne.webp",
    sceneImage: "/scenes/roller/shiro-champagne.webp" },
  { name: "Shiro Mink",          hex: "#A0907E", shadowHex: "#776A5C", highlightHex: "#BBAC98",
    image: "/textures/roller/shiro-mink.webp",
    sceneImage: "/scenes/roller/shiro-mink.webp" },
  { name: "Shiro Burgundy",      hex: "#6B2D2A", shadowHex: "#451A18", highlightHex: "#894542",
    image: "/textures/roller/shiro-burgundy.webp",
    sceneImage: "/scenes/roller/shiro-burgundy.webp" },

  // Blackout
  { name: "Moma Blackout Charcoal", hex: "#2F2D2A", shadowHex: "#181715", highlightHex: "#4A4844",
    image: "/textures/roller/moma-blackout-charcoal.webp",
    sceneImage: "/scenes/roller/moma-blackout-charcoal.webp" },
  { name: "Dernise Black",       hex: "#1F1E1B", shadowHex: "#0D0D0B", highlightHex: "#383631",
    image: "/textures/roller/dernise-black.webp",
    sceneImage: "/scenes/roller/dernise-black.webp" },
];

/**
 * VertiSheer Pivot fabric library — five vertical-louvre fabrics from the
 * Kova catalogue, ranging from warm whites through silver and beige to
 * ginger and dark anchor grey. Each entry carries the close-up swatch
 * photo plus the room scene preview.
 */
export const VERTISHEER_FABRICS: Fabric[] = [
  { name: "Pivot White",   hex: "#DED9D4", shadowHex: "#908D89", highlightHex: "#E9E6E3",
    image: "/textures/vertisheer/pivot-white.webp",
    sceneImage: "/scenes/vertisheer/pivot-white.webp" },
  { name: "Pivot Silver",  hex: "#AEA9A5", shadowHex: "#716D6B", highlightHex: "#CAC7C4",
    image: "/textures/vertisheer/pivot-silver.webp",
    sceneImage: "/scenes/vertisheer/pivot-silver.webp" },
  { name: "Pivot Beige",   hex: "#D5C6B4", shadowHex: "#8A8075", highlightHex: "#E3D9CE",
    image: "/textures/vertisheer/pivot-beige.webp",
    sceneImage: "/scenes/vertisheer/pivot-beige.webp" },
  { name: "Pivot Ginger",  hex: "#BBA38D", shadowHex: "#79695B", highlightHex: "#D2C3B4",
    image: "/textures/vertisheer/pivot-ginger.webp",
    sceneImage: "/scenes/vertisheer/pivot-ginger.webp" },
  { name: "Pivot Anchor",  hex: "#636164", shadowHex: "#403F41", highlightHex: "#99989A",
    image: "/textures/vertisheer/pivot-anchor.webp",
    sceneImage: "/scenes/vertisheer/pivot-anchor.webp" },
];

/**
 * Venetian wood / faux-wood finish library — physical W-coded samples from
 * the Kova catalogue. Photographed and colour-matched.
 */
export const VENETIAN_FABRICS: Fabric[] = [
  {
    // W101: swatch circle is generated (SVG) because user didn't supply one.
    // Scene photo IS the user's — they have a W101 Alpine White room shot.
    name: "W101 Alpine White",
    hex: "#F1ECE3",
    shadowHex: "#D8D2C2",
    highlightHex: "#FBF9F2",
    image: "/textures/venetian/w101-alpine-white.svg",
    sceneImage: "/scenes/venetian/w101-alpine-white.webp",
  },
  {
    name: "W301 Pearl River",
    hex: "#D6CFC2",
    shadowHex: "#B5AC9C",
    highlightHex: "#EAE4D6",
    image: "/textures/venetian/w301-pearl-river.webp",
    sceneImage: "/scenes/venetian/w301-pearl-river.webp",
  },
  {
    name: "W302 Agate Grey",
    hex: "#C9BFA8",
    shadowHex: "#A89D87",
    highlightHex: "#E0D8C5",
    image: "/textures/venetian/w302-agate-grey.webp",
    sceneImage: "/scenes/venetian/w302-agate-grey.webp",
  },
  {
    name: "W206 Mahogany Teak",
    hex: "#5B2E1F",
    shadowHex: "#3A1C12",
    highlightHex: "#7E4732",
    image: "/textures/venetian/w206-mahogany-teak.webp",
    sceneImage: "/scenes/venetian/w206-mahogany-teak.webp",
  },
];

/** Fabric set for a given product. Defaults to the general FABRICS list. */
export function getFabricsForProduct(p: ProductId): Fabric[] {
  if (p === "venetian") return VENETIAN_FABRICS;
  if (p === "roller") return ROLLER_FABRICS;
  if (p === "vertisheer") return VERTISHEER_FABRICS;
  return FABRICS;
}

/** Per-product opacity options. Indexed by product. */
export const OPACITY_OPTIONS: Record<ProductId, OpacityId[]> = {
  roller: ["blackout", "dim-out", "sunscreen", "light-filtering"],
  venetian: ["blackout", "dim-out", "light-filtering"],
  vertisheer: ["sunscreen", "light-filtering"],
};

/** Approximate "amount of light leaking through" used by the SVG overlays. 0 = opaque, 1 = sheer. */
export const OPACITY_LEVEL: Record<OpacityId, number> = {
  blackout: 0.0,
  "dim-out": 0.18,
  sunscreen: 0.42,
  "light-filtering": 0.6,
};

export const DEFAULT_CONFIGURATION: Configuration = {
  product: "roller",
  fabric: ROLLER_FABRICS[0]!,
  opacity: "sunscreen",
};
