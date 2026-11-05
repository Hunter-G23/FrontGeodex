import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

export const KEYS = { token: 'auth_token', guest: 'guest_token' }

let onUnauthorized = null
export const setUnauthorizedHandler = fn => { onUnauthorized = fn }

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL, timeout: 15000 })

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync(KEYS.token)
  const guest = await SecureStore.getItemAsync(KEYS.guest)
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (guest && !config.skipGuest) config.headers['X-Guest-Token'] = guest
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error
    if (response?.status === 401 && onUnauthorized) onUnauthorized()
    return Promise.reject({
      status: response?.status,
      code: response?.data?.code,
      details: response?.data?.details,
      message: response
        ? response.data?.message || 'Ocurrió un error inesperado.'
        : 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'
    })
  }
)

export default api