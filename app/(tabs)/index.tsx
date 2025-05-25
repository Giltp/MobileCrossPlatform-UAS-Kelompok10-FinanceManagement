import { View, Text, Button, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

export default function Home() {
  const testInsert = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('⚠️ Belum login');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        title: 'Test',
        amount: 10000,
        user_id: user.id,
        type: 'expense',
        date: new Date().toISOString()
      }]);

    if (error) console.log('❌ Error:', error);
    else console.log('✅ Success:', data);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      Alert.alert('Logout gagal', error.message)
    } else {
      Alert.alert('Berhasil logout', '', [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
        },
      ])
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Finance App</Text>
      <Button title="Test Insert" onPress={testInsert} />
      <View style={{ height: 20 }} />
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  )
}
