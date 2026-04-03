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

export interface Instruction {
  id: string
  type: InstructionType
  label?: string
  text: string
  stitchCount?: number
  videoUrl?: string
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
