export type CraftType = 'knitting' | 'crochet'
export type Category = 'sweater' | 'cardigan' | 'wrap' | 'beret' | 'bandana' | 'toy'
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
}

export interface PatternSection {
  id: string
  name: string
  description?: string
  instructions: Instruction[]
}

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
  hashtags: string[]
  buyUrl: string
  /** Primary UI accent colour for this pattern */
  accentColor: string
  /** Short description shown on library card */
  coverDescription: string
}
