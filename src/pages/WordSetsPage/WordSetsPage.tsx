import { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets } from '../../hooks/useWordSets'
import { insertWordSet } from '../../services/db'
import { useWords } from '../../hooks/useWords'
import { getWordsBySetIds } from '../../services/wordsService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { WordSetCard } from '../../components/word-set-list/WordSetCard'
import { pluralizeRu, wordsCountLabel } from '../../utils/pluralize'
import { sortCategories } from '../../utils/categories'
import './WordSetsPage.scss'

const ALL_CATEGORIES = 'Все'

type Tab = 'recommended' | 'mine'

export function WordSetsPage() {
  const { session } = useAuth()
  const userId = session!.userId
  const { sets } = useWordSets(userId)
  const { words } = useWords(userId)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('recommended')
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES)

  // "Рекомендованные" — preset-наборы, заданные по умолчанию; "Мои" —
  // созданные самим пользователем (isPreset = false).
  const presetSets = useMemo(
    () => sets.filter((s) => s.isPreset).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [sets],
  )
  const customSets = useMemo(
    () => sets.filter((s) => !s.isPreset).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [sets],
  )
  const tabSets = activeTab === 'recommended' ? presetSets : customSets

  // Категории есть только у preset-наборов — у "Моих" их не бывает, поэтому
  // фильтр по категориям имеет смысл только на вкладке "Рекомендованные".
  const categories = useMemo(
    () => sortCategories(presetSets.map((s) => s.category).filter((c): c is string => !!c)),
    [presetSets],
  )

  const visibleSets = useMemo(
    () =>
      activeTab === 'recommended' && activeCategory !== ALL_CATEGORIES
        ? tabSets.filter((s) => s.category === activeCategory)
        : tabSets,
    [tabSets, activeTab, activeCategory],
  )

  const visibleWordsCount = useMemo(
    () => getWordsBySetIds(userId, visibleSets.map((s) => s.id)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, visibleSets, words],
  )

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    setActiveCategory(ALL_CATEGORIES)
  }

  function handleCreate() {
    if (!name.trim()) {
      setError('Название обязательно')
      return
    }
    insertWordSet(userId, { name, description })
    setName('')
    setDescription('')
    setError(null)
    setCreating(false)
    setActiveTab('mine')
  }

  return (
    <div className="word-sets-page">
      <PageHeader
        title="Наборы"
        subtitle={
          visibleSets.length > 0
            ? `${visibleSets.length} ${pluralizeRu(visibleSets.length, 'набор', 'набора', 'наборов')} · ${wordsCountLabel(visibleWordsCount)}`
            : undefined
        }
        actions={<Button onClick={() => setCreating(true)}>+ Набор</Button>}
      />

      <div className="word-sets-page__tabs">
        <button
          className={`word-sets-page__tab${activeTab === 'recommended' ? ' word-sets-page__tab--active' : ''}`}
          onClick={() => switchTab('recommended')}
        >
          Рекомендованные <span className="word-sets-page__tab-count">{presetSets.length}</span>
        </button>
        <button
          className={`word-sets-page__tab${activeTab === 'mine' ? ' word-sets-page__tab--active' : ''}`}
          onClick={() => switchTab('mine')}
        >
          Мои <span className="word-sets-page__tab-count">{customSets.length}</span>
        </button>
      </div>

      {activeTab === 'recommended' && categories.length > 0 && (
        <div className="word-sets-page__categories">
          <button
            className={`word-sets-page__category-chip${activeCategory === ALL_CATEGORIES ? ' word-sets-page__category-chip--active' : ''}`}
            onClick={() => setActiveCategory(ALL_CATEGORIES)}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`word-sets-page__category-chip${activeCategory === category ? ' word-sets-page__category-chip--active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {tabSets.length === 0 ? (
        activeTab === 'mine' ? (
          <EmptyState
            title="Своих наборов пока нет"
            description="Создайте набор, чтобы добавлять в него собственные слова"
            action={<Button onClick={() => setCreating(true)}>Создать набор</Button>}
          />
        ) : (
          <EmptyState title="Рекомендованных наборов нет" />
        )
      ) : (
        <div className="word-sets-page__list">
          {visibleSets.map((set) => (
            <WordSetCard
              key={set.id}
              set={set}
              showCategory={activeTab === 'recommended' && activeCategory === ALL_CATEGORIES}
            />
          ))}
        </div>
      )}

      {creating && (
        <Modal title="Новый набор" onClose={() => setCreating(false)}>
          <div className="word-sets-page__form">
            <div className="word-sets-page__field">
              <label className="word-sets-page__label" htmlFor="set-name">
                Название*
              </label>
              <input
                id="set-name"
                className="word-sets-page__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="word-sets-page__field">
              <label className="word-sets-page__label" htmlFor="set-description">
                Описание
              </label>
              <textarea
                id="set-description"
                className="word-sets-page__input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="word-sets-page__error">{error}</p>}
            <div className="word-sets-page__actions">
              <Button variant="ghost" onClick={() => setCreating(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreate}>Создать</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
