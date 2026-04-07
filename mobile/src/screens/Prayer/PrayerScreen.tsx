import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { prayerApi } from '../../services/api';

const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerScreen() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['prayerTimes', coords?.lat, coords?.lng],
    queryFn: () =>
      prayerApi.getTimings({ lat: coords!.lat, lng: coords!.lng }),
    enabled: !!coords,
    staleTime: 1000 * 60 * 30,
  });

  if (locationError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Location permission denied. Enable it in your phone settings to get accurate prayer times.
        </Text>
      </View>
    );
  }

  if (!coords || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#D4AF37" size="large" />
        <Text style={styles.loadingText}>
          {!coords ? 'Getting your location...' : 'Loading prayer times...'}
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not fetch prayer times.</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const timings = data?.timings;
  const meta = data?.meta;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Prayer Times</Text>
      <Text style={styles.location}>{meta?.timezone}</Text>
      <Text style={styles.method}>Method: {meta?.method?.name}</Text>

      <View style={styles.list}>
        {PRAYERS.map((name) => (
          <View key={name} style={styles.row}>
            <Text style={styles.prayerName}>{name}</Text>
            <Text style={styles.prayerTime}>{timings?.[name]}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1117',
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F0F0F0',
    marginTop: 10,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#8B949E',
    marginBottom: 2,
  },
  method: {
    fontSize: 12,
    color: '#8B949E',
    marginBottom: 24,
  },
  list: {
    backgroundColor: '#161B22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  prayerName: {
    fontSize: 16,
    color: '#F0F0F0',
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '700',
  },
  loadingText: {
    color: '#8B949E',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#1B4332',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#D4AF37',
    fontWeight: '600',
  },
});
