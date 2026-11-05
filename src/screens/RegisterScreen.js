import { useState } from 'react'
import { Alert, Text } from 'react-native'
import Screen from '../components/Screen'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { login, register } from '../services/authService'
import { colors, font } from '../theme'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth()
  const [form, setForm] = useState({ userName: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = key => value => setForm(f => ({ ...f, [key]: value }))

  const submit = async () => {
    const next = {}
    if (!form.userName.trim()) next.userName = 'Elige un nombre de usuario'
    if (!emailRegex.test(form.email.trim())) next.email = 'Ingresa un correo válido'
    if (form.password.length < 8) next.password = 'Debe tener al menos 8 caracteres'
    setErrors(next); setApiError('')
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      const email = form.email.trim()
      await register({ userName: form.userName.trim(), email, password: form.password, phone: form.phone.trim() || undefined })
      const { token } = await login({ email, password: form.password })
      const migration = await signIn(token)
      if (migration && !migration.error) {
        Alert.alert('Progreso transferido', `Se movieron ${migration.recognitionsMoved} reconocimientos y ${migration.achievementsMoved} logros a tu cuenta.`)
      }
    } catch (e) { setApiError(e.message); setLoading(false) }
  }

  return (
    <Screen>
      <Text accessibilityRole="header" style={{ fontSize: font.title, fontWeight: '800', color: colors.text, marginBottom: 24 }}>Crear cuenta</Text>
      <ErrorBanner message={apiError} />
      <Input label="Nombre de usuario" value={form.userName} onChangeText={set('userName')} error={errors.userName} autoCapitalize="none" />
      <Input label="Correo electrónico" value={form.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Contraseña (mínimo 8 caracteres)" value={form.password} onChangeText={set('password')} error={errors.password} secureTextEntry />
      <Input label="Teléfono (opcional)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
      <Button title="Crear cuenta" onPress={submit} loading={loading} />
    </Screen>
  )
}