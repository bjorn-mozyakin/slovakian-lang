import { useCallback, useEffect, useState } from 'react'
import type { Word } from '../entities/types'
import * as db from '../services/db'
import { onDataChanged } from '../services/dataEvents'

export function useWords(userId: string) {
  const [words, setWords] = useState<Word[]>(() => db.getWords().filter((w) => w.userId === userId))

  const reload = useCallback(() => {
    setWords(db.getWords().filter((w) => w.userId === userId))
  }, [userId])

  useEffect(() => onDataChanged(reload), [reload])
  useEffect(() => reload(), [reload])

  return { words, reload }
}
