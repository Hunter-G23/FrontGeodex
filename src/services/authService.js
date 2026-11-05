import api from './api'

export const register = data => api.post('/user/registro', data, { skipGuest: true }).then(r => r.data)
export const login = data => api.post('/user/login', data).then(r => r.data) // { message, token, user }
export const migrateGuest = () => api.post('/guest/migrate').then(r => r.data)