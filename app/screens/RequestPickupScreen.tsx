import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function RequestPickupScreen() {
  const navigation = useNavigation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Request Pickup</Text>

      <TextInput style={styles.input} placeholder="Pickup Location" value={pickup} onChangeText={setPickup} />
      <TextInput style={styles.input} placeholder="Dropoff Location" value={dropoff} onChangeText={setDropoff} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

      <Button title="Upload Image" onPress={pickImage} />
      {imageUri && <Text style={{ marginTop: 10 }}>Image selected ✅</Text>}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit Pickup</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Map')}>
        <Text style={styles.link}>View Map</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007bff', marginTop: 15, textAlign: 'center' }
});
