import type { ReactNode } from 'react'
import './GameShell.scss'

interface GameShellProps {
  title: ReactNode
  onExit: () => void
  /** Растягивает игру на весь экран без прокрутки (на мобильных) — см. Мемори. */
  fitScreen?: boolean
  children: ReactNode
}

/** Полноэкранная обёртка игрового раунда: общая для Тренировок и Грамматики. */
export function GameShell({ title, onExit, fitScreen, children }: GameShellProps) {
  return (
    <div className={`game-shell${fitScreen ? ' game-shell--fit' : ''}`}>
      <div className="game-shell__header">
        <button className="game-shell__exit" onClick={onExit} aria-label="Завершить игру">
          ✕ {title}
        </button>
      </div>
      {children}
    </div>
  )
}
