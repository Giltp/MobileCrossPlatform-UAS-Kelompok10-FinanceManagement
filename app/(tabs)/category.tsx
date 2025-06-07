import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo, Octicons} from '@expo/vector-icons';

const categories = [
  { name: 'Food', icon: <FontAwesome5 name="utensils" size={24} color="#fff" /> },
  { name: 'Transport', icon: <FontAwesome5 name="bus" size={24} color="#fff" /> },
  { name: 'Medicine', icon: <FontAwesome5 name="pills" size={24} color="#fff" /> },
  { name: 'Groceries', icon: <MaterialIcons name="local-grocery-store" size={24} color="#fff" /> },
  { name: 'Rent', icon: <FontAwesome5 name="key" size={24} color="#fff" /> },
  { name: 'Gifts', icon: <Octicons name="gift" size={24} color="white" /> },
  { name: 'Savings', icon: <FontAwesome5 name="piggy-bank" size={24} color="#fff" /> },
  { name: 'Entertainment', icon: <MaterialIcons name="movie" size={24} color="#fff" /> },
  { name: 'More', icon: <Entypo name="dots-three-horizontal" size={24} color="#fff" /> },
];

export default function CategoryScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Categories</Text>

        <View style={styles.balanceContainer}>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>$7,783.00</Text>
          </View>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.expense}>-$1,187.40</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>$20,000.00</Text>
        </View>

        <Text style={styles.note}>✅ 30% Of Your Expenses, Looks Good.</Text>
      </View>

      {/* Categories */}
      <View style={styles.grid}>
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryBox}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F8F3',
  },
  header: {
    backgroundColor: '#00C9A7',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceBox: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
  balance: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  expense: {
    color: '#D0F4EA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: '#000',
  },
  progressText: {
    textAlign: 'right',
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  note: {
    marginTop: 10,
    color: '#fff',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '30%',
    backgroundColor: '#53D3B3',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: '#00B894',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
