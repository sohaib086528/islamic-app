import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function getQiblaAngle(lat: number, lng: number): number {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (KAABA_LAT * Math.PI) / 180;
  const Δλ = ((KAABA_LNG - lng) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

export default function QiblaScreen() {
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const subRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission required for Qibla direction.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const angle = getQiblaAngle(loc.coords.latitude, loc.coords.longitude);
      setQiblaAngle(angle);

      Magnetometer.setUpdateInterval(100);
      subRef.current = Magnetometer.addListener(({ x, y }) => {
        let h = Math.atan2(y, x) * (180 / Math.PI);
        if (h < 0) h += 360;
        setHeading(h);
      });
      setLoading(false);
    })();
    return () => {
      subRef.current?.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#D4AF37" size="large" />
        <Text style={styles.loadingText}>Finding Qibla...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const needleAngle = qiblaAngle !== null ? qiblaAngle - heading : 0;
  const diff = qiblaAngle !== null ? Math.abs(((qiblaAngle - heading + 540) % 360) - 180) : 999;
  const aligned = diff < 5;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Qibla Direction</Text>
      <Text style={styles.subtitle}>
        {qiblaAngle !== null ? `${qiblaAngle.toFixed(1)}° from North` : ''}
      </Text>

      <View style={styles.compassOuter}>
        <View style={styles.compassInner}>
          <Text style={styles.northLabel}>N</Text>
          <Text style={styles.southLabel}>S</Text>
          <Text style={styles.eastLabel}>E</Text>
          <Text style={styles.westLabel}>W</Text>

          <View
            style={[
              styles.needle,
              {
                transform: [{ rotate: `${needleAngle}deg` }],
              },
            ]}
          >
            <View style={[styles.needleTop, aligned && styles.needleAligned]} />
            <View style={styles.needleBottom} />
          </View>

          <View style={styles.kaabaMarker}>
            <Text style={styles.kaabaEmoji}>🕋</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.statusText, aligned && styles.statusAligned]}>
        {aligned ? '✓ Facing the Qibla' : 'Rotate to face Qibla'}
      </Text>
      <Text style={styles.headingText}>
        Device heading: {heading.toFixed(1)}°
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1117' },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', marginTop: 20, marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8B949E', marginBottom: 40 },
  loadingText: { color: '#8B949E', marginTop: 12 },
  errorText: { color: '#FF6B6B', textAlign: 'center', paddingHorizontal: 30, lineHeight: 22 },
  compassOuter: {
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#161B22', borderWidth: 2, borderColor: '#30363D',
    justifyContent: 'center', alignItems: 'center',
  },
  compassInner: {
    width: 240, height: 240, borderRadius: 120,
    borderWidth: 1, borderColor: '#30363D',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  northLabel: { position: 'absolute', top: 8, color: '#FF6B6B', fontWeight: '700', fontSize: 16 },
  southLabel: { position: 'absolute', bottom: 8, color: '#8B949E', fontWeight: '700', fontSize: 14 },
  eastLabel: { position: 'absolute', right: 10, color: '#8B949E', fontWeight: '700', fontSize: 14 },
  westLabel: { position: 'absolute', left: 10, color: '#8B949E', fontWeight: '700', fontSize: 14 },
  needle: {
    position: 'absolute', width: 4, height: 180,
    alignItems: 'center', justifyContent: 'center',
  },
  needleTop: { flex: 1, width: 4, backgroundColor: '#D4AF37', borderRadius: 2 },
  needleAligned: { backgroundColor: '#56D364' },
  needleBottom: { flex: 1, width: 4, backgroundColor: '#30363D', borderRadius: 2 },
  kaabaMarker: { position: 'absolute' },
  kaabaEmoji: { fontSize: 28 },
  statusText: { marginTop: 32, fontSize: 16, color: '#8B949E', fontWeight: '600' },
  statusAligned: { color: '#56D364' },
  headingText: { marginTop: 8, fontSize: 12, color: '#8B949E' },
});
