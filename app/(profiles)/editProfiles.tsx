import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function EditProfile() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Failed to fetch profile:', error);
      } else {
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
      }
    };

    fetchProfile();
  }, []);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Camera roll permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      console.log('📸 Picked image:', image.uri);

      if (!userId) {
        Alert.alert('Error', 'User ID not available.');
        return;
      }

      const fileExt = image.uri.split('.').pop() || 'jpg';
      const filePath = `${userId}/avatar.${fileExt}`;

      try {
        const base64 = await FileSystem.readAsStringAsync(image.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { error } = await supabase.storage
          .from('avatars')
          .upload(filePath, Buffer.from(base64, 'base64'), {
            upsert: true,
            contentType: 'image/jpeg',
          });

        if (error) {
          console.error('❌ Upload error:', error);
          Alert.alert('Upload failed', error.message);
          return;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        console.log('✅ Upload success. Public URL:', data.publicUrl);
        setAvatarUrl(data.publicUrl);
      } catch (err) {
        console.error('❌ File upload error:', err);
        Alert.alert('File Error', 'Failed to upload image.');
      }
    }
  };



  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
      })
      .eq('id', userId);

    if (error) {
      Alert.alert('Update failed', error.message);
    } else {
      Alert.alert('Profile updated');
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require('@/assets/images/Profile Placeholders.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF0000', marginBottom: 8 }]}
        onPress={() => router.replace('/(tabs)/profile')}
      >
        <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ECFFF5',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  changePhoto: {
    color: '#00D17E',
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#E0F2E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00D17E',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
