import { useEffect, useRef, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { recordAnswer, recordSprintScore } from '../../../services/db'
import { Button } from '../../ui/Button'
import './SprintGame.scss'

interface SprintGameProps {
  gameType: GameType
  pool: Word[]
  userId: string
  onFinish: (result: RoundResult) => void
}

interface Pair {
  word: Word
  candidateTranslation: string
  isCorrect: boolean
}

const DURATION_SEC = 30

function makePair(pool: Word[]): Pair {
  const word = pool[Math.floor(Math.random() * pool.length)]
  const showCorrect = Math.random() < 0.5 || pool.length < 2
  if (showCorrect) {
    return { word, candidateTranslation: word.russianTranslation, isCorrect: true }
  }
  const others = pool.filter((w) => w.id !== word.id)
  const randomOther = others[Math.floor(Math.random() * others.length)]
  return { word, candidateTranslation: randomOther.russianTranslation, isCorrect: false }
}

/** Очки за верный ответ растут со стрейком (10 → 20 → 30), потом держатся на 30, пока не собьёшься. */
const STREAK_STEP = 10
const STREAK_CAP = 3

export function SprintGame({ gameType, pool, userId, onFinish }: SprintGameProps) {
  const [started, setStarted] = useState(false)
  const [remaining, setRemaining] = useState(DURATION_SEC)
  const [pair, setPair] = useState<Pair | null>(null)
  const [score, setScore] = useState(0)
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null)

  const scoreRef = useRef(0)
  const pointsRef = useRef(0)
  const streakRef = useRef(0)
  const attemptsRef = useRef(0)
  // Слова, уже верно подтверждённые в этом заходе спринта, — в этом же заходе
  // больше не показываем (только остальные ещё нерешённые слова набора).
  const solvedRef = useRef<Set<string>>(new Set())

  function activePool(): Word[] {
    const remaining = pool.filter((w) => !solvedRef.current.has(w.id))
    return remaining.length >= 2 ? remaining : pool
  }

  useEffect(() => {
    if (!started) return
    setRemaining(DURATION_SEC)
    setPair(makePair(activePool()))

    const interval = setInterval(() => {
      // Апдейтер должен быть чистым (без побочных эффектов) — React Strict
      // Mode в dev вызывает такие функции дважды, чтобы проверить чистоту.
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  // Побочные эффекты завершения раунда вынесены в отдельный эффект с
  // защитой finishedRef — иначе (см. выше про апдейтер) они могли бы
  // сработать дважды и результат сохранился бы в топ-5 два раза.
  const finishedRef = useRef(false)
  useEffect(() => {
    if (!started) {
      finishedRef.current = false
      return
    }
    if (remaining !== 0 || finishedRef.current) return
    finishedRef.current = true
    const sprintScoreId = recordSprintScore(userId, pointsRef.current, scoreRef.current, attemptsRef.current)
    onFinish({
      gameType,
      correct: scoreRef.current,
      total: attemptsRef.current,
      points: pointsRef.current,
      durationSec: DURATION_SEC,
      sprintScoreId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, remaining])

  function handleStart() {
    scoreRef.current = 0
    pointsRef.current = 0
    streakRef.current = 0
    attemptsRef.current = 0
    solvedRef.current = new Set()
    setScore(0)
    setPoints(0)
    setStreak(0)
    setStarted(true)
  }

  function handleAnswer(userSaysCorrect: boolean) {
    if (!pair || feedback) return
    const isRight = userSaysCorrect === pair.isCorrect
    attemptsRef.current += 1
    if (isRight) {
      scoreRef.current += 1
      setScore(scoreRef.current)
      streakRef.current += 1
      pointsRef.current += Math.min(streakRef.current, STREAK_CAP) * STREAK_STEP
      setStreak(streakRef.current)
      setPoints(pointsRef.current)
    } else {
      streakRef.current = 0
      setStreak(0)
    }
    setFeedback(isRight ? 'right' : 'wrong')

    // Прогресс слова: засчитываем только когда пользователь подтвердил
    // настоящий верный перевод, или ошибся в суждении об этом слове —
    // случай "верно отверг подделку" не доказывает знание правильного перевода.
    if (isRight && pair.isCorrect) {
      recordAnswer(pair.word.id, gameType, true)
      solvedRef.current.add(pair.word.id)
    } else if (!isRight) {
      recordAnswer(pair.word.id, gameType, false)
    }

    setTimeout(() => {
      setFeedback(null)
      setPair(makePair(activePool()))
    }, 150)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!started) {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleStart()
        }
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleAnswer(false)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleAnswer(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, pair, feedback])

  if (!started) {
    return (
      <div className="sprint-game sprint-game--setup">
        <p className="sprint-game__setup-title">Спринт: {DURATION_SEC} секунд</p>
        <p className="sprint-game__setup-description">
          Верно или неверно переведено слово — отвечайте на скорость. Чем длиннее серия верных ответов, тем больше очков.
        </p>
        <Button onClick={handleStart}>
          Начать <span className="sprint-game__key-hint">Enter</span>
        </Button>
      </div>
    )
  }

  if (!pair) return null

  return (
    <div className="sprint-game">
      <div className="sprint-game__hud">
        <span className="sprint-game__timer">{remaining} сек</span>
        <span className="sprint-game__score">
          Очки: {points}
          {streak >= 2 && <span className="sprint-game__streak"> 🔥×{Math.min(streak, STREAK_CAP)}</span>}
        </span>
        <span className="sprint-game__correct-count">Верно: {score}</span>
      </div>

      <div className={`sprint-game__pair${feedback ? ` sprint-game__pair--${feedback}` : ''}`}>
        <div className="sprint-game__sk">{pair.word.slovakWord}</div>
        <div className="sprint-game__ru">{pair.candidateTranslation}</div>
      </div>

      <div className="sprint-game__actions">
        <Button variant="danger" fullWidth onClick={() => handleAnswer(false)}>
          ← Неверно
        </Button>
        <Button variant="primary" fullWidth onClick={() => handleAnswer(true)}>
          Верно →
        </Button>
      </div>
    </div>
  )
}
