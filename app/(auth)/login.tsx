import { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });
  console.log('redirectTo value:', redirectTo);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        console.log('Login success via Google:', session.user.email);
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
    } else {
      Alert.alert('Login berhasil', '', [
        {
          text: 'OK',
          onPress: () => router.replace({ pathname: '/(tabs)' }),
        },
      ]);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Redirect URL:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });

      console.log('Login URL:', data?.url);

      if (error) {
        Alert.alert('Google Login Error', error.message);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        console.log('WebBrowser result:', result);

        // Cek session secara eksplisit (untuk jaga-jaga kalau listener gagal)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionData?.session?.user) {
          console.log('User from getSession:', sessionData.session.user.email);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Session not ready', sessionError?.message || 'Belum berhasil login');
        }
      }
    } catch (err) {
      console.error('UNEXPECTED ERROR:', err);
      Alert.alert('Error', String(err));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Link href="/register">Belum punya akun? Register di sini</Link>
      <Button title="Login dengan Google" onPress={handleGoogleLogin} />
    </View>
  );
}
