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
    toy: 'Toy',
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
        <!-- ── Image hero ── -->
        <div class="card-image">
          <img
            v-if="pattern.coverImage"
            :src="pattern.coverImage"
            :alt="pattern.name"
            class="card-img"
            loading="lazy"
          />
          <!-- Fallback gradient when no image -->
          <div v-else class="card-img-fallback" />

          <!-- Gradient scrim -->
          <div class="card-scrim" />

          <!-- Category pill on image -->
          <span class="img-category">{{ categoryLabel(pattern.category) }}</span>

          <!-- Yarn color dots bottom-left of image -->
          <div class="img-swatches">
            <span
              v-for="yarn in pattern.materials.yarns.slice(0, 5)"
              :key="yarn.id"
              class="img-swatch"
              :style="{ background: yarn.colorHex }"
              :title="yarn.colorName"
            />
          </div>

          <!-- Photo count badge (top-right) if images exist -->
          <span v-if="pattern.images?.length" class="img-photo-count">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            {{ pattern.images.length }}
          </span>
        </div>

        <!-- ── Card body ── -->
        <div class="card-body">
          <div class="card-meta">
            <span class="badge-craft" :class="pattern.craft">{{ craftLabel(pattern.craft) }}</span>
            <span v-if="pattern.sizes.length > 1" class="badge-sizes">
              {{ pattern.sizes.length }} sizes
            </span>
          </div>

          <h2 class="card-name">{{ pattern.name }}</h2>
          <p class="card-designer">by {{ pattern.designer }}</p>
          <p class="card-desc">{{ pattern.coverDescription }}</p>

          <div class="card-footer">
            <span class="difficulty">
              <span
                v-for="n in 3"
                :key="n"
                class="dot"
                :class="{ filled: n <= difficultyDots(pattern.difficulty) }"
              />
              <span class="diff-label">{{ pattern.difficulty }}</span>
            </span>
            <span class="open-link">Open →</span>
          </div>
        </div>
      </article>
    </div>

    <!-- ── Empty state ─────────────────────────────────────────────── -->
    <div v-if="filtered.length === 0" class="empty">
      No patterns in this category yet.
    </div>
  </div>
</template>

<style scoped>
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

.header-inner { max-width: 960px; margin: 0 auto; }

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logo-mark { font-size: 1.1rem; color: #EE276E; }
.logo-name { font-size: 1.4rem; font-weight: 800; color: #121212; letter-spacing: -0.03em; }
.logo-sub  { font-size: 0.75rem; font-weight: 600; color: #00B9CD; letter-spacing: 0.09em; text-transform: uppercase; }
.tagline   { font-size: 0.875rem; color: #546E7A; }

/* ── Filters ─────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.chip {
  padding: 0.4rem 1.1rem;
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
.chip.active { background: #00B9CD; border-color: #00B9CD; color: #fff; }

/* ── Grid ────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Card ────────────────────────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #C8EEF3;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 185, 205, 0.16);
  border-color: rgba(0, 185, 205, 0.5);
}

/* ── Card image area ─────────────────────────────────────────────── */
.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--accent, #00B9CD);
  flex-shrink: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.card:hover .card-img {
  transform: scale(1.06);
}

/* Accent-colour diagonal-stripe fallback when no image */
.card-img-fallback {
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.06) 0px,
      rgba(255,255,255,0.06) 1px,
      transparent 1px,
      transparent 12px
    ),
    var(--accent, #00B9CD);
}

/* Bottom gradient scrim so overlaid text stays readable */
.card-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(0, 0, 0, 0.42) 100%
  );
  pointer-events: none;
}

/* Category pill — bottom-left over image */
.img-category {
  position: absolute;
  bottom: 0.6rem;
  left: 0.7rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
}

/* Yarn dot swatches — bottom-right over image */
.img-swatches {
  position: absolute;
  bottom: 0.6rem;
  right: 0.7rem;
  display: flex;
  gap: -4px;
}

.img-swatch {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  flex-shrink: 0;
  margin-left: -4px;
}

.img-swatch:first-child { margin-left: 0; }

/* Photo count badge — top-right over image */
.img-photo-count {
  position: absolute;
  top: 0.6rem;
  right: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
}

/* ── Card body ───────────────────────────────────────────────────── */
.card-body {
  padding: 0.85rem 1rem 0.9rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.badge-craft {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}

.badge-craft.knitting { background: #E5F8FA; color: #007A8A; }
.badge-craft.crochet  { background: #FDE8F0; color: #B81050; }

.badge-sizes {
  font-size: 0.65rem;
  font-weight: 600;
  color: #546E7A;
  background: #E5F8FA;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}

.card-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin-top: 0.1rem;
}

.card-designer {
  font-size: 0.72rem;
  color: #78909C;
}

.card-desc {
  font-size: 0.78rem;
  color: #78909C;
  line-height: 1.55;
  margin-top: 0.2rem;
  flex: 1;
  /* clamp to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
  padding-top: 0.55rem;
  border-top: 1px solid #E0F5F8;
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #C8EEF3;
  transition: background 0.2s;
}

.dot.filled { background: var(--accent, #00B9CD); }

.diff-label {
  font-size: 0.65rem;
  color: #546E7A;
  text-transform: capitalize;
  margin-left: 0.1rem;
}

.open-link {
  font-size: 0.72rem;
  font-weight: 700;
  color: #00B9CD;
  letter-spacing: 0.01em;
  transition: color 0.15s;
}

.card:hover .open-link { color: #007A8A; }

/* ── Empty ───────────────────────────────────────────────────────── */
.empty {
  text-align: center;
  padding: 4rem;
  color: #78909C;
  font-size: 0.875rem;
}
</style>
