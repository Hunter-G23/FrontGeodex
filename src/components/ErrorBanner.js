import { Text, View } from 'react-native'
import { colors, font } from '../theme'

export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <View accessibilityRole="alert" style={{ backgroundColor: colors.errorBg, borderColor: colors.error, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 }}>
      <Text style={{ color: colors.error, fontSize: font.small }}>⚠ {message}</Text>
    </View>
  )
}