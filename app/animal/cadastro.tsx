import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { db } from '../../firebase';
import { Page, Heading, Field, Button } from '../../components/ui';
import { isValidDate } from '../../utils/format';
import type { StatusAnimal, Sexo } from '../../types';

export default function CadastroAnimalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;
  const [brinco, setBrinco] = useState('');
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Bovino');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState<Sexo>('M');
  const [nascimento, setNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [pasto, setPasto] = useState('');
  const [status, setStatus] = useState<StatusAnimal>('ativo');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'animais', id)).then(s => {
      if (!s.exists()) return;
      const a = s.data();
      setBrinco(a.brinco || ''); setNome(a.nome || ''); setEspecie(a.especie || '');
      setRaca(a.raca || ''); setSexo(a.sexo || 'M'); setNascimento(a.nascimento || '');
      setPeso(String(a.peso ?? '')); setPasto(a.pasto || ''); setStatus(a.status || 'ativo');
    });
  }, [id]);

  async function salvar() {
    const pesoNum = Number(peso.replace(',', '.'));
    if (!brinco.trim() || !especie.trim() || !sexo || !nascimento || !peso.trim() || !status) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios.' }); return;
    }
    if (!isValidDate(nascimento)) {
      Toast.show({ type: 'error', text1: 'Data inválida', text2: 'Use o formato AAAA-MM-DD.' }); return;
    }
    if (!Number.isFinite(pesoNum) || pesoNum <= 0) {
      Toast.show({ type: 'error', text1: 'Informe um peso válido, maior que zero.' }); return;
    }
    setSaving(true);
    try {
      const repetidos = await getDocs(query(collection(db, 'animais'), where('brinco', '==', brinco.trim())));
      if (repetidos.docs.some(d => d.id !== id)) {
        Toast.show({ type: 'error', text1: 'Já existe um animal com esse número de brinco.' }); return;
      }
      const dados = { brinco: brinco.trim(), nome: nome.trim(), especie: especie.trim(), raca: raca.trim(), sexo, nascimento, peso: pesoNum, pasto: pasto.trim(), status };
      if (id) await updateDoc(doc(db, 'animais', id), dados);
      else await addDoc(collection(db, 'animais'), dados);
      Toast.show({ type: 'success', text1: editando ? 'Animal atualizado!' : 'Animal cadastrado!' });
      router.back();
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao salvar animal', text2: 'Verifique sua conexão e as regras do Firestore.' });
    } finally { setSaving(false); }
  }

  return <Page><ScrollView showsVerticalScrollIndicator={false}>
    <Heading title={editando ? 'Editar animal' : 'Novo animal'} subtitle="Os campos com * são obrigatórios." />
    <Field label="Número do brinco *" value={brinco} onChangeText={setBrinco} placeholder="Ex.: 0001" />
    <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Nome ou identificação" />
    <Field label="Espécie *" value={especie} onChangeText={setEspecie} placeholder="Bovino" />
    <Field label="Raça" value={raca} onChangeText={setRaca} placeholder="Nelore, Angus..." />
    <Field label="Sexo * (M ou F)" value={sexo} onChangeText={v => setSexo(v.toUpperCase() === 'F' ? 'F' : 'M')} autoCapitalize="characters" maxLength={1} />
    <Field label="Nascimento * (AAAA-MM-DD)" value={nascimento} onChangeText={setNascimento} placeholder="2024-03-15" />
    <Field label="Peso atual em kg *" value={peso} onChangeText={setPeso} keyboardType="decimal-pad" placeholder="Ex.: 320" />
    <Field label="Pasto" value={pasto} onChangeText={setPasto} placeholder="Ex.: Pasto 01" />
    <Field label="Status * (ativo, vendido ou abatido)" value={status} onChangeText={v => setStatus((['ativo','vendido','abatido'].includes(v.toLowerCase()) ? v.toLowerCase() : 'ativo') as StatusAnimal)} />
    <Button title={saving ? 'Salvando...' : 'Salvar animal'} onPress={salvar} disabled={saving} />
    <Button title="Cancelar" onPress={() => router.back()} secondary />
  </ScrollView></Page>;
}
