import { useEffect, useRef, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { SLOVAK_SPECIAL_CHARS } from '../../../entities/types'
import { isAnswerCorrect, getPrimaryVariant } from '../../../services/wordsService'
import { recordAnswer } from '../../../services/db'
import { speakSlovak } from '../../../services/speech'
import { Button } from '../../ui/Button'
import './ListeningGame.scss'

interface ListeningGameProps {
  gameType: GameType
  words: Word[]
  onFinish: (result: RoundResult) => void
}

export function ListeningGame({ gameType, words, onFinish }: ListeningGameProps) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const word = words[index]
  const answer = getPrimaryVariant(word.slovakWord)

  function handleCheck() {
    if (checked) return
    const isCorrect = isAnswerCorrect(value, word.slovakWord)
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
    if (!checked) inputRef.current?.focus()
  }, [checked, index])

  // Слово озвучивается автоматически при появлении — кнопка нужна, чтобы
  // прослушать ещё раз, а не только один раз при загрузке.
  useEffect(() => {
    speakSlovak(answer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div className="listening-game">
      <p className="listening-game__progress">
        {index + 1} / {words.length}
      </p>

      <button type="button" className="listening-game__play" onClick={() => speakSlovak(answer)} aria-label="Прослушать слово">
        🔊
      </button>

      <form
        className="listening-game__form"
        onSubmit={(e) => {
          e.preventDefault()
          checked ? handleNext() : handleCheck()
        }}
      >
        <input
          ref={inputRef}
          className={`listening-game__input${checked ? (wasCorrect ? ' listening-game__input--correct' : ' listening-game__input--wrong') : ''}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <div className="listening-game__panel">
          {SLOVAK_SPECIAL_CHARS.map((ch) => (
            <button
              key={ch}
              type="button"
              className="listening-game__char"
              onClick={() => insertChar(ch)}
              tabIndex={-1}
            >
              {ch}
            </button>
          ))}
        </div>

        <p
          className={`listening-game__answer${checked ? (wasCorrect ? ' listening-game__answer--correct' : ' listening-game__answer--wrong') : ' listening-game__answer--hidden'}`}
        >
          {answer} – {word.russianTranslation}
        </p>

        <Button type="submit" fullWidth>
          {checked ? (index + 1 >= words.length ? 'Завершить' : 'Далее') : 'Проверить'}
          <span className="listening-game__key-hint">Enter</span>
        </Button>
      </form>
    </div>
  )
}
