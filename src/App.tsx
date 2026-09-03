import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { TrainingPage } from './pages/TrainingPage/TrainingPage'
import { GamePage } from './pages/GamePage/GamePage'
import { ResultPage } from './pages/ResultPage/ResultPage'
import { WordSetsPage } from './pages/WordSetsPage/WordSetsPage'
import { WordSetDetailPage } from './pages/WordSetsPage/WordSetDetailPage'
import { AllWordsPage } from './pages/AllWordsPage/AllWordsPage'
import { GrammarPage } from './pages/GrammarPage/GrammarPage'
import { GrammarPlayPage } from './pages/GrammarPage/GrammarPlayPage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { useAuth } from './hooks/useAuth'
import { syncPresetData } from './services/seed'

function App() {
  const { session } = useAuth()

  // Подхватывает новые/обновлённые preset-наборы при каждом входе, без
  // необходимости сбрасывать локальные данные вручную.
  useEffect(() => {
    if (session) {
      syncPresetData(session.userId)
    }
  }, [session])

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/game/:gameType"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grammar/play"
          element={
            <ProtectedRoute>
              <GrammarPlayPage />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<TrainingPage />} />
          <Route path="/word-sets" element={<WordSetsPage />} />
          <Route path="/word-sets/:id" element={<WordSetDetailPage />} />
          <Route path="/words" element={<AllWordsPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
