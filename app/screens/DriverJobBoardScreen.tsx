import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function DriverJobBoardScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigation = useNavigation();
  const driverId = 'driver123';

  useEffect(() => {
    const q = query(
      collection(firestore, 'packages'),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const acceptJob = async (jobId: string) => {
    await updateDoc(doc(firestore, 'packages', jobId), {
      status: 'assigned',
      assignedDriverId: driverId,
    });

    navigation.navigate('DriverActiveJobScreen', {
      packageId: jobId,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text>Description: {item.description}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => acceptJob(item.id)}
            >
              <Text style={{ color: 'white' }}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  jobCard: {
    backgroundColor: '#eee',
    padding: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
  },
});
