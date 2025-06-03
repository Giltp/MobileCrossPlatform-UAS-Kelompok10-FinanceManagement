// app/index.tsx & Splash Screen
import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // ⏳ Splash selama 5 detik

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo launch.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <Redirect href="/OnBoard/OnBoarding_A" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});
