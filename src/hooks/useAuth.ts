import { useEffect, useState } from 'react'
import { getSession, onAuthChange, type Session } from '../services/authService'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(() => getSession())

  useEffect(() => onAuthChange(setSession), [])

  return { session, isAuthenticated: !!session }
}
