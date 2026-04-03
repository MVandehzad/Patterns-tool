<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPatternById } from '@/data/patterns'
import PatternViewer from '@/components/pattern/PatternViewer.vue'

const route = useRoute()
const router = useRouter()

const pattern = computed(() => getPatternById(route.params.id as string))
</script>

<template>
  <div v-if="pattern">
    <PatternViewer :pattern="pattern" @back="router.push('/')" />
  </div>
  <div v-else class="not-found">
    <p>Pattern not found.</p>
    <button @click="router.push('/')">Back to library</button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  color: #2D2926;
}
</style>
