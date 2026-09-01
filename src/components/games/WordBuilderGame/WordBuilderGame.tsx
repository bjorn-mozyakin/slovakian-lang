import { useEffect, useMemo, useState } from 'react'
import type { GameType, RoundResult, Word } from '../../../entities/types'
import { shuffle, getPrimaryVariant } from '../../../services/wordsService'
import { recordAnswer } from '../../../services/db'
import { Button } from '../../ui/Button'
import './WordBuilderGame.scss'

interface WordBuilderGameProps {
  gameType: GameType
  words: Word[]
  onFinish: (result: RoundResult) => void
}

interface Tile {
  id: string
  char: string
  used: boolean
}

function buildTiles(word: string): Tile[] {
  return shuffle(
    Array.from(word).map((char, i) => ({ id: `${i}-${char}-${Math.random()}`, char, used: false })),
  )
}

export function WordBuilderGame({ gameType, words, onFinish }: WordBuilderGameProps) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [picked, setPicked] = useState<Tile[]>([])
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing')

  const word = words[index]
  // У слова может быть несколько вариантов написания через запятую
  // ("topánky, obuv") — собираем по буквам только один из них.
  const answer = getPrimaryVariant(word.slovakWord)
  const builtWord = useMemo(() => picked.map((t) => t.char).join(''), [picked])

  // Плитки всегда пересобираем реактивно по текущему слову (а не вручную
  // внутри advance()) — так при быстром повторном Enter/клике их никогда
  // не может рассинхронизировать с уже переключившимся index.
  useEffect(() => {
    setTiles(buildTiles(answer))
    setPicked([])
    setStatus('playing')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, answer])

  function advance() {
    if (index + 1 >= words.length) {
      onFinish({
        gameType,
        correct,
        total: words.length,
        insufficientWords: words.length < 10,
      })
    } else {
      setIndex((i) => i + 1)
    }
  }

  // Слово собрано (верно или нет) — ждём Enter/клик "Дальше", не переходим
  // к следующему слову автоматически.
  function finishWord(isCorrect: boolean) {
    if (status !== 'playing') return
    setStatus(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setCorrect((c) => c + 1)
    recordAnswer(word.id, gameType, isCorrect)
  }

  function handlePick(tile: Tile) {
    if (status !== 'playing' || tile.used) return
    const nextPicked = [...picked, tile]
    setTiles((ts) => ts.map((t) => (t.id === tile.id ? { ...t, used: true } : t)))
    setPicked(nextPicked)

    if (nextPicked.length === Array.from(answer).length) {
      const built = nextPicked.map((t) => t.char).join('')
      finishWord(built === answer)
    }
  }

  function handleUndo() {
    if (status !== 'playing' || picked.length === 0) return
    const last = picked[picked.length - 1]
    setPicked(picked.slice(0, -1))
    setTiles((ts) => ts.map((t) => (t.id === last.id ? { ...t, used: false } : t)))
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (status === 'playing') {
          // Слово ещё не собрано полностью — засчитываем как неверное и идём дальше.
          finishWord(builtWord === answer)
        } else {
          advance()
        }
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        handleUndo()
        return
      }
      if (status !== 'playing') return
      const key = e.key.toLowerCase()
      if (key.length !== 1) return
      const tile = tiles.find((t) => !t.used && t.char.toLowerCase() === key)
      if (tile) handlePick(tile)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles, status, picked, builtWord])

  return (
    <div className="builder-game">
      <p className="builder-game__progress">
        {index + 1} / {words.length}
      </p>
      <div className="builder-game__prompt">{word.russianTranslation}</div>

      <div
        className={`builder-game__built${
          status === 'correct' ? ' builder-game__built--correct' : status === 'wrong' ? ' builder-game__built--wrong' : ''
        }`}
      >
        {builtWord || ' '}
      </div>

      <p className={`builder-game__answer${status === 'wrong' ? '' : ' builder-game__answer--hidden'}`}>
        Верно: {answer}
      </p>

      <div className="builder-game__tiles">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className="builder-game__tile"
            disabled={tile.used || status !== 'playing'}
            onClick={() => handlePick(tile)}
          >
            {tile.char}
          </button>
        ))}
      </div>

      <div className="builder-game__footer">
        <Button variant="ghost" onClick={handleUndo} disabled={picked.length === 0 || status !== 'playing'}>
          ← Стереть букву
        </Button>
        <Button variant="ghost" onClick={() => (status === 'playing' ? finishWord(builtWord === answer) : advance())}>
          {status === 'playing' ? 'Не знаю' : 'Дальше'} <span className="builder-game__key-hint">Enter</span>
        </Button>
      </div>
    </div>
  )
}
