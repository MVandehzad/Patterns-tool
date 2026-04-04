<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pattern, PatternSection } from '@/types/pattern'
import { usePatternProgressStore } from '@/stores/patternProgress'
import RowVisualizer from './RowVisualizer.vue'

const props = defineProps<{ pattern: Pattern }>()
const store = usePatternProgressStore()

const openSections = ref<Set<string>>(new Set([props.pattern.sections[0]?.id]))

function toggleSection(id: string) {
  if (openSections.value.has(id)) {
    openSections.value.delete(id)
  } else {
    openSections.value.add(id)
  }
}

const allInstructionIds = computed(() =>
  props.pattern.sections.flatMap((s) => s.instructions.map((i) => i.id)),
)

const overall = computed(() =>
  store.overallProgress(props.pattern.id, allInstructionIds.value),
)

function sectionProgress(section: PatternSection) {
  return store.sectionProgress(
    props.pattern.id,
    section.instructions.map((i) => i.id),
  )
}

function iconForType(type: string) {
  const map: Record<string, string> = {
    round: '○',
    row: '—',
    note: '📌',
    tip: '💡',
    step: '▸',
    attention: '⚠',
  }
  return map[type] ?? '·'
}

const typeColors: Record<string, string> = {
  round: '',
  row: '',
  note: '#546E7A',
  tip: '#5A7A9E',
  step: '',
  attention: '#C4694A',
}
</script>

<template>
  <div class="instructions" :style="{ '--accent': pattern.accentColor }">

    <!-- Overall progress bar -->
    <div class="overall-bar-wrap">
      <div class="overall-bar-header">
        <span class="overall-label">Overall progress</span>
        <span class="overall-pct">{{ overall.done }} / {{ overall.total }} steps — {{ overall.pct }}%</span>
      </div>
      <div class="overall-track">
        <div
          class="overall-fill"
          :style="{ width: overall.pct + '%' }"
        />
      </div>
    </div>

    <!-- Sections -->
    <div
      v-for="(section, si) in pattern.sections"
      :key="section.id"
      class="section"
    >
      <!-- Section header (accordion toggle) -->
      <button
        class="section-header"
        :class="{ open: openSections.has(section.id) }"
        @click="toggleSection(section.id)"
      >
        <div class="sh-left">
          <!-- Progress ring -->
          <svg width="28" height="28" viewBox="0 0 28 28" class="ring">
            <circle cx="14" cy="14" r="10" fill="none" stroke="#C8EEF3" stroke-width="2.5"/>
            <circle
              cx="14" cy="14" r="10"
              fill="none"
              :stroke="sectionProgress(section).pct === 100 ? '#4CAF82' : pattern.accentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              :stroke-dasharray="`${62.8 * sectionProgress(section).pct / 100} 62.8`"
              transform="rotate(-90 14 14)"
              style="transition: stroke-dasharray 0.35s ease"
            />
            <!-- Checkmark when complete -->
            <path
              v-if="sectionProgress(section).pct === 100"
              d="M9 14l3 3 7-7"
              stroke="#4CAF82"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <text
              v-else
              x="14" y="14"
              text-anchor="middle"
              dominant-baseline="central"
              font-size="7"
              font-weight="700"
              fill="#121212"
            >{{ si + 1 }}</text>
          </svg>

          <div class="sh-text">
            <span class="sh-name">{{ section.name }}</span>
            <span class="sh-sub" v-if="section.description">{{ section.description }}</span>
          </div>
        </div>

        <div class="sh-right">
          <span class="sh-pct" :style="{ color: sectionProgress(section).pct === 100 ? '#4CAF82' : pattern.accentColor }">
            {{ sectionProgress(section).pct === 100 ? '✓' : sectionProgress(section).pct + '%' }}
          </span>
          <svg
            class="chevron"
            :class="{ rotated: openSections.has(section.id) }"
            width="14" height="14" viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M3 5L7 9L11 5" stroke="#78909C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </button>

      <!-- Instructions list -->
      <Transition name="accordion">
        <div v-if="openSections.has(section.id)" class="instruction-list">
          <div
            v-for="instruction in section.instructions"
            :key="instruction.id"
            class="instruction-row"
            :class="{
              done: store.isCompleted(pattern.id, instruction.id),
              clickable: instruction.type !== 'note' && instruction.type !== 'tip' && instruction.type !== 'attention',
            }"
            @click="
              instruction.type !== 'note' && instruction.type !== 'tip' && instruction.type !== 'attention'
                ? store.toggleInstruction(pattern.id, instruction.id)
                : undefined
            "
          >
            <!-- Left: type icon / check -->
            <div class="instr-icon-wrap">
              <template v-if="store.isCompleted(pattern.id, instruction.id)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :fill="pattern.accentColor"/>
                  <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else>
                <span
                  class="type-icon"
                  :style="typeColors[instruction.type] ? { color: typeColors[instruction.type] } : {}"
                >
                  {{ iconForType(instruction.type) }}
                </span>
              </template>
            </div>

            <!-- Content -->
            <div class="instr-content">
              <div class="instr-top-row">
                <span v-if="instruction.label" class="instr-label">{{ instruction.label }}</span>
                <span
                  v-if="instruction.stitchCount != null"
                  class="stitch-count"
                  :style="{ background: pattern.accentColor + '18', color: pattern.accentColor }"
                >
                  [{{ instruction.stitchCount }}]
                </span>
              </div>
              <!-- Row visualizer replaces plain text when structured data exists -->
              <RowVisualizer
                v-if="instruction.segments?.length"
                :segments="instruction.segments"
                :sizeIndex="store.getSelectedSizeIndex(pattern.id)"
                :sizeLabel="`Size ${pattern.sizes[store.getSelectedSizeIndex(pattern.id)]}`"
                :accentColor="pattern.accentColor"
                :rawText="instruction.text"
                @click.stop
              />
              <p
                v-else
                class="instr-text"
                :class="{
                  'text-note': instruction.type === 'note',
                  'text-tip': instruction.type === 'tip',
                  'text-attention': instruction.type === 'attention',
                }"
              >
                {{ instruction.text }}
              </p>
              <a
                v-if="instruction.videoUrl"
                :href="instruction.videoUrl"
                target="_blank"
                rel="noopener"
                class="video-link"
                @click.stop
              >
                ▶ Watch video tutorial
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Reset button -->
    <button
      v-if="overall.done > 0"
      class="reset-btn"
      @click="store.resetPattern(pattern.id)"
    >
      Reset all progress
    </button>

  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.instructions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Overall bar ─────────────────────────────────────────────────── */
.overall-bar-wrap {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.overall-bar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overall-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.overall-pct {
  font-size: 0.72rem;
  color: #546E7A;
}

.overall-track {
  height: 6px;
  background: #C8EEF3;
  border-radius: 999px;
  overflow: hidden;
}

.overall-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* ── Section card ─────────────────────────────────────────────────── */
.section {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.section:has(.section-header.open) {
  border-color: var(--accent);
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  gap: 0.75rem;
  transition: background 0.15s;
}

.section-header:hover { background: #F0FBFC; }

.sh-left {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  flex: 1;
  min-width: 0;
}

.ring { flex-shrink: 0; margin-top: 1px; }

.sh-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.sh-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #121212;
  text-align: left;
}

.sh-sub {
  font-size: 0.72rem;
  color: #546E7A;
  text-align: left;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
}

.sh-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sh-pct {
  font-size: 0.75rem;
  font-weight: 700;
}

.chevron {
  transition: transform 0.2s;
}
.chevron.rotated { transform: rotate(180deg); }

/* ── Instruction list ─────────────────────────────────────────────── */
.instruction-list {
  border-top: 1px solid #E0F5F8;
}

.instruction-row {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #E0F5F8;
  transition: background 0.12s;
}

.instruction-row:last-child { border-bottom: none; }

.instruction-row.clickable { cursor: pointer; }
.instruction-row.clickable:hover { background: #F0FBFC; }

.instruction-row.done {
  background: #EBF9FB;
}

.instruction-row.done .instr-text,
.instruction-row.done .instr-label {
  opacity: 0.45;
  text-decoration: line-through;
  text-decoration-color: #A8D4DC;
}

/* Icon column */
.instr-icon-wrap {
  width: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
}

.type-icon {
  font-size: 0.75rem;
  color: #A8D4DC;
  line-height: 1;
}

/* Content */
.instr-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.instr-top-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.instr-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #121212;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.stitch-count {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.instr-text {
  font-size: 0.82rem;
  color: #121212;
  line-height: 1.6;
}

.text-note {
  color: #546E7A;
  font-style: italic;
  font-size: 0.78rem;
  background: #EBF9FB;
  border-left: 3px solid #A8D4DC;
  padding: 0.35rem 0.6rem;
  border-radius: 0 6px 6px 0;
  margin: 0.1rem 0;
}

.text-tip {
  color: #004080;
  font-size: 0.78rem;
  background: #E5F0FA;
  border-left: 3px solid #4A8CC4;
  padding: 0.35rem 0.6rem;
  border-radius: 0 6px 6px 0;
  margin: 0.1rem 0;
}

.text-attention {
  color: #7A1030;
  font-size: 0.78rem;
  background: #FDE8F0;
  border-left: 3px solid #EE276E;
  padding: 0.35rem 0.6rem;
  border-radius: 0 6px 6px 0;
  margin: 0.1rem 0;
  font-weight: 500;
}

.video-link {
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.15rem;
}

.video-link:hover { text-decoration: underline; }

/* ── Accordion transition ─────────────────────────────────────────── */
.accordion-enter-active, .accordion-leave-active {
  transition: opacity 0.22s, max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-height: 4000px;
}

.accordion-enter-from, .accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Reset ────────────────────────────────────────────────────────── */
.reset-btn {
  background: none;
  border: 1.5px solid #C8EEF3;
  border-radius: 10px;
  padding: 0.7rem;
  width: 100%;
  font-size: 0.78rem;
  color: #78909C;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s;
}

.reset-btn:hover {
  border-color: #B81050;
  color: #B81050;
}
</style>
