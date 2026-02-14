import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, onSnapshot, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function HomeScreen() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  // Pick an image for the package
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // Subscribe to drivers collection in Firestore
  useEffect(() => {
    const unsubscribeDrivers = onSnapshot(collection(db, 'drivers'), snapshot => {
      const driverData: any[] = [];
      snapshot.forEach(doc => driverData.push({ id: doc.id, ...doc.data() }));
      setDrivers(driverData);
    });

    const unsubscribePackages = onSnapshot(collection(db, 'packages'), snapshot => {
      const packageData: any[] = [];
      snapshot.forEach(doc => packageData.push({ id: doc.id, ...doc.data() }));
      setPackages(packageData);
    });

    return () => {
      unsubscribeDrivers();
      unsubscribePackages();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schedule a Pickup</Text>

      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickupLocation}
        onChangeText={setPickupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Dropoff Location"
        value={dropoffLocation}
        onChangeText={setDropoffLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Package Description"
        value={packageDescription}
        onChangeText={setPackageDescription}
      />

      <Button title="Upload Package Photo" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.mapLabel}>Drivers & Packages</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {drivers.map(driver => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
            title={`Driver ${driver.id}`}
            pinColor="blue"
          />
        ))}

        {packages.map(pkg => (
          <Marker
            key={pkg.id}
            coordinate={{ latitude: pkg.latitude, longitude: pkg.longitude }}
            title={`Package ${pkg.id}`}
            pinColor="green"
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Schedule Pickup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  image: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
  mapLabel: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  map: { width: '100%', height: 300, marginBottom: 20 },
});
