import { useEffect, useMemo, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { pickDistractors, shuffle } from '../../../services/wordsService'
import { recordAnswer } from '../../../services/db'
import './MultipleChoiceGame.scss'

interface MultipleChoiceGameProps {
  gameType: GameType
  words: Word[]
  pool: Word[]
  userId: string
  direction: 'sk-ru' | 'ru-sk'
  onFinish: (result: RoundResult) => void
}

interface Question {
  word: Word
  options: Word[]
}

// Спец-id для ответа "не знаю" — заведомо не совпадает ни с одним id слова,
// поэтому handleSelect естественно засчитывает его как неверный ответ и
// подсвечивает верный вариант, не подсвечивая никакой вариант как "выбранный неверно".
const DONT_KNOW = '__dont_know__'

export function MultipleChoiceGame({ gameType, words, pool, userId, direction, onFinish }: MultipleChoiceGameProps) {
  const questions = useMemo<Question[]>(
    () =>
      words.map((word) => {
        const distractors = pickDistractors(userId, word, pool, 4)
        return { word, options: shuffle([word, ...distractors]) }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const question = questions[index]
  const isSkToRu = direction === 'sk-ru'

  function handleSelect(optionId: string) {
    if (selectedId) return
    setSelectedId(optionId)
    const isCorrect = optionId === question.word.id
    if (isCorrect) setCorrect((c) => c + 1)
    recordAnswer(question.word.id, gameType, isCorrect)

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        onFinish({
          gameType,
          correct: isCorrect ? correct + 1 : correct,
          total: questions.length,
          insufficientWords: questions.length < 10,
        })
      } else {
        setIndex((i) => i + 1)
        setSelectedId(null)
      }
    }, 700)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (!selectedId) handleSelect(DONT_KNOW)
        return
      }
      const digit = Number(e.key)
      if (!Number.isInteger(digit) || digit < 1 || digit > question.options.length) return
      const opt = question.options[digit - 1]
      if (opt) handleSelect(opt.id)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, selectedId])

  return (
    <div className="mc-game">
      <p className="mc-game__progress">
        {index + 1} / {questions.length}
      </p>
      <div className="mc-game__prompt">{isSkToRu ? question.word.slovakWord : question.word.russianTranslation}</div>

      <div className="mc-game__options">
        {question.options.map((opt, i) => {
          const label = isSkToRu ? opt.russianTranslation : opt.slovakWord
          const isSelected = selectedId === opt.id
          const isCorrectOption = opt.id === question.word.id
          let stateClass = ''
          if (selectedId) {
            if (isCorrectOption) stateClass = 'mc-game__option--correct'
            else if (isSelected) stateClass = 'mc-game__option--wrong'
          }
          return (
            <button
              key={opt.id}
              className={`mc-game__option ${stateClass}`}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selectedId}
            >
              <span className="mc-game__option-key">{i + 1}</span>
              {label}
            </button>
          )
        })}
      </div>

      <button
        className={`mc-game__dont-know${selectedId === DONT_KNOW ? ' mc-game__dont-know--wrong' : ''}`}
        onClick={() => handleSelect(DONT_KNOW)}
        disabled={!!selectedId}
      >
        Не знаю <span className="mc-game__key-hint">Enter</span>
      </button>
    </div>
  )
}
