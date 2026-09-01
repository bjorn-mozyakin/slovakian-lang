import type { Word } from '../../entities/types'
import { PART_OF_SPEECH_LABELS, GENDER_LABELS } from '../../entities/types'
import { LearnedBadge } from '../ui/LearnedBadge'
import './WordCard.scss'

interface WordCardProps {
  word: Word
  onToggleStatus: (word: Word) => void
  onEdit: (word: Word) => void
  onDelete: (word: Word) => void
  /** Категории наборов, в которые входит слово — показываются мелкими метками, если переданы. */
  categories?: string[]
}

export function WordCard({ word, onToggleStatus, onEdit, onDelete, categories }: WordCardProps) {
  const learned = word.status === 'learned'

  return (
    <div className={`word-card${learned ? ' word-card--learned' : ''}`}>
      <LearnedBadge
        learned={learned}
        onClick={() => onToggleStatus(word)}
        title={learned ? 'Выучено — нажмите, чтобы сбросить' : 'Не выучено — нажмите, чтобы отметить выученным'}
      />

      <div className="word-card__body" onClick={() => onEdit(word)}>
        <div className="word-card__row">
          <span className="word-card__sk">{word.slovakWord}</span>
          <span className="word-card__ru">{word.russianTranslation}</span>
        </div>
        <div className="word-card__meta">
          {word.partOfSpeech && (
            <span className="word-card__tag">
              {PART_OF_SPEECH_LABELS[word.partOfSpeech]}
              {word.gender ? `, ${GENDER_LABELS[word.gender]}` : ''}
            </span>
          )}
          {categories?.map((category) => (
            <span key={category} className="word-card__category">
              {category}
            </span>
          ))}
          {word.note && <span className="word-card__note">{word.note}</span>}
        </div>
      </div>

      <button className="word-card__delete" onClick={() => onDelete(word)} aria-label="Удалить слово">
        🗑
      </button>
    </div>
  )
}
