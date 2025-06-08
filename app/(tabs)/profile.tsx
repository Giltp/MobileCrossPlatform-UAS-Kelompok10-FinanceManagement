import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout gagal', error.message);
    } else {
      Alert.alert('Logout Berhasil', '', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00D4AA" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.profileSection}>
            <Text style={styles.name}>John Smith</Text>
            <Text style={styles.id}>ID: 25030024</Text>
          </View>

          <View style={styles.menuList}>
            <MenuItem icon="person-outline" label="Edit Profile" />
            <MenuItem icon="shield-checkmark-outline" label="Security" />
            <MenuItem icon="settings-outline" label="Setting" />
            <MenuItem icon="help-circle-outline" label="Help" />
            <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
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
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#222',
  },
  id: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuList: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
});

//<Image
//source={require('@/assets/images/profile-placeholder.png')}
//style={styles.avatar}
///>