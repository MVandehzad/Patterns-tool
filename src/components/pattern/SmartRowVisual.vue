<script setup lang="ts">
/**
 * SmartRowVisual — adaptive instruction visualizer.
 *
 * Chooses one of three display modes based on available data:
 *
 *  count-bar   — proportional fill bar for rounds/rows with a known stitch count
 *                (crochet amigurumi, simple knitting rows). Shows delta vs previous.
 *
 *  technique   — pill-badge strip for garment rows/rounds where we can detect
 *                RS/WS, M1 increases, decreases, rib/cable stitch, and markers.
 *
 *  sparkline   — connected count-milestone trail for 'step' instructions that
 *                embed multiple [X] counts in their text (e.g. Buddy the Snowman).
 *
 *  (nothing)   — if nothing useful is detectable, the component renders nothing
 *                and the parent falls back to plain text only.
 */
import { computed } from 'vue'
import type { Instruction } from '@/types/pattern'
import {
  extractFinalCount,
  extractAllCounts,
  countIncreases,
  countDecreases,
  detectSide,
  detectStitchType,
  hasMarkers,
} from '@/utils/instructionParsing'

const props = defineProps<{
  instruction: Instruction
  craft: 'knitting' | 'crochet'
  /** Stitch count of the nearest preceding round/row in the same section */
  prevCount?: number
  /** Maximum stitch count in this section — used to scale the count bar */
  maxCount?: number
}>()

// ── Parsed data ────────────────────────────────────────────────────
const stitchCount = computed(
  () => props.instruction.stitchCount ?? extractFinalCount(props.instruction.text),
)

const allCounts = computed(() => extractAllCounts(props.instruction.text))

const delta = computed(() => {
  if (stitchCount.value == null || props.prevCount == null) return null
  return stitchCount.value - props.prevCount
})

const increases = computed(() => countIncreases(props.instruction.text))
const decreases = computed(() => countDecreases(props.instruction.text))
const side = computed(() => detectSide(props.instruction.text))
const stitchType = computed(() => detectStitchType(props.instruction.text))
const markers = computed(() => hasMarkers(props.instruction.text))

// ── Mode selection ──────────────────────────────────────────────────
type Mode = 'count-bar' | 'technique' | 'sparkline' | 'none'

const mode = computed((): Mode => {
  const type = props.instruction.type

  // Note / tip / attention — never visualize
  if (type === 'note' || type === 'tip' || type === 'attention') return 'none'

  // Has segments → handled by RowVisualizer, skip here
  if (props.instruction.segments?.length) return 'none'

  // step with 2+ embedded milestones → sparkline (check before count-bar so
  // e.g. "Row 1 [16] → Row 3 [24] → Row 5 [32]" doesn't collapse to count-bar)
  if (type === 'step' && allCounts.value.length >= 2) return 'sparkline'

  // round/row with a stitch count → count bar
  if ((type === 'round' || type === 'row') && stitchCount.value != null) return 'count-bar'

  // round/row without a count but with detectable features → technique strip
  if (type === 'round' || type === 'row') {
    if (side.value || increases.value > 0 || decreases.value > 0 || markers.value) {
      return 'technique'
    }
  }

  return 'none'
})

// ── Count bar helpers ───────────────────────────────────────────────
const barPct = computed(() => {
  if (stitchCount.value == null) return 0
  const max = props.maxCount && props.maxCount > 0 ? props.maxCount : stitchCount.value
  return Math.min(100, Math.round((stitchCount.value / max) * 100))
})

/** Fill color based on stitch trend */
const fillColor = computed(() => {
  if (delta.value == null) return '#00B9CD'
  if (delta.value > 0) return '#2DBF86'  // increasing — green
  if (delta.value < 0) return '#E86070'  // decreasing — coral
  return '#00B9CD'                        // flat — teal
})

const trackColor = computed(() => fillColor.value + '22')

// ── Sparkline helpers ───────────────────────────────────────────────
/** Color each milestone node based on direction from previous */
function nodeColor(counts: number[], i: number): string {
  if (i === 0) return '#00B9CD'
  return counts[i] > counts[i - 1] ? '#2DBF86'
    : counts[i] < counts[i - 1] ? '#E86070'
    : '#00B9CD'
}

const sparkCounts = computed(() => {
  const c = allCounts.value
  return c.length > 7 ? c.filter((_, i) => i % Math.ceil(c.length / 7) === 0 || i === c.length - 1) : c
})

// ── Technique pill helpers ──────────────────────────────────────────
interface Pill { label: string; color: string; bg: string }

const pills = computed((): Pill[] => {
  const result: Pill[] = []

  if (side.value === 'RS') result.push({ label: 'RS', color: '#007A8A', bg: '#E5F8FA' })
  if (side.value === 'WS') result.push({ label: 'WS', color: '#6A5C9A', bg: '#EEE8F8' })

  if (increases.value > 0)
    result.push({ label: `+${increases.value}`, color: '#1A8A5A', bg: '#E6FAF2' })

  if (decreases.value > 0)
    result.push({ label: `−${decreases.value}`, color: '#B83050', bg: '#FDE8EE' })

  if (stitchType.value === 'rib')
    result.push({ label: 'rib', color: '#007A8A', bg: '#E5F8FA' })
  if (stitchType.value === 'cable')
    result.push({ label: 'cable', color: '#7A5A00', bg: '#FFF5D6' })
  if (stitchType.value === 'garter')
    result.push({ label: 'garter', color: '#546E7A', bg: '#EEF4F7' })
  if (stitchType.value === 'sc')
    result.push({ label: 'sc', color: '#B81050', bg: '#FDE8F0' })
  if (stitchType.value === 'dc')
    result.push({ label: 'dc', color: '#B81050', bg: '#FDE8F0' })

  if (markers.value)
    result.push({ label: '◆ markers', color: '#8A6400', bg: '#FFF3D0' })

  return result
})
</script>

<template>
  <!-- ── Count bar ─────────────────────────────────────────────────── -->
  <div v-if="mode === 'count-bar'" class="vis-row">
    <div
      class="count-track"
      :style="{ background: trackColor }"
    >
      <div
        class="count-fill"
        :style="{ width: barPct + '%', background: fillColor }"
      />
    </div>
    <div class="count-meta">
      <span class="count-num">{{ stitchCount }} sts</span>
      <span
        v-if="delta != null && delta !== 0"
        class="delta-badge"
        :class="delta > 0 ? 'delta-pos' : 'delta-neg'"
      >
        {{ delta > 0 ? '+' : '' }}{{ delta }}
      </span>
      <span
        v-if="delta === 0 && prevCount != null"
        class="delta-badge delta-flat"
      >
        ═
      </span>
    </div>
  </div>

  <!-- ── Technique strip ───────────────────────────────────────────── -->
  <div v-else-if="mode === 'technique'" class="vis-row vis-technique">
    <span
      v-for="pill in pills"
      :key="pill.label"
      class="tech-pill"
      :style="{ color: pill.color, background: pill.bg }"
    >
      {{ pill.label }}
    </span>
  </div>

  <!-- ── Sparkline ─────────────────────────────────────────────────── -->
  <div v-else-if="mode === 'sparkline'" class="vis-row vis-sparkline">
    <template v-for="(count, i) in sparkCounts" :key="i">
      <div class="spark-node" :style="{ '--node-color': nodeColor(sparkCounts, i) }">
        <div class="spark-dot" />
        <span class="spark-count">{{ count }}</span>
      </div>
      <div v-if="i < sparkCounts.length - 1" class="spark-arrow">
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
          <path d="M0 4h13M10 1l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Shared ──────────────────────────────────────────────────────── */
.vis-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.3rem 0 0.1rem;
}

/* ── Count bar ───────────────────────────────────────────────────── */
.count-track {
  flex: 1;
  height: 7px;
  border-radius: 4px;
  overflow: hidden;
  min-width: 0;
}

.count-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.count-meta {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
}

.count-num {
  font-size: 0.65rem;
  font-weight: 700;
  color: #546E7A;
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Fira Code', monospace;
  white-space: nowrap;
}

.delta-badge {
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.1rem 0.3rem;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

.delta-pos  { color: #1A8A5A; background: #E6FAF2; }
.delta-neg  { color: #B83050; background: #FDE8EE; }
.delta-flat { color: #78909C; background: #EEF4F7; font-size: 0.55rem; }

/* ── Technique strip ─────────────────────────────────────────────── */
.vis-technique {
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tech-pill {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  white-space: nowrap;
  text-transform: uppercase;
}

/* ── Sparkline ───────────────────────────────────────────────────── */
.vis-sparkline {
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
}

.spark-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.spark-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--node-color, #00B9CD);
  flex-shrink: 0;
}

.spark-count {
  font-size: 0.58rem;
  font-weight: 700;
  color: #546E7A;
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Fira Code', monospace;
  white-space: nowrap;
}

.spark-arrow {
  color: #C8D8DC;
  margin: 0 1px;
  flex-shrink: 0;
  padding-bottom: 8px; /* align with dots not labels */
}
</style>
