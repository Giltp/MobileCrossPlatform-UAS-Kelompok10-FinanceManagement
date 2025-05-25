import { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Link, router } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      Alert.alert('Login gagal', error.message)
    } else {
      Alert.alert('Login berhasil', '', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/index'), // Ganti dengan rute yang sesuai
        },
      ])
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1 }} />
      <Button title="Login" onPress={handleLogin} />
      <Link href="/register">Belum punya akun? Register di sini</Link>
    </View>
  )
}
