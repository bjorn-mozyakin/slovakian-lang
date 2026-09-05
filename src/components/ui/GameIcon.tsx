import type { GameType } from '../../entities/types'
import './GameIcon.scss'

/** Иконки игр — картинки пользователя из public/icons (см. README-договорённость по именам файлов). */
const ICON_FILES: Partial<Record<GameType, string>> = {
  'choice-sk-ru': '01_word_to_translation.png',
  'choice-ru-sk': '02_translation_to_word.png',
  'type-sk-ru': '03_type_translation.png',
  'type-ru-sk': '04_type_word.png',
  builder: '05_word_constructor.png',
  sprint: '06_sprint.png',
  memory: '07_memory.png',
}

interface GameIconProps {
  type: GameType
}

export function GameIcon({ type }: GameIconProps) {
  const file = ICON_FILES[type]
  if (!file) {
    return (
      <span className="game-icon game-icon--placeholder" aria-hidden="true">
        🎧
      </span>
    )
  }
  return <img className="game-icon" src={`${import.meta.env.BASE_URL}icons/${file}`} alt="" />
}
