import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

export default function DriverActiveJobScreen({ route }: any) {
  const { packageId } = route.params;
  const driverId = 'driver123';
  const [status, setStatus] = useState('assigned');

  useEffect(() => {
    startTracking();
  }, []);

  const startTracking = async () => {
    await Location.requestForegroundPermissionsAsync();

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      async (location) => {
        await updateDoc(doc(firestore, 'drivers', driverId), {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          lastUpdated: new Date(),
        });
      }
    );
  };

  const updateStatus = async (newStatus: string) => {
    setStatus(newStatus);

    await updateDoc(doc(firestore, 'packages', packageId), {
      status: newStatus,
    });

    if (newStatus === 'completed') {
      alert('Delivery Completed');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Current Status: {status}</Text>

      <TouchableOpacity
        onPress={() => updateStatus('arrived')}
        style={{ backgroundColor: 'orange', padding: 15, marginTop: 20 }}
      >
        <Text>Arrived at Pickup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => updateStatus('in-progress')}
        style={{ backgroundColor: 'blue', padding: 15, marginTop: 20 }}
      >
        <Text>Package Picked Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => updateStatus('completed')}
        style={{ backgroundColor: 'green', padding: 15, marginTop: 20 }}
      >
        <Text>Delivered</Text>
      </TouchableOpacity>
    </View>
  );
}
