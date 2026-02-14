import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

export default function ChatScreen({ route }: any) {
  const { packageId, customerId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(firestore, 'chats', packageId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(firestore, 'chats', packageId, 'messages'), {
      text: message,
      senderId: customerId,
      createdAt: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 5 }}>
            {item.senderId === customerId ? 'You: ' : 'Driver: '}
            {item.text}
          </Text>
        )}
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type message..."
        style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
      />

      <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: 'blue', padding: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
