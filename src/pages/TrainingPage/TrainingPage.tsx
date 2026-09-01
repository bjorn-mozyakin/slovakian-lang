import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets, useWordCountForSet } from '../../hooks/useWordSets'
import { useSelectedWordSets } from '../../hooks/useSelectedWordSets'
import { useWords } from '../../hooks/useWords'
import { getNotLearnedPool, getWordsBySetIds } from '../../services/wordsService'
import { wordsCountLabel } from '../../utils/pluralize'
import { UNCATEGORIZED, sortCategories } from '../../utils/categories'
import { GAMES } from '../../entities/types'
import type { WordSet } from '../../entities/types'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import './TrainingPage.scss'

function TrainingChip({
  set,
  active,
  onToggle,
}: {
  set: WordSet
  active: boolean
  onToggle: () => void
}) {
  const count = useWordCountForSet(set.id)
  return (
    <button
      className={`training-page__chip${active ? ' training-page__chip--active' : ''}`}
      onClick={onToggle}
    >
      {set.name}
      <span className="training-page__chip-count">{count}</span>
    </button>
  )
}

function CategoryGroup({
  userId,
  category,
  sets,
  selectedIds,
  expanded,
  onToggleExpand,
  onToggleSet,
  onToggleCategory,
}: {
  userId: string
  category: string
  sets: WordSet[]
  selectedIds: string[]
  expanded: boolean
  onToggleExpand: () => void
  onToggleSet: (id: string) => void
  onToggleCategory: (allSelected: boolean) => void
}) {
  const selectedCount = sets.filter((s) => selectedIds.includes(s.id)).length
  const allSelected = selectedCount === sets.length
  const someSelected = selectedCount > 0 && !allSelected
  // Без useMemo: должно пересчитываться при любом изменении слов/наборов,
  // а не только когда меняется сам список sets этой категории.
  const totalWords = getWordsBySetIds(userId, sets.map((s) => s.id)).length

  return (
    <div className="training-page__category">
      <div className="training-page__category-header">
        <button
          className="training-page__category-checkbox"
          onClick={() => onToggleCategory(allSelected)}
          aria-label={allSelected ? `Убрать категорию «${category}»` : `Выбрать всю категорию «${category}»`}
          data-state={allSelected ? 'all' : someSelected ? 'some' : 'none'}
        >
          {allSelected ? '✓' : someSelected ? '–' : ''}
        </button>
        <button className="training-page__category-title" onClick={onToggleExpand}>
          <span className="training-page__category-name-row">
            <span className={`training-page__category-chevron${expanded ? ' training-page__category-chevron--open' : ''}`}>
              ▸
            </span>
            {category}
          </span>
          <span className="training-page__category-meta">
            {selectedCount}/{sets.length} наборов · {wordsCountLabel(totalWords)}
          </span>
        </button>
      </div>
      {expanded && (
        <div className="training-page__chips">
          {sets.map((set) => (
            <TrainingChip
              key={set.id}
              set={set}
              active={selectedIds.includes(set.id)}
              onToggle={() => onToggleSet(set.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TrainingPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session!.userId
  const { sets } = useWordSets(userId)
  const { selectedIds, toggle, toggleMany, selectAll, selectNone } = useSelectedWordSets(sets)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)
  // Подписка на изменения словаря, чтобы счётчики обновлялись сразу.
  const { words } = useWords(userId)

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, WordSet[]>()
    for (const set of sets) {
      const category = set.category ?? UNCATEGORIZED
      if (!groups.has(category)) groups.set(category, [])
      groups.get(category)!.push(set)
    }
    for (const list of groups.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    }
    return sortCategories(groups.keys()).map((name) => ({ category: name, sets: groups.get(name)! }))
  }, [sets])

  const selectedWordsCount = useMemo(
    () => getWordsBySetIds(userId, selectedIds).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, selectedIds.join(','), sets],
  )

  // Сколько слов из выбранных наборов ещё не отгадано в каждой конкретной
  // игре — уже решённые в игре слова в ней больше не появятся. Спринт —
  // исключение: там всегда доступны все слова набора, без исключения по
  // прогрессу (см. GamePage.tsx), поэтому для него просто общее число слов.
  const remainingByGame = useMemo(
    () =>
      new Map(
        GAMES.map((game) => [
          game.type,
          game.type === 'sprint' ? selectedWordsCount : getNotLearnedPool(userId, selectedIds, game.type).length,
        ]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, selectedIds.join(','), words, selectedWordsCount],
  )

  function toggleExpand(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  if (sets.length === 0) {
    return (
      <div className="training-page">
        <PageHeader title="Тренировка" />
        <EmptyState
          title="Сначала добавьте набор слов"
          description="Создайте набор и добавьте в него слова, чтобы начать тренировку"
          action={<Button onClick={() => navigate('/word-sets')}>Мои наборы</Button>}
        />
      </div>
    )
  }

  return (
    <div className="training-page">
      <PageHeader title="Тренировка" />

      <section className="training-page__filter">
        <div className="training-page__filter-header">
          <button className="training-page__filter-toggle" onClick={() => setFilterOpen((v) => !v)}>
            <span className="training-page__category-name-row">
              <span className={`training-page__category-chevron${filterOpen ? ' training-page__category-chevron--open' : ''}`}>
                ▸
              </span>
              <h2 className="training-page__filter-title">Наборы для тренировки</h2>
            </span>
            <span className="training-page__selected-count">
              {selectedIds.length === 0
                ? 'не выбраны'
                : `выбрано ${selectedIds.length} · ${wordsCountLabel(selectedWordsCount)}`}
            </span>
          </button>
          <div className="training-page__filter-actions">
            <button className="training-page__filter-link" onClick={selectAll}>
              Все
            </button>
            <button className="training-page__filter-link" onClick={selectNone}>
              Ничего
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="training-page__categories">
            {groupedByCategory.map(({ category, sets: categorySets }) => (
              <CategoryGroup
                key={category}
                userId={userId}
                category={category}
                sets={categorySets}
                selectedIds={selectedIds}
                expanded={expandedCategories.has(category)}
                onToggleExpand={() => toggleExpand(category)}
                onToggleSet={toggle}
                onToggleCategory={(allSelected) =>
                  toggleMany(categorySets.map((s) => s.id), !allSelected)
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="training-page__games">
        <h2 className="training-page__games-title">Игры</h2>
        <div className="training-page__game-list">
          {GAMES.map((game) => (
            <button
              key={game.type}
              className="training-page__game-card"
              disabled={selectedIds.length === 0}
              onClick={() => navigate(`/game/${game.type}`)}
            >
              <span className="training-page__game-title">{game.title}</span>
              <span className="training-page__game-description">{game.description}</span>
              {selectedIds.length > 0 && (
                <span className="training-page__game-remaining">
                  Осталось {wordsCountLabel(remainingByGame.get(game.type) ?? 0)}
                </span>
              )}
            </button>
          ))}
        </div>
        {selectedIds.length === 0 && (
          <p className="training-page__hint">Выберите хотя бы один набор, чтобы начать игру</p>
        )}
      </section>
    </div>
  )
}
