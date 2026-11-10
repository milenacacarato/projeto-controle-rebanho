import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { db } from '../../firebase';
import { Page, Heading, Button, Pill } from '../../components/ui';
import { theme } from '../../constants/theme';
import { formatDate, daysSince } from '../../utils/format';
import type { Animal, Manejo } from '../../types';

export default function AnimalDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [manejos, setManejos] = useState<Manejo[]>([]);
  const [alertaVacina, setAlertaVacina] = useState(false);

  const carregar = useCallback(async () => {
    const a = await getDoc(doc(db, 'animais', id));
    if (!a.exists()) { setAnimal(null); return; }
    setAnimal({ id: a.id, ...a.data() } as Animal);
    const snap = await getDocs(query(collection(db, 'animais', id, 'manejos'), orderBy('data', 'desc')));
    const lista = snap.docs.map(d => ({ id: d.id, ...d.data() } as Manejo));
    setManejos(lista);
    const vacinas = lista.filter(m => m.tipo === 'vacina').sort((x,y) => y.data.localeCompare(x.data));
    setAlertaVacina(!vacinas.length || daysSince(vacinas[0].data) > 180);
  }, [id]);

  useEffect(() => { carregar(); }, [carregar]);

  async function excluir() {
    Alert.alert('Excluir animal', 'Deseja realmente excluir este animal? O histórico de manejos também será removido.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          const snap = await getDocs(collection(db, 'animais', id, 'manejos'));
          await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
          await deleteDoc(doc(db, 'animais', id));
          Toast.show({ type: 'success', text1: 'Animal excluído.' });
          router.replace('/(tabs)/animais');
        } catch { Toast.show({ type: 'error', text1: 'Não foi possível excluir o animal.' }); }
      }}
    ]);
  }

  if (!animal) return <Page><Text>Carregando cadastro...</Text></Page>;

  return <Page><ScrollView>
    <Heading title={`Brinco ${animal.brinco}`} subtitle={animal.nome || animal.raca || animal.especie} />
    {alertaVacina && <View style={styles.warning}><Text style={styles.warningTitle}>⚠ Vacinação pendente</Text><Text>Não há vacina registrada nos últimos 180 dias.</Text></View>}
    <View style={styles.info}>
      <Info label="Espécie" value={animal.especie} /><Info label="Raça" value={animal.raca || '—'} />
      <Info label="Sexo" value={animal.sexo} /><Info label="Nascimento" value={formatDate(animal.nascimento)} />
      <Info label="Peso atual" value={`${animal.peso} kg`} /><Info label="Pasto" value={animal.pasto || '—'} />
      <Info label="Status" value={animal.status} />
    </View>
    <Button title="Registrar manejo" onPress={() => router.push({ pathname: '/manejo/cadastro', params: { id } })} />
    <Button title="Editar animal" secondary onPress={() => router.push({ pathname: '/animal/cadastro', params: { id } })} />
    <Text style={styles.section}>Histórico de manejo</Text>
    {manejos.length === 0 ? <Text style={styles.empty}>Nenhum manejo registrado.</Text> : manejos.map(m =>
      <View key={m.id} style={styles.manejo}>
        <View style={{ flex: 1 }}><Text style={styles.manejoTitle}>{m.tipo.toUpperCase()}</Text><Text style={styles.manejoDesc}>{m.descricao}</Text><Text style={styles.date}>{formatDate(m.data)}</Text></View>
        {m.tipo === 'pesagem' && <Pill label={`${m.pesoKg} kg`} color={theme.colors.success} />}
      </View>
    )}
    <Button title="Excluir animal" secondary onPress={excluir} />
  </ScrollView></Page>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoCell}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  warning: { backgroundColor: theme.colors.warningBg, padding: 14, borderRadius: 12, marginBottom: 14 },
  warningTitle: { color: theme.colors.warning, fontWeight: '900', marginBottom: 4 },
  info: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#FFF', borderRadius: 14, padding: 8, borderWidth: 1, borderColor: theme.colors.border },
  infoCell: { width: '50%', padding: 10 },
  infoLabel: { color: theme.colors.muted, fontSize: 12 },
  infoValue: { color: theme.colors.text, fontWeight: '800', marginTop: 4 },
  section: { fontSize: 19, fontWeight: '900', color: theme.colors.text, marginTop: 22, marginBottom: 10 },
  empty: { color: theme.colors.muted, paddingVertical: 12 },
  manejo: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 9, flexDirection: 'row', alignItems: 'center' },
  manejoTitle: { fontWeight: '900', color: theme.colors.primary, fontSize: 12 },
  manejoDesc: { color: theme.colors.text, marginTop: 4 },
  date: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }
});
