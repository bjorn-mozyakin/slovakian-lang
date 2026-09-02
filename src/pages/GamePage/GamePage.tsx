import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets } from '../../hooks/useWordSets'
import { useSelectedWordSets } from '../../hooks/useSelectedWordSets'
import { getWordsBySetIds, pickRandomNotLearned } from '../../services/wordsService'
import type { GameType, RoundResult } from '../../entities/types'
import { GAMES } from '../../entities/types'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { GameShell } from '../../components/layout/GameShell'
import { MultipleChoiceGame } from '../../components/games/MultipleChoiceGame/MultipleChoiceGame'
import { TypingGame } from '../../components/games/TypingGame/TypingGame'
import { WordBuilderGame } from '../../components/games/WordBuilderGame/WordBuilderGame'
import { MemoryGame } from '../../components/games/MemoryGame/MemoryGame'
import { SprintGame } from '../../components/games/SprintGame/SprintGame'
import './GamePage.scss'

const MIN_WORDS_FOR: Partial<Record<GameType, number>> = {
  builder: 3,
  memory: 3,
}

export function GamePage() {
  const { gameType } = useParams<{ gameType: GameType }>()
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session!.userId
  const { sets } = useWordSets(userId)
  const { selectedIds } = useSelectedWordSets(sets)

  const game = GAMES.find((g) => g.type === gameType)

  const roundWords = useMemo(() => {
    if (!gameType || gameType === 'sprint') return []
    return pickRandomNotLearned(userId, selectedIds, gameType, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, userId, selectedIds.join(',')])

  const distractorPool = useMemo(
    () => getWordsBySetIds(userId, selectedIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, selectedIds.join(',')],
  )

  // В отличие от остальных игр, Спринт не исключает уже отгаданные слова —
  // это скоростная тренировка на повторение, а не прогресс по новым словам,
  // поэтому пул всегда включает все слова выбранных наборов.
  const sprintPool = useMemo(() => {
    if (gameType !== 'sprint') return []
    return getWordsBySetIds(userId, selectedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, userId, selectedIds.join(',')])

  if (!game || !gameType) {
    return <EmptyState title="Игра не найдена" action={<Button onClick={() => navigate('/')}>К тренировке</Button>} />
  }

  function handleFinish(result: RoundResult) {
    navigate('/result', { state: result, replace: true })
  }

  const noWordsEmptyState = (
    <EmptyState
      title="Нет невыученных слов"
      description="В выбранных наборах не осталось невыученных слов. Смените наборы или сбросьте статусы в настройках."
      action={
        <div className="game-page__empty-actions">
          <Button onClick={() => navigate('/')}>К странице Тренировки</Button>
          <Button variant="ghost" onClick={() => navigate('/settings')}>
            Настройки
          </Button>
        </div>
      }
    />
  )

  if (gameType === 'sprint') {
    if (sprintPool.length === 0) {
      return (
        <EmptyState
          title="В выбранных наборах нет слов"
          description="Выберите наборы, в которых есть хотя бы несколько слов."
          action={<Button onClick={() => navigate('/')}>К странице Тренировки</Button>}
        />
      )
    }
    return (
      <GameShell title={game.title} onExit={() => navigate('/')}>
        <SprintGame gameType={gameType} pool={sprintPool} userId={userId} onFinish={handleFinish} />
      </GameShell>
    )
  }

  if (roundWords.length === 0) return noWordsEmptyState

  const minRequired = MIN_WORDS_FOR[gameType] ?? 1
  if (roundWords.length < minRequired) {
    return (
      <EmptyState
        title="Недостаточно слов для этой игры"
        description={`Нужно как минимум ${minRequired} невыученных слова в выбранных наборах.`}
        action={<Button onClick={() => navigate('/')}>К странице Тренировки</Button>}
      />
    )
  }

  return (
    <GameShell title={game.title} onExit={() => navigate('/')} fitScreen={gameType === 'memory'}>
      {(gameType === 'choice-sk-ru' || gameType === 'choice-ru-sk') && (
        <MultipleChoiceGame
          gameType={gameType}
          words={roundWords}
          pool={distractorPool}
          userId={userId}
          direction={gameType === 'choice-sk-ru' ? 'sk-ru' : 'ru-sk'}
          onFinish={handleFinish}
        />
      )}
      {(gameType === 'type-sk-ru' || gameType === 'type-ru-sk') && (
        <TypingGame
          gameType={gameType}
          words={roundWords}
          direction={gameType === 'type-sk-ru' ? 'sk-ru' : 'ru-sk'}
          onFinish={handleFinish}
        />
      )}
      {gameType === 'builder' && <WordBuilderGame gameType={gameType} words={roundWords} onFinish={handleFinish} />}
      {gameType === 'memory' && <MemoryGame gameType={gameType} words={roundWords} onFinish={handleFinish} />}
    </GameShell>
  )
}
