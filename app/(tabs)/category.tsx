import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Category() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error fetching categories:', error.message);
        Alert.alert('Error', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error fetching totals:', error.message);
        return;
      }

      const income = data.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
      const expense = data.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

      setTotalIncome(income);
      setTotalExpense(expense);
    };

    fetchTotals();
  }, []);

  const budget = 20000;
  const expensePercent = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;

  const renderIcon = (icon: string, family: string) => {
    switch (family) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon as any} size={24} color="#fff" />;
      case 'FontAwesome5':
      default:
        return <FontAwesome5 name={icon as any} size={24} color="#fff" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Categories</Text>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.expense}>-${totalExpense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${expensePercent}%` }]} />
          </View>
          <Text style={styles.progressAmount}>${budget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </View>
        <Text style={styles.progressText}>
          {expensePercent}% Of Your Expenses, {expensePercent < 50 ? 'Looks Good' : 'Be Careful'}.
        </Text>
      </View>

      <View style={styles.grid}>
        {categories.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999', width: '100%' }}>
            No categories yet.
          </Text>
        ) : (
          categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryBox}
              onPress={() => router.push({ pathname: '/Category/[category]', params: { category: item.name } })}
            >
              <View style={styles.iconContainer}>
                {renderIcon(item.icon, item.icon_family)}
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        )}
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
  progressAmount: {
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
