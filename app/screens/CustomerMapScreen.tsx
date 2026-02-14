import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure your firebaseConfig.ts exports 'db'

interface Driver {
  id: string;
  latitude: number;
  longitude: number;
}

interface Package {
  id: string;
  latitude: number;
  longitude: number;
  status?: string;
}

export default function CustomerMapScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to drivers collection
  useEffect(() => {
    const unsubscribeDrivers = onSnapshot(collection(db, 'drivers'), snapshot => {
      const driverData: Driver[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        driverData.push({
          id: doc.id,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });
      setDrivers(driverData);
    });

    return () => unsubscribeDrivers();
  }, []);

  // Subscribe to a single package document (replace 'packageId' with actual package id)
  useEffect(() => {
    const packageId = 'packageId'; // Replace with dynamic package id per user
    const unsubscribePackage = onSnapshot(doc(db, 'packages', packageId), snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPackageData({
          id: snapshot.id,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status,
        });
      }
      setLoading(false);
    });

    return () => unsubscribePackage();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: packageData?.latitude || drivers[0]?.latitude || 37.78825,
        longitude: packageData?.longitude || drivers[0]?.longitude || -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {drivers.map(driver => (
        <Marker
          key={driver.id}
          coordinate={{
            latitude: driver.latitude,
            longitude: driver.longitude,
          }}
          title={`Driver: ${driver.id}`}
          pinColor="blue"
        />
      ))}

      {packageData && (
        <Marker
          key={packageData.id}
          coordinate={{
            latitude: packageData.latitude,
            longitude: packageData.longitude,
          }}
          title={`Your Package`}
          pinColor="green"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
