<script setup lang="ts">
import { computed } from 'vue'
import type { RowSegment, IncreaseKind } from '@/types/pattern'

const props = defineProps<{
  segments: RowSegment[]
  sizeIndex: number
  sizeLabel: string
  accentColor: string
  rawText?: string
}>()

// ── Helpers ────────────────────────────────────────────────────────────

function countAt(seg: RowSegment): number {
  return seg.counts.length === 1
    ? seg.counts[0]
    : (seg.counts[props.sizeIndex] ?? seg.counts[0])
}

const totalCount = computed(() =>
  props.segments.reduce((s, seg) => s + countAt(seg), 0),
)

// flex-grow value for each band — proportional to stitch count
function flex(seg: RowSegment): number {
  return countAt(seg)
}

// ── Side (RS / WS) ─────────────────────────────────────────────────────
const isRS = computed(() => {
  const back = props.segments.find((s) => s.section === 'Back')
  return back?.stitch === 'k'
})

// ── Increase classification ─────────────────────────────────────────────
function isKnitIncrease(inc: IncreaseKind): boolean {
  return inc === 'M1R' || inc === 'M1L'
}

// ── Short section labels ────────────────────────────────────────────────
const SHORT: Record<string, string> = {
  'Left Edge': '←',
  'Right Edge': '→',
  'Left Front': 'L.Front',
  'Right Front': 'R.Front',
  'Left Sleeve': 'L.Sleeve',
  'Right Sleeve': 'R.Sleeve',
  Back: 'Back',
}
function shortLabel(seg: RowSegment): string {
  return SHORT[seg.section] ?? seg.section
}

// ── Show stitch count only when the band is wide enough ────────────────
function showCount(seg: RowSegment): boolean {
  return countAt(seg) / totalCount.value > 0.06
}
</script>

<template>
  <div class="rv" :style="{ '--accent': accentColor }">

    <!-- ── Header ────────────────────────────────────────────────────── -->
    <div class="rv-header">
      <div class="rv-badges">
        <span class="badge side" :class="isRS ? 'rs' : 'ws'">
          {{ isRS ? 'RS · Knit' : 'WS · Purl' }}
        </span>
        <span class="badge size">{{ sizeLabel }}</span>
      </div>
      <span class="total-count">{{ totalCount }} sts across</span>
    </div>

    <!-- ── Track ──────────────────────────────────────────────────────── -->
    <div class="rv-track-wrap">

      <!-- Band row -->
      <div class="rv-track">
        <template v-for="(seg, i) in segments" :key="i">

          <!-- PREFIX: increase then marker (order matches knitting direction) -->
          <div
            v-if="seg.prefix?.increase"
            class="rv-inc"
            :class="isKnitIncrease(seg.prefix.increase) ? 'knit-inc' : 'purl-inc'"
            :title="seg.prefix.increase"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <line x1="5" y1="17" x2="5" y2="5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <polyline points="2,9 5,5 8,9" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="inc-label">{{ seg.prefix.increase }}</span>
          </div>

          <div v-if="seg.prefix?.marker" class="rv-marker">
            <span class="rv-gem">◆</span>
          </div>

          <!-- BAND -->
          <div
            class="rv-band"
            :class="`stitch-${seg.stitch}`"
            :style="{ flexGrow: flex(seg), flexShrink: 0, minWidth: '4px' }"
            :title="`${seg.section} — ${countAt(seg)} sts`"
          >
            <span v-if="showCount(seg)" class="rv-count">{{ countAt(seg) }}</span>
          </div>

          <!-- SUFFIX: marker then increase -->
          <div v-if="seg.suffix?.marker" class="rv-marker">
            <span class="rv-gem">◆</span>
          </div>

          <div
            v-if="seg.suffix?.increase"
            class="rv-inc"
            :class="isKnitIncrease(seg.suffix.increase) ? 'knit-inc' : 'purl-inc'"
            :title="seg.suffix.increase"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <line x1="5" y1="17" x2="5" y2="5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <polyline points="2,9 5,5 8,9" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="inc-label">{{ seg.suffix.increase }}</span>
          </div>

        </template>
      </div>

      <!-- Label row — mirrors the track structure for perfect alignment -->
      <div class="rv-labels">
        <template v-for="(seg, i) in segments" :key="i">
          <div v-if="seg.prefix?.increase" class="rv-lbl-inc" />
          <div v-if="seg.prefix?.marker"   class="rv-lbl-marker" />
          <div
            class="rv-lbl"
            :style="{ flexGrow: flex(seg), flexShrink: 0, minWidth: '4px' }"
          >{{ shortLabel(seg) }}</div>
          <div v-if="seg.suffix?.marker"   class="rv-lbl-marker" />
          <div v-if="seg.suffix?.increase" class="rv-lbl-inc" />
        </template>
      </div>

    </div>

    <!-- ── Legend ─────────────────────────────────────────────────────── -->
    <div class="rv-legend">
      <span class="leg-item">
        <span class="leg-swatch stitch-k" />
        <span>Knit</span>
      </span>
      <span class="leg-item">
        <span class="leg-swatch stitch-p" />
        <span>Purl</span>
      </span>
      <span class="leg-item">
        <span class="leg-swatch stitch-sl" />
        <span>Slip</span>
      </span>
      <span class="leg-item knit-inc">
        <svg width="8" height="12" viewBox="0 0 10 18" fill="none">
          <line x1="5" y1="17" x2="5" y2="5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <polyline points="2,9 5,5 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Inc (RS)</span>
      </span>
      <span class="leg-item purl-inc">
        <svg width="8" height="12" viewBox="0 0 10 18" fill="none">
          <line x1="5" y1="17" x2="5" y2="5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <polyline points="2,9 5,5 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Inc (WS)</span>
      </span>
      <span class="leg-item">
        <span class="leg-gem">◆</span>
        <span>Marker</span>
      </span>
    </div>

    <!-- ── Raw text (collapsible) ──────────────────────────────────────── -->
    <details v-if="rawText" class="rv-raw">
      <summary class="rv-raw-toggle">View raw instruction</summary>
      <p class="rv-raw-text">{{ rawText }}</p>
    </details>

  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rv {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Header ──────────────────────────────────────────────────────────── */
.rv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.rv-badges {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.badge.rs   { background: #E5F8FA; color: #00879A; }
.badge.ws   { background: #EDE5F8; color: #6A4AC4; }
.badge.size { background: #E5F8FA; color: #546E7A; }

.total-count {
  font-size: 0.65rem;
  color: #78909C;
  white-space: nowrap;
}

/* ── Track wrapper ───────────────────────────────────────────────────── */
.rv-track-wrap {
  border: 1.5px solid #C8EEF3;
  border-radius: 10px;
  overflow: hidden;
}

/* ── Band row ────────────────────────────────────────────────────────── */
.rv-track {
  display: flex;
  align-items: stretch;
  height: 48px;
  overflow: hidden;
}

/* Stitch band textures */
.rv-band {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: flex-grow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stitch-k {
  /* Knit: warm cream with subtle 45° diagonal (approximates V-stitch rhythm) */
  background: repeating-linear-gradient(
    135deg,
    #E4F7FA 0px, #E4F7FA 4px,
    #C8EEF3 4px, #C8EEF3 8px
  );
}

.stitch-p {
  /* Purl: cool lavender with horizontal pinstripes */
  background: repeating-linear-gradient(
    0deg,
    #DDE4F0 0px, #DDE4F0 4px,
    #C8D4EA 4px, #C8D4EA 8px
  );
}

.stitch-sl {
  /* Slip: warm grey with 90° dashes */
  background: repeating-linear-gradient(
    90deg,
    #DCF0F5 0px, #DCF0F5 6px,
    #B8D8E4 6px, #B8D8E4 12px
  );
}

.rv-count {
  font-size: 0.58rem;
  font-weight: 800;
  color: rgba(45, 41, 38, 0.55);
  pointer-events: none;
  user-select: none;
  font-variant-numeric: tabular-nums;
}

/* ── Marker ──────────────────────────────────────────────────────────── */
.rv-marker {
  width: 12px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #C9A84C;
  position: relative;
}

.rv-gem {
  font-size: 0.55rem;
  color: #fff;
  line-height: 1;
  position: absolute;
  top: 4px;
}

/* ── Increase arrow ──────────────────────────────────────────────────── */
.rv-inc {
  width: 18px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  position: relative;
}

.knit-inc { color: #4CAF82; background: #F0FAF5; }
.purl-inc { color: #5A8AC4; background: #EEF4FB; }

.inc-label {
  font-size: 0.38rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1;
  opacity: 0.9;
}

/* ── Label row ───────────────────────────────────────────────────────── */
.rv-labels {
  display: flex;
  align-items: stretch;
  background: #F0FBFC;
  border-top: 1px solid #C8EEF3;
}

.rv-lbl {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.56rem;
  font-weight: 600;
  color: #546E7A;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.28rem 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  transition: flex-grow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Spacers — same fixed widths as their track counterparts */
.rv-lbl-marker { width: 12px; flex-shrink: 0; background: #C9A84C22; border-right: 1px solid #C9A84C44; }
.rv-lbl-inc    { width: 18px; flex-shrink: 0; }

/* ── Legend ──────────────────────────────────────────────────────────── */
.rv-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 1rem;
  padding: 0.25rem 0;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  color: #546E7A;
}

.leg-swatch {
  width: 18px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.06);
}

.leg-gem {
  font-size: 0.65rem;
  color: #C9A84C;
}

/* ── Raw text ────────────────────────────────────────────────────────── */
.rv-raw {
  border-top: 1px solid #C8EEF3;
  padding-top: 0.4rem;
}

.rv-raw-toggle {
  font-size: 0.68rem;
  color: #78909C;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.rv-raw-toggle::-webkit-details-marker { display: none; }
.rv-raw-toggle::before { content: '▸ '; }
details[open] .rv-raw-toggle::before { content: '▾ '; }

.rv-raw-text {
  margin-top: 0.4rem;
  font-size: 0.73rem;
  color: #546E7A;
  line-height: 1.65;
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
  background: #E5F8FA;
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
}
</style>
