<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Gauge } from '@/types/pattern'

const props = defineProps<{ gauge: Gauge; accent: string }>()

// Animate dots in after mount
const revealed = ref(0)
onMounted(() => {
  const total = props.gauge.stitches * props.gauge.rows
  const step = Math.max(1, Math.round(total / 40))
  let n = 0
  const timer = setInterval(() => {
    n = Math.min(n + step, total)
    revealed.value = n
    if (n >= total) clearInterval(timer)
  }, 16)
})

const COLS = 10
const ROWS = 10
</script>

<template>
  <div class="gauge-card" :style="{ '--accent': accent }">
    <div class="header-row">
      <h3 class="section-title">Gauge Swatch</h3>
      <span class="needle-badge">{{ gauge.needleOrHook }}</span>
    </div>

    <!-- Animated dot grid (10 × 10 represents the 10 × 10 cm block) -->
    <div class="dot-grid">
      <div
        v-for="r in ROWS"
        :key="r"
        class="dot-row"
      >
        <span
          v-for="c in COLS"
          :key="c"
          class="dot"
          :class="{ lit: ((r - 1) * COLS + c) <= revealed }"
        />
      </div>
    </div>

    <!-- Numbers -->
    <div class="gauge-nums">
      <div class="gauge-num">
        <span class="num">{{ gauge.stitches }}</span>
        <span class="lbl">stitches</span>
      </div>
      <div class="gauge-x">×</div>
      <div class="gauge-num">
        <span class="num">{{ gauge.rows }}</span>
        <span class="lbl">rows</span>
      </div>
      <div class="gauge-eq">=</div>
      <div class="gauge-num">
        <span class="num">10 × 10</span>
        <span class="lbl">cm / 4 × 4"</span>
      </div>
    </div>

    <p class="gauge-stitch">in {{ gauge.stitch }}</p>

    <div class="gauge-warning">
      <span class="warn-icon">⚠</span>
      Always swatch before starting — gauge affects the final size.
    </div>
  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.gauge-card {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.needle-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent);
  background: #F0FBFC;
  border: 1.5px solid #C8EEF3;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}

/* ── Dot grid ────────────────────────────────────────────────────── */
.dot-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem 0;
  align-items: center;
}

.dot-row {
  display: flex;
  gap: 5px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #C8EEF3;
  transition: background 0.08s, transform 0.08s;
}

.dot.lit {
  background: var(--accent);
  transform: scale(1.05);
}

/* ── Gauge numbers ───────────────────────────────────────────────── */
.gauge-nums {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.gauge-num {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.num {
  font-size: 1.35rem;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.03em;
  line-height: 1;
}

.lbl {
  font-size: 0.62rem;
  color: #546E7A;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gauge-x, .gauge-eq {
  font-size: 1.1rem;
  color: #C8C0B8;
  font-weight: 300;
}

.gauge-stitch {
  text-align: center;
  font-size: 0.78rem;
  color: #546E7A;
  font-style: italic;
}

.gauge-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: #FFF8E5;
  border: 1px solid #F5D98A;
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.75rem;
  color: #5A4200;
  line-height: 1.5;
}

.warn-icon {
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-top: 0.05rem;
}
</style>
