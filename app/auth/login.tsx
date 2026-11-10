import React, { useState } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { auth } from '../../firebase';
import { Button, Field } from '../../components/ui';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      Toast.show({ type: 'error', text1: 'Preencha e-mail e senha.' });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Não foi possível entrar', text2: 'Confira suas credenciais e tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
    <View style={styles.brand}>
      <Text style={styles.emoji}>🐂</Text>
      <Text style={styles.title}>Controle de Rebanho</Text>
      <Text style={styles.subtitle}>Gestão simples e organizada da sua propriedade</Text>
    </View>
    <View style={styles.card}>
      <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="seu@email.com" />
      <Field label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Sua senha" />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={entrar} disabled={loading} />
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 22 },
  brand: { alignItems: 'center', marginBottom: 28 },
  emoji: { fontSize: 54, marginBottom: 8 },
  title: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 27 },
  subtitle: { color: theme.colors.muted, textAlign: 'center', marginTop: 7 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border }
});
