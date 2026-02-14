import React, { useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DriverLocationUpdater({ driverId }: any) {

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startTracking = async () => {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required for real-time tracking.');
        return;
      }

      // Start tracking
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
        async (location) => {
          const { latitude, longitude } = location.coords;

          try {
            // Update driver location in Firestore
            await setDoc(doc(db, 'drivers', driverId), {
              latitude,
              longitude,
              lastUpdated: new Date(),
            }, { merge: true });
          } catch (error) {
            console.error('Failed to update driver location:', error);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [driverId]);

  return (
    <View style={styles.container}>
      <Text>Tracking driver location...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
