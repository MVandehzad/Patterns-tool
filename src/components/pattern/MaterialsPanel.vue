<script setup lang="ts">
import { computed } from 'vue'
import type { Pattern } from '@/types/pattern'
import { usePatternProgressStore } from '@/stores/patternProgress'

const props = defineProps<{ pattern: Pattern }>()
const store = usePatternProgressStore()

const selectedSizeIdx = computed(() => store.getSelectedSizeIndex(props.pattern.id))

function quantityForSize(qtyArr: number[]): number {
  return qtyArr.length === 1 ? qtyArr[0] : (qtyArr[selectedSizeIdx.value] ?? qtyArr[0])
}

const checkedCount = computed(() =>
  props.pattern.materials.yarns.filter((y) => store.isYarnChecked(props.pattern.id, y.id)).length,
)
</script>

<template>
  <div class="materials" :style="{ '--accent': pattern.accentColor }">

    <!-- ── Yarns ─────────────────────────────────────────────────── -->
    <section class="section-block">
      <div class="section-header">
        <h3 class="section-title">Yarns</h3>
        <span class="check-progress">
          {{ checkedCount }} / {{ pattern.materials.yarns.length }} in stash
        </span>
      </div>

      <div class="yarn-list">
        <div
          v-for="yarn in pattern.materials.yarns"
          :key="yarn.id"
          class="yarn-card"
          :class="{ checked: store.isYarnChecked(pattern.id, yarn.id) }"
          @click="store.toggleYarn(pattern.id, yarn.id)"
        >
          <div class="yarn-left">
            <div class="yarn-swatch" :style="{ background: yarn.colorHex }">
              <svg
                v-if="store.isYarnChecked(pattern.id, yarn.id)"
                class="check-icon"
                width="14" height="14" viewBox="0 0 14 14"
                fill="none"
              >
                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="yarn-info">
            <div class="yarn-top-row">
              <span class="yarn-name">{{ yarn.name }}</span>
              <span class="qty-badge">
                × {{ quantityForSize(yarn.quantitiesPerSize) }} skein{{ quantityForSize(yarn.quantitiesPerSize) > 1 ? 's' : '' }}
              </span>
            </div>
            <span class="yarn-brand">{{ yarn.brand }}</span>
            <div class="yarn-meta-row">
              <span class="yarn-color-name">Color {{ yarn.colorCode }} — {{ yarn.colorName }}</span>
            </div>
            <div class="yarn-specs">
              <span class="spec">{{ yarn.fiber }}</span>
              <span class="spec-sep">·</span>
              <span class="spec">{{ yarn.weightGrams }}g / {{ yarn.weightOz }}oz</span>
              <span class="spec-sep">·</span>
              <span class="spec">{{ yarn.metersPerSkein }}m / {{ yarn.yardsPerSkein }}yds</span>
            </div>
            <p v-if="yarn.notes" class="yarn-note">{{ yarn.notes }}</p>
          </div>
        </div>
      </div>

      <a
        :href="pattern.buyUrl"
        target="_blank"
        rel="noopener"
        class="buy-btn"
        @click.stop
      >
        Buy yarn at Hobbii ↗
      </a>
    </section>

    <!-- ── Tools ─────────────────────────────────────────────────── -->
    <section class="section-block">
      <h3 class="section-title">Tools & Notions</h3>
      <div class="tools-list">
        <div
          v-for="tool in pattern.materials.tools"
          :key="tool.name"
          class="tool-row"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-name">{{ tool.name }}</span>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.materials {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.section-block {
  background: #fff;
  border: 1.5px solid #C8EEF3;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
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

.check-progress {
  font-size: 0.72rem;
  color: #546E7A;
  background: #E5F8FA;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

/* ── Yarn list ───────────────────────────────────────────────────── */
.yarn-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.yarn-card {
  display: flex;
  gap: 0.85rem;
  padding: 0.85rem;
  border-radius: 10px;
  border: 1.5px solid #C8EEF3;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.yarn-card:hover { border-color: var(--accent); }

.yarn-card.checked {
  background: #EBF9FB;
  border-color: var(--accent);
  opacity: 0.72;
}

.yarn-left {
  flex-shrink: 0;
}

.yarn-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

.yarn-info {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  flex: 1;
  min-width: 0;
}

.yarn-top-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.yarn-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #121212;
}

.qty-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent);
  background: #F0FBFC;
  border: 1px solid #C8EEF3;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  white-space: nowrap;
}

.yarn-brand {
  font-size: 0.72rem;
  color: #78909C;
}

.yarn-color-name {
  font-size: 0.75rem;
  color: #546E7A;
  font-weight: 500;
}

.yarn-specs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.15rem;
}

.spec {
  font-size: 0.68rem;
  color: #78909C;
}

.spec-sep {
  font-size: 0.6rem;
  color: #A8D4DC;
}

.yarn-note {
  font-size: 0.68rem;
  color: #546E7A;
  font-style: italic;
  margin-top: 0.2rem;
}

.buy-btn {
  display: block;
  text-align: center;
  padding: 0.7rem;
  border-radius: 10px;
  background: #EE276E;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
  margin-top: 0.25rem;
  box-shadow: 0 2px 10px rgba(238, 39, 110, 0.25);
}

.buy-btn:hover { background: #D21055; }

.buy-btn:hover { opacity: 0.88; }

/* ── Tools ───────────────────────────────────────────────────────── */
.tools-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tool-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #E5F8FA;
}

.tool-row:last-child { border-bottom: none; }

.tool-icon {
  font-size: 1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.tool-name {
  font-size: 0.82rem;
  color: #121212;
}
</style>
