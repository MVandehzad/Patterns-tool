<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Abbreviation } from '@/types/pattern'

const props = defineProps<{ abbreviations: Abbreviation[]; open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const query = ref('')

const filtered = computed(() => {
  if (!query.value.trim()) return props.abbreviations
  const q = query.value.toLowerCase()
  return props.abbreviations.filter(
    (a) => a.short.toLowerCase().includes(q) || a.full.toLowerCase().includes(q),
  )
})
</script>

<template>
  <Transition name="sheet">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div class="sheet">
        <div class="sheet-handle" />

        <div class="sheet-header">
          <span class="sheet-title">Abbreviations</span>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>

        <div class="search-wrap">
          <input
            v-model="query"
            class="search"
            placeholder="Search abbreviations…"
            type="search"
          />
        </div>

        <div class="abbr-list">
          <div
            v-for="abbr in filtered"
            :key="abbr.short"
            class="abbr-row"
          >
            <span class="abbr-short">{{ abbr.short }}</span>
            <span class="abbr-full">{{ abbr.full }}</span>
          </div>
          <div v-if="filtered.length === 0" class="abbr-empty">No matches found.</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  background: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 680px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  overflow: hidden;
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: #DDD6CF;
  border-radius: 2px;
  margin: 0.75rem auto 0;
  flex-shrink: 0;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem 0.5rem;
  flex-shrink: 0;
}

.sheet-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2D2926;
  letter-spacing: -0.01em;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F3F0EC;
  border: none;
  color: #7A6F66;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: background 0.15s;
}

.close-btn:hover { background: #EAE4DC; }

.search-wrap {
  padding: 0.5rem 1.25rem;
  flex-shrink: 0;
}

.search {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #EAE4DC;
  border-radius: 10px;
  font-size: 0.82rem;
  color: #2D2926;
  font-family: inherit;
  background: #FAF8F5;
  outline: none;
  transition: border-color 0.15s;
}

.search:focus { border-color: #C4826E; }

/* ── List ────────────────────────────────────────────────────────── */
.abbr-list {
  overflow-y: auto;
  flex: 1;
  padding: 0.25rem 0 1rem;
}

.abbr-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.6rem 1.25rem;
  border-bottom: 1px solid #F0EBE5;
}

.abbr-row:last-child { border-bottom: none; }

.abbr-short {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2D2926;
  min-width: 56px;
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
}

.abbr-full {
  font-size: 0.8rem;
  color: #5A4F46;
  line-height: 1.5;
  flex: 1;
}

.abbr-empty {
  padding: 2rem;
  text-align: center;
  font-size: 0.82rem;
  color: #9A8F86;
}

/* ── Transitions ─────────────────────────────────────────────────── */
.sheet-enter-active, .sheet-leave-active {
  transition: opacity 0.25s;
}

.sheet-enter-active .sheet, .sheet-leave-active .sheet {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from { opacity: 0; }
.sheet-leave-to   { opacity: 0; }

.sheet-enter-from .sheet { transform: translateY(100%); }
.sheet-leave-to   .sheet { transform: translateY(100%); }
</style>
