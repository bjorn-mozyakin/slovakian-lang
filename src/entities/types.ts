export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'numeral'
  | 'interjection'

export type Gender = 'masculine' | 'feminine' | 'neuter'

export type WordStatus = 'learned' | 'not_learned'

export const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, string> = {
  noun: 'существительное',
  verb: 'глагол',
  adjective: 'прилагательное',
  adverb: 'наречие',
  pronoun: 'местоимение',
  preposition: 'предлог',
  conjunction: 'союз',
  numeral: 'числительное',
  interjection: 'междометие',
}

export const GENDER_LABELS: Record<Gender, string> = {
  masculine: 'мужской',
  feminine: 'женский',
  neuter: 'средний',
}

export interface Word {
  id: string
  userId: string
  slovakWord: string
  russianTranslation: string
  partOfSpeech: PartOfSpeech | null
  gender: Gender | null
  note: string | null
  status: WordStatus
  solvedInGames: GameType[]
  createdAt: string
  updatedAt: string
}

export interface WordSet {
  id: string
  userId: string
  name: string
  description: string | null
  isPreset: boolean
  /** Необязательная тематическая категория — для группировки на экранах "Тренировка"/"Мои наборы". */
  category: string | null
  createdAt: string
  updatedAt: string
}

export interface WordSetItem {
  id: string
  wordId: string
  wordSetId: string
}

export type GameType =
  | 'choice-sk-ru'
  | 'choice-ru-sk'
  | 'type-sk-ru'
  | 'type-ru-sk'
  | 'builder'
  | 'memory'
  | 'sprint'

export interface GameInfo {
  type: GameType
  title: string
  description: string
}

export const GAMES: GameInfo[] = [
  { type: 'choice-sk-ru', title: 'Слово → перевод', description: 'Выбери верный перевод (SK → RU)' },
  { type: 'choice-ru-sk', title: 'Перевод → слово', description: 'Выбери верное слово (RU → SK)' },
  { type: 'type-sk-ru', title: 'Ввод перевода', description: 'Впиши перевод на русском (SK → RU)' },
  { type: 'type-ru-sk', title: 'Ввод слова', description: 'Впиши слово на словацком (RU → SK)' },
  { type: 'builder', title: 'Конструктор слов', description: 'Собери словацкое слово из букв' },
  { type: 'sprint', title: 'Спринт', description: 'Верно или неверно — на скорость' },
  { type: 'memory', title: 'Мемори', description: 'Найди пары слово ↔ перевод' },
]

/**
 * Прогресс тренировки считается по РАЗНЫМ играм: solvedInGames — список типов
 * игр, где слово хотя бы раз было отгадано правильно (без дублей). Слово
 * становится "выучено", только когда пройдены ВСЕ игры из GAMES. Внутри
 * одной и той же игры уже решённое в ней слово больше не показывается —
 * только в тех играх, где оно ещё не отгадано.
 */
export const MASTERY_TARGET = GAMES.length

export interface RoundResult {
  gameType: GameType
  correct: number
  total: number
  mistakes?: number
  points?: number
  durationSec?: number
  insufficientWords?: boolean
  /** id только что сохранённой попытки спринта — по нему ищем её в топ-5 на экране результата. */
  sprintScoreId?: string
}

/** Одна из топ-5 лучших попыток спринта пользователя (по очкам), с датой достижения. */
export interface SprintScore {
  id: string
  userId: string
  points: number
  correct: number
  total: number
  createdAt: string
}

export const SLOVAK_SPECIAL_CHARS = [
  'á', 'ä', 'č', 'ď', 'dz', 'dž', 'é', 'í', 'ľ', 'ĺ', 'ň', 'ó', 'ô', 'ŕ', 'š', 'ť', 'ú', 'ý', 'ž',
]
