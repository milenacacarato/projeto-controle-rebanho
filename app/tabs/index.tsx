import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Page, Heading, Button, Pill } from '../../components/ui';
import { theme } from '../../constants/theme';
import { useFocusRefresh } from '../../hooks/use-focus-refresh';

export default function HomeScreen() {
  const [total, setTotal] = useState(0);
  const [ativos, setAtivos] = useState(0);
  const [alertas, setAlertas] = useState(0);

  const carregar = useCallback(async () => {
    const snap = await getDocs(collection(db, 'animais'));
    const data = snap.docs.map(d => d.data());
    setTotal(data.length);
    setAtivos(data.filter(a => a.status === 'ativo').length);
    const hoje = Date.now();
    const semVacina = await Promise.all(snap.docs.map(async d => {
      const m = await getDocs(query(collection(db, 'animais', d.id, 'manejos'), where('tipo', '==', 'vacina')));
      const dates = m.docs.map(x => String(x.data().data || '')).sort().reverse();
      if (!dates.length) return true;
      return (hoje - new Date(`${dates[0]}T00:00:00Z`).getTime()) / 86400000 > 180;
    }));
    setAlertas(semVacina.filter(Boolean).length);
  }, []);
  useFocusRefresh(carregar);

  return <Page>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.top}>
        <View><Text style={styles.kicker}>PAINEL DA FAZENDA</Text><Text style={styles.greeting}>Olá, produtor!</Text></View>
        <Pressable onPress={() => signOut(auth)}><Text style={styles.logout}>Sair ↗</Text></Pressable>
      </View>
      <Heading title="Visão geral" subtitle="Acompanhe os principais indicadores do seu rebanho." />
      <View style={styles.grid}>
        <View style={styles.stat}><Text style={styles.number}>{total}</Text><Text style={styles.statLabel}>Animais cadastrados</Text></View>
        <View style={styles.stat}><Text style={styles.number}>{ativos}</Text><Text style={styles.statLabel}>Animais ativos</Text></View>
      </View>
      <View style={styles.alert}>
        <Pill label="ATENÇÃO" color={theme.colors.warning} />
        <Text style={styles.alertNumber}>{alertas}</Text>
        <Text style={styles.alertText}>animal(is) sem vacinação registrada nos últimos 180 dias.</Text>
      </View>
      <Button title="+ Cadastrar animal" onPress={() => router.push('/animal/cadastro')} />
      <Button title="Visualizar rebanho" secondary onPress={() => router.push('/(tabs)/animais')} />
      <Text style={styles.note}>Dica: registre cada vacina, pesagem ou tratamento na ficha do animal para manter o histórico atualizado.</Text>
    </ScrollView>
  </Page>;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  kicker: { color: theme.colors.primary, fontWeight: '900', fontSize: 11, letterSpacing: 1.4 },
  greeting: { color: theme.colors.text, fontSize: 25, fontWeight: '900', marginTop: 4 },
  logout: { color: theme.colors.primary, fontWeight: '800' },
  grid: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 18, backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: theme.colors.border },
  number: { fontSize: 31, fontWeight: '900', color: theme.colors.primaryDark },
  statLabel: { color: theme.colors.muted, marginTop: 5, fontWeight: '600' },
  alert: { marginTop: 16, padding: 17, borderRadius: 15, backgroundColor: theme.colors.warningBg },
  alertNumber: { fontSize: 28, fontWeight: '900', color: theme.colors.warning, marginTop: 8 },
  alertText: { color: '#704000', lineHeight: 20 },
  note: { color: theme.colors.muted, marginTop: 22, lineHeight: 21, fontSize: 13 }
});
