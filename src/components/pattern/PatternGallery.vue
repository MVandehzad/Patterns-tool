<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
  patternName: string
  open: boolean
  initialIndex?: number
}>()

const emit = defineEmits<{ close: [] }>()

const current = ref(props.initialIndex ?? 0)

// Reset to initialIndex whenever gallery opens
watch(() => props.open, (val) => {
  if (val) current.value = props.initialIndex ?? 0
})

const total = computed(() => props.images.length)
const hasPrev = computed(() => current.value > 0)
const hasNext = computed(() => current.value < total.value - 1)

function prev() { if (hasPrev.value) current.value-- }
function next() { if (hasNext.value) current.value++ }
function goTo(i: number) { current.value = i }

function handleKey(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'Escape')     emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="gallery-fade">
      <div v-if="open" class="gallery-overlay" @click.self="emit('close')">

        <!-- ── Top bar ─────────────────────────────────────────────── -->
        <div class="gallery-topbar">
          <span class="gallery-pattern-name">{{ patternName }}</span>
          <span class="gallery-counter">{{ current + 1 }} / {{ total }}</span>
          <button class="gallery-close" @click="emit('close')" aria-label="Close gallery">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- ── Main image ──────────────────────────────────────────── -->
        <div class="gallery-stage">

          <!-- Prev hit area / arrow -->
          <button
            class="gallery-nav gallery-nav-prev"
            :class="{ hidden: !hasPrev }"
            @click="prev"
            aria-label="Previous photo"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <Transition name="img-slide" mode="out-in">
            <img
              :key="current"
              :src="images[current]"
              :alt="`${patternName} photo ${current + 1}`"
              class="gallery-main-img"
            />
          </Transition>

          <!-- Next hit area / arrow -->
          <button
            class="gallery-nav gallery-nav-next"
            :class="{ hidden: !hasNext }"
            @click="next"
            aria-label="Next photo"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- ── Dot indicators ──────────────────────────────────────── -->
        <div class="gallery-dots" v-if="total <= 8">
          <button
            v-for="(_, i) in images"
            :key="i"
            class="gallery-dot"
            :class="{ active: i === current }"
            @click="goTo(i)"
            :aria-label="`Go to photo ${i + 1}`"
          />
        </div>

        <!-- ── Thumbnail strip ─────────────────────────────────────── -->
        <div class="gallery-thumbs">
          <button
            v-for="(img, i) in images"
            :key="i"
            class="thumb-btn"
            :class="{ active: i === current }"
            @click="goTo(i)"
            :aria-label="`Photo ${i + 1}`"
          >
            <img :src="img.replace('1200/800', '240/160')" :alt="`Thumbnail ${i + 1}`" class="thumb-img" />
          </button>
        </div>

        <!-- ── Keyboard hint ───────────────────────────────────────── -->
        <p class="gallery-hint">← → to navigate &nbsp;·&nbsp; Esc to close</p>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────────────── */
.gallery-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(8, 10, 14, 0.96);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
}

/* Fade in/out */
.gallery-fade-enter-active,
.gallery-fade-leave-active { transition: opacity 0.22s ease; }
.gallery-fade-enter-from,
.gallery-fade-leave-to    { opacity: 0; }

/* ── Top bar ─────────────────────────────────────────────────────── */
.gallery-topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.gallery-pattern-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  flex: 1;
}

.gallery-counter {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.08);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  margin-right: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.gallery-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;
  flex-shrink: 0;
}

.gallery-close:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.08);
}

/* ── Stage ───────────────────────────────────────────────────────── */
.gallery-stage {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 0;
  padding: 1rem 4.5rem;
}

.gallery-main-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

/* Slide transition between images */
.img-slide-enter-active,
.img-slide-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.img-slide-enter-from   { opacity: 0; transform: scale(0.97); }
.img-slide-leave-to     { opacity: 0; transform: scale(1.02); }

/* ── Navigation arrows ───────────────────────────────────────────── */
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.gallery-nav:hover { background: rgba(255,255,255,0.22); }
.gallery-nav:active { transform: translateY(-50%) scale(0.94); }
.gallery-nav.hidden { opacity: 0.2; pointer-events: none; }

.gallery-nav-prev { left: 1rem; }
.gallery-nav-next { right: 1rem; }

/* ── Dot indicators ──────────────────────────────────────────────── */
.gallery-dots {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem 0;
  flex-shrink: 0;
}

.gallery-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}

.gallery-dot.active {
  background: #00B9CD;
  transform: scale(1.4);
}

/* ── Thumbnail strip ─────────────────────────────────────────────── */
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem 0.8rem;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
  border-top: 1px solid rgba(255,255,255,0.07);
  width: 100%;
  justify-content: center;
}

.gallery-thumbs::-webkit-scrollbar { display: none; }

.thumb-btn {
  flex-shrink: 0;
  width: 64px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.18s, transform 0.18s, opacity 0.18s;
  background: none;
  opacity: 0.5;
}

.thumb-btn.active {
  border-color: #00B9CD;
  opacity: 1;
  transform: scale(1.06);
}

.thumb-btn:hover:not(.active) { opacity: 0.75; }

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Keyboard hint ───────────────────────────────────────────────── */
.gallery-hint {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.25);
  padding: 0 0 0.6rem;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}
</style>
