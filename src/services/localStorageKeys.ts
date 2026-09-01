export const STORAGE_KEYS = {
  words: 'slovak_trainer:words',
  wordSets: 'slovak_trainer:word_sets',
  wordSetItems: 'slovak_trainer:word_set_items',
  session: 'slovak_trainer:session',
  selectedWordSetIds: 'slovak_trainer:selected_word_set_ids',
  seeded: 'slovak_trainer:seeded_v1',
  sprintScores: 'slovak_trainer:sprint_scores',
} as const

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
