import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { router, useSegments } from 'expo-router'

export function useProtectedRoute() {
  const segments = useSegments()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user
      const inAuthGroup = segments[0] === '(auth)'

      if (!user && !inAuthGroup) {
        router.replace('/login')
      }

      if (user && inAuthGroup) {
        router.replace({ pathname: '/(tabs)' })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [segments])
}
