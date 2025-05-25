import { View, Text, Button } from 'react-native'
import { supabase } from '@/lib/supabase'

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
        user_id: user.id, // Ini penting untuk lolos policy
        type: 'expense',
        date: new Date().toISOString()
      }]);

    if (error) console.log('❌ Error:', error);
    else console.log('✅ Success:', data);
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Finance App</Text>
      <Button title="Test Insert" onPress={testInsert} />
    </View>
  )
}
