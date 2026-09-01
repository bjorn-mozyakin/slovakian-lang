import { Link } from 'react-router-dom'
import type { WordSet } from '../../entities/types'
import { useWordCountForSet } from '../../hooks/useWordSets'
import { wordsCountLabel } from '../../utils/pluralize'
import './WordSetCard.scss'

interface WordSetCardProps {
  set: WordSet
  selectionMode?: boolean
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

export function WordSetCard({ set, selectionMode, selected, onToggleSelect }: WordSetCardProps) {
  const count = useWordCountForSet(set.id)

  const content = (
    <>
      {selectionMode && (
        <input
          type="checkbox"
          className="word-set-card__checkbox"
          checked={!!selected}
          onChange={() => onToggleSelect?.(set.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className="word-set-card__main">
        <span className="word-set-card__name">{set.name}</span>
        {(set.category || set.description) && (
          <div className="word-set-card__meta-row">
            {set.category && <span className="word-set-card__category">{set.category}</span>}
            {set.description && <span className="word-set-card__description">{set.description}</span>}
          </div>
        )}
      </div>
      <span className="word-set-card__count">{wordsCountLabel(count)}</span>
    </>
  )

  if (selectionMode) {
    return (
      <div
        className="word-set-card word-set-card--selectable"
        onClick={() => onToggleSelect?.(set.id)}
      >
        {content}
      </div>
    )
  }

  return (
    <Link to={`/word-sets/${set.id}`} className="word-set-card">
      {content}
    </Link>
  )
}
