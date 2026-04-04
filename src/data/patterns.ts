import type { Pattern } from '@/types/pattern'
import hazyWhisper from './hazyWhisper'
import birdNest from './birdNest'
import buddySnowman from './buddySnowman'
import miniLamb from './miniLamb'
import rustRhythmBandana from './rustRhythmBandana'
import twistedLoveBeret from './twistedLoveBeret'
import copperCrest from './copperCrest'
import cellaCardigan from './cellaCardigan'
import cellaWrap from './cellaWrap'

export const ALL_PATTERNS: Pattern[] = [
  hazyWhisper,
  copperCrest,
  cellaCardigan,
  cellaWrap,
  twistedLoveBeret,
  rustRhythmBandana,
  buddySnowman,
  birdNest,
  miniLamb,
]

export function getPatternById(id: string): Pattern | undefined {
  return ALL_PATTERNS.find((p) => p.id === id)
}
