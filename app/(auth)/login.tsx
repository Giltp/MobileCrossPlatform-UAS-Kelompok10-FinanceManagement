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
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirectTo = 'https://auth.expo.io/@giltpp/MobileCrossPlatform-UAS-Kelompok7-FinanceManagement';

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Login gagal', error.message);
      return;
    }

    // ✅ Simpan email & password untuk fingerprint
    await SecureStore.setItemAsync('email', email);
    await SecureStore.setItemAsync('password', password);

    // ✅ Arahkan ke home (tabs)
    router.replace('/(tabs)');
  };

  const handleFingerprintLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !enrolled) {
      Alert.alert('Error', 'Fingerprint is not available or set up on this device.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with fingerprint',
    });

    if (!result.success) {
      Alert.alert('Auth failed', 'Fingerprint authentication failed.');
      return;
    }

    const storedEmail = await SecureStore.getItemAsync('email');
    const storedPassword = await SecureStore.getItemAsync('password');

    if (!storedEmail || !storedPassword) {
      Alert.alert('Missing credentials', 'Email/password not saved.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: storedEmail,
      password: storedPassword,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
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
      <TouchableOpacity onPress={handleFingerprintLogin}>
        <Text style={styles.fingerprintText}>
          Use <Text style={{ color: 'blue' }}>Fingerprint</Text> To Access
        </Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or sign up with</Text>
      <View style={styles.socialIcons}>
        {/* Facebook bisa ditambahkan nanti */}
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image
            source={require('../../assets/images/Google Logo.png')}
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
