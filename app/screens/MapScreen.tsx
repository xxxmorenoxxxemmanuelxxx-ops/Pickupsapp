import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function MapScreen({ route }: any) {
  const navigation = useNavigation();
  const { driverId, pickup, dropoff, packageId } = route.params;
  const [driverLocation, setDriverLocation] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'drivers', driverId), (docSnap) => {
      if (docSnap.exists()) {
        setDriverLocation(docSnap.data());
      }
    });

    return () => unsub();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {driverLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
          <Marker coordinate={dropoff} title="Dropoff" pinColor="red" />
          <Marker coordinate={driverLocation} title="Driver" pinColor="blue" />

          <Polyline
            coordinates={[pickup, driverLocation, dropoff]}
            strokeColor="blue"
            strokeWidth={4}
          />
        </MapView>
      )}

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            packageId,
            driverId,
            customerId: 'customer123',
          })
        }
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Open Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#1E90FF',
    padding: 15,
  },
});
