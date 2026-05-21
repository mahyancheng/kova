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
 * Roller blind fabric library — banded roller fabric in the same W-coded
 * colour family as the Venetian wood finishes (so customers can pair them
 * across a room). Each has a real Kova room shot with the fabric installed.
 */
export const ROLLER_FABRICS: Fabric[] = [
  {
    name: "W101 Alpine White",
    hex: "#F1ECE3",
    shadowHex: "#D8D2C2",
    highlightHex: "#FBF9F2",
    image: "/textures/roller/w101-alpine-white.svg",
    sceneImage: "/scenes/roller/w101-alpine-white.png",
  },
  {
    name: "W301 Pearl River",
    hex: "#D6CFC2",
    shadowHex: "#B5AC9C",
    highlightHex: "#EAE4D6",
    image: "/textures/roller/w301-pearl-river.png",
    sceneImage: "/scenes/roller/w301-pearl-river.png",
  },
  {
    name: "W302 Agate Grey",
    hex: "#C9BFA8",
    shadowHex: "#A89D87",
    highlightHex: "#E0D8C5",
    image: "/textures/roller/w302-agate-grey.png",
    sceneImage: "/scenes/roller/w302-agate-grey.png",
  },
  {
    name: "W206 Mahogany Teak",
    hex: "#5B2E1F",
    shadowHex: "#3A1C12",
    highlightHex: "#7E4732",
    image: "/textures/roller/w206-mahogany-teak.png",
    sceneImage: "/scenes/roller/w206-mahogany-teak.png",
  },
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
    sceneImage: "/scenes/venetian/w101-alpine-white.png",
  },
  {
    name: "W301 Pearl River",
    hex: "#D6CFC2",
    shadowHex: "#B5AC9C",
    highlightHex: "#EAE4D6",
    image: "/textures/venetian/w301-pearl-river.png",
    sceneImage: "/scenes/venetian/w301-pearl-river.png",
  },
  {
    name: "W302 Agate Grey",
    hex: "#C9BFA8",
    shadowHex: "#A89D87",
    highlightHex: "#E0D8C5",
    image: "/textures/venetian/w302-agate-grey.png",
    sceneImage: "/scenes/venetian/w302-agate-grey.png",
  },
  {
    name: "W206 Mahogany Teak",
    hex: "#5B2E1F",
    shadowHex: "#3A1C12",
    highlightHex: "#7E4732",
    image: "/textures/venetian/w206-mahogany-teak.png",
    sceneImage: "/scenes/venetian/w206-mahogany-teak.png",
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
