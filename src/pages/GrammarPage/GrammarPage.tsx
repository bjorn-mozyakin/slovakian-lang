import { useEffect, useRef, useState } from 'react'
import { SLOVAK_SPECIAL_CHARS } from '../../entities/types'
import type { Tense, VerbPhrase } from '../../entities/verbs'
import { PRONOUNS, TENSES, TENSE_LABELS, VERBS, buildPhrase } from '../../entities/verbs'
import { shuffle, isAnswerCorrect } from '../../services/wordsService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import './GrammarPage.scss'

const ROUND_SIZE = 10

type Direction = 'ru-sk' | 'sk-ru'

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

export function GrammarPage() {
  const [selectedTenses, setSelectedTenses] = useState<Set<Tense>>(new Set(TENSES))
  const [direction, setDirection] = useState<Direction>('ru-sk')
  const [phrases, setPhrases] = useState<VerbPhrase[] | null>(null)
  const [lastResult, setLastResult] = useState<{ correct: number; total: number } | null>(null)
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const phrase = phrases?.[index]
  const isRuToSk = direction === 'ru-sk'
  const prompt = phrase && (isRuToSk ? phrase.promptRu : phrase.answerSk)
  const answer = phrase && (isRuToSk ? phrase.answerSk : phrase.promptRu)

  function toggleTense(tense: Tense) {
    setSelectedTenses((prev) => {
      const next = new Set(prev)
      if (next.has(tense)) next.delete(tense)
      else next.add(tense)
      return next
    })
  }

  function handleStart(dir: Direction) {
    setDirection(dir)
    setLastResult(null)
    setPhrases(buildRound(selectedTenses))
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
    if (!phrases) return
    if (index + 1 >= phrases.length) {
      setLastResult({ correct, total: phrases.length })
      setPhrases(null)
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
    if (!phrases) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      e.preventDefault()
      checked ? handleNext() : handleCheck()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases, checked, value, index])

  useEffect(() => {
    if (phrases && !checked) inputRef.current?.focus()
  }, [phrases, checked, index])

  // Итог раунда — отдельный экран, как в обычных играх из "Тренировки".
  useEffect(() => {
    if (!lastResult) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleStart(direction)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setLastResult(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult, direction])

  if (!phrases && lastResult) {
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
              <Button fullWidth onClick={() => handleStart(direction)}>
                Играть ещё раз <span className="grammar-game__key-hint">Enter</span>
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setLastResult(null)}>
                К странице Грамматики <span className="grammar-game__key-hint">Esc</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Настройка (до старта раунда).
  if (!phrases) {
    return (
      <div className="grammar-page">
        <PageHeader title="Грамматика" />

        <section className="grammar-page__games">
          <h2 className="grammar-page__games-title">Игры</h2>

          <div className="grammar-page__group">
            <h3 className="grammar-page__group-title">Глагол + Время</h3>

            <div className="grammar-page__tenses">
              {TENSES.map((tense) => (
                <button
                  key={tense}
                  type="button"
                  className={`grammar-page__tense-chip${selectedTenses.has(tense) ? ' grammar-page__tense-chip--active' : ''}`}
                  onClick={() => toggleTense(tense)}
                >
                  {TENSE_LABELS[tense]}
                </button>
              ))}
            </div>

            <div className="grammar-page__game-list">
              <button
                className="grammar-page__game-card"
                disabled={selectedTenses.size === 0}
                onClick={() => handleStart('ru-sk')}
              >
                <span className="grammar-page__game-title">Глаголы: на словацкий</span>
                <span className="grammar-page__game-description">
                  Переведи фразу на словацкий: местоимение + глагол в нужном времени
                </span>
              </button>
              <button
                className="grammar-page__game-card"
                disabled={selectedTenses.size === 0}
                onClick={() => handleStart('sk-ru')}
              >
                <span className="grammar-page__game-title">Глаголы: на русский</span>
                <span className="grammar-page__game-description">
                  Переведи словацкую фразу на русский: местоимение + глагол в нужном времени
                </span>
              </button>
            </div>
            {selectedTenses.size === 0 && (
              <p className="grammar-page__hint">Выберите хотя бы одно время, чтобы начать игру</p>
            )}
          </div>
        </section>
      </div>
    )
  }

  if (!phrase || !prompt || !answer) return null

  return (
    <div className="grammar-page">
      <div className="grammar-page__header">
        <button className="grammar-page__exit" onClick={() => setPhrases(null)} aria-label="Завершить игру">
          ✕ Глаголы
        </button>
      </div>
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
    </div>
  )
}
