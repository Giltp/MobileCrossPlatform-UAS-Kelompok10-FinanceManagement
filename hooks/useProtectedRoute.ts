// hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { router, useSegments } from 'expo-router';

export function useProtectedRoute() {
  const segments = useSegments();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      const inAuthGroup = segments[0] === '(auth)';
      const inOnBoardGroup = segments[0] === 'OnBoard'; // 👈 pengecualian

      console.log('✅ ProtectedRoute: segments =', segments);
      console.log('✅ user =', user);

      if (!user && !inAuthGroup && !inOnBoardGroup) {
        router.replace('/(auth)/login');
      }

      if (user && (inAuthGroup || inOnBoardGroup)) {
        router.replace('/(tabs)');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [segments]);
}
