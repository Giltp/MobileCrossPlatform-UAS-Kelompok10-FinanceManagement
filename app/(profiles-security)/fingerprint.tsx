import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function FingerprintListScreen() {
  const [fingerprints, setFingerprints] = useState<any[]>([]);

  useEffect(() => {
    const fetchFingerprints = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('❌ Failed to fetch user', userError);
        return;
      }

      const { data, error } = await supabase
        .from('user_fingerprints')
        .select('id, label, is_enabled, created_at')
        .eq('id', user.id);


      if (error) {
        console.error('❌ Error loading fingerprints:', error);
      } else {
        setFingerprints(data || []);
      }
    };

    fetchFingerprints();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({ pathname: '/(profiles-security)/fingerprintDetail', params: { id: item.id } })}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="finger-print" size={24} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>{item.label}</Text>
        <Text style={{ color: '#666', fontSize: 12 }}>{item.is_enabled ? 'Enabled' : 'Disabled'}</Text>
        <Text style={{ color: '#aaa', fontSize: 10 }}>Created: {item.created_at ? new Date(item.created_at).toLocaleString() : ''}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fingerprint</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Fingerprints</Text>
        <FlatList
          data={fingerprints}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addItem}
              onPress={() => router.push('/(profiles-security)/addFingerprint')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#00D4AA' }]}>
                <Ionicons name="add" size={24} color="white" />
              </View>
              <Text style={styles.itemText}>Add A Fingerprint</Text>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00D4AA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#E9FFF4',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
});
