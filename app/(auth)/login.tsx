import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirectTo = 'https://auth.expo.io/@giltpp/MobileCrossPlatform-UAS-Kelompok10-FinanceManagement';

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.replace('/(tabs)');
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Login gagal', error.message);
      return;
    }
    Alert.alert('Login berhasil', '', [
      { text: 'OK', onPress: () => router.replace('/Launch/Launch_A') },
    ]);
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) {
        Alert.alert('Google Login Error', error.message);
        return;
      }
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            router.replace('/(tabs)');
          } else {
            Alert.alert('Session not ready', sessionError?.message || 'Belum berhasil login');
          }
        }
      }
    } catch (err) {
      Alert.alert('Unexpected Error', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.forgotText}>Forgot Password?</Text>
      <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/register')}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.fingerprintText}>
        Use <Text style={{ color: 'blue' }}>Fingerprint</Text> To Access
      </Text>
      <Text style={styles.orText}>or sign up with</Text>
      <View style={styles.socialIcons}>
        {/* Facebook bisa ditambahkan nanti */}
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>
        Don't have an account?{' '}
        <Link href="/register">
          <Text style={{ color: 'blue' }}>Sign Up</Text>
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ECFFF5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#E0F2E9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#00D17E',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#DEF4E7',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fingerprintText: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  orText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  icon: {
    width: 36,
    height: 36,
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
});
