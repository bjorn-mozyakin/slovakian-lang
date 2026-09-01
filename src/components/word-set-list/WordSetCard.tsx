import { Link } from 'react-router-dom'
import type { WordSet } from '../../entities/types'
import { useSetProgress } from '../../hooks/useWordSets'
import { getWordIdsForSet, setWordsStatus } from '../../services/db'
import { wordsCountLabel } from '../../utils/pluralize'
import { LearnedBadge } from '../ui/LearnedBadge'
import './WordSetCard.scss'

interface WordSetCardProps {
  set: WordSet
  /** Показывать бейдж категории — скрывается, когда список и так отфильтрован по одной категории. */
  showCategory?: boolean
}

export function WordSetCard({ set, showCategory = true }: WordSetCardProps) {
  const { total, learned } = useSetProgress(set.id)
  // У набора нет промежуточного статуса — либо выучены все слова, либо нет.
  const isFullyLearned = total > 0 && learned === total

  function handleStatusClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (total === 0) return
    setWordsStatus(getWordIdsForSet(set.id), isFullyLearned ? 'not_learned' : 'learned')
  }

  return (
    <Link to={`/word-sets/${set.id}`} className="word-set-card">
      <div className="word-set-card__main">
        <span className="word-set-card__name">{set.name}</span>
        {((showCategory && set.category) || set.description) && (
          <div className="word-set-card__meta-row">
            {showCategory && set.category && <span className="word-set-card__category">{set.category}</span>}
            {set.description && <span className="word-set-card__description">{set.description}</span>}
          </div>
        )}
      </div>
      <div className="word-set-card__end">
        <span className="word-set-card__count">{wordsCountLabel(total)}</span>
        {total > 0 && (
          <LearnedBadge
            learned={isFullyLearned}
            onClick={handleStatusClick}
            title={isFullyLearned ? 'Выучено — нажмите, чтобы сбросить' : 'Не выучено — нажмите, чтобы отметить выученным'}
          />
        )}
      </div>
    </Link>
  )
}
