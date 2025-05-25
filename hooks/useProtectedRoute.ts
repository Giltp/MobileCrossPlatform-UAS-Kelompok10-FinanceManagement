// hooks/useProtectedRoute.ts
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { router, useSegments } from 'expo-router'

export function useProtectedRoute() {
  const segments = useSegments()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user
      const inAuthGroup = segments[0] === '(auth)'

      if (error) {
        // Handle Supabase error jika perlu
        console.error('Supabase auth error:', error)
      }

      if (!user && !inAuthGroup) {
        // Belum login dan buka halaman luar auth
        router.replace('/login')
      }

      if (user && inAuthGroup) {
        // Sudah login, jangan izinkan lihat halaman login/register
        router.replace('/index')
      }
    }

    checkSession()
    // Tidak perlu cleanup function di sini
  }, [segments])
}
