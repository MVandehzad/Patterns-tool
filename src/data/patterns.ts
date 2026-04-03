import type { Pattern } from '@/types/pattern'
import hazyWhisper from './hazyWhisper'
import birdNest from './birdNest'

export const ALL_PATTERNS: Pattern[] = [hazyWhisper, birdNest]

export function getPatternById(id: string): Pattern | undefined {
  return ALL_PATTERNS.find((p) => p.id === id)
}
