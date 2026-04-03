import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'hobbii-pattern-progress'

interface StoredPatternState {
  completedIds: string[]
  selectedSizeIndex: number
  checkedYarnIds: string[]
}

interface PatternState {
  completedIds: Set<string>
  selectedSizeIndex: number
  checkedYarnIds: Set<string>
}

function loadFromStorage(): Record<string, PatternState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: Record<string, StoredPatternState> = JSON.parse(raw)
    const result: Record<string, PatternState> = {}
    for (const [pid, ps] of Object.entries(parsed)) {
      result[pid] = {
        completedIds: new Set(ps.completedIds ?? []),
        selectedSizeIndex: ps.selectedSizeIndex ?? 0,
        checkedYarnIds: new Set(ps.checkedYarnIds ?? []),
      }
    }
    return result
  } catch {
    return {}
  }
}

function saveToStorage(states: Record<string, PatternState>) {
  const out: Record<string, StoredPatternState> = {}
  for (const [pid, ps] of Object.entries(states)) {
    out[pid] = {
      completedIds: [...ps.completedIds],
      selectedSizeIndex: ps.selectedSizeIndex,
      checkedYarnIds: [...ps.checkedYarnIds],
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(out))
}

export const usePatternProgressStore = defineStore('patternProgress', () => {
  const states = ref<Record<string, PatternState>>(loadFromStorage())

  function ensurePattern(patternId: string) {
    if (!states.value[patternId]) {
      states.value[patternId] = {
        completedIds: new Set(),
        selectedSizeIndex: 0,
        checkedYarnIds: new Set(),
      }
    }
  }

  function save() {
    saveToStorage(states.value)
  }

  function toggleInstruction(patternId: string, instructionId: string) {
    ensurePattern(patternId)
    const s = states.value[patternId]
    if (s.completedIds.has(instructionId)) {
      s.completedIds.delete(instructionId)
    } else {
      s.completedIds.add(instructionId)
    }
    save()
  }

  function isCompleted(patternId: string, instructionId: string): boolean {
    return states.value[patternId]?.completedIds.has(instructionId) ?? false
  }

  function setSelectedSize(patternId: string, index: number) {
    ensurePattern(patternId)
    states.value[patternId].selectedSizeIndex = index
    save()
  }

  function getSelectedSizeIndex(patternId: string): number {
    return states.value[patternId]?.selectedSizeIndex ?? 0
  }

  function toggleYarn(patternId: string, yarnId: string) {
    ensurePattern(patternId)
    const s = states.value[patternId]
    if (s.checkedYarnIds.has(yarnId)) {
      s.checkedYarnIds.delete(yarnId)
    } else {
      s.checkedYarnIds.add(yarnId)
    }
    save()
  }

  function isYarnChecked(patternId: string, yarnId: string): boolean {
    return states.value[patternId]?.checkedYarnIds.has(yarnId) ?? false
  }

  function sectionProgress(
    patternId: string,
    instructionIds: string[],
  ): { done: number; total: number; pct: number } {
    const done = instructionIds.filter((id) => isCompleted(patternId, id)).length
    const total = instructionIds.length
    return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
  }

  function overallProgress(
    patternId: string,
    allInstructionIds: string[],
  ): { done: number; total: number; pct: number } {
    return sectionProgress(patternId, allInstructionIds)
  }

  function resetPattern(patternId: string) {
    delete states.value[patternId]
    save()
  }

  return {
    states,
    toggleInstruction,
    isCompleted,
    setSelectedSize,
    getSelectedSizeIndex,
    toggleYarn,
    isYarnChecked,
    sectionProgress,
    overallProgress,
    resetPattern,
  }
})
