import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TeamMembersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Team Members</Text>
      <Text style={styles.text}>Here you can see all the members of the team.</Text>
      {/* Later: Add list of team members */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 18, textAlign: 'center' },
});
