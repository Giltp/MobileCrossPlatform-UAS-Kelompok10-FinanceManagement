import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams  } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function FingerprintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<{ label: string; is_enabled: boolean; created_at: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('user_fingerprints')
        .select('label, is_enabled, created_at')
        .eq('id', id)
        .single();
      if (error) {
        console.error(error);
      } else {
        setRecord(data);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Delete this fingerprint?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          const { error } = await supabase
            .from('user_fingerprints')
            .delete()
            .eq('id', id);
          if (error) {
            Alert.alert('Error', error.message);
          } else {
            Alert.alert('Success', 'Fingerprint deleted.', [{ text: 'OK', onPress: () => router.back() }]);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00D4AA" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{record?.label || 'Detail'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.detailBox}>
          <Ionicons name="finger-print" size={72} color="#00D4AA" />
          <Text style={styles.name}>{record?.label}</Text>
          <Text style={{ color: '#666', marginTop: 8 }}>
            {record?.is_enabled ? 'Enabled' : 'Disabled'}
          </Text>
          <Text style={{ color: '#aaa', marginTop: 4, fontSize: 12 }}>
            Created: {record?.created_at ? new Date(record.created_at).toLocaleString() : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00D4AA' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, justifyContent: 'space-between',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, backgroundColor: '#E9FFF4', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 40, alignItems: 'center' },
  detailBox: { alignItems: 'center', marginBottom: 40 },
  name: { marginTop: 20, fontSize: 20, fontWeight: '600', color: '#222' },
  deleteBtn: { backgroundColor: '#FF4D4D', paddingVertical: 14, paddingHorizontal: 60, borderRadius: 30 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
