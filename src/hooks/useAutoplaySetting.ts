import { useState } from 'react'
import type { GameType } from '../entities/types'
import { readJson, writeJson, STORAGE_KEYS } from '../services/localStorageKeys'

/**
 * Настройка автопроизношения словацкого слова — отдельная для каждой игры
 * (изменение в одной игре не влияет на остальные), но выглядит и включена
 * по умолчанию одинаково везде (см. AutoplayToggle).
 */
export function useAutoplaySetting(gameType: GameType) {
  const key = `${STORAGE_KEYS.autoplayPronunciation}:${gameType}`
  const [autoplay, setAutoplayState] = useState(() => readJson(key, true))

  function setAutoplay(next: boolean) {
    setAutoplayState(next)
    writeJson(key, next)
  }

  return [autoplay, setAutoplay] as const
}
