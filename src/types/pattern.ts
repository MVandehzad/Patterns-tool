export type CraftType = 'knitting' | 'crochet'
export type Category = 'sweater' | 'cardigan' | 'vest' | 'wrap' | 'cowl' | 'beret' | 'bandana' | 'toy' | 'decoration'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type InstructionType = 'round' | 'row' | 'note' | 'tip' | 'step' | 'attention'

export interface Yarn {
  id: string
  brand: string
  name: string
  colorCode: string
  colorName: string
  colorHex: string
  fiber: string
  weightGrams: number
  weightOz: number
  metersPerSkein: number
  yardsPerSkein: number
  /** One entry per size; single-element for one-size patterns */
  quantitiesPerSize: number[]
  notes?: string
}

export interface Tool {
  name: string
  icon: string
}

export interface Gauge {
  stitches: number
  rows: number
  needleOrHook: string
  stitch: string
}

export interface Measurement {
  label: string
  unitCm: string[]
  unitInch: string[]
}

export interface Abbreviation {
  short: string
  full: string
}

// ── Row Visualizer types ────────────────────────────────────────────
/** The character class of stitches in a segment */
export type StitchKind = 'k' | 'p' | 'sl'

/** Increase actions that can appear at a segment boundary */
export type IncreaseKind = 'M1R' | 'M1L' | 'M1RP' | 'M1LP'

/** Decorations that appear at the leading or trailing edge of a segment */
export interface SegmentBoundary {
  /** SM — renders a gold marker line + diamond ◆ */
  marker?: true
  /** M1x increase — renders an upward-arrow icon */
  increase?: IncreaseKind
}

/**
 * One horizontal band in the RowVisualizer track.
 * Width is proportional to the stitch count for the selected size.
 */
export interface RowSegment {
  /** Garment section name shown as a label below the band */
  section: string
  /**
   * Stitch counts indexed by size (matches pattern.sizes order).
   * Use a single-element array when the count is the same for all sizes.
   */
  counts: number[]
  /** Stitch character painted as the band texture */
  stitch: StitchKind
  /** Decorations that appear before (left of) this band */
  prefix?: SegmentBoundary
  /** Decorations that appear after (right of) this band */
  suffix?: SegmentBoundary
}

export interface Instruction {
  id: string
  type: InstructionType
  label?: string
  text: string
  stitchCount?: number
  videoUrl?: string
  /** When present, renders a RowVisualizer in place of plain text */
  segments?: RowSegment[]
  /**
   * Override round number for anatomy bar rendering.
   * When omitted SmartRowVisual parses the number from the label ("Round 5 (increase)" → 5).
   */
  anatomyRound?: number
}

export interface PatternSection {
  id: string
  name: string
  description?: string
  instructions: Instruction[]
}

// ── Construction metadata ─────────────────────────────────────────────────
/**
 * One named section of a raglan yoke (e.g. Front, Back, Left Sleeve).
 * Sections are listed in round order starting from the BOR marker.
 */
export interface RaglanSection {
  label: string
  /** Optional hex color for the anatomy bar segment */
  colorHint?: string
}

/**
 * Describes the mathematical structure of a top-down raglan yoke so the
 * frontend can dynamically compute stitch distributions at any round.
 *
 * Formula for section count after round N:
 *   increasesElapsed = ceil(N / increaseFrequency)
 *   count = startCounts[sizeIndex][sectionIndex] + increasesElapsed × 2
 */
export interface RaglanYokeMeta {
  type: 'raglan'
  /** Named sections in round order (e.g. [R Sleeve, Front, L Sleeve, Back]) */
  sections: RaglanSection[]
  /** Stitches in each raglan join column — usually 2 */
  raglansPerJoint: number
  /**
   * Starting stitch counts before any increase rounds.
   * Indexed as [sizeIndex][sectionIndex] — must match pattern.sizes length.
   */
  startCounts: number[][]
  /**
   * How often an increase round occurs.
   * 1 = every round, 2 = every other round (odd rounds), 4 = every 4th, etc.
   * Increases elapsed after round N = Math.ceil(N / increaseFrequency)
   */
  increaseFrequency: number
}

/** Union of all supported construction metadata types */
export type ConstructionMeta = RaglanYokeMeta

export interface Pattern {
  id: string
  sku: string
  name: string
  craft: CraftType
  category: Category
  difficulty: Difficulty
  designer: string
  year: number
  /** Display sizes e.g. ['1','2','3'] or ['One size'] */
  sizes: string[]
  ease?: string
  measurements: Measurement[]
  /** Primary image shown on the library card */
  coverImage?: string
  /** Gallery images shown in the fullscreen viewer */
  images?: string[]
  materials: {
    yarns: Yarn[]
    tools: Tool[]
  }
  gauge?: Gauge
  abbreviations: Abbreviation[]
  sections: PatternSection[]
  /**
   * Structural metadata used by SmartRowVisual to dynamically compute and
   * render stitch-anatomy bars for construction-heavy sections (yokes, bodies).
   * When present, relevant round/row instructions display a proportional bar
   * instead of technique pills — no manual segment data needed.
   */
  constructionMeta?: ConstructionMeta
  hashtags: string[]
  buyUrl: string
  /** Primary UI accent colour for this pattern */
  accentColor: string
  /** Short description shown on library card */
  coverDescription: string
}
