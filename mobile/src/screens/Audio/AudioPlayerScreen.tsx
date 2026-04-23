import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AudioPlayerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>🎧</Text>
      <Text style={styles.title}>Audio Player</Text>
      <Text style={styles.subtitle}>Audio playback is coming soon.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, color: '#F0F0F0', fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8B949E', textAlign: 'center' },
});
