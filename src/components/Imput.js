import { Text, TextInput, View } from 'react-native'
import { colors, font } from '../theme'

export default function Input({ label, error, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: font.small, fontWeight: '600', color: colors.text, marginBottom: 6 }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={{
          minHeight: 52, borderWidth: error ? 2 : 1, borderColor: error ? colors.error : colors.border,
          borderRadius: 10, paddingHorizontal: 12, fontSize: font.body, color: colors.text, backgroundColor: colors.surface
        }}
        {...props}
      />
      {!!error && <Text accessibilityLiveRegion="polite" style={{ color: colors.error, marginTop: 4, fontSize: font.small }}>⚠ {error}</Text>}
    </View>
  )
}