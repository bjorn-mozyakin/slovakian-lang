import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { signInWithEmail } from '../../services/authService'
import { Button } from '../../components/ui/Button'
import './LoginPage.scss'

export function LoginPage() {
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError('Введите корректный email')
      return
    }
    setError(null)
    await signInWithEmail(trimmed)
    setSubmitted(true)
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <h1 className="login-page__title">Словацкий словарь</h1>
        <p className="login-page__subtitle">Тренажёр словацкой лексики</p>

        {submitted ? (
          <p className="login-page__notice">
            Вход выполнен. Backend (Supabase Magic Link) ещё не подключён — сессия
            создана локально для разработки интерфейса.
          </p>
        ) : (
          <form className="login-page__form" onSubmit={handleSubmit}>
            <label className="login-page__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="login-page__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="login-page__error">{error}</p>}
            <Button type="submit" fullWidth>
              Войти по Magic Link
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
