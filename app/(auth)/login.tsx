import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { supabase } from '@/lib/supabase'
import { router, Link } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      let message = 'Login failed. Please try again.'
      if (error.message.includes('Invalid login credentials')) message = 'Incorrect email or password.'
      Alert.alert('Login Error', message)
    } else {
      Alert.alert('Login berhasil', '', [
        {
          text: 'OK',
          onPress: () => router.replace('/OnBoard/OnBoarding_A')
,
        },
      ])
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <TextInput
        placeholder="example@example.com"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.fingerprintText}>
        Use <Text style={styles.highlight}>Fingerprint</Text> To Access
      </Text>

      <Text style={styles.socialText}>or sign up with</Text>
      <View style={styles.socialIcons}>
        <Text>🔵</Text>
        <Text>🔴</Text>
      </View>

      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text style={styles.bottomText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00C9A7',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#00C9A7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#00C9A7',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  fingerprintText: {
    textAlign: 'center',
    marginVertical: 12,
  },
  highlight: {
    color: '#00C9A7',
    fontWeight: 'bold',
  },
  socialText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  bottomText: {
    textAlign: 'center',
    color: '#444',
    marginTop: 20,
  },
})
