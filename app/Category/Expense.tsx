import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function ExpenseScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('');

  const formattedDate = date.toDateString();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expenses</Text>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{formattedDate}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="SELECT THE CATEGORY" value=""/>
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Medicine" value="Medicine" />
          <Picker.Item label="Rent" value="Rent" />
          <Picker.Item label="Savings" value="Savings" />
          <Picker.Item label="Transport" value="Transport" />
        </Picker>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} placeholder="$0.00" keyboardType="numeric" />

      <Text style={styles.label}>Expense Title</Text>
      <TextInput style={styles.input} placeholder="Dinner" />

      <Text style={styles.label}>Message</Text>
      <TextInput style={styles.messageInput} placeholder="Enter Message" multiline />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E6F8F3' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  messageInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#00C9A7',
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
