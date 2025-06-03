import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function HomeTab() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout gagal", error.message);
    } else {
      Alert.alert("Berhasil logout", "", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    }
  };

  const renderPeriodButton = (period: "Daily" | "Weekly" | "Monthly") => (
    <TouchableOpacity
      key={period}
      style={[styles.periodButton, selectedPeriod === period && styles.selectedPeriodButton]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.selectedPeriodButtonText,
        ]}
      >
        {period}
      </Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = (
    icon: string,
    title: string,
    date: string,
    category: string,
    amount: string,
    isPositive: boolean = false
  ) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isPositive ? "#4CAF50" : "#2196F3" },
          ]}
        >
          <Ionicons name={icon as any} size={24} color="white" />
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseTitle}>{title}</Text>
          <Text style={styles.expenseDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseCategory}>{category}</Text>
        <Text
          style={[
            styles.expenseAmount,
            { color: isPositive ? "#4CAF50" : "#333" },
          ]}
        >
          {amount}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00D4AA" barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
          <Text style={styles.goodMorning}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceSection}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>💰 Total Balance</Text>
              <Text style={styles.balanceAmount}>$7,783.00</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.expenseLabel}>💸 Total Expense</Text>
              <Text style={styles.expenseAmount}>$1,187.40</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressAmount}>$20,000.00</Text>
          </View>
          <Text style={styles.progressText}>30% Of Your Expenses, Looks Good.</Text>
        </View>

        <View style={styles.savingsCard}>
          <View style={styles.savingsLeft}>
            <View style={styles.savingsIconContainer}>
              <Ionicons name="car" size={32} color="#00D4AA" />
            </View>
            <Text style={styles.savingsTitle}>Savings{"\n"}On Goals</Text>
          </View>
          <View style={styles.savingsRight}>
            <View style={styles.savingsItem}>
              <View style={styles.savingsRow}>
                <Ionicons name="trending-up" size={16} color="#4CAF50" />
                <Text style={styles.savingsItemTitle}>Revenue Last Week</Text>
              </View>
              <Text style={styles.savingsItemAmount}>$4,000.00</Text>
            </View>
            <View style={styles.savingsItem}>
              <View style={styles.savingsRow}>
                <Ionicons name="restaurant" size={16} color="#FF9800" />
                <Text style={styles.savingsItemTitle}>Food Last Week</Text>
              </View>
              <Text style={[styles.savingsItemAmount, { color: "#FF9800" }]}>- $100.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.periodSelector}>
          {["Daily", "Weekly", "Monthly"].map((period) =>
            renderPeriodButton(period as "Daily" | "Weekly" | "Monthly")
          )}
        </View>

        <View style={styles.expenseList}>
          {renderExpenseItem("card", "Salary", "18:27 - April 30", "Monthly", "$4,000.00", true)}
          {renderExpenseItem("basket", "Groceries", "17:00 - April 24", "Pantry", "-$100.00")}
          {renderExpenseItem("home", "Rent", "8:30 - April 15", "Rent", "-$674.40")}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Salin semua style dari HomeScreen di sini
  container: {
    flex: 1,
    backgroundColor: "#00D4AA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  goodMorning: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
  },
  notificationButton: {
    padding: 8,
  },
  balanceSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  expenseLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  expenseAmount: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  progressAmount: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  progressText: {
    color: "white",
    fontSize: 12,
    opacity: 0.9,
  },
  savingsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  savingsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20,
  },
  savingsRight: {
    flex: 1,
  },
  savingsItem: {
    marginBottom: 8,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  savingsItemTitle: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  savingsItemAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  periodSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedPeriodButton: {
    backgroundColor: "#00D4AA",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedPeriodButtonText: {
    color: "white",
  },
  expenseList: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: "#666",
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
});
