import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function PackageMapScreen({ route }: any) {
  const { packageId } = route.params; // Passed from booking screen
  const [packageLocation, setPackageLocation] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'packages', packageId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPackageLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } else {
        console.warn('No package found for ID:', packageId);
      }
    });

    return () => unsubscribe();
  }, [packageId]);

  if (!packageLocation) return (
    <View style={styles.container}>
      <Text>Loading package location...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: packageLocation.latitude,
          longitude: packageLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: packageLocation.latitude, longitude: packageLocation.longitude }}
          title="Your Package"
          pinColor="green"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
