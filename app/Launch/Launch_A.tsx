import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Launch_A() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('assets/images/Launch.png')} style={styles.logo} />
      <Text style={styles.title}>FinWise</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/OnBoard/OnBoarding_A')}>
          <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

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
  button: {
    marginTop: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#00C9A7',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
