import { readJson, writeJson, STORAGE_KEYS } from './localStorageKeys'

export interface Session {
  userId: string
  email: string
}

/**
 * Локальная заглушка аутентификации. Интерфейс намеренно повторяет форму
 * будущей Supabase Auth сессии, чтобы страницы (Login, защищённый роутинг)
 * не пришлось переписывать при подключении Supabase Magic Link — поменяется
 * только реализация этого файла.
 */
type Listener = (session: Session | null) => void

const listeners = new Set<Listener>()

function emit(session: Session | null) {
  listeners.forEach((l) => l(session))
}

export function getSession(): Session | null {
  return readJson<Session | null>(STORAGE_KEYS.session, null)
}

export async function signInWithEmail(email: string): Promise<void> {
  const trimmed = email.trim().toLowerCase()
  const session: Session = { userId: trimmed, email: trimmed }
  writeJson(STORAGE_KEYS.session, session)
  emit(session)
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.session)
  emit(null)
}

export function onAuthChange(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
