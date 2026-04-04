<script setup lang="ts">
import type { Pattern } from '@/types/pattern'

defineProps<{ pattern: Pattern }>()
</script>

<template>
  <div class="hero" :style="{ '--accent': pattern.accentColor }">
    <!-- Decorative swatch strip -->
    <div class="swatch-strip">
      <div
        v-for="yarn in pattern.materials.yarns"
        :key="yarn.id"
        class="strip-seg"
        :style="{ background: yarn.colorHex }"
      />
    </div>

    <div class="hero-body">
      <!-- Badges -->
      <div class="badge-row">
        <span class="craft-badge" :class="pattern.craft">
          {{ pattern.craft === 'knitting' ? '🪡 Knitting' : '🪝 Crochet' }}
        </span>
        <span class="year-badge">{{ pattern.year }}</span>
      </div>

      <!-- Name -->
      <h1 class="pattern-name">{{ pattern.name }}</h1>
      <p class="designer">by {{ pattern.designer }}</p>

      <!-- Key stats -->
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ pattern.sizes[0] === 'One size' ? '1' : pattern.sizes.length }}</span>
          <span class="stat-label">{{ pattern.sizes[0] === 'One size' ? 'One size' : 'Sizes' }}</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-value">{{ pattern.sections.length }}</span>
          <span class="stat-label">Sections</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-value">{{ pattern.materials.yarns.length }}</span>
          <span class="stat-label">Yarn{{ pattern.materials.yarns.length > 1 ? 's' : '' }}</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-value difficulty-dots">
            <span
              v-for="n in 3"
              :key="n"
              class="dot"
              :class="{ filled: n <= ({ beginner: 1, intermediate: 2, advanced: 3 }[pattern.difficulty] ?? 1) }"
            />
          </span>
          <span class="stat-label" style="text-transform: capitalize">{{ pattern.difficulty }}</span>
        </div>
      </div>

      <!-- Yarn color palette -->
      <div class="palette">
        <div
          v-for="yarn in pattern.materials.yarns"
          :key="yarn.id"
          class="palette-item"
        >
          <span class="palette-dot" :style="{ background: yarn.colorHex }" />
          <span class="palette-name">{{ yarn.colorName }}</span>
          <span class="palette-code">#{{ yarn.colorCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.hero {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 16px;
  overflow: hidden;
}

/* Swatch strip — full color bar across the top */
.swatch-strip {
  display: flex;
  height: 8px;
  width: 100%;
}

.strip-seg {
  flex: 1;
}

.hero-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.badge-row {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.craft-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  letter-spacing: 0.03em;
}

.craft-badge.knitting { background: #E5F8FA; color: #00879A; }
.craft-badge.crochet  { background: #FDE8F0; color: #B81050; }

.year-badge {
  font-size: 0.68rem;
  font-weight: 500;
  color: #78909C;
  background: #E5F8FA;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
}

.pattern-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.designer {
  font-size: 0.82rem;
  color: #546E7A;
}

/* Stats row */
.stats {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: #F0FBFC;
  border-radius: 10px;
  border: 1px solid #C8EEF3;
  overflow: hidden;
  margin-top: 0.25rem;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.65rem 0.5rem;
  gap: 0.2rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat-label {
  font-size: 0.62rem;
  color: #546E7A;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  background: #C8EEF3;
  align-self: stretch;
}

.difficulty-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C8EEF3;
}

.dot.filled { background: var(--accent); }

/* Colour palette */
.palette {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.25rem;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.palette-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  flex-shrink: 0;
}

.palette-name {
  font-size: 0.8rem;
  color: #121212;
  font-weight: 500;
  flex: 1;
}

.palette-code {
  font-size: 0.7rem;
  color: #78909C;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
</style>
