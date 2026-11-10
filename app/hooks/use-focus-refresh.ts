import { useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';

/** Executa novamente a consulta sempre que a tela ganha foco. */
export function useFocusRefresh(callback: () => void | Promise<void>) {
  const memoized = useCallback(() => {
    void callback();
  }, [callback]);

  useFocusEffect(
    useCallback(() => {
      memoized();
    }, [memoized])
  );
}
