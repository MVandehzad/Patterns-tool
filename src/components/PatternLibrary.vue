<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ALL_PATTERNS } from '@/data/patterns'
import type { CraftType, Category } from '@/types/pattern'

const router = useRouter()

type Filter = 'all' | CraftType | 'toy'
const activeFilter = ref<Filter>('all')

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'knitting', label: 'Knitting' },
  { key: 'crochet', label: 'Crochet' },
  { key: 'toy', label: 'Toys' },
]

const filtered = computed(() => {
  if (activeFilter.value === 'all') return ALL_PATTERNS
  if (activeFilter.value === 'toy') return ALL_PATTERNS.filter((p) => p.category === 'toy')
  return ALL_PATTERNS.filter((p) => p.craft === activeFilter.value)
})

const difficultyDots = (d: string) => ({ beginner: 1, intermediate: 2, advanced: 3 }[d] ?? 1)
const craftLabel = (craft: string) => (craft === 'knitting' ? 'Knitting' : 'Crochet')

function categoryLabel(c: Category): string {
  const map: Record<Category, string> = {
    sweater: 'Sweater',
    cardigan: 'Cardigan',
    wrap: 'Wrap',
    beret: 'Beret',
    bandana: 'Bandana',
    toy: 'Crochet Toy',
  }
  return map[c] ?? c
}
</script>

<template>
  <div class="library">
    <!-- ── Header ──────────────────────────────────────────────────── -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-mark">✦</span>
          <span class="logo-name">Hobbii</span>
          <span class="logo-sub">Pattern Studio</span>
        </div>
        <p class="tagline">Your patterns, beautifully organised.</p>
      </div>
    </header>

    <!-- ── Filter chips ────────────────────────────────────────────── -->
    <div class="filter-bar">
      <button
        v-for="f in filters"
        :key="f.key"
        class="chip"
        :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- ── Pattern grid ────────────────────────────────────────────── -->
    <div class="grid">
      <article
        v-for="pattern in filtered"
        :key="pattern.id"
        class="card"
        :style="{ '--accent': pattern.accentColor }"
        @click="router.push(`/pattern/${pattern.id}`)"
      >
        <!-- Colored top bar -->
        <div class="card-bar" />

        <!-- Yarn swatches -->
        <div class="swatches">
          <span
            v-for="yarn in pattern.materials.yarns.slice(0, 4)"
            :key="yarn.id"
            class="swatch"
            :style="{ background: yarn.colorHex }"
            :title="yarn.colorName"
          />
        </div>

        <!-- Card content -->
        <div class="card-body">
          <div class="card-meta">
            <span class="badge-craft" :class="pattern.craft">{{ craftLabel(pattern.craft) }}</span>
            <span class="badge-cat">{{ categoryLabel(pattern.category) }}</span>
          </div>

          <h2 class="card-name">{{ pattern.name }}</h2>
          <p class="card-designer">by {{ pattern.designer }}</p>
          <p class="card-desc">{{ pattern.coverDescription }}</p>

          <div class="card-footer">
            <span class="difficulty" :title="`${pattern.difficulty}`">
              <span
                v-for="n in 3"
                :key="n"
                class="dot"
                :class="{ filled: n <= difficultyDots(pattern.difficulty) }"
              />
              <span class="diff-label">{{ pattern.difficulty }}</span>
            </span>
            <span class="sizes-label" v-if="pattern.sizes.length > 1">
              {{ pattern.sizes.length }} sizes
            </span>
          </div>
        </div>

        <!-- Open button -->
        <div class="card-cta">
          <span class="open-btn">Open Pattern →</span>
        </div>
      </article>
    </div>

    <!-- ── Empty state ─────────────────────────────────────────────── -->
    <div v-if="filtered.length === 0" class="empty">
      <span>No patterns in this category yet.</span>
    </div>
  </div>
</template>

<style scoped>
/* ── Hobbii brand tokens ─────────────────────────────────────────────
   Primary teal   #00B9CD   secondary pink  #EE276E
   Dark text      #121212   mid text        #546E7A   muted   #78909C
   Page bg        #F0FBFC   card bg         #FFFFFF
   Border         #C8EEF3   divider         #E0F5F8
   Chip bg        #E5F8FA
   ─────────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.library {
  min-height: 100vh;
  background: #F0FBFC;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 4rem;
}

/* ── Header ──────────────────────────────────────────────────────── */
.header {
  background: #fff;
  border-bottom: 2px solid #00B9CD;
  padding: 2.5rem 1.5rem 2rem;
}

.header-inner {
  max-width: 900px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logo-mark {
  font-size: 1.1rem;
  color: #EE276E;
}

.logo-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.03em;
}

.logo-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: #00B9CD;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.tagline {
  font-size: 0.875rem;
  color: #546E7A;
}

/* ── Filters ─────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.chip {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1.5px solid #C8EEF3;
  background: #fff;
  color: #546E7A;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.chip:hover { border-color: #00B9CD; color: #00B9CD; }

.chip.active {
  background: #00B9CD;
  border-color: #00B9CD;
  color: #fff;
}

/* ── Grid ────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Card ────────────────────────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #C8EEF3;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0, 185, 205, 0.14);
  border-color: #00B9CD;
}

.card-bar {
  height: 4px;
  background: var(--accent, #00B9CD);
  flex-shrink: 0;
}

.swatches {
  display: flex;
  gap: 5px;
  padding: 0.9rem 1rem 0;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  flex-shrink: 0;
}

.card-body {
  padding: 0.75rem 1rem 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge-craft, .badge-cat {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.badge-craft.knitting { background: #E5F8FA; color: #00879A; }
.badge-craft.crochet  { background: #FDE8F0; color: #B81050; }
.badge-cat { background: #E5F8FA; color: #546E7A; }

.card-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.card-designer {
  font-size: 0.75rem;
  color: #546E7A;
}

.card-desc {
  font-size: 0.8rem;
  color: #78909C;
  line-height: 1.5;
  margin-top: 0.25rem;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #E0F5F8;
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #C8EEF3;
}

.dot.filled { background: var(--accent, #00B9CD); }

.diff-label {
  font-size: 0.68rem;
  color: #546E7A;
  text-transform: capitalize;
  margin-left: 0.15rem;
}

.sizes-label {
  font-size: 0.68rem;
  color: #546E7A;
  background: #E5F8FA;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}

.card-cta {
  padding: 0.65rem 1rem;
  border-top: 1px solid #E0F5F8;
}

.open-btn {
  font-size: 0.78rem;
  font-weight: 600;
  color: #00B9CD;
  letter-spacing: 0.01em;
}

/* ── Empty ───────────────────────────────────────────────────────── */
.empty {
  text-align: center;
  padding: 4rem;
  color: #78909C;
  font-size: 0.875rem;
}
</style>
