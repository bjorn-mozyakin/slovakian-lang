import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { RoundResult } from '../../entities/types'
import { GAMES } from '../../entities/types'
import { useAuth } from '../../hooks/useAuth'
import { getSprintScores } from '../../services/db'
import { Button } from '../../components/ui/Button'
import './ResultPage.scss'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()
  const result = location.state as RoundResult | undefined

  useEffect(() => {
    if (!result) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        navigate(`/game/${result!.gameType}`, { replace: true })
      } else if (e.key === 'Escape') {
        e.preventDefault()
        navigate('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, navigate])

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

        <div className="result-page__actions">
          <Button fullWidth onClick={() => navigate(`/game/${result.gameType}`, { replace: true })}>
            Повторить эту игру <span className="result-page__key-hint">Enter</span>
          </Button>
          <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
            Выбрать другую игру <span className="result-page__key-hint">Esc</span>
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/')}>
            Сменить наборы
          </Button>
        </div>
      </div>
    </div>
  )
}
