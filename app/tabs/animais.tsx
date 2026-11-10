import React, { useCallback, useState } from 'react';
import { FlatList, Text, Pressable, View, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Page, Heading, Field, Pill } from '../../components/ui';
import { theme } from '../../constants/theme';
import { useRebanho } from '../../hooks/use-rebanho';
import { useFocusRefresh } from '../../hooks/use-focus-refresh';
import type { StatusAnimal } from '../../types';

const filtros: Array<{ label: string; value: StatusAnimal | 'todos' }> = [
  { label: 'Todos', value: 'todos' }, { label: 'Ativos', value: 'ativo' },
  { label: 'Vendidos', value: 'vendido' }, { label: 'Abatidos', value: 'abatido' }
];

export default function AnimaisScreen() {
  const [filtro, setFiltro] = useState<StatusAnimal | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const { animais, loading, carregar } = useRebanho();
  const atualizar = useCallback(() => carregar(filtro), [carregar, filtro]);
  useFocusRefresh(atualizar);
  const lista = animais.filter(a => `${a.brinco} ${a.nome || ''} ${a.raca || ''}`.toLowerCase().includes(busca.toLowerCase()));

  return <Page>
    <View style={styles.header}>
      <Heading title="Meu rebanho" subtitle={`${animais.length} registro(s) encontrados`} />
      <Pressable style={styles.add} onPress={() => router.push('/animal/cadastro')}><Ionicons name="add" size={25} color="#FFF" /></Pressable>
    </View>
    <Field label="Buscar animal" value={busca} onChangeText={setBusca} placeholder="Brinco, nome ou raça..." />
    <View style={styles.filters}>{filtros.map(f => <Pressable key={f.value} onPress={() => setFiltro(f.value)} style={[styles.filter, filtro === f.value && styles.selected]}><Text style={[styles.filterText, filtro === f.value && { color: '#FFF' }]}>{f.label}</Text></Pressable>)}</View>
    <FlatList
      data={lista} keyExtractor={item => item.id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={atualizar} />}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum animal encontrado. Cadastre o primeiro animal do rebanho.</Text>}
      renderItem={({ item }) => <Pressable style={styles.card} onPress={() => router.push({ pathname: '/animal/[id]', params: { id: item.id } })}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brinco}>Brinco {item.brinco}</Text>
          <Text style={styles.name}>{item.nome || item.raca || item.especie}</Text>
          <Text style={styles.meta}>{item.especie} · {item.sexo} · {item.peso} kg</Text>
        </View>
        <Pill label={item.status.toUpperCase()} color={item.status === 'ativo' ? theme.colors.success : theme.colors.muted} />
        <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
      </Pressable>}
    />
  </Page>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  add: { backgroundColor: theme.colors.primary, width: 43, height: 43, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EAE3DA' },
  selected: { backgroundColor: theme.colors.primary },
  filterText: { color: theme.colors.text, fontWeight: '700', fontSize: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10 },
  brinco: { fontSize: 11, color: theme.colors.primary, fontWeight: '900' },
  name: { fontSize: 16, color: theme.colors.text, fontWeight: '800', marginTop: 3 },
  meta: { color: theme.colors.muted, fontSize: 12, marginTop: 4 },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: 45, lineHeight: 22 }
});
