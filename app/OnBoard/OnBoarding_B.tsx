// app/OnBoard/OnBoarding_B.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function OnBoard_B() {

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>
          Are You Ready{'\n'}To Take Control Of{'\n'}Your Finances?
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/OnBoard_B.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.buttonText}>Start Using App</Text>
      </TouchableOpacity>
      <View style={styles.dots}>
        <View style={styles.inactiveDot} />
        <View style={styles.activeDot} />
      </View>
    </View>
  );
}

// ...styles tetap sama

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topSection: {
    flex: 1,
    backgroundColor: '#00cba9',
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    color: '#fff', // putih agar kontras dengan background hijau
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  imageContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  image: { width: 220, height: 220 },
  button: {
    alignSelf: 'center',
    backgroundColor: '#00cba9',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, marginTop: 10 },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00cba9',
    margin: 6,
  },
  inactiveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    margin: 6,
  },
});
