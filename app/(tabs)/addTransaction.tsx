// app/(tabs)/addTransaction.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const allCategories = ['Food', 'Transport', 'Groceries', 'Rent', 'Salary', 'Savings'];

export default function AddTransaction() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(allCategories[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type,
      title,
      category,
      amount: numericAmount,
      date: date.toISOString(),
    });

    if (error) {
      Alert.alert('Insert Failed', error.message);
    } else {
      Alert.alert('Success', 'Transaction added successfully');
      router.back(); // go back to home or previous screen
    }
  };

  // Filter categories based on type
  const filteredCategories = type === 'income' ? ['Savings'] : allCategories.filter(cat => cat !== 'Savings');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transaction Type</Text>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.activeType]}
          onPress={() => setType('income')}
        >
          <Text style={styles.typeText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.activeType]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.typeText}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Groceries" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {filteredCategories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="e.g. 100.00"
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#EFFFFA' },
  label: { marginTop: 12, fontWeight: '600', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },
  activeType: {
    backgroundColor: '#00D4AA',
  },
  typeText: {
    color: '#000',
    fontWeight: '500',
  },
  dateText: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 6,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#00D17E',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#00D4AA',
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 16,
    backgroundColor: '#F6FFFB',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
    color: '#222',
    backgroundColor: 'transparent',
  },
});
