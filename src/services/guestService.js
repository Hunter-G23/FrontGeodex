import api from './api'

export const createGuestSession = () => api.post('/guest/session').then(r => r.data)
export const getGuestSession = () => api.get('/guest/session').then(r => r.data)