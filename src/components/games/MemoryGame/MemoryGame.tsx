import { useMemo, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { shuffle } from '../../../services/wordsService'
import { recordAnswer } from '../../../services/db'
import './MemoryGame.scss'

interface MemoryGameProps {
  gameType: GameType
  words: Word[]
  onFinish: (result: RoundResult) => void
}

interface Card {
  id: string
  wordId: string
  label: string
}

// При совпадении карточки остаются открытыми навсегда — торопиться некуда,
// пауза нужна только чтобы избежать визуального рывка. При несовпадении и
// в конце игры пользователю нужно время прочитать, что было на карточках,
// прежде чем они перевернутся обратно или начнётся переход на результат.
const MATCH_DELAY_MS = 700
const MISMATCH_DELAY_MS = 1500
const FINISH_DELAY_MS = 1500

export function MemoryGame({ gameType, words, onFinish }: MemoryGameProps) {
  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        words.flatMap((w) => [
          { id: `${w.id}-sk`, wordId: w.id, label: w.slovakWord },
          { id: `${w.id}-ru`, wordId: w.id, label: w.russianTranslation },
        ]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [busy, setBusy] = useState(false)

  function handleFlip(card: Card) {
    if (busy || flipped.includes(card.id) || matched.has(card.id)) return

    const nextFlipped = [...flipped, card.id]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setBusy(true)
      const [firstId, secondId] = nextFlipped
      const first = cards.find((c) => c.id === firstId)!
      const second = cards.find((c) => c.id === secondId)!
      const isMatch = first.wordId === second.wordId && first.id !== second.id

      setTimeout(
        () => {
          if (isMatch) {
            recordAnswer(first.wordId, gameType, true)
            const nextMatched = new Set(matched)
            nextMatched.add(firstId)
            nextMatched.add(secondId)
            setMatched(nextMatched)
            setFlipped([])
            setBusy(false)

            if (nextMatched.size === cards.length) {
              setTimeout(() => {
                onFinish({ gameType, correct: words.length, total: words.length, mistakes })
              }, FINISH_DELAY_MS)
            }
          } else {
            setMistakes((m) => m + 1)
            setFlipped([])
            setBusy(false)
          }
        },
        isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS,
      )
    }
  }

  return (
    <div className="memory-game">
      <p className="memory-game__progress">
        Пар найдено: {matched.size / 2} / {words.length} · Ошибок: {mistakes}
      </p>
      <div className="memory-game__grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.id)
          const isMatched = matched.has(card.id)
          return (
            <button
              key={card.id}
              className={`memory-game__card${isFlipped ? ' memory-game__card--flipped' : ''}${
                isMatched ? ' memory-game__card--matched' : ''
              }`}
              onClick={() => handleFlip(card)}
              disabled={isMatched}
            >
              <span className="memory-game__card-face memory-game__card-face--back">?</span>
              <span className="memory-game__card-face memory-game__card-face--front">{card.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
