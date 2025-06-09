import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import tipe dari types.ts
import { RootStackParamList } from 'types';

// Definisikan tipe navigation khusus untuk screen ini
type FoodScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category/Savings'>;

const expenses = [
  { title: 'Dinner', date: '18:27 - April 30', amount: -26.0 },
  { title: 'Delivery Pizza', date: '15:00 - April 24', amount: -18.35 },
  { title: 'Lunch', date: '12:30 - April 15', amount: -15.4 },
  { title: 'Brunch', date: '9:30 - April 08', amount: -12.13 },
];

export default function FoodScreen() {
  const navigation = useNavigation<FoodScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings</Text>
        <View style={styles.balanceContainer}>
          <View>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>$7,783.00</Text>
          </View>
          <View>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.expense}>- $1,187.40</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.limitText}>$20,000.00</Text>
        <Text style={styles.note}>✅ 30% Of Your Expenses, Looks Good.</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <FontAwesome5 name="piggy-bank" size={24} color="#00C9A7" />
            <View style={{ marginLeft: 10 }}>
              <Text>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Category/Expense')}
      >
        <Text style={styles.addText}>Add Expenses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F8F3' },
  header: {
    backgroundColor: '#00C9A7',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  balanceContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  label: { color: '#fff', fontSize: 12 },
  balance: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  expense: { color: '#D0F4EA', fontSize: 18, fontWeight: 'bold' },
  progressBar: {
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressFill: { width: '30%', height: '100%', backgroundColor: '#000' },
  limitText: { color: '#fff', fontSize: 12, textAlign: 'right' },
  note: { color: '#fff', fontSize: 12, marginTop: 5 },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  date: { fontSize: 12, color: '#666' },
  amount: { color: '#1677ff', fontWeight: 'bold' },
  addButton: {
    margin: 20,
    backgroundColor: '#00C9A7',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addText: { color: '#fff', fontWeight: 'bold' },
});
