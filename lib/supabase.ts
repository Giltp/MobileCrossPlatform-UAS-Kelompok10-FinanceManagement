// lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://qxwnzfjskshwowwmaxml.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d256Zmpza3Nod293d21heG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTI3NzQsImV4cCI6MjA2MzI4ODc3NH0.scLhtr3eB4ONvtVOL-g_SfXUXkpN2zvVYt8WGVTrJ4w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Set to false for React Native
    },
})