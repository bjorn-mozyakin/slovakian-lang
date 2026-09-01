import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson, STORAGE_KEYS } from '../services/localStorageKeys'
import type { WordSet } from '../entities/types'

/** Выбор наборов для тренировки — персистентен между раундами до явного изменения. */
export function useSelectedWordSets(allSets: WordSet[]) {
  const [selectedIds, setSelectedIds] = useState<string[] | null>(() =>
    readJson<string[] | null>(STORAGE_KEYS.selectedWordSetIds, null),
  )

  // null означает "ещё не выбирали" → по умолчанию все наборы
  const effectiveIds = selectedIds ?? allSets.map((s) => s.id)

  useEffect(() => {
    if (selectedIds === null) return
    const validIds = new Set(allSets.map((s) => s.id))
    const filtered = selectedIds.filter((id) => validIds.has(id))
    if (filtered.length !== selectedIds.length) {
      setSelectedIds(filtered)
    }
  }, [allSets, selectedIds])

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const base = prev ?? allSets.map((s) => s.id)
      const next = base.includes(id) ? base.filter((x) => x !== id) : [...base, id]
      writeJson(STORAGE_KEYS.selectedWordSetIds, next)
      return next
    })
  }, [allSets])

  /** Массово добавить/убрать сразу несколько наборов (например, всю категорию) одним изменением. */
  const toggleMany = useCallback((ids: string[], select: boolean) => {
    setSelectedIds((prev) => {
      const base = prev ?? allSets.map((s) => s.id)
      const idSet = new Set(ids)
      const next = select ? [...base, ...ids.filter((id) => !base.includes(id))] : base.filter((id) => !idSet.has(id))
      writeJson(STORAGE_KEYS.selectedWordSetIds, next)
      return next
    })
  }, [allSets])

  const selectAll = useCallback(() => {
    const all = allSets.map((s) => s.id)
    writeJson(STORAGE_KEYS.selectedWordSetIds, all)
    setSelectedIds(all)
  }, [allSets])

  const selectNone = useCallback(() => {
    writeJson(STORAGE_KEYS.selectedWordSetIds, [])
    setSelectedIds([])
  }, [])

  return { selectedIds: effectiveIds, toggle, toggleMany, selectAll, selectNone }
}
