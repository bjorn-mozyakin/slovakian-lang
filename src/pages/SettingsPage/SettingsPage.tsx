import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { setAllWordsStatus } from '../../services/db'
import { signOut } from '../../services/authService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import './SettingsPage.scss'

export function SettingsPage() {
  const { session } = useAuth()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  function handleReset() {
    setAllWordsStatus(session!.userId, 'not_learned')
    setConfirmingReset(false)
  }

  function handleLogout() {
    signOut()
  }

  return (
    <div className="settings-page">
      <PageHeader title="Настройки" />

      <section className="settings-page__section">
        <h2 className="settings-page__section-title">Прогресс</h2>
        <p className="settings-page__section-description">
          Сбросить статус всех слов во всех наборах в «не выучено».
        </p>
        <Button variant="danger" onClick={() => setConfirmingReset(true)}>
          Сбросить все статусы
        </Button>
      </section>

      <section className="settings-page__section">
        <h2 className="settings-page__section-title">Аккаунт</h2>
        <p className="settings-page__section-description">{session?.email}</p>
        <Button variant="ghost" onClick={() => setConfirmingLogout(true)}>
          Выйти из аккаунта
        </Button>
      </section>

      {confirmingReset && (
        <ConfirmDialog
          title="Сбросить все статусы?"
          message="Все слова во всех наборах получат статус «не выучено». Это действие нельзя отменить."
          confirmLabel="Сбросить"
          danger
          onConfirm={handleReset}
          onCancel={() => setConfirmingReset(false)}
        />
      )}

      {confirmingLogout && (
        <ConfirmDialog
          title="Выйти из аккаунта?"
          message="Вы сможете снова войти по email в любой момент."
          confirmLabel="Выйти"
          onConfirm={handleLogout}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}
    </div>
  )
}
