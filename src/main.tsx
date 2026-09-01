import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.scss'
import App from './App.tsx'

// Заход на /#reset очищает локальное хранилище (все наборы/слова/статусы
// пересоздаются из seed-данных при следующем входе). Временный инструмент
// для разработки, пока данные хранятся в localStorage, а не в Supabase.
if (window.location.hash === '#reset') {
  localStorage.clear()
  window.location.replace(window.location.pathname + window.location.search)
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
