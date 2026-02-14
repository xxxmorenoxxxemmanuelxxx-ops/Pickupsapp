import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DriverPackageMapScreen({ route }: any) {
  const { packageId, driverId } = route.params; // IDs passed from booking
  const [packageLocation, setPackageLocation] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);

  // Subscribe to package location
  useEffect(() => {
    const unsubscribePackage = onSnapshot(doc(db, 'packages', packageId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPackageLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    return () => unsubscribePackage();
  }, [packageId]);

  // Subscribe to driver location
  useEffect(() => {
    const unsubscribeDriver = onSnapshot(doc(db, 'drivers', driverId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDriverLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    return () => unsubscribeDriver();
  }, [driverId]);

  if (!packageLocation || !driverLocation) return (
    <View style={styles.container}>
      <Text>Loading map...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (driverLocation.latitude + packageLocation.latitude) / 2,
          longitude: (driverLocation.longitude + packageLocation.longitude) / 2,
          latitudeDelta: Math.abs(driverLocation.latitude - packageLocation.latitude) * 2 || 0.02,
          longitudeDelta: Math.abs(driverLocation.longitude - packageLocation.longitude) * 2 || 0.02,
        }}
      >
        {/* Driver Marker */}
        <Marker
          coordinate={driverLocation}
          title="Driver"
          pinColor="blue"
        />

        {/* Package Marker */}
        <Marker
          coordinate={packageLocation}
          title="Package"
          pinColor="green"
        />

        {/* Optional: Draw a line between driver and package */}
        <Polyline
          coordinates={[driverLocation, packageLocation]}
          strokeColor="
