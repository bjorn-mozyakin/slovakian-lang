/** Ярлык для наборов без категории (собственные наборы пользователя). */
export const UNCATEGORIZED = 'Свои наборы'

/** Порядок категорий на экранах "Тренировка"/"Наборы" — остальные (нестандартные) идут после по алфавиту. */
export const CATEGORY_ORDER = [
  'Еда',
  'Дом и быт',
  'Одежда и части тела',
  'Люди и общество',
  'Время, природа и животные',
  'Язык и грамматика',
  'Учёба, работа и техника',
  'Город и транспорт',
  'Здоровье и спорт',
  'Абстрактные понятия',
  UNCATEGORIZED,
]

/** Список категорий, которые реально встречаются у переданных наборов, в каноническом порядке. */
export function sortCategories(categories: Iterable<string>): string[] {
  const set = new Set(categories)
  return [
    ...CATEGORY_ORDER.filter((c) => set.has(c)),
    ...[...set].filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, 'ru')),
  ]
}
