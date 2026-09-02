import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SLOVAK_SPECIAL_CHARS } from '../../entities/types'
import type { Tense, VerbPhrase } from '../../entities/verbs'
import { PRONOUNS, TENSES, VERBS, buildPhrase } from '../../entities/verbs'
import { shuffle, isAnswerCorrect } from '../../services/wordsService'
import { GameShell } from '../../components/layout/GameShell'
import { Button } from '../../components/ui/Button'
import './GrammarPage.scss'

const ROUND_SIZE = 10

type Direction = 'ru-sk' | 'sk-ru'

interface PlayState {
  tenses: Tense[]
  direction: Direction
}

function buildRound(tenses: Set<Tense>): VerbPhrase[] {
  const pool: VerbPhrase[] = []
  for (const verb of VERBS) {
    for (const pronoun of PRONOUNS) {
      for (const tense of TENSES) {
        if (tenses.has(tense)) pool.push(buildPhrase(verb, pronoun, tense))
      }
    }
  }
  return shuffle(pool).slice(0, ROUND_SIZE)
}

export function GrammarPlayPage() {
  const location = useLocation()
  const playState = location.state as PlayState | undefined

  if (!playState) return <Navigate to="/grammar" replace />

  return <GrammarPlaySession direction={playState.direction} tenses={new Set(playState.tenses)} />
}

function GrammarPlaySession({ direction, tenses }: { direction: Direction; tenses: Set<Tense> }) {
  const navigate = useNavigate()
  const [phrases, setPhrases] = useState<VerbPhrase[]>(() => buildRound(tenses))
  const [lastResult, setLastResult] = useState<{ correct: number; total: number } | null>(null)
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const phrase = phrases[index] as VerbPhrase | undefined
  const isRuToSk = direction === 'ru-sk'
  const prompt = phrase && (isRuToSk ? phrase.promptRu : phrase.answerSk)
  const answer = phrase && (isRuToSk ? phrase.answerSk : phrase.promptRu)

  function restart() {
    setPhrases(buildRound(tenses))
    setLastResult(null)
    setIndex(0)
    setCorrect(0)
    setValue('')
    setChecked(false)
    setWasCorrect(false)
  }

  function handleCheck() {
    if (checked || !answer) return
    const isCorrect = isAnswerCorrect(value, answer)
    setWasCorrect(isCorrect)
    setChecked(true)
    if (isCorrect) setCorrect((c) => c + 1)
  }

  function handleNext() {
    if (index + 1 >= phrases.length) {
      setLastResult({ correct, total: phrases.length })
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
    if (lastResult) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      e.preventDefault()
      checked ? handleNext() : handleCheck()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult, checked, value, index])

  useEffect(() => {
    if (!lastResult) inputRef.current?.focus()
  }, [lastResult, checked, index])

  // Итог раунда — отдельный экран, как в обычных играх из "Тренировки".
  useEffect(() => {
    if (!lastResult) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        restart()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        navigate('/grammar')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult])

  if (lastResult) {
    return (
      <div className="grammar-page">
        <div className="grammar-page__result-screen">
          <div className="grammar-page__result-card">
            <p className="grammar-page__result-label">Глаголы</p>
            <p className="grammar-page__result-score">
              {lastResult.correct}/{lastResult.total}
            </p>
            <p className="grammar-page__result-caption">правильных ответов</p>

            <div className="grammar-page__result-actions">
              <Button fullWidth onClick={restart}>
                Играть ещё раз <span className="grammar-game__key-hint">Enter</span>
              </Button>
              <Button fullWidth variant="secondary" onClick={() => navigate('/grammar')}>
                К странице Грамматики <span className="grammar-game__key-hint">Esc</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!phrase || !prompt || !answer) return null

  return (
    <GameShell title="Глаголы" onExit={() => navigate('/grammar')}>
      <div className="grammar-game">
        <p className="grammar-game__progress">
          {index + 1} / {phrases.length}
        </p>
        <div className="grammar-game__prompt">{prompt}</div>

        <form
          className="grammar-game__form"
          onSubmit={(e) => {
            e.preventDefault()
            checked ? handleNext() : handleCheck()
          }}
        >
          <input
            ref={inputRef}
            className={`grammar-game__input${checked ? (wasCorrect ? ' grammar-game__input--correct' : ' grammar-game__input--wrong') : ''}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={checked}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {isRuToSk && (
            <div className="grammar-game__panel">
              {SLOVAK_SPECIAL_CHARS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="grammar-game__char"
                  onClick={() => insertChar(ch)}
                  tabIndex={-1}
                >
                  {ch}
                </button>
              ))}
            </div>
          )}

          <p className={`grammar-game__answer${checked && !wasCorrect ? '' : ' grammar-game__answer--hidden'}`}>
            Верный ответ: {answer}
          </p>

          <Button type="submit" fullWidth>
            {checked ? (index + 1 >= phrases.length ? 'Завершить' : 'Далее') : 'Проверить'}
            <span className="grammar-game__key-hint">Enter</span>
          </Button>
        </form>
      </div>
    </GameShell>
  )
}
