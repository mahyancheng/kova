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
    image: "/textures/roller/cenza-charcoal-grey.jpg",
    sceneImage: "/scenes/roller/cenza-charcoal-grey.jpg" },
  { name: "Cenza Linen Stone",   hex: "#9A938A", shadowHex: "#736C63", highlightHex: "#B6AFA6",
    image: "/textures/roller/cenza-linen-stone.jpg",
    sceneImage: "/scenes/roller/cenza-linen-stone.jpg" },
  { name: "Cenza Pale Yellow",   hex: "#DCC36A", shadowHex: "#B19A48", highlightHex: "#EBD995",
    image: "/textures/roller/cenza-pale-yellow.jpg",
    sceneImage: "/scenes/roller/cenza-pale-yellow.jpg" },
  { name: "Cenza Red Apricot",   hex: "#BC4F36", shadowHex: "#8C3520", highlightHex: "#D27358",
    image: "/textures/roller/cenza-red-apricot.jpg",
    sceneImage: "/scenes/roller/cenza-red-apricot.jpg" },

  // Denver — woven plain
  { name: "Denver Cream",        hex: "#DCC9A8", shadowHex: "#B5A282", highlightHex: "#EEDFC2",
    image: "/textures/roller/denver-cream.jpg",
    sceneImage: "/scenes/roller/denver-cream.jpg" },
  { name: "Denver Beige",        hex: "#C0AC91", shadowHex: "#988568", highlightHex: "#D6C5AD",
    image: "/textures/roller/denver-beige.jpg",
    sceneImage: "/scenes/roller/denver-beige.jpg" },
  { name: "Denver Grey",         hex: "#82827D", shadowHex: "#5E5E5A", highlightHex: "#9F9F9A",
    image: "/textures/roller/denver-grey.jpg",
    sceneImage: "/scenes/roller/denver-grey.jpg" },
  { name: "Denver Graphite",     hex: "#4A4843", shadowHex: "#2C2A26", highlightHex: "#6B6963",
    image: "/textures/roller/denver-graphite.jpg",
    sceneImage: "/scenes/roller/denver-graphite.jpg" },

  // Shiro — soft texture
  { name: "Shiro Champagne",     hex: "#CFB789", shadowHex: "#A48E64", highlightHex: "#E1CDA8",
    image: "/textures/roller/shiro-champagne.jpg",
    sceneImage: "/scenes/roller/shiro-champagne.jpg" },
  { name: "Shiro Mink",          hex: "#A0907E", shadowHex: "#776A5C", highlightHex: "#BBAC98",
    image: "/textures/roller/shiro-mink.jpg",
    sceneImage: "/scenes/roller/shiro-mink.jpg" },
  { name: "Shiro Burgundy",      hex: "#6B2D2A", shadowHex: "#451A18", highlightHex: "#894542",
    image: "/textures/roller/shiro-burgundy.jpg",
    sceneImage: "/scenes/roller/shiro-burgundy.jpg" },

  // Blackout
  { name: "Moma Blackout Charcoal", hex: "#2F2D2A", shadowHex: "#181715", highlightHex: "#4A4844",
    image: "/textures/roller/moma-blackout-charcoal.jpg",
    sceneImage: "/scenes/roller/moma-blackout-charcoal.jpg" },
  { name: "Dernise Black",       hex: "#1F1E1B", shadowHex: "#0D0D0B", highlightHex: "#383631",
    image: "/textures/roller/dernise-black.jpg",
    sceneImage: "/scenes/roller/dernise-black.jpg" },
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
    sceneImage: "/scenes/venetian/w101-alpine-white.jpg",
  },
  {
    name: "W301 Pearl River",
    hex: "#D6CFC2",
    shadowHex: "#B5AC9C",
    highlightHex: "#EAE4D6",
    image: "/textures/venetian/w301-pearl-river.jpg",
    sceneImage: "/scenes/venetian/w301-pearl-river.jpg",
  },
  {
    name: "W302 Agate Grey",
    hex: "#C9BFA8",
    shadowHex: "#A89D87",
    highlightHex: "#E0D8C5",
    image: "/textures/venetian/w302-agate-grey.jpg",
    sceneImage: "/scenes/venetian/w302-agate-grey.jpg",
  },
  {
    name: "W206 Mahogany Teak",
    hex: "#5B2E1F",
    shadowHex: "#3A1C12",
    highlightHex: "#7E4732",
    image: "/textures/venetian/w206-mahogany-teak.jpg",
    sceneImage: "/scenes/venetian/w206-mahogany-teak.jpg",
  },
];

/** Fabric set for a given product. Defaults to the general FABRICS list. */
export function getFabricsForProduct(p: ProductId): Fabric[] {
  if (p === "venetian") return VENETIAN_FABRICS;
  if (p === "roller") return ROLLER_FABRICS;
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
