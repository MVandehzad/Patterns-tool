<script setup lang="ts">
import { computed } from 'vue'
import type { Pattern } from '@/types/pattern'
import { usePatternProgressStore } from '@/stores/patternProgress'

const props = defineProps<{ pattern: Pattern }>()
const store = usePatternProgressStore()

const selectedIdx = computed(() => store.getSelectedSizeIndex(props.pattern.id))
const selectedSize = computed(() => props.pattern.sizes[selectedIdx.value])
</script>

<template>
  <div class="size-selector" :style="{ '--accent': pattern.accentColor }">
    <div class="header-row">
      <h3 class="section-title">Size</h3>
      <span class="selected-label">{{ selectedSize }}</span>
    </div>

    <!-- Size buttons -->
    <div class="size-buttons">
      <button
        v-for="(size, idx) in pattern.sizes"
        :key="size"
        class="size-btn"
        :class="{ active: idx === selectedIdx }"
        @click="store.setSelectedSize(pattern.id, idx)"
      >
        {{ size }}
      </button>
    </div>

    <!-- Ease note -->
    <p v-if="pattern.ease" class="ease-note">{{ pattern.ease }}</p>

    <!-- Measurement table -->
    <div class="measure-table" v-if="pattern.measurements.length">
      <div
        v-for="m in pattern.measurements"
        :key="m.label"
        class="measure-row"
      >
        <span class="measure-label">{{ m.label }}</span>
        <span class="measure-values">
          <span class="measure-val">{{ m.unitCm[selectedIdx] }} cm</span>
          <span class="measure-sep">/</span>
          <span class="measure-val secondary">{{ m.unitInch[selectedIdx] }}"</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.size-selector {
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

.selected-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
  background: #F0FBFC;
  border: 1.5px solid var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

/* ── Size buttons ────────────────────────────────────────────────── */
.size-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.size-btn {
  min-width: 40px;
  height: 36px;
  padding: 0 0.6rem;
  border-radius: 8px;
  border: 1.5px solid #C8EEF3;
  background: #F0FBFC;
  color: #546E7A;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.size-btn:hover { border-color: var(--accent); color: var(--accent); }

.size-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.ease-note {
  font-size: 0.72rem;
  color: #546E7A;
  font-style: italic;
}

/* ── Measurement table ───────────────────────────────────────────── */
.measure-table {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #C8EEF3;
  overflow: hidden;
}

.measure-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid #E0F5F8;
  gap: 1rem;
}

.measure-row:last-child { border-bottom: none; }

.measure-label {
  font-size: 0.78rem;
  color: #546E7A;
  flex: 1;
}

.measure-values {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.measure-val {
  font-size: 0.85rem;
  font-weight: 700;
  color: #121212;
}

.measure-val.secondary {
  font-size: 0.78rem;
  font-weight: 500;
  color: #546E7A;
}

.measure-sep {
  font-size: 0.7rem;
  color: #C8C0B8;
}
</style>
