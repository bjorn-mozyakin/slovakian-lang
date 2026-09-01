import { NavLink, Outlet } from 'react-router-dom'
import './AppLayout.scss'

const NAV_ITEMS = [
  { to: '/', label: 'Тренировка', icon: '🎯', end: true },
  { to: '/word-sets', label: 'Наборы', icon: '📚', end: false },
  { to: '/words', label: 'Все слова', icon: '📝', end: false },
  { to: '/settings', label: 'Настройки', icon: '⚙️', end: false },
]

export function AppLayout() {
  return (
    <div className="app-layout">
      <main className="app-layout__content">
        <Outlet />
      </main>
      <nav className="app-layout__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'app-layout__nav-item' + (isActive ? ' app-layout__nav-item--active' : '')
            }
          >
            <span className="app-layout__nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="app-layout__nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
