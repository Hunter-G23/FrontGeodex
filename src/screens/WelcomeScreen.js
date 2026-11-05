import { useState } from 'react'
import { Text, View } from 'react-native'
import Screen from '../components/Screen'
import Button from '../components/Button'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { colors, font } from '../theme'

export default function WelcomeScreen({ navigation }) {
  const { continueAsGuest } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const goGuest = async () => {
    setLoading(true); setError('')
    try { await continueAsGuest() } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <Text accessibilityRole="header" style={{ fontSize: 34, fontWeight: '800', color: colors.text }}>Geodex</Text>
        <Text style={{ fontSize: font.subtitle, color: colors.muted, marginBottom: 16 }}>
          Fotografía una roca y descubre qué es. Crea una cuenta para guardar tu colección.
        </Text>
        <ErrorBanner message={error} />
        <Button title="Iniciar sesión" onPress={() => navigation.navigate('Login')} />
        <Button title="Crear cuenta" variant="secondary" onPress={() => navigation.navigate('Register')} />
        <Button title="Continuar como invitado" variant="secondary" loading={loading} onPress={goGuest}
          hint="Podrás reconocer hasta 10 rocas sin cuenta" />
      </View>
    </Screen>
  )
}