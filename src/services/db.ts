import type { GameType, SprintScore, Word, WordSet, WordSetItem } from '../entities/types'
import { GAMES, MASTERY_TARGET } from '../entities/types'
import { readJson, writeJson, STORAGE_KEYS } from './localStorageKeys'
import { notifyDataChanged } from './dataEvents'

const ALL_GAME_TYPES: GameType[] = GAMES.map((g) => g.type)

/**
 * Локальное хранилище (localStorage), структура таблиц повторяет будущую
 * схему Supabase (word_sets, words, word_set_items), чтобы переход на
 * реальный бэкенд не потребовал переписывать вызывающий код — только
 * реализацию функций в этом файле (см. supabase/migrations).
 */

function uuid(): string {
  return crypto.randomUUID()
}

function nowIso(): string {
  return new Date().toISOString()
}

export function getWords(): Word[] {
  // solvedInGames заменил старый числовой masteryCount — у слов, сохранённых
  // раньше, этого поля может не быть. Для уже "выученных" слов подставляем
  // все игры (статус и так их уже исключает из тренировки); для остальных —
  // пустой список (старый общий счётчик не говорит, в каких именно играх
  // был прогресс, поэтому начинаем историю по играм заново).
  return readJson<Word[]>(STORAGE_KEYS.words, []).map((w) => ({
    ...w,
    solvedInGames: w.solvedInGames ?? (w.status === 'learned' ? ALL_GAME_TYPES : []),
  }))
}

function saveWords(words: Word[]): void {
  writeJson(STORAGE_KEYS.words, words)
  notifyDataChanged()
}

export function getWordSets(): WordSet[] {
  // category добавлена позже — у наборов, сохранённых раньше, поля может не быть.
  return readJson<WordSet[]>(STORAGE_KEYS.wordSets, []).map((s) => ({ ...s, category: s.category ?? null }))
}

function saveWordSets(sets: WordSet[]): void {
  writeJson(STORAGE_KEYS.wordSets, sets)
  notifyDataChanged()
}

export function getWordSetItems(): WordSetItem[] {
  return readJson<WordSetItem[]>(STORAGE_KEYS.wordSetItems, [])
}

function saveWordSetItems(items: WordSetItem[]): void {
  writeJson(STORAGE_KEYS.wordSetItems, items)
  notifyDataChanged()
}

export function insertWord(
  userId: string,
  data: Pick<Word, 'slovakWord' | 'russianTranslation' | 'partOfSpeech' | 'gender' | 'note'>,
): Word {
  const word: Word = {
    id: uuid(),
    userId,
    slovakWord: data.slovakWord.trim(),
    russianTranslation: data.russianTranslation.trim(),
    partOfSpeech: data.partOfSpeech,
    gender: data.partOfSpeech === 'noun' ? data.gender : null,
    note: data.note?.trim() || null,
    status: 'not_learned',
    solvedInGames: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  saveWords([...getWords(), word])
  return word
}

export function updateWord(id: string, patch: Partial<Word>): void {
  const words = getWords().map((w) =>
    w.id === id
      ? {
          ...w,
          ...patch,
          gender: (patch.partOfSpeech ?? w.partOfSpeech) === 'noun' ? (patch.gender ?? w.gender) : null,
          updatedAt: nowIso(),
        }
      : w,
  )
  saveWords(words)
}

/** Ручное переключение статуса (карточка слова, массовые операции) — синхронизирует прогресс по играм. */
export function setWordsStatus(ids: string[], status: Word['status']): void {
  const idSet = new Set(ids)
  const solvedInGames = status === 'learned' ? ALL_GAME_TYPES : []
  const words = getWords().map((w) => (idSet.has(w.id) ? { ...w, status, solvedInGames, updatedAt: nowIso() } : w))
  saveWords(words)
}

export function setAllWordsStatus(userId: string, status: Word['status']): void {
  const solvedInGames = status === 'learned' ? ALL_GAME_TYPES : []
  const words = getWords().map((w) => (w.userId === userId ? { ...w, status, solvedInGames, updatedAt: nowIso() } : w))
  saveWords(words)
}

/**
 * Прогресс тренировки считается по разным играм: правильный ответ добавляет
 * gameType в список "решено в этой игре" у слова (без дублей — повторный
 * правильный ответ в той же игре ничего не меняет, слово там больше и не
 * должно появляться). Неправильный ответ не откатывает прогресс — слово
 * просто остаётся доступным для повторной попытки в этой же игре. Когда
 * набирается MASTERY_TARGET разных игр — слово становится "выучено".
 */
export function recordAnswer(id: string, gameType: GameType, isCorrect: boolean): void {
  if (!isCorrect) return
  const words = getWords().map((w) => {
    if (w.id !== id || w.solvedInGames.includes(gameType)) return w
    const solvedInGames = [...w.solvedInGames, gameType]
    const status: Word['status'] = solvedInGames.length >= MASTERY_TARGET ? 'learned' : 'not_learned'
    return { ...w, solvedInGames, status, updatedAt: nowIso() }
  })
  saveWords(words)
}

export function deleteWord(id: string): void {
  saveWords(getWords().filter((w) => w.id !== id))
  saveWordSetItems(getWordSetItems().filter((i) => i.wordId !== id))
}

export function insertWordSet(
  userId: string,
  data: { name: string; description?: string | null; isPreset?: boolean; category?: string | null },
): WordSet {
  const set: WordSet = {
    id: uuid(),
    userId,
    name: data.name.trim(),
    description: data.description?.trim() || null,
    isPreset: data.isPreset ?? false,
    category: data.category ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  saveWordSets([...getWordSets(), set])
  return set
}

export function updateWordSet(id: string, patch: Partial<Pick<WordSet, 'name' | 'description' | 'category'>>): void {
  const sets = getWordSets().map((s) => (s.id === id ? { ...s, ...patch, updatedAt: nowIso() } : s))
  saveWordSets(sets)
}

export function deleteWordSet(id: string): void {
  saveWordSets(getWordSets().filter((s) => s.id !== id))
  saveWordSetItems(getWordSetItems().filter((i) => i.wordSetId !== id))
}

export function attachWordToSet(wordId: string, wordSetId: string): void {
  const items = getWordSetItems()
  if (items.some((i) => i.wordId === wordId && i.wordSetId === wordSetId)) return
  saveWordSetItems([...items, { id: uuid(), wordId, wordSetId }])
}

export function detachWordFromSet(wordId: string, wordSetId: string): void {
  saveWordSetItems(getWordSetItems().filter((i) => !(i.wordId === wordId && i.wordSetId === wordSetId)))
}

/**
 * Пакетная замена всей таблицы — один вызов = одна запись в localStorage.
 * Нужна для массовых операций (например, синхронизация preset-данных на
 * тысячи слов), где insertWord/attachWordToSet по одному элементу означали
 * бы тысячи полных перезаписей массива и заметное подвисание вкладки.
 */
export function replaceWords(words: Word[]): void {
  saveWords(words)
}

export function replaceWordSets(sets: WordSet[]): void {
  saveWordSets(sets)
}

export function replaceWordSetItems(items: WordSetItem[]): void {
  saveWordSetItems(items)
}

/** Топ-5 лучших попыток спринта пользователя (по очкам, убывание). */
export function getSprintScores(userId: string): SprintScore[] {
  return readJson<SprintScore[]>(STORAGE_KEYS.sprintScores, [])
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.points - a.points)
}

/**
 * Сохраняет попытку спринта и оставляет только топ-5 по очкам — остальные
 * попытки не храним, нужен только рекордный список. Возвращает id только
 * что созданной записи: если её нет среди getSprintScores после вызова —
 * значит в топ-5 она не попала.
 */
export function recordSprintScore(userId: string, points: number, correct: number, total: number): string {
  const all = readJson<SprintScore[]>(STORAGE_KEYS.sprintScores, [])
  const others = all.filter((s) => s.userId !== userId)
  const mine = all.filter((s) => s.userId === userId)
  const entry: SprintScore = { id: uuid(), userId, points, correct, total, createdAt: nowIso() }
  const top5 = [...mine, entry].sort((a, b) => b.points - a.points).slice(0, 5)
  writeJson(STORAGE_KEYS.sprintScores, [...others, ...top5])
  notifyDataChanged()
  return entry.id
}

export function getWordSetIdsForWord(wordId: string): string[] {
  return getWordSetItems()
    .filter((i) => i.wordId === wordId)
    .map((i) => i.wordSetId)
}

export function getWordIdsForSet(wordSetId: string): string[] {
  return getWordSetItems()
    .filter((i) => i.wordSetId === wordSetId)
    .map((i) => i.wordId)
}
