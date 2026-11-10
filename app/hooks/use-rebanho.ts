import { useCallback, useState } from 'react';
import {
  collection, getDocs, orderBy, query, where
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Animal, StatusAnimal } from '../types';

export function useRebanho() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async (status?: StatusAnimal | 'todos') => {
    setLoading(true);
    try {
      const base = collection(db, 'animais');
      const q = status && status !== 'todos'
        ? query(base, where('status', '==', status), orderBy('brinco'))
        : query(base, orderBy('brinco'));
      const snapshot = await getDocs(q);
      setAnimais(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Animal)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { animais, loading, carregar };
}
