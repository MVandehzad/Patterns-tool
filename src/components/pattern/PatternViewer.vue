<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pattern } from '@/types/pattern'
import { usePatternProgressStore } from '@/stores/patternProgress'
import PatternHero from './PatternHero.vue'
import MaterialsPanel from './MaterialsPanel.vue'
import SizeSelector from './SizeSelector.vue'
import GaugeCard from './GaugeCard.vue'
import AbbreviationsDrawer from './AbbreviationsDrawer.vue'
import PatternInstructions from './PatternInstructions.vue'

const props = defineProps<{ pattern: Pattern }>()
const emit = defineEmits<{ back: [] }>()

const store = usePatternProgressStore()
const activeTab = ref<'overview' | 'materials' | 'instructions'>('overview')

const allInstructionIds = computed(() =>
  props.pattern.sections.flatMap((s) => s.instructions.map((i) => i.id)),
)

const overall = computed(() =>
  store.overallProgress(props.pattern.id, allInstructionIds.value),
)

const showAbbr = ref(false)
</script>

<template>
  <div class="viewer" :style="{ '--accent': pattern.accentColor }">

    <!-- ── Sticky top bar ──────────────────────────────────────────── -->
    <div class="topbar">
      <button class="back-btn" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        All Patterns
      </button>

      <div class="topbar-center">
        <span class="topbar-name">{{ pattern.name }}</span>
      </div>

      <!-- Overall progress ring -->
      <div class="progress-wrap" :title="`${overall.done} / ${overall.total} steps done`">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#EAE4DC" stroke-width="3"/>
          <circle
            cx="16" cy="16" r="12"
            fill="none"
            :stroke="pattern.accentColor"
            stroke-width="3"
            stroke-linecap="round"
            :stroke-dasharray="`${75.4 * overall.pct / 100} 75.4`"
            transform="rotate(-90 16 16)"
            style="transition: stroke-dasharray 0.4s ease"
          />
        </svg>
        <span class="progress-pct">{{ overall.pct }}%</span>
      </div>
    </div>

    <!-- ── Tab nav ─────────────────────────────────────────────────── -->
    <div class="tabs">
      <button
        v-for="tab in (['overview', 'materials', 'instructions'] as const)"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- ── Tab content ─────────────────────────────────────────────── -->
    <div class="tab-content">

      <!-- OVERVIEW -------------------------------------------------- -->
      <div v-if="activeTab === 'overview'" class="panel">
        <PatternHero :pattern="pattern" />
        <SizeSelector
          v-if="pattern.sizes[0] !== 'One size' && pattern.measurements.length"
          :pattern="pattern"
        />
        <GaugeCard v-if="pattern.gauge" :gauge="pattern.gauge" :accent="pattern.accentColor" />

        <!-- Construction overview card -->
        <div class="info-card">
          <h3 class="info-title">Construction</h3>
          <p class="info-text">{{ pattern.coverDescription }}</p>
          <div class="tag-row">
            <span class="tag">{{ pattern.craft === 'knitting' ? '🪡 Knitting' : '🪝 Crochet' }}</span>
            <span class="tag">{{ pattern.category }}</span>
            <span class="tag">{{ pattern.difficulty }}</span>
          </div>
        </div>

        <!-- Sections overview -->
        <div class="sections-overview">
          <h3 class="info-title" style="padding: 0 1rem 0.5rem">Pattern Sections</h3>
          <div
            v-for="(section, si) in pattern.sections"
            :key="section.id"
            class="section-chip"
          >
            <span class="section-num">{{ si + 1 }}</span>
            <span class="section-chip-name">{{ section.name }}</span>
            <span
              class="section-chip-pct"
              :style="{ color: pattern.accentColor }"
            >
              {{ store.sectionProgress(pattern.id, section.instructions.map(i => i.id)).pct }}%
            </span>
          </div>
          <div style="padding: 0.75rem 1rem 0">
            <button class="cta-btn" @click="activeTab = 'instructions'">
              Start Pattern →
            </button>
          </div>
        </div>
      </div>

      <!-- MATERIALS ------------------------------------------------- -->
      <div v-if="activeTab === 'materials'" class="panel">
        <MaterialsPanel :pattern="pattern" />
      </div>

      <!-- INSTRUCTIONS ---------------------------------------------- -->
      <div v-if="activeTab === 'instructions'" class="panel">
        <PatternInstructions :pattern="pattern" />
      </div>

    </div>

    <!-- ── Abbreviations floating trigger ─────────────────────────── -->
    <button class="abbr-fab" @click="showAbbr = true" title="Abbreviations reference">
      <span class="abbr-fab-label">ABC</span>
    </button>

    <AbbreviationsDrawer
      :abbreviations="pattern.abbreviations"
      :open="showAbbr"
      @close="showAbbr = false"
    />

  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.viewer {
  min-height: 100vh;
  background: #F0FBFC;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 5rem;
}

/* ── Top bar ──────────────────────────────────────────────────────── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid #00B9CD;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 52px;
  gap: 0.75rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #00B9CD;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0;
  font-family: inherit;
  flex-shrink: 0;
  transition: color 0.15s;
}

.back-btn:hover { color: #007F8C; }

.topbar-center {
  flex: 1;
  text-align: center;
  overflow: hidden;
}

.topbar-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-wrap {
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.progress-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.48rem;
  font-weight: 700;
  color: #121212;
}

/* ── Tabs ─────────────────────────────────────────────────────────── */
.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #C8EEF3;
  padding: 0 1rem;
  gap: 0;
  position: sticky;
  top: 52px;
  z-index: 40;
}

.tab {
  flex: 1;
  padding: 0.75rem 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #78909C;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.01em;
}

.tab:hover { color: #121212; }
.tab.active {
  color: #121212;
  border-bottom-color: #EE276E;
}

/* ── Content panels ───────────────────────────────────────────────── */
.tab-content {
  max-width: 680px;
  margin: 0 auto;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* ── Info card (construction) ─────────────────────────────────────── */
.info-card {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.info-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.info-text {
  font-size: 0.875rem;
  color: #546E7A;
  line-height: 1.6;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.72rem;
  font-weight: 500;
  color: #546E7A;
  background: #E5F8FA;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  text-transform: capitalize;
}

/* ── Sections overview ─────────────────────────────────────────────── */
.sections-overview {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 14px;
  padding: 1.1rem 0 0.5rem;
}

.section-chip {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #E0F5F8;
}

.section-chip:last-of-type { border-bottom: none; }

.section-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #E5F8FA;
  color: #00B9CD;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-chip-name {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: #121212;
}

.section-chip-pct {
  font-size: 0.72rem;
  font-weight: 700;
}

.cta-btn {
  width: 100%;
  padding: 0.75rem;
  background: #EE276E;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.1s;
  box-shadow: 0 2px 12px rgba(238, 39, 110, 0.28);
}

.cta-btn:hover { background: #D21055; transform: translateY(-1px); }
.cta-btn:active { transform: translateY(0); }

/* ── ABC FAB ──────────────────────────────────────────────────────── */
.abbr-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #00B9CD;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 185, 205, 0.38);
  transition: transform 0.15s, background 0.15s;
  z-index: 30;
}

.abbr-fab:hover { background: #007F8C; transform: scale(1.06); }

.abbr-fab-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  font-family: inherit;
}
</style>
