import './LearnedBadge.scss'

interface LearnedBadgeProps {
  learned: boolean
  onClick?: (e: React.MouseEvent) => void
  title?: string
}

/** Кликабельный индикатор "выучено" — общий и для отдельного слова, и для набора целиком. */
export function LearnedBadge({ learned, onClick, title }: LearnedBadgeProps) {
  return (
    <button
      type="button"
      className={`learned-badge${learned ? ' learned-badge--learned' : ' learned-badge--not-learned'}`}
      onClick={onClick}
      title={title}
    >
      {learned ? '✓' : '?'}
    </button>
  )
}
