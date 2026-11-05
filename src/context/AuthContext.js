import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import api, { KEYS, setUnauthorizedHandler } from '../services/api'
import { createGuestSession, getGuestSession } from '../services/guestService'
import { migrateGuest } from '../services/authService'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const ADMIN_ROLE = 'Admin'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearUser = useCallback(async () => {
    await SecureStore.deleteItemAsync(KEYS.token)
    setUser(null)
  }, [])

  // Restaurar sesión al abrir la app
  useEffect(() => {
    setUnauthorizedHandler(clearUser)
    ;(async () => {
      try {
        if (await SecureStore.getItemAsync(KEYS.token)) {
          try { setUser((await api.get('/user/me')).data) } catch { await clearUser() }
        }
        if (await SecureStore.getItemAsync(KEYS.guest)) {
          try { setGuest(await getGuestSession()) } catch { await SecureStore.deleteItemAsync(KEYS.guest) }
        }
      } finally { setLoading(false) }
    })()
  }, [clearUser])

  const continueAsGuest = async () => {
    const { token, ...session } = await createGuestSession()
    await SecureStore.setItemAsync(KEYS.guest, token)
    setGuest(session)
  }

  const signIn = async token => {
    await SecureStore.setItemAsync(KEYS.token, token)
    let migration = null
    if (await SecureStore.getItemAsync(KEYS.guest)) {
      try {
        migration = await migrateGuest()
        await SecureStore.deleteItemAsync(KEYS.guest)
        setGuest(null)
      } catch (e) {
        migration = { error: e.message }
        if (e.status === 401 || e.status === 409) { // sesión inválida o ya transferida
          await SecureStore.deleteItemAsync(KEYS.guest)
          setGuest(null)
        }
      }
    }
    setUser((await api.get('/user/me')).data)
    return migration
  }

  // Cierra la sesión de usuario o abandona la de invitado
  const signOut = async () => {
    await clearUser()
    await SecureStore.deleteItemAsync(KEYS.guest)
    setGuest(null)
  }

  const refreshGuest = async () => setGuest(await getGuestSession())

  const mode = useMemo(() => {
    if (user) return user.role?.name === ADMIN_ROLE ? 'admin' : 'user'
    return guest ? 'guest' : 'public'
  }, [user, guest])

  return (
    <AuthContext.Provider value={{ user, guest, mode, loading, continueAsGuest, signIn, signOut, refreshGuest }}>
      {children}
    </AuthContext.Provider>
  )
}