import React, { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../firebase';
import { theme } from '../constants/theme';

export default function RootLayout() {
  const [user, setUser] = useState(auth.currentUser);
  const [ready, setReady] = useState(false);
  const segments = useSegments();

  useEffect(() => onAuthStateChanged(auth, current => {
    setUser(current);
    setReady(true);
  }), []);

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)');
  }, [user, ready, segments]);

  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>;

  return <>
    <Stack screenOptions={{ headerShown: false }} />
    <Toast />
  </>;
}
