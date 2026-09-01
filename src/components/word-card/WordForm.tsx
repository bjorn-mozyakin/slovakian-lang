import { useState, type FormEvent } from 'react'
import type { Gender, PartOfSpeech, Word, WordSet } from '../../entities/types'
import { PART_OF_SPEECH_LABELS, GENDER_LABELS } from '../../entities/types'
import { Button } from '../ui/Button'
import './WordForm.scss'

export interface WordFormValues {
  slovakWord: string
  russianTranslation: string
  partOfSpeech: PartOfSpeech | null
  gender: Gender | null
  note: string | null
}

interface WordFormProps {
  initial?: Word
  /** Наборы, в которые уже входит редактируемое слово — только для отображения (read-only). */
  sets?: WordSet[]
  onSubmit: (values: WordFormValues) => void
  onCancel: () => void
  submitLabel?: string
}

const PARTS_OF_SPEECH = Object.keys(PART_OF_SPEECH_LABELS) as PartOfSpeech[]
const GENDERS = Object.keys(GENDER_LABELS) as Gender[]

export function WordForm({ initial, sets, onSubmit, onCancel, submitLabel = 'Сохранить' }: WordFormProps) {
  const [slovakWord, setSlovakWord] = useState(initial?.slovakWord ?? '')
  const [russianTranslation, setRussianTranslation] = useState(initial?.russianTranslation ?? '')
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | ''>(initial?.partOfSpeech ?? '')
  const [gender, setGender] = useState<Gender | ''>(initial?.gender ?? '')
  const [note, setNote] = useState(initial?.note ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!slovakWord.trim() || !russianTranslation.trim()) {
      setError('Слово и перевод обязательны')
      return
    }
    onSubmit({
      slovakWord: slovakWord.trim(),
      russianTranslation: russianTranslation.trim(),
      partOfSpeech: partOfSpeech || null,
      gender: partOfSpeech === 'noun' ? gender || null : null,
      note: note.trim() || null,
    })
  }

  return (
    <form className="word-form" onSubmit={handleSubmit}>
      <div className="word-form__field">
        <label className="word-form__label" htmlFor="slovakWord">
          Слово (словацкий)*
        </label>
        <input
          id="slovakWord"
          className="word-form__input"
          value={slovakWord}
          onChange={(e) => setSlovakWord(e.target.value)}
          autoFocus
        />
      </div>

      <div className="word-form__field">
        <label className="word-form__label" htmlFor="russianTranslation">
          Перевод (русский)*
        </label>
        <input
          id="russianTranslation"
          className="word-form__input"
          value={russianTranslation}
          onChange={(e) => setRussianTranslation(e.target.value)}
        />
      </div>

      <div className="word-form__field">
        <label className="word-form__label" htmlFor="partOfSpeech">
          Часть речи
        </label>
        <select
          id="partOfSpeech"
          className="word-form__input"
          value={partOfSpeech}
          onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech | '')}
        >
          <option value="">—</option>
          {PARTS_OF_SPEECH.map((p) => (
            <option key={p} value={p}>
              {PART_OF_SPEECH_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      {partOfSpeech === 'noun' && (
        <div className="word-form__field">
          <label className="word-form__label" htmlFor="gender">
            Род
          </label>
          <select
            id="gender"
            className="word-form__input"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | '')}
          >
            <option value="">—</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="word-form__field">
        <label className="word-form__label" htmlFor="note">
          Заметка
        </label>
        <textarea
          id="note"
          className="word-form__input word-form__input--textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      {sets && sets.length > 0 && (
        <div className="word-form__field">
          <span className="word-form__label">Наборы</span>
          <div className="word-form__sets">
            {sets.map((set) => (
              <span key={set.id} className="word-form__set-tag">
                {set.name}
                {set.category && <span className="word-form__set-category">{set.category}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="word-form__error">{error}</p>}

      <div className="word-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
