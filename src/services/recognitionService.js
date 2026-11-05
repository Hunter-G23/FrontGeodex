import api from './api'

export const recognizeImage = async uri => {
  const form = new FormData()
  form.append('image', { uri, name: 'rock.jpg', type: 'image/jpeg' })
  const { data } = await api.post('/recognition', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  })
  return data
}