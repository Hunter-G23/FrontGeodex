import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'

export default function Screen({ children, scroll = true }) {
  const content = scroll
    ? <ScrollView contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    : children
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}