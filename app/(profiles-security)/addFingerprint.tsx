import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AddFingerprintScreen() {
  const handleAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    if (!result.success) {
      Alert.alert('Authentication Failed', result.error || 'Unable to authenticate.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    const label = `Fingerprint ${new Date().toLocaleDateString()}`;
    const { error } = await supabase
      .from('user_fingerprints')
      .upsert({ id: user.id, label, is_enabled: true }); // or insert()

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Fingerprint added successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00D4AA" barStyle="light-content" />
      <Text style={styles.title}>Add Fingerprint</Text>
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>Use Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00D4AA', justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 20, marginBottom: 24 },
  button: { backgroundColor: '#ECFFF5', padding: 16, borderRadius: 16 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#00D4AA' },
});
