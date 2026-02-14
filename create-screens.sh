#!/bin/bash

# Make sure the app folder exists
mkdir -p ~/pickupsapp/app

# index.tsx
echo "Creating app/index.tsx..."
cat <<EOL > ~/pickupsapp/app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href='/login' />;
}
EOL

# login.tsx
echo "Creating app/login.tsx..."
cat <<EOL > ~/pickupsapp/app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      router.push('/home');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickups Login</Text>
      <TextInput
        placeholder='Email'
        style={styles.input}
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder='Password'
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title='Login' onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});
EOL

# home.tsx
echo "Creating app/home.tsx..."
cat <<EOL > ~/pickupsapp/app/home.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pickups!</Text>
      <Button title='Logout' onPress={() => router.push('/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});
EOL

echo "All screens created successfully!"
