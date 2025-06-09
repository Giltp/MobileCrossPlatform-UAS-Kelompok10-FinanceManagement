import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/OnBoard/OnBoarding_A');
    }, 3000); // ⏳ Tunggu 3 detik sebelum redirect

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('assets/images/Launch.png')} style={styles.logo} />
      <Text style={styles.title}>FinWise</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C9A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});
