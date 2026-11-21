import type { ReactNode } from 'react'
import './PageHeader.scss'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  /** Если передан — под заголовком появляется кнопка "Назад". */
  onBack?: () => void
}

export function PageHeader({ title, subtitle, actions, onBack }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__titles">
        <h1 className="page-header__title">{title}</h1>
        {onBack && (
          <button className="page-header__back" onClick={onBack}>
            ← Назад
          </button>
        )}
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}
