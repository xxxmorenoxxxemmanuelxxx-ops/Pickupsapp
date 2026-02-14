import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';

export default function PickupRequestScreen() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageImage, setPackageImage] = useState<string | null>(null);
  const [packageSize, setPackageSize] = useState('Medium');
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [drivers, setDrivers] = useState([
    { id: 'driver1', latitude: 37.78925, longitude: -122.4334 },
    { id: 'driver2', latitude: 37.78725, longitude: -122.4314 },
  ]);
  const [packageLocation, setPackageLocation] = useState({ latitude: 37.78825, longitude: -122.4324 });

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPackageImage(result.assets[0].uri);
    }
  };

  // Placeholder submit function
  const submitRequest = () => {
    alert('Pickup request submitted!');
    // Here you would integrate with Firestore / your backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Pickup Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pickup address"
        value={pickupLocation}
        onChangeText={setPickupLocation}
      />

      <Text style={styles.label}>Drop-off Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter drop-off address"
        value={dropoffLocation}
        onChangeText={setDropoffLocation}
      />

      <Text style={styles.label}>Package Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the item"
        value={packageDescription}
        onChangeText={setPackageDescription}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{packageImage ? 'Change Image' : 'Upload Image'}</Text>
      </TouchableOpacity>
      {packageImage && <Image source={{ uri: packageImage }} style={styles.image} />}

      <Text style={styles.label}>Package Size</Text>
      <TextInput
        style={styles.input}
        placeholder="Small / Medium / Large"
        value={packageSize}
        onChangeText={setPackageSize}
      />

      <Text style={styles.label}>Pickup Time</Text>
      <TextInput
        style={styles.input}
        placeholder="ASAP or scheduled time"
        value={pickupTime}
        onChangeText={setPickupTime}
      />

      <Text style={styles.label}>Special Instructions</Text>
      <TextInput
        style={styles.input}
        placeholder="Any additional info"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
      />

      <Text style={styles.label}>Contact Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional phone/email"
        value={contactInfo}
        onChangeText={setContactInfo}
      />

      <Text style={styles.label}>Map View</Text>
      <MapView style={styles.map} region={region}>
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
            title={`Driver ${driver.id}`}
            pinColor="blue"
          />
        ))}
        <Marker coordinate={packageLocation} title="Your Package" pinColor="green" />
      </MapView>

      <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={submitRequest}>
        <Text style={styles.buttonText}>Submit Pickup Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 6, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 6 },
  map: { width: '100%', height: 300, marginTop: 10, borderRadius: 6 },
});
