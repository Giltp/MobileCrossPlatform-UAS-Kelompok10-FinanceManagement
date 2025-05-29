import React from "react";
import { View } from "react-native";
import HomeScreen from "@/components/HomeScreen";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}
