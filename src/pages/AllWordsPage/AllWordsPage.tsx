import { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useWords } from '../../hooks/useWords'
import * as db from '../../services/db'
import { getSetsForWord, getWordCategoriesMap } from '../../services/wordsService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { WordCard } from '../../components/word-card/WordCard'
import { WordForm, type WordFormValues } from '../../components/word-card/WordForm'
import type { Word, WordStatus } from '../../entities/types'
import { wordsCountLabel } from '../../utils/pluralize'
import './AllWordsPage.scss'

type StatusFilter = WordStatus | 'all'

export function AllWordsPage() {
  const { session } = useAuth()
  const userId = session!.userId
  const { words, reload } = useWords(userId)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [adding, setAdding] = useState(false)
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [deletingWord, setDeletingWord] = useState<Word | null>(null)

  const matchingQuery = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return words
    return words.filter(
      (w) => w.slovakWord.toLowerCase().includes(q) || w.russianTranslation.toLowerCase().includes(q),
    )
  }, [words, query])

  const filtered = useMemo(
    () => (status === 'all' ? matchingQuery : matchingQuery.filter((w) => w.status === status)),
    [matchingQuery, status],
  )

  const counts = useMemo(
    () => ({
      all: matchingQuery.length,
      not_learned: matchingQuery.filter((w) => w.status === 'not_learned').length,
      learned: matchingQuery.filter((w) => w.status === 'learned').length,
    }),
    [matchingQuery],
  )

  // Одним проходом считаем категории для всех слов сразу — иначе на 2000+
  // словах пришлось бы гонять поиск наборов по каждому слову отдельно.
  const categoriesByWord = useMemo(() => getWordCategoriesMap(userId), [userId, words])

  function handleToggleStatus(word: Word) {
    db.setWordsStatus([word.id], word.status === 'learned' ? 'not_learned' : 'learned')
    reload()
  }

  function handleCreate(values: WordFormValues) {
    db.insertWord(userId, values)
    reload()
    setAdding(false)
  }

  function handleUpdate(values: WordFormValues) {
    if (!editingWord) return
    db.updateWord(editingWord.id, values)
    reload()
    setEditingWord(null)
  }

  function handleDelete() {
    if (!deletingWord) return
    db.deleteWord(deletingWord.id)
    reload()
    setDeletingWord(null)
  }

  return (
    <div className="all-words-page">
      <PageHeader
        title="Все слова"
        subtitle={
          filtered.length === words.length
            ? wordsCountLabel(words.length)
            : `Показано ${filtered.length} из ${words.length}`
        }
        actions={<Button onClick={() => setAdding(true)}>+ Слово</Button>}
      />

      <div className="all-words-page__filters">
        <input
          className="all-words-page__search"
          placeholder="Поиск по словацкому или русскому..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="all-words-page__status-tabs">
          <button
            className={`all-words-page__status-tab${status === 'all' ? ' all-words-page__status-tab--active' : ''}`}
            onClick={() => setStatus('all')}
          >
            Все <span className="all-words-page__status-count">{counts.all}</span>
          </button>
          <button
            className={`all-words-page__status-tab${status === 'not_learned' ? ' all-words-page__status-tab--active' : ''}`}
            onClick={() => setStatus('not_learned')}
          >
            Не выучено <span className="all-words-page__status-count">{counts.not_learned}</span>
          </button>
          <button
            className={`all-words-page__status-tab${status === 'learned' ? ' all-words-page__status-tab--active' : ''}`}
            onClick={() => setStatus('learned')}
          >
            Выучено <span className="all-words-page__status-count">{counts.learned}</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={words.length === 0 ? 'Словарь пока пуст' : 'Ничего не найдено'}
          description={words.length === 0 ? 'Добавьте слово или зайдите в набор' : 'Попробуйте изменить запрос или фильтр'}
        />
      ) : (
        <div className="all-words-page__list">
          {filtered.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              categories={categoriesByWord.get(word.id)}
              onToggleStatus={handleToggleStatus}
              onEdit={setEditingWord}
              onDelete={setDeletingWord}
            />
          ))}
        </div>
      )}

      {adding && (
        <Modal title="Новое слово" onClose={() => setAdding(false)}>
          <WordForm onSubmit={handleCreate} onCancel={() => setAdding(false)} submitLabel="Добавить" />
        </Modal>
      )}

      {editingWord && (
        <Modal title="Редактировать слово" onClose={() => setEditingWord(null)}>
          <WordForm
            initial={editingWord}
            sets={getSetsForWord(userId, editingWord.id)}
            onSubmit={handleUpdate}
            onCancel={() => setEditingWord(null)}
          />
        </Modal>
      )}

      {deletingWord && (
        <ConfirmDialog
          title="Удалить слово?"
          message="Слово будет удалено полностью, включая привязку ко всем наборам. Это действие необратимо."
          confirmLabel="Удалить"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingWord(null)}
        />
      )}
    </div>
  )
}
