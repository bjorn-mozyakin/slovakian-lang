import type { GameType, Word, WordSet, WordStatus } from '../entities/types'
import * as db from './db'

export function getAllWords(userId: string): Word[] {
  return db.getWords().filter((w) => w.userId === userId)
}

export function getWordsBySetIds(userId: string, wordSetIds: string[]): Word[] {
  const idsInSets = new Set(
    db.getWordSetItems()
      .filter((i) => wordSetIds.includes(i.wordSetId))
      .map((i) => i.wordId),
  )
  return getAllWords(userId).filter((w) => idsInSets.has(w.id))
}

export function searchWords(
  userId: string,
  query: string,
  status: WordStatus | 'all',
): Word[] {
  const q = query.trim().toLowerCase()
  return getAllWords(userId).filter((w) => {
    const matchesQuery =
      !q ||
      w.slovakWord.toLowerCase().includes(q) ||
      w.russianTranslation.toLowerCase().includes(q)
    const matchesStatus = status === 'all' || w.status === status
    return matchesQuery && matchesStatus
  })
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Невыученные слова набора(ов), которые ещё не были правильно отгаданы в
 * указанной игре — уже решённые в этой игре слово в ней больше не
 * показываем (но оно доступно в остальных играх, где ещё не отгадано).
 */
export function getNotLearnedPool(userId: string, wordSetIds: string[], gameType: GameType): Word[] {
  return getWordsBySetIds(userId, wordSetIds).filter(
    (w) => w.status === 'not_learned' && !w.solvedInGames.includes(gameType),
  )
}

export function pickRandomNotLearned(
  userId: string,
  wordSetIds: string[],
  gameType: GameType,
  limit: number,
): Word[] {
  const pool = getNotLearnedPool(userId, wordSetIds, gameType)
  return shuffle(pool).slice(0, limit)
}

/** Неверные варианты для multiple choice: сначала из того же набора слов, при нехватке — из всего словаря. */
export function pickDistractors(
  userId: string,
  correctWord: Word,
  pool: Word[],
  count: number,
): Word[] {
  const candidates = pool.filter((w) => w.id !== correctWord.id)
  let chosen = shuffle(candidates).slice(0, count)
  if (chosen.length < count) {
    const rest = getAllWords(userId).filter(
      (w) => w.id !== correctWord.id && !chosen.some((c) => c.id === w.id),
    )
    chosen = [...chosen, ...shuffle(rest).slice(0, count - chosen.length)]
  }
  return chosen
}

/** Наборы, в которые входит слово (для отображения меток категории/набора у слова). */
export function getSetsForWord(userId: string, wordId: string): WordSet[] {
  const setIds = new Set(db.getWordSetIdsForWord(wordId))
  return db.getWordSets().filter((s) => s.userId === userId && setIds.has(s.id))
}

/** Уникальные категории наборов, в которые входит слово. */
export function getCategoriesForWord(userId: string, wordId: string): string[] {
  const categories = new Set(
    getSetsForWord(userId, wordId)
      .map((s) => s.category)
      .filter((c): c is string => !!c),
  )
  return [...categories].sort((a, b) => a.localeCompare(b, 'ru'))
}

/**
 * Карта id слова → его категории, посчитанная одним проходом по всем
 * наборам/связям — для списков (например "Все слова"), где считать
 * категории по каждому слову отдельным проходом было бы медленно.
 */
export function getWordCategoriesMap(userId: string): Map<string, string[]> {
  const setCategoryById = new Map(
    db.getWordSets()
      .filter((s) => s.userId === userId)
      .map((s) => [s.id, s.category] as const),
  )
  const byWord = new Map<string, Set<string>>()
  for (const item of db.getWordSetItems()) {
    const category = setCategoryById.get(item.wordSetId)
    if (!category) continue
    if (!byWord.has(item.wordId)) byWord.set(item.wordId, new Set())
    byWord.get(item.wordId)!.add(category)
  }
  const result = new Map<string, string[]>()
  for (const [wordId, categories] of byWord) {
    result.set(wordId, [...categories].sort((a, b) => a.localeCompare(b, 'ru')))
  }
  return result
}

export function normalizeAnswer(value: string): string {
  // Ё считаем равнозначной Е — в базе только Е (проще вводить), но если
  // пользователь по привычке наберёт Ё, ответ всё равно должен засчитаться.
  return value.trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ')
}

/** Поле перевода может содержать несколько вариантов через запятую ("ботинки, обувь") — все они допустимы. */
export function getAnswerVariants(text: string): string[] {
  const parts = text.split(',').map((p) => p.trim()).filter(Boolean)
  return parts.length > 0 ? parts : [text]
}

/** Верно ли значение — совпадает ли хотя бы с одним из вариантов (или с полной строкой целиком). */
export function isAnswerCorrect(value: string, target: string): boolean {
  const normalizedValue = normalizeAnswer(value)
  if (normalizedValue === normalizeAnswer(target)) return true
  return getAnswerVariants(target).some((variant) => normalizeAnswer(variant) === normalizedValue)
}

/** Один вариант написания слова — для игр, где нужен ровно один текст (например, сборка слова по буквам). */
export function getPrimaryVariant(text: string): string {
  return getAnswerVariants(text)[0]
}
