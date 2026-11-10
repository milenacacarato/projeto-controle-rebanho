import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { db } from '../../firebase';
import { Page, Heading, Field, Button } from '../../components/ui';
import { isValidDate } from '../../utils/format';
import type { TipoManejo } from '../../types';

export default function CadastroManejoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tipo, setTipo] = useState<TipoManejo>('vacina');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [pesoKg, setPesoKg] = useState('');
  const [saving, setSaving] = useState(false);

  async function salvar() {
    if (!descricao.trim() || !isValidDate(data)) {
      Toast.show({ type: 'error', text1: 'Informe a descrição e uma data válida (AAAA-MM-DD).' }); return;
    }
    const peso = Number(pesoKg.replace(',', '.'));
    if (tipo === 'pesagem' && (!Number.isFinite(peso) || peso <= 0)) {
      Toast.show({ type: 'error', text1: 'Informe o peso da pesagem.' }); return;
    }
    setSaving(true);
    try {
      const dados: any = { tipo, descricao: descricao.trim(), data };
      if (tipo === 'pesagem') dados.pesoKg = peso;
      await addDoc(collection(db, 'animais', id, 'manejos'), dados);
      if (tipo === 'pesagem') await updateDoc(doc(db, 'animais', id), { peso });
      Toast.show({ type: 'success', text1: 'Manejo registrado!' });
      router.back();
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao registrar manejo.' });
    } finally { setSaving(false); }
  }

  return <Page><ScrollView>
    <Heading title="Novo manejo" subtitle="Registre vacina, pesagem ou tratamento." />
    <Field label="Tipo * (vacina, pesagem ou tratamento)" value={tipo} onChangeText={v => setTipo((['vacina','pesagem','tratamento'].includes(v.toLowerCase()) ? v.toLowerCase() : 'vacina') as TipoManejo)} />
    <Field label="Descrição *" value={descricao} onChangeText={setDescricao} placeholder="Nome da vacina, tratamento ou observação" multiline />
    <Field label="Data * (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-01-31" />
    {tipo === 'pesagem' && <Field label="Peso aferido em kg *" value={pesoKg} onChangeText={setPesoKg} keyboardType="decimal-pad" placeholder="Ex.: 350" />}
    <Button title={saving ? 'Salvando...' : 'Salvar manejo'} onPress={salvar} disabled={saving} />
    <Button title="Cancelar" onPress={() => router.back()} secondary />
  </ScrollView></Page>;
}
