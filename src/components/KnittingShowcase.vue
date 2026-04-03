<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// ─── Types ──────────────────────────────────────────────────────────
type Phase = 'idle' | 'knitting' | 'complete'

interface Sparkle {
  id: number
  x: number; y: number
  size: number; delay: number; angle: number
}

// ─── Sweater silhouette (reused in clipPath + display paths) ────────
const SWEATER_PATH =
  'M 198,82 C 218,52 302,52 322,82 ' +
  'Q 370,95 415,108 L 505,148 Q 516,208 512,260 Q 510,276 492,277 ' +
  'L 470,266 Q 448,216 420,198 L 440,416 Q 440,442 260,442 ' +
  'Q 80,442 80,416 L 100,198 Q 72,216 48,266 L 28,277 ' +
  'Q 10,276 8,260 Q 4,208 15,148 L 105,108 Q 152,95 198,82 Z'

// ─── Animation constants ────────────────────────────────────────────
const FILL_TOP    = 52
const FILL_BOTTOM = 442
const FILL_RANGE  = FILL_BOTTOM - FILL_TOP   // 390 px
const DURATION    = 5800                      // ms — unhurried, cinematic

// ─── State ──────────────────────────────────────────────────────────
const phase    = ref<Phase>('idle')
const rawT     = ref(0)
const sparkles = ref<Sparkle[]>([])

let rafId:   number | null = null
let startTs: number | null = null

// ─── Easing & derived values ─────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}

const eased  = computed(() => easeInOutCubic(rawT.value))
const fillY  = computed(() => FILL_BOTTOM - FILL_RANGE * eased.value)
const pct    = computed(() => Math.round(rawT.value * 100))

// Thread: cubic bezier from yarn ball (~430,452) to current fill edge
const threadPath = computed(() => {
  const bx = 430, by = 452
  const tx = 308, ty = fillY.value
  const d   = by - ty                              // vertical distance traveled
  const c1y = by - d * 0.42
  const c2y = ty + Math.max(32, d * 0.22)
  return `M ${bx},${by} C ${bx - 12},${c1y} ${tx + 32},${c2y} ${tx},${ty}`
})

// ─── Sparkle generation ──────────────────────────────────────────────
function spawnSparkles() {
  sparkles.value = Array.from({ length: 20 }, (_, i) => ({
    id:    i,
    x:     72  + Math.random() * 376,
    y:     58  + Math.random() * 374,
    size:  6   + Math.random() * 15,
    delay: Math.random() * 0.65,
    angle: Math.random() * 90,
  }))
}

// ─── Animation loop ──────────────────────────────────────────────────
function tick(ts: number) {
  if (startTs === null) startTs = ts
  const t = Math.min((ts - startTs) / DURATION, 1)
  rawT.value = t
  if (t < 1) {
    rafId = requestAnimationFrame(tick)
  } else {
    rawT.value  = 1
    phase.value = 'complete'
    spawnSparkles()
  }
}

// ─── Controls ───────────────────────────────────────────────────────
function startKnitting() {
  if (phase.value === 'knitting') return
  if (rafId) cancelAnimationFrame(rafId)
  phase.value    = 'knitting'
  rawT.value     = 0
  sparkles.value = []
  startTs        = null
  rafId          = requestAnimationFrame(tick)
}

function reset() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
  phase.value    = 'idle'
  rawT.value     = 0
  sparkles.value = []
  startTs        = null
}

onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<template>
  <section class="showcase">

    <!-- ── Page header ──────────────────────────────────────────── -->
    <header class="page-header">
      <span class="pip" />
      <span class="page-title">Knit Studio</span>
      <span class="page-sub">by Hobbii</span>
    </header>

    <!-- ── Main card ────────────────────────────────────────────── -->
    <div class="card">

      <!-- yarn swatch chips (top-right) -->
      <div class="swatches">
        <span class="swatch" style="background:#00b9cd" title="Ocean Teal" />
        <span class="swatch" style="background:#ee2770" title="Wild Rose" />
      </div>

      <!-- ── SVG canvas ─────────────────────────────────────────── -->
      <svg
        class="sw-svg"
        viewBox="0 0 520 500"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated knitting sweater"
      >
        <defs>

          <!-- Stitch texture overlay (transparent bg, V-shapes) -->
          <pattern id="pSt" patternUnits="userSpaceOnUse" width="12" height="14">
            <path d="M1,2 Q3,2 6,11 Q9,2 11,2"
                  fill="none" stroke="rgba(0,0,0,0.13)" stroke-width="2.1"
                  stroke-linecap="round"/>
            <path d="M1,2 Q2.5,2 4,6.5"
                  fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.4"
                  stroke-linecap="round"/>
          </pattern>

          <!-- Rib stitch overlay (1×1 rib texture) -->
          <pattern id="pRib" patternUnits="userSpaceOnUse" width="8" height="14">
            <rect width="4" height="14" fill="rgba(0,0,0,0.08)"/>
            <path d="M0.5,2 Q2,2 4,11 Q6,2 7.5,2"
                  fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1.7"
                  stroke-linecap="round"/>
          </pattern>

          <!-- Sweater silhouette clip -->
          <clipPath id="swClip">
            <path :d="SWEATER_PATH"/>
          </clipPath>

          <!-- Fill progress clip (grows upward with animation) -->
          <clipPath id="fillClip">
            <rect x="0" :y="fillY" width="520" height="500"/>
          </clipPath>

          <!-- Completion shimmer gradient -->
          <linearGradient id="shimGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="white" stop-opacity="0"   />
            <stop offset="40%"  stop-color="white" stop-opacity="0.38"/>
            <stop offset="60%"  stop-color="white" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"   />
          </linearGradient>

          <!-- Knit edge glow filter -->
          <filter id="edgeGlow" x="-8%" y="-500%" width="116%" height="1100%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          <!-- Yarn ball drop shadow -->
          <filter id="ballFx">
            <feDropShadow dx="2" dy="4" stdDeviation="5"
                          flood-color="#900030" flood-opacity="0.32"/>
          </filter>

          <!-- Sweater ambient shadow -->
          <filter id="sweaterFx" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="6" stdDeviation="10"
                          flood-color="#00b9cd" flood-opacity="0.14"/>
          </filter>

        </defs>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L0 — Ghost outline (always visible, dashed)            -->
        <!-- ════════════════════════════════════════════════════════ -->
        <path class="sw-ghost" :d="SWEATER_PATH"/>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L1 — Knitted fabric (clipped to sweater + progress)    -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g clip-path="url(#swClip)">
          <g clip-path="url(#fillClip)">

            <!-- teal base -->
            <rect x="0" y="0" width="520" height="500" fill="#00b9cd"/>
            <!-- stitch texture overlay -->
            <rect x="0" y="0" width="520" height="500" fill="url(#pSt)"/>

            <!-- yoke colorwork stripes (Hobbii Wild Rose) -->
            <rect x="0" y="124" width="520" height="13" fill="#ee2770"/>
            <rect x="0" y="124" width="520" height="13" fill="url(#pSt)"/>

            <rect x="0" y="145" width="520" height="9"  fill="#ee2770"/>
            <rect x="0" y="145" width="520" height="9"  fill="url(#pSt)"/>

            <rect x="0" y="162" width="520" height="7"  fill="#ee2770"/>
            <rect x="0" y="162" width="520" height="7"  fill="url(#pSt)"/>

            <!-- lower body accent stripe -->
            <rect x="0" y="360" width="520" height="6"  fill="#ee2770"/>
            <rect x="0" y="360" width="520" height="6"  fill="url(#pSt)"/>

            <!-- ribbed hem band -->
            <rect x="0" y="416" width="520" height="28" fill="#009eb5"/>
            <rect x="0" y="416" width="520" height="28" fill="url(#pRib)"/>

          </g>
        </g>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L2 — Filled outline stroke (fades in with progress)    -->
        <!-- ════════════════════════════════════════════════════════ -->
        <path
          v-if="eased > 0.02"
          class="sw-outline"
          :d="SWEATER_PATH"
          :style="{ opacity: Math.min(eased * 3, 1) }"
          filter="url(#sweaterFx)"
        />

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L3 — Active knit edge glow + row line                  -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g v-if="phase === 'knitting'" clip-path="url(#swClip)">
          <line x1="0" :y1="fillY" x2="520" :y2="fillY"
                class="edge-glow" filter="url(#edgeGlow)"/>
          <line x1="0" :y1="fillY" x2="520" :y2="fillY"
                class="edge-line"/>
        </g>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L4 — Knitting needles (track the fill edge)            -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g v-if="phase === 'knitting'">
          <!-- Left needle -->
          <line :x1="55"  :y1="fillY - 7"
                :x2="162" :y2="fillY + 4"
                class="needle"/>
          <circle :cx="55"  :cy="fillY - 7"   r="4.5" class="needle-tip"/>
          <circle :cx="161" :cy="fillY + 3.5" r="7.5" class="needle-cap"/>
          <!-- Right needle (mirrored) -->
          <line :x1="465" :y1="fillY - 7"
                :x2="358" :y2="fillY + 4"
                class="needle"/>
          <circle :cx="465" :cy="fillY - 7"   r="4.5" class="needle-tip"/>
          <circle :cx="359" :cy="fillY + 3.5" r="7.5" class="needle-cap"/>
        </g>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L5 — Yarn thread (ball → fill edge)                    -->
        <!-- ════════════════════════════════════════════════════════ -->
        <path
          v-if="phase !== 'idle'"
          :d="threadPath"
          class="yarn-thread"
          fill="none"
        />

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L6 — Yarn ball                                         -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g v-if="phase !== 'idle'" class="yarn-ball">
          <!-- ground shadow -->
          <ellipse cx="455" cy="479" rx="27" ry="8"
                   fill="rgba(0,0,0,0.09)"/>
          <!-- main body -->
          <circle cx="455" cy="455" r="28" fill="#ee2770"
                  filter="url(#ballFx)"/>
          <!-- yarn windings -->
          <ellipse cx="455" cy="455" rx="26" ry="9"
                   fill="none" stroke="#c40f4a" stroke-width="2.5" opacity="0.65"/>
          <ellipse cx="455" cy="455" rx="9"  ry="26"
                   fill="none" stroke="#c40f4a" stroke-width="2.5" opacity="0.65"/>
          <ellipse cx="455" cy="455" rx="21" ry="21"
                   fill="none" stroke="#ff4d8f" stroke-width="1.5" opacity="0.4"
                   transform="rotate(45 455 455)"/>
          <ellipse cx="455" cy="455" rx="21" ry="21"
                   fill="none" stroke="#ff4d8f" stroke-width="1.5" opacity="0.4"
                   transform="rotate(-45 455 455)"/>
          <ellipse cx="455" cy="455" rx="14" ry="23"
                   fill="none" stroke="#ff6fa3" stroke-width="1" opacity="0.28"
                   transform="rotate(22 455 455)"/>
          <!-- highlight -->
          <circle cx="444" cy="444" r="8" fill="rgba(255,255,255,0.18)"/>
          <circle cx="441" cy="441" r="3" fill="rgba(255,255,255,0.38)"/>
        </g>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L7 — Completion shimmer sweep                          -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g v-if="phase === 'complete'" clip-path="url(#swClip)">
          <rect class="shimmer-rect"
                x="-250" y="0" width="1020" height="500"
                fill="url(#shimGrad)"/>
        </g>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- L8 — Sparkles                                          -->
        <!-- ════════════════════════════════════════════════════════ -->
        <g v-if="phase === 'complete'">
          <g
            v-for="s in sparkles" :key="s.id"
            :transform="`translate(${s.x},${s.y}) rotate(${s.angle})`"
            class="sparkle"
            :style="`--sd:${s.delay}s`"
          >
            <line :x1="-s.size/2" y1="0"        :x2="s.size/2"  y2="0"        class="sp-a"/>
            <line x1="0"          :y1="-s.size/2" x2="0"          :y2="s.size/2" class="sp-a"/>
            <line :x1="-s.size*.35" :y1="-s.size*.35"
                  :x2="s.size*.35"  :y2="s.size*.35"  class="sp-b"/>
            <line :x1="s.size*.35"  :y1="-s.size*.35"
                  :x2="-s.size*.35" :y2="s.size*.35"  class="sp-b"/>
            <circle r="2.2" class="sp-dot"/>
          </g>
        </g>

      </svg>

      <!-- ── Completion badge ──────────────────────────────────── -->
      <Transition name="badge">
        <div v-if="phase === 'complete'" class="badge">
          <span class="badge-glyph">✦</span>
          Knitting Complete
          <span class="badge-glyph">✦</span>
        </div>
      </Transition>

      <!-- ── Yarn legend ───────────────────────────────────────── -->
      <div class="yarn-legend">
        <span class="y-item">
          <span class="y-dot" style="background:#00b9cd"/>
          <span class="y-name">Ocean Teal</span>
        </span>
        <span class="y-sep">×</span>
        <span class="y-item">
          <span class="y-dot" style="background:#ee2770"/>
          <span class="y-name">Wild Rose</span>
        </span>
      </div>

    </div>

    <!-- ── Controls ─────────────────────────────────────────────── -->
    <div class="controls">

      <Transition name="track">
        <div v-if="phase === 'knitting'" class="track">
          <div class="track-fill" :style="{ width: pct + '%' }"/>
          <span class="track-pct">{{ pct }}%</span>
        </div>
      </Transition>

      <button
        v-if="phase !== 'complete'"
        class="btn-knit"
        :class="{ knitting: phase === 'knitting' }"
        :disabled="phase === 'knitting'"
        @click="startKnitting"
      >
        <!-- Knitting needle icon -->
        <svg class="btn-icon" width="18" height="18" viewBox="0 0 20 20"
             fill="none" aria-hidden="true">
          <line x1="4" y1="16" x2="16" y2="4"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="16.5" cy="3.5" r="2.2" fill="currentColor"/>
          <path d="M4,16 L2.5,18.5 L5,17.5 Z" fill="currentColor"/>
          <line x1="7" y1="15" x2="19" y2="3"
                stroke="currentColor" stroke-width="1.3"
                stroke-linecap="round" opacity="0.45"/>
        </svg>
        <span v-if="phase === 'idle'">Start Knitting</span>
        <span v-else class="btn-dots">
          Knitting
          <span class="dot">·</span><span class="dot">·</span><span class="dot">·</span>
        </span>
      </button>

      <button v-else class="btn-reset" @click="reset">
        <svg width="16" height="16" viewBox="0 0 16 16"
             fill="none" aria-hidden="true">
          <path d="M14,8 A6,6 0 1 1 8,2"
                stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" fill="none"/>
          <polygon points="8,0 8,4 12,2" fill="currentColor"/>
        </svg>
        Knit Again
      </button>

    </div>

  </section>
</template>

<style scoped>
/* ── Reset ──────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Showcase page ──────────────────────────────────────────────────── */
.showcase {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 22% 8%,  #cff3f7 0%, transparent 50%),
    radial-gradient(ellipse at 82% 92%, #fcd8e8 0%, transparent 50%),
    #f7fcfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  gap: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Page header ────────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  user-select: none;
}

.pip {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ee2770;
  box-shadow: 0 0 0 4px rgba(238, 39, 112, 0.18);
  flex-shrink: 0;
  animation: pipPulse 2.4s ease-in-out infinite;
}

@keyframes pipPulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(238, 39, 112, 0.18); }
  50%      { box-shadow: 0 0 0 9px rgba(238, 39, 112, 0.04); }
}

.page-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: -0.01em;
}

.page-sub {
  font-size: 0.72rem;
  color: #00b9cd;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

/* ── Card ───────────────────────────────────────────────────────────── */
.card {
  position: relative;
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 28px;
  border: 1px solid rgba(0, 185, 205, 0.14);
  box-shadow:
    0 1px 2px  rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 12px 40px rgba(0, 185, 205, 0.08);
  padding: 2rem 2rem 1.25rem;
  /* graph-paper dot grid — evokes knitting chart paper */
  background-image: radial-gradient(circle, rgba(0, 185, 205, 0.11) 1px, transparent 1px);
  background-size: 18px 18px;
  background-color: #fff;
}

/* ── Yarn swatch chips ──────────────────────────────────────────────── */
.swatches {
  position: absolute;
  top: 1.25rem; right: 1.5rem;
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.swatch {
  display: block;
  width: 13px; height: 13px;
  border-radius: 50%;
  border: 2.5px solid #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.16);
}

/* ── SVG ────────────────────────────────────────────────────────────── */
.sw-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Ghost outline: dashed, very faint */
.sw-ghost {
  fill: rgba(0, 185, 205, 0.03);
  stroke: rgba(0, 185, 205, 0.28);
  stroke-width: 1.8;
  stroke-dasharray: 9 6;
  stroke-linecap: round;
}

/* Sweater outline stroke (appears as fill grows) */
.sw-outline {
  fill: none;
  stroke: #007a88;
  stroke-width: 1.8;
  stroke-linejoin: round;
  stroke-linecap: round;
}

/* ── Active knit edge ───────────────────────────────────────────────── */
.edge-glow {
  stroke: #00e5ff;
  stroke-width: 10;
  opacity: 0.18;
}

.edge-line {
  stroke: rgba(255, 255, 255, 0.88);
  stroke-width: 2.4;
  stroke-linecap: round;
  animation: edgePulse 0.55s ease-in-out infinite alternate;
}

@keyframes edgePulse {
  from { opacity: 0.52; }
  to   { opacity: 1;   }
}

/* ── Needles ────────────────────────────────────────────────────────── */
.needle {
  stroke: #c2c2c2;
  stroke-width: 5.5;
  stroke-linecap: round;
}

.needle-tip {
  fill: #e2e2e2;
  stroke: #aaa;
  stroke-width: 1;
}

.needle-cap {
  fill: #d5d5d5;
  stroke: #b2b2b2;
  stroke-width: 1;
}

/* ── Yarn thread ────────────────────────────────────────────────────── */
.yarn-thread {
  stroke: #ee2770;
  stroke-width: 2.6;
  stroke-linecap: round;
  opacity: 0.84;
  filter: drop-shadow(0 1px 4px rgba(238, 39, 112, 0.38));
}

/* ── Yarn ball ──────────────────────────────────────────────────────── */
.yarn-ball {
  animation: ballFloat 3.4s ease-in-out infinite;
}

@keyframes ballFloat {
  0%, 100% { transform: translateY(0px);  }
  50%      { transform: translateY(-4px); }
}

/* ── Completion shimmer ─────────────────────────────────────────────── */
.shimmer-rect {
  animation: shimSweep 1.6s ease-in-out forwards;
}

@keyframes shimSweep {
  0%   { transform: translateX(-350px); opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { transform: translateX(480px);  opacity: 0; }
}

/* ── Sparkles ───────────────────────────────────────────────────────── */
.sparkle {
  opacity: 0;
  animation: spAnim 0.9s ease-out var(--sd, 0s) forwards;
}

.sp-a {
  stroke: #ee2770;
  stroke-width: 2;
  stroke-linecap: round;
}

.sp-b {
  stroke: #ee2770;
  stroke-width: 1;
  stroke-linecap: round;
  opacity: 0.65;
}

.sp-dot { fill: #ffb0ce; }

@keyframes spAnim {
  0%   { opacity: 0; transform: scale(0); }
  35%  { opacity: 1; transform: scale(1.3); }
  70%  { opacity: 0.9; }
  100% { opacity: 0; transform: scale(0.55) rotate(20deg); }
}

/* ── Completion badge ───────────────────────────────────────────────── */
.badge {
  position: absolute;
  bottom: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #121212;
  color: #fff;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.52rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  z-index: 2;
}

.badge-glyph {
  color: #ee2770;
  font-size: 0.68rem;
  line-height: 1;
}

.badge-enter-active {
  transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(16px) scale(0.8);
}

/* ── Yarn legend ────────────────────────────────────────────────────── */
.yarn-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 185, 205, 0.1);
  margin-top: 0.25rem;
}

.y-item {
  display: flex;
  align-items: center;
  gap: 0.38rem;
}

.y-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.y-name {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.025em;
}

.y-sep {
  font-size: 0.7rem;
  color: #ccc;
}

/* ── Controls ───────────────────────────────────────────────────────── */
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  max-width: 290px;
}

/* progress track */
.track {
  width: 100%;
  height: 5px;
  background: rgba(0, 185, 205, 0.14);
  border-radius: 99px;
  position: relative;
  overflow: visible;
}

.track-fill {
  height: 100%;
  background: linear-gradient(90deg, #00b9cd 0%, #ee2770 100%);
  border-radius: 99px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0, 185, 205, 0.45);
}

.track-pct {
  position: absolute;
  right: 0;
  bottom: calc(100% + 5px);
  font-size: 0.67rem;
  font-weight: 700;
  color: #00b9cd;
  letter-spacing: 0.04em;
}

.track-enter-active, .track-leave-active { transition: opacity 0.25s; }
.track-enter-from,   .track-leave-to     { opacity: 0; }

/* ── Knit button ────────────────────────────────────────────────────── */
.btn-knit {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.875rem 2.25rem;
  background: #ee2770;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.975rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(238, 39, 112, 0.38);
  user-select: none;
  white-space: nowrap;
}

.btn-knit:hover:not(:disabled) {
  background: #d01055;
  transform: translateY(-2px);
  box-shadow: 0 7px 28px rgba(238, 39, 112, 0.48);
}

.btn-knit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 3px 14px rgba(238, 39, 112, 0.32);
}

.btn-knit:disabled,
.btn-knit.knitting {
  opacity: 0.72;
  cursor: not-allowed;
  animation: btnPulse 1.6s ease-in-out infinite;
}

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(238, 39, 112, 0.38); }
  50%      { box-shadow: 0 4px 30px rgba(238, 39, 112, 0.6);  }
}

/* ── Reset button ───────────────────────────────────────────────────── */
.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.875rem 2.25rem;
  background: #121212;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.975rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  user-select: none;
  white-space: nowrap;
}

.btn-reset:hover {
  background: #2c2c2c;
  transform: translateY(-2px);
  box-shadow: 0 7px 28px rgba(0, 0, 0, 0.28);
}

.btn-reset:active {
  transform: translateY(0);
}

.btn-icon { flex-shrink: 0; }

/* animated knitting dots */
.btn-dots {
  display: flex;
  align-items: baseline;
}

.btn-dots .dot {
  font-size: 1.3em;
  line-height: 1;
  margin-left: 1px;
  animation: dotJump 1.1s ease-in-out infinite;
}
.btn-dots .dot:nth-child(2) { animation-delay: 0.15s; }
.btn-dots .dot:nth-child(3) { animation-delay: 0.30s; }

@keyframes dotJump {
  0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
  40%           { opacity: 1;   transform: translateY(-3px); }
}
</style>
