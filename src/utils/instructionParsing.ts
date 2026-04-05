/**
 * Shared parsing utilities for extracting visual data from instruction text.
 * Used by SmartRowVisual to drive its adaptive displays.
 */

/** Extract a single final stitch count from text like "… [24]" or "… [24 sts]" */
export function extractFinalCount(text: string): number | null {
  const m = text.match(/\[(\d{1,5})\s*(?:sts?)?\]\s*\.?\s*$/)
  return m ? parseInt(m[1], 10) : null
}

/**
 * Extract ALL stitch-count milestones embedded in text.
 * Matches "[X]" where X is 1–5 digits and not preceded by letters.
 * Safely skips "[k2, p2]" style brackets.
 */
export function extractAllCounts(text: string): number[] {
  const results: number[] = []
  // match [digits] or [digits sts] — must start with a digit, not a letter
  const re = /\[(\d{1,5})\s*(?:sts?)?\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    results.push(parseInt(m[1], 10))
  }
  return results
}

/** Count increase keywords in text */
export function countIncreases(text: string): number {
  const matches = text.match(
    /\b(M1R|M1L|M1LP|M1RP|kfb|m1r|m1l|m1lp|m1rp|m1)\b|\binc\b/gi,
  )
  return matches ? matches.length : 0
}

/** Count decrease keywords in text */
export function countDecreases(text: string): number {
  const matches = text.match(
    /\b(k2tog|ssk|K2togL|K2togR|p2tog|dec|cdd|k3tog)\b/gi,
  )
  return matches ? matches.length : 0
}

/** Detect row side: 'RS' | 'WS' | null */
export function detectSide(text: string): 'RS' | 'WS' | null {
  if (/\(RS\)|\bRS\b/.test(text)) return 'RS'
  if (/\(WS\)|\bWS\b/.test(text)) return 'WS'
  return null
}

/** Detect dominant stitch character */
export function detectStitchType(
  text: string,
): 'rib' | 'cable' | 'purl' | 'stockinette' | 'sc' | 'dc' | 'hdc' | 'garter' {
  const t = text.toLowerCase()
  if (/rib\b|k\d+,\s*p\d+|k2,\s*p2|k1,\s*p1/.test(t)) return 'rib'
  if (/cable\b|\bcn\b/.test(t)) return 'cable'
  if (/garter|\bknit every row\b/.test(t)) return 'garter'
  if (/\bhdc\b/.test(t)) return 'hdc'
  if (/\bdc\b/.test(t)) return 'dc'
  if (/\bsc\b/.test(t)) return 'sc'
  if (/\bpurl to\b|p to end/.test(t)) return 'purl'
  return 'stockinette'
}

/** True if the text mentions placing or slipping stitch markers */
export function hasMarkers(text: string): boolean {
  return /\b(PM|SM|place marker|slip marker)\b/i.test(text)
}
