import React, { useEffect, useState } from 'react';
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
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not found', userError);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile({ ...data, id: user.id });
      }
    };

    fetchProfile();
  }, []);

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
            <Image
              source={
                profile?.avatar_url
                  ? { uri: profile.avatar_url }
                  : require('@/assets/images/Profile Placeholders.png')
              }
              style={styles.avatar}
            />
            {profile?.full_name && (
              <Text style={styles.fullName}>({profile.full_name})</Text>
            )}
            <Text style={styles.username}>{profile?.username || 'User'}</Text>
            <Text style={styles.id}>
              ID: {profile?.id?.split('-')[1]?.toUpperCase() ?? '....'}
            </Text>
          </View>

          <View style={styles.menuList}>
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => router.push('/(profiles)/editProfiles')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              label="Security"
              onPress={() => router.push('/(profiles)/security')}
            />
            <MenuItem
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
            />
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
  fullName: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
});
