import { useEffect, useState, useCallback } from 'react'
import type { WordSet } from '../entities/types'
import * as db from '../services/db'
import { onDataChanged } from '../services/dataEvents'

export function useWordSets(userId: string) {
  const [sets, setSets] = useState<WordSet[]>(() => db.getWordSets().filter((s) => s.userId === userId))

  const reload = useCallback(() => {
    setSets(db.getWordSets().filter((s) => s.userId === userId))
  }, [userId])

  useEffect(() => onDataChanged(reload), [reload])
  useEffect(() => reload(), [reload])

  return { sets, reload }
}

export function useWordCountForSet(wordSetId: string): number {
  const [count, setCount] = useState(0)
  const recompute = useCallback(() => {
    setCount(db.getWordIdsForSet(wordSetId).length)
  }, [wordSetId])
  useEffect(() => onDataChanged(recompute), [recompute])
  useEffect(() => recompute(), [recompute])
  return count
}

/** Сколько слов в наборе всего и сколько из них уже "выучено" — для галочки на карточке набора. */
export function useSetProgress(wordSetId: string): { total: number; learned: number } {
  const [progress, setProgress] = useState({ total: 0, learned: 0 })
  const recompute = useCallback(() => {
    const wordIds = new Set(db.getWordIdsForSet(wordSetId))
    const words = db.getWords().filter((w) => wordIds.has(w.id))
    setProgress({ total: words.length, learned: words.filter((w) => w.status === 'learned').length })
  }, [wordSetId])
  useEffect(() => onDataChanged(recompute), [recompute])
  useEffect(() => recompute(), [recompute])
  return progress
}
