import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !category) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching category data:', error.message);
        return;
      }

      setTransactions(data);
    };

    fetchData();
  }, [category]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('❌ Delete error:', error.message);
      return;
    }
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const totalAmount = transactions.reduce((acc, item) => {
    return acc + (item.type === 'expense' ? -item.amount : item.amount);
  }, 0);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Invalid category selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/category')} style={{ marginBottom: 16 }}>
        <Text style={{ color: '#00C9A7' }}>{'← Back to Categories'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{category} Expenses</Text>
      <Text style={styles.total}>
        Total: {totalAmount >= 0 ? '+' : '-'}${Math.abs(totalAmount).toFixed(2)}
      </Text>
      {transactions.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#777', marginTop: 40 }}>
          No transactions in this category yet.
        </Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
              <Text
                style={[
                  styles.amount,
                  { color: item.type === 'income' ? '#4CAF50' : '#F44336' },
                ]}
              >
                {item.type === 'income' ? '+' : '-'}${item.amount}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: 'red', fontSize: 12, marginTop: 6 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E6F8F3' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  item: { marginBottom: 16, padding: 12, backgroundColor: '#fff', borderRadius: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 12, color: '#777' },
  amount: { marginTop: 4, fontWeight: 'bold' },
});
