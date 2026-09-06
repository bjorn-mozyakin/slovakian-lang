import type { GameType } from '../../entities/types'
import './GameIcon.scss'

/**
 * Иконки игр — картинки пользователя из public/icons. Имена файлов без
 * числовых префиксов (порядок игр задаётся только в GAMES в entities/types.ts) —
 * так новую иконку можно добавить в любой момент, не переименовывая остальные.
 */
const ICON_FILES: Partial<Record<GameType, string>> = {
  'choice-sk-ru': 'word_to_translation.png',
  'choice-ru-sk': 'translation_to_word.png',
  'type-sk-ru': 'type_translation.png',
  'type-ru-sk': 'type_word.png',
  listening: 'listening.png',
  builder: 'word_constructor.png',
  sprint: 'sprint.png',
  memory: 'memory.png',
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
