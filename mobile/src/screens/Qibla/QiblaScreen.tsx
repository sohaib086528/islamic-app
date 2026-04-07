import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function QiblaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>🧭</Text>
      <Text style={styles.title}>Qibla Direction</Text>
      <Text style={styles.subtitle}>Coming in Week 2</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, color: '#F0F0F0', fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8B949E' },
});
