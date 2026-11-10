import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { theme } from '../constants/theme';

export function Page({ children }: { children: React.ReactNode }) {
  return <View style={styles.page}>{children}</View>;
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={{ marginBottom: 18 }}>
    <Text style={styles.heading}>{title}</Text>
    {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>;
}

export function Field({ label, style, ...props }: TextInputProps & { label: string; style?: ViewStyle }) {
  return <View style={[{ marginBottom: 13 }, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#9A938A" style={styles.input} {...props} />
  </View>;
}

export function Button({ title, onPress, secondary, disabled }: {
  title: string; onPress: () => void; secondary?: boolean; disabled?: boolean;
}) {
  return <Pressable disabled={disabled} onPress={onPress}
    style={[styles.button, secondary && styles.secondary, disabled && { opacity: 0.55 }]}>
    <Text style={[styles.buttonText, secondary && { color: theme.colors.primary }]}>{title}</Text>
  </Pressable>;
}

export function Pill({ label, color = theme.colors.primary }: { label: string; color?: string }) {
  return <View style={[styles.pill, { backgroundColor: color + '18' }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background, padding: 18 },
  heading: { color: theme.colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: theme.colors.muted, marginTop: 4, fontSize: 14 },
  label: { color: theme.colors.text, fontWeight: '700', marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 12, color: theme.colors.text, fontSize: 15 },
  button: { backgroundColor: theme.colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 7 },
  secondary: { backgroundColor: '#F3E7DD', borderWidth: 1, borderColor: '#E6C9B4' },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  pillText: { fontSize: 12, fontWeight: '800' }
});
