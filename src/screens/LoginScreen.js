import { useState } from 'react'
import { Alert, Text } from 'react-native'
import Screen from '../components/Screen'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'
import { colors, font } from '../theme'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const next = {}
    if (!emailRegex.test(email.trim())) next.email = 'Ingresa un correo válido'
    if (!password) next.password = 'Ingresa tu contraseña'
    setErrors(next); setApiError('')
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      const { token } = await login({ email: email.trim(), password })
      const migration = await signIn(token)
      if (migration && !migration.error) {
        Alert.alert('Progreso transferido', `Se movieron ${migration.recognitionsMoved} reconocimientos y ${migration.achievementsMoved} logros a tu cuenta.`)
      }
    } catch (e) { setApiError(e.message); setLoading(false) }
  }

  return (
    <Screen>
      <Text accessibilityRole="header" style={{ fontSize: font.title, fontWeight: '800', color: colors.text, marginBottom: 24 }}>Iniciar sesión</Text>
      <ErrorBanner message={apiError} />
      <Input label="Correo electrónico" value={email} onChangeText={setEmail} error={errors.email}
        keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" />
      <Input label="Contraseña" value={password} onChangeText={setPassword} error={errors.password}
        secureTextEntry autoComplete="password" returnKeyType="done" onSubmitEditing={submit} />
      <Button title="Entrar" onPress={submit} loading={loading} />
      <Button title="¿No tienes cuenta? Regístrate" variant="secondary" onPress={() => navigation.replace('Register')} />
    </Screen>
  )
}