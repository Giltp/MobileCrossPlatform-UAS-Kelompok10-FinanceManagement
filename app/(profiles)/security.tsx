import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SecurityScreen() {
  const menuItems = [
    { label: 'Change Pin', route: '/(profiles-security)/changePassword' },
    { label: 'Fingerprint', route: '/(profiles-security)/fingerprint' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00D4AA" barStyle="light-content" />
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={{ paddingRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Security</Text>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={() => item.route !== '#' && router.push(item.route as '/(profiles-security)/changePassword')}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00D4AA',
  },
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#D0E8DC',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
});
