import { useEffect, useRef, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { SLOVAK_SPECIAL_CHARS } from '../../../entities/types'
import { isAnswerCorrect } from '../../../services/wordsService'
import { recordAnswer } from '../../../services/db'
import { Button } from '../../ui/Button'
import './TypingGame.scss'

interface TypingGameProps {
  gameType: GameType
  words: Word[]
  direction: 'sk-ru' | 'ru-sk'
  onFinish: (result: RoundResult) => void
}

export function TypingGame({ gameType, words, direction, onFinish }: TypingGameProps) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const word = words[index]
  const isSkToRu = direction === 'sk-ru'
  const prompt = isSkToRu ? word.slovakWord : word.russianTranslation
  const answer = isSkToRu ? word.russianTranslation : word.slovakWord

  function handleCheck() {
    if (checked) return
    const isCorrect = isAnswerCorrect(value, answer)
    setWasCorrect(isCorrect)
    setChecked(true)
    if (isCorrect) setCorrect((c) => c + 1)
    recordAnswer(word.id, gameType, isCorrect)
  }

  function handleNext() {
    if (index + 1 >= words.length) {
      onFinish({
        gameType,
        correct,
        total: words.length,
        insufficientWords: words.length < 10,
      })
    } else {
      setIndex((i) => i + 1)
      setValue('')
      setChecked(false)
      setWasCorrect(false)
    }
  }

  function insertChar(ch: string) {
    setValue((v) => v + ch)
    inputRef.current?.focus()
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      e.preventDefault()
      checked ? handleNext() : handleCheck()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, value, index])

  // Фокус нужно ставить уже после того, как React перерисовал DOM и снял
  // disabled с поля — иначе браузер игнорирует focus() на отключённом input.
  useEffect(() => {
    if (!checked) {
      inputRef.current?.focus()
    }
  }, [checked, index])

  return (
    <div className="typing-game">
      <p className="typing-game__progress">
        {index + 1} / {words.length}
      </p>
      <div className="typing-game__prompt">{prompt}</div>

      <form
        className="typing-game__form"
        onSubmit={(e) => {
          e.preventDefault()
          checked ? handleNext() : handleCheck()
        }}
      >
        <input
          ref={inputRef}
          className={`typing-game__input${checked ? (wasCorrect ? ' typing-game__input--correct' : ' typing-game__input--wrong') : ''}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {!isSkToRu && (
          <div className="typing-game__panel">
            {SLOVAK_SPECIAL_CHARS.map((ch) => (
              <button
                key={ch}
                type="button"
                className="typing-game__char"
                onClick={() => insertChar(ch)}
                tabIndex={-1}
              >
                {ch}
              </button>
            ))}
          </div>
        )}

        {checked && !wasCorrect && (
          <p className="typing-game__answer">Верный ответ: {answer}</p>
        )}

        <Button type="submit" fullWidth>
          {checked ? (index + 1 >= words.length ? 'Завершить' : 'Далее') : 'Проверить'}
          <span className="typing-game__key-hint">Enter</span>
        </Button>
      </form>
    </div>
  )
}
