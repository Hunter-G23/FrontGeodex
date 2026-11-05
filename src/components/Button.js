
import { ActivityIndicator, Pressable, Text } from 'react-native'
import { colors, font } from '../theme'

export default function Button({ title, onPress, loading, disabled, variant = 'primary', hint }) {
  const primary = variant === 'primary'
  const inactive = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={hint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => ({
        minHeight: 52, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center',
        backgroundColor: primary ? colors.primary : colors.surface,
        borderWidth: primary ? 0 : 2, borderColor: colors.primary,
        opacity: inactive ? 0.55 : pressed ? 0.85 : 1
      })}
    >
      {loading
        ? <ActivityIndicator color={primary ? colors.onPrimary : colors.primary} />
        : <Text style={{ fontSize: font.body, fontWeight: '700', color: primary ? colors.onPrimary : colors.primary }}>{title}</Text>}
    </Pressable>
  )
}