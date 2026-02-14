import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function NewPackageScreen() {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const imageRef = ref(storage, `packages/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const submitPackage = async () => {
    let imageUrl = null;

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const docRef = await addDoc(collection(firestore, 'packages'), {
      customerId: 'customer123',
      description,
      imageUrls: imageUrl ? [imageUrl] : [],
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    navigation.navigate('MapScreen', {
      packageId: docRef.id,
      driverId: 'driver123',
      pickup: { latitude: 37.78825, longitude: -122.4324 },
      dropoff: { latitude: 37.75825, longitude: -122.4624 },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Describe Your Package</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe the package..."
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={submitPackage}>
        <Text style={styles.buttonText}>Submit Package</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#1E90FF', padding: 12, marginBottom: 10 },
  submitButton: { backgroundColor: 'green', padding: 15 },
  buttonText: { color: 'white', textAlign: 'center' },
  image: { width: '100%', height: 200, marginBottom: 10 }
});
