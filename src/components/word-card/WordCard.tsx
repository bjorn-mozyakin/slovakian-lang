import type { Word } from '../../entities/types'
import { PART_OF_SPEECH_LABELS, GENDER_LABELS, MASTERY_TARGET, GAMES } from '../../entities/types'
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
  const solvedCount = word.solvedInGames.length
  const solvedTitles = word.solvedInGames.map((t) => GAMES.find((g) => g.type === t)?.title ?? t).join(', ')

  return (
    <div className={`word-card${learned ? ' word-card--learned' : ''}`}>
      <button
        className="word-card__status"
        onClick={() => onToggleStatus(word)}
        aria-label={learned ? 'Отметить как невыученное' : 'Отметить как выученное'}
        title={
          learned
            ? 'Выучено'
            : `Прогресс: ${solvedCount}/${MASTERY_TARGET}${solvedTitles ? ` (решено в: ${solvedTitles})` : ''}`
        }
      >
        {learned ? (
          '✓'
        ) : (
          <span className="word-card__dots">
            {Array.from({ length: MASTERY_TARGET }).map((_, i) => (
              <span
                key={i}
                className={`word-card__dot${i < solvedCount ? ' word-card__dot--filled' : ''}`}
              />
            ))}
          </span>
        )}
      </button>

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
