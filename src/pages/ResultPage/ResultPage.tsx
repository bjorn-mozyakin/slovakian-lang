import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { RoundResult } from '../../entities/types'
import { GAMES } from '../../entities/types'
import { useAuth } from '../../hooks/useAuth'
import { useWordSets } from '../../hooks/useWordSets'
import { useSelectedWordSets } from '../../hooks/useSelectedWordSets'
import { getSprintScores } from '../../services/db'
import { getNotLearnedPool, getWordsBySetIds } from '../../services/wordsService'
import { Button } from '../../components/ui/Button'
import './ResultPage.scss'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session!.userId
  const { sets } = useWordSets(userId)
  const { selectedIds } = useSelectedWordSets(sets)
  const result = location.state as RoundResult | undefined

  const hasMoreWords = result
    ? result.gameType === 'sprint'
      ? getWordsBySetIds(userId, selectedIds).length > 0
      : getNotLearnedPool(userId, selectedIds, result.gameType).length > 0
    : false

  useEffect(() => {
    if (!result) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        hasMoreWords ? navigate(`/game/${result!.gameType}`, { replace: true }) : navigate('/')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        navigate('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, hasMoreWords, navigate])

  if (!result) {
    return <Navigate to="/" replace />
  }

  const game = GAMES.find((g) => g.type === result.gameType)
  const isSprint = result.gameType === 'sprint'
  const leaderboard = isSprint ? getSprintScores(session!.userId) : []
  const madeLeaderboard = isSprint && leaderboard.some((s) => s.id === result.sprintScoreId)

  return (
    <div className="result-page">
      <div className="result-page__card">
        <p className="result-page__label">{game?.title}</p>

        <p className="result-page__score">
          {result.correct}/{result.total}
        </p>
        <p className="result-page__score-caption">
          {isSprint ? `правильных ответов за ${result.durationSec} сек` : 'правильных ответов'}
        </p>

        {typeof result.points === 'number' && (
          <p className="result-page__points">Очки: {result.points}</p>
        )}

        {typeof result.mistakes === 'number' && (
          <p className="result-page__mistakes">Ошибок при сопоставлении: {result.mistakes}</p>
        )}

        {result.insufficientWords && (
          <p className="result-page__notice">
            Слов оказалось меньше, чем нужно для полного раунда — сыграли со всеми доступными.
          </p>
        )}

        {isSprint && leaderboard.length > 0 && (
          <div className="result-page__leaderboard">
            {madeLeaderboard && <p className="result-page__leaderboard-banner">🏆 Новый результат в топ-5!</p>}
            <p className="result-page__leaderboard-title">Топ-5 лучших попыток</p>
            <table className="result-page__leaderboard-table">
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className={entry.id === result.sprintScoreId ? 'result-page__leaderboard-row--current' : ''}
                  >
                    <td>{i + 1}</td>
                    <td>{entry.points} очков</td>
                    <td>
                      {entry.correct}/{entry.total}
                    </td>
                    <td>{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!hasMoreWords && (
          <p className="result-page__notice">
            В этой игре больше не осталось слов — смените наборы или выберите другую игру.
          </p>
        )}

        <div className="result-page__actions">
          {hasMoreWords && (
            <Button fullWidth onClick={() => navigate(`/game/${result.gameType}`, { replace: true })}>
              Играть ещё раз <span className="result-page__key-hint">Enter</span>
            </Button>
          )}
          <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
            К странице Тренировки <span className="result-page__key-hint">Esc</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
