import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets } from '../../hooks/useWordSets'
import { useWords } from '../../hooks/useWords'
import * as db from '../../services/db'
import { getSetsForWord } from '../../services/wordsService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { WordCard } from '../../components/word-card/WordCard'
import { WordForm, type WordFormValues } from '../../components/word-card/WordForm'
import type { Word } from '../../entities/types'
import './WordSetDetailPage.scss'

export function WordSetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session!.userId
  const { sets, reload: reloadSets } = useWordSets(userId)
  const { words, reload: reloadWords } = useWords(userId)

  const set = sets.find((s) => s.id === id)
  const wordIdsInSet = useMemo(() => new Set(db.getWordIdsForSet(id ?? '')), [id, words])
  const setWords = words.filter((w) => wordIdsInSet.has(w.id))
  const otherWords = words.filter((w) => !wordIdsInSet.has(w.id))

  const [editingSet, setEditingSet] = useState(false)
  const [deletingSet, setDeletingSet] = useState(false)
  const [addingWord, setAddingWord] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const [attachQuery, setAttachQuery] = useState('')
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [detachingWord, setDetachingWord] = useState<Word | null>(null)

  const [name, setName] = useState(set?.name ?? '')
  const [description, setDescription] = useState(set?.description ?? '')

  if (!set) {
    return (
      <EmptyState
        title="Набор не найден"
        action={<Button onClick={() => navigate('/word-sets')}>К списку наборов</Button>}
      />
    )
  }

  function openEditSet() {
    setName(set!.name)
    setDescription(set!.description ?? '')
    setEditingSet(true)
  }

  function handleSaveSet() {
    if (!name.trim()) return
    db.updateWordSet(set!.id, { name: name.trim(), description: description.trim() || null })
    reloadSets()
    setEditingSet(false)
  }

  function handleDeleteSet() {
    db.deleteWordSet(set!.id)
    navigate('/word-sets')
  }

  function handleCreateWord(values: WordFormValues) {
    const word = db.insertWord(userId, values)
    db.attachWordToSet(word.id, set!.id)
    reloadWords()
    setAddingWord(false)
  }

  function handleUpdateWord(values: WordFormValues) {
    if (!editingWord) return
    db.updateWord(editingWord.id, values)
    reloadWords()
    setEditingWord(null)
  }

  function handleDetach() {
    if (!detachingWord) return
    db.detachWordFromSet(detachingWord.id, set!.id)
    reloadWords()
    setDetachingWord(null)
  }

  function handleToggleStatus(word: Word) {
    db.setWordsStatus([word.id], word.status === 'learned' ? 'not_learned' : 'learned')
    reloadWords()
  }

  function handleBulkStatus(status: 'learned' | 'not_learned') {
    db.setWordsStatus(setWords.map((w) => w.id), status)
    reloadWords()
  }

  const filteredOther = otherWords.filter((w) => {
    const q = attachQuery.trim().toLowerCase()
    if (!q) return true
    return w.slovakWord.toLowerCase().includes(q) || w.russianTranslation.toLowerCase().includes(q)
  })

  return (
    <div className="word-set-detail-page">
      <PageHeader
        title={set.name}
        actions={
          <>
            <Button variant="ghost" onClick={openEditSet}>
              Изменить
            </Button>
            <Button variant="danger" onClick={() => setDeletingSet(true)}>
              Удалить
            </Button>
          </>
        }
      />

      {set.description && <p className="word-set-detail-page__description">{set.description}</p>}

      <div className="word-set-detail-page__toolbar">
        <Button variant="secondary" onClick={() => handleBulkStatus('not_learned')}>
          Сбросить статусы набора
        </Button>
        <Button variant="secondary" onClick={() => handleBulkStatus('learned')}>
          Отметить все выученными
        </Button>
      </div>

      <div className="word-set-detail-page__add">
        <Button onClick={() => setAddingWord(true)}>+ Новое слово</Button>
        <Button variant="ghost" onClick={() => setAttaching(true)}>
          Привязать существующее
        </Button>
      </div>

      {setWords.length === 0 ? (
        <EmptyState title="В наборе пока нет слов" description="Добавьте новое слово или привяжите существующее" />
      ) : (
        <div className="word-set-detail-page__list">
          {setWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onToggleStatus={handleToggleStatus}
              onEdit={setEditingWord}
              onDelete={setDetachingWord}
            />
          ))}
        </div>
      )}

      {editingSet && (
        <Modal title="Изменить набор" onClose={() => setEditingSet(false)}>
          <div className="word-set-detail-page__form">
            <div className="word-set-detail-page__field">
              <label className="word-set-detail-page__label" htmlFor="edit-name">
                Название*
              </label>
              <input
                id="edit-name"
                className="word-set-detail-page__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="word-set-detail-page__field">
              <label className="word-set-detail-page__label" htmlFor="edit-description">
                Описание
              </label>
              <textarea
                id="edit-description"
                className="word-set-detail-page__input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="word-set-detail-page__actions">
              <Button variant="ghost" onClick={() => setEditingSet(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveSet}>Сохранить</Button>
            </div>
          </div>
        </Modal>
      )}

      {deletingSet && (
        <ConfirmDialog
          title="Удалить набор?"
          message="Набор будет удалён. Слова из набора не удаляются — они останутся в разделе «Все слова» без привязки к набору."
          confirmLabel="Удалить"
          danger
          onConfirm={handleDeleteSet}
          onCancel={() => setDeletingSet(false)}
        />
      )}

      {addingWord && (
        <Modal title="Новое слово" onClose={() => setAddingWord(false)}>
          <WordForm onSubmit={handleCreateWord} onCancel={() => setAddingWord(false)} submitLabel="Добавить" />
        </Modal>
      )}

      {editingWord && (
        <Modal title="Редактировать слово" onClose={() => setEditingWord(null)}>
          <WordForm
            initial={editingWord}
            sets={getSetsForWord(userId, editingWord.id)}
            onSubmit={handleUpdateWord}
            onCancel={() => setEditingWord(null)}
          />
        </Modal>
      )}

      {detachingWord && (
        <ConfirmDialog
          title="Убрать слово из набора?"
          message="Слово не удаляется полностью — оно останется в разделе «Все слова». Удалить слово насовсем можно там."
          confirmLabel="Убрать из набора"
          danger
          onConfirm={handleDetach}
          onCancel={() => setDetachingWord(null)}
        />
      )}

      {attaching && (
        <Modal title="Привязать существующее слово" onClose={() => setAttaching(false)}>
          <input
            className="word-set-detail-page__input"
            placeholder="Поиск слова..."
            value={attachQuery}
            onChange={(e) => setAttachQuery(e.target.value)}
            autoFocus
          />
          <div className="word-set-detail-page__attach-list">
            {filteredOther.length === 0 && (
              <p className="word-set-detail-page__empty-hint">Ничего не найдено</p>
            )}
            {filteredOther.map((w) => (
              <button
                key={w.id}
                className="word-set-detail-page__attach-item"
                onClick={() => {
                  db.attachWordToSet(w.id, set!.id)
                  reloadWords()
                }}
              >
                <span>{w.slovakWord}</span>
                <span className="word-set-detail-page__attach-ru">{w.russianTranslation}</span>
                <span className="word-set-detail-page__attach-plus">+</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
