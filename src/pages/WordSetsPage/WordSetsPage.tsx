import { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets } from '../../hooks/useWordSets'
import { insertWordSet, setWordsStatus, getWordIdsForSet } from '../../services/db'
import { useWords } from '../../hooks/useWords'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { WordSetCard } from '../../components/word-set-list/WordSetCard'
import { pluralizeRu, wordsCountLabel } from '../../utils/pluralize'
import './WordSetsPage.scss'

export function WordSetsPage() {
  const { session } = useAuth()
  const userId = session!.userId
  const { sets } = useWordSets(userId)
  const { words, reload: reloadWords } = useWords(userId)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const sortedSets = useMemo(
    () => [...sets].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [sets],
  )

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
  }

  function toggleSelectionMode() {
    setSelectionMode((v) => !v)
    setSelectedIds([])
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function applyBulkStatus(status: 'learned' | 'not_learned') {
    const wordIds = selectedIds.flatMap((setId) => getWordIdsForSet(setId))
    setWordsStatus(wordIds, status)
    reloadWords()
    setSelectionMode(false)
    setSelectedIds([])
  }

  return (
    <div className="word-sets-page">
      <PageHeader
        title="Мои наборы"
        subtitle={
          sets.length > 0
            ? `${sets.length} ${pluralizeRu(sets.length, 'набор', 'набора', 'наборов')} · ${wordsCountLabel(words.length)} всего`
            : undefined
        }
        actions={
          <>
            {sets.length > 0 && (
              <Button variant="ghost" onClick={toggleSelectionMode}>
                {selectionMode ? 'Отмена' : 'Выбрать'}
              </Button>
            )}
            <Button onClick={() => setCreating(true)}>+ Набор</Button>
          </>
        }
      />

      {sets.length === 0 ? (
        <EmptyState
          title="Наборов пока нет"
          description="Создайте первый набор слов, чтобы начать пополнять словарь"
          action={<Button onClick={() => setCreating(true)}>Создать набор</Button>}
        />
      ) : (
        <div className="word-sets-page__list">
          {sortedSets.map((set) => (
            <WordSetCard
              key={set.id}
              set={set}
              selectionMode={selectionMode}
              selected={selectedIds.includes(set.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {selectionMode && selectedIds.length > 0 && (
        <div className="word-sets-page__bulk-bar">
          <span className="word-sets-page__bulk-count">Выбрано: {selectedIds.length}</span>
          <Button variant="secondary" onClick={() => applyBulkStatus('not_learned')}>
            Сбросить статусы
          </Button>
          <Button onClick={() => applyBulkStatus('learned')}>Отметить выученными</Button>
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
