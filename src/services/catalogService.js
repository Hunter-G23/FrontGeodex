import api from './api'

export const getRocks = (params = {}) => api.get('/rock', { params }).then(r => r.data)
export const getRock = id => api.get(`/rock/${id}`).then(r => r.data)
export const getTypes = () => api.get('/type').then(r => r.data)
export const getCategories = () => api.get('/category').then(r => r.data)
export const getAchievements = () => api.get('/achievement').then(r => r.data)