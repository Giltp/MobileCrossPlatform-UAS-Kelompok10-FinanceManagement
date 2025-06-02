import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Index() {
  useEffect(() => {
    const initialize = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const { data: { session } } = await supabase.auth.getSession();

      if (!hasSeenOnboarding) {
        router.replace('/');// Pergi ke launch screen
      } else if (!session) {
        router.replace('/(auth)/login'); // Belum login
      } else {
        router.replace('/(tabs)'); // Sudah login
      }
    };

    initialize();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
