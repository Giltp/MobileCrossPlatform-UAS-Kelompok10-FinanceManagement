import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleChange = async () => {
    if (!current || !newPass || !confirm) {
      Alert.alert('Input Required', 'Please fill in all fields.');
      return;
    }

    if (newPass !== confirm) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const email = session.user.email;

    // Re-authenticate using current password
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email: email ?? '', password: current });
    if (loginErr) {
      Alert.alert('Incorrect Password', 'Your current password is incorrect.');
      return;
    }

    // Update password
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPass });
    if (updateErr) {
      Alert.alert('Update Failed', updateErr.message);
    } else {
      Alert.alert('Success', 'Password updated successfully.');
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Pin</Text>

      <TextInput
        placeholder="Current Pin"
        secureTextEntry
        style={styles.input}
        value={current}
        onChangeText={setCurrent}
      />
      <TextInput
        placeholder="New Pin"
        secureTextEntry
        style={styles.input}
        value={newPass}
        onChangeText={setNewPass}
      />
      <TextInput
        placeholder="Confirm Pin"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>Change Pin</Text>
      </TouchableOpacity>

      <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FF0000', marginBottom: 8 }]}
              onPress={() => router.replace('/(profiles)/security')}
            >
              <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFFF5',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#E0F2E9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00D17E',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});
