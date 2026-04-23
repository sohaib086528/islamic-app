import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ActivityIndicator,
  TouchableOpacity, Switch, ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { prayerApi } from '../../services/api';
import { useSettingsStore } from '../../store/settingsStore';
import {
  requestNotificationPermission,
  scheduleAllPrayerNotifications,
  cancelAllNotifications,
} from '../../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerScreen() {
  const { prayerMethod } = useSettingsStore();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocationError(true); return; }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('notificationsEnabled').then((value) => {
      setNotificationsEnabled(value === 'true');
    });
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['prayerTimes', coords?.lat, coords?.lng, prayerMethod],
    queryFn: () => prayerApi.getTimings({ lat: coords!.lat, lng: coords!.lng, method: prayerMethod }),
    enabled: !!coords,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (!data?.timings) return;
    const interval = setInterval(() => {
      const now = new Date();
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      for (const p of prayers) {
        const [h, m] = data.timings[p].split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(h, m, 0, 0);
        if (prayerTime > now) {
          const diff = Math.floor((prayerTime.getTime() - now.getTime()) / 1000);
          const hh = Math.floor(diff / 3600);
          const mm = Math.floor((diff % 3600) / 60);
          const ss = diff % 60;
          setCountdown(`${p} in ${hh}h ${mm}m ${ss}s`);
          return;
        }
      }
      setCountdown('');
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  async function toggleNotifications(val: boolean) {
    if (val) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      if (data?.timings) {
        await scheduleAllPrayerNotifications(data.timings);
      }
    } else {
      await cancelAllNotifications();
    }
    await AsyncStorage.setItem('notificationsEnabled', String(val));
    setNotificationsEnabled(val);
  }

  if (locationError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Location permission denied.</Text>
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
        <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const timings = data?.timings;
  const meta = data?.meta;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Prayer Times</Text>
        <Text style={styles.location}>{meta?.timezone}</Text>
        {!!countdown && (
          <View style={styles.countdownBox}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        <View style={styles.list}>
          {PRAYERS.map((name) => (
            <View key={name} style={styles.row}>
              <Text style={styles.prayerName}>{name}</Text>
              <Text style={styles.prayerTime}>{timings?.[name]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notifRow}>
          <View>
            <Text style={styles.notifLabel}>Prayer Notifications</Text>
            <Text style={styles.notifSub}>Receive adhan reminders daily</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#30363D', true: '#1B4332' }}
            thumbColor={notificationsEnabled ? '#D4AF37' : '#8B949E'}
          />
        </View>

        <Text style={styles.methodText}>
          Method: {meta?.method?.name}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1117', padding: 30 },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', marginBottom: 4, marginTop: 10 },
  location: { fontSize: 13, color: '#8B949E', marginBottom: 12 },
  countdownBox: {
    backgroundColor: '#1B4332', borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#2D6A4F',
  },
  countdownText: { color: '#D4AF37', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  list: {
    backgroundColor: '#161B22', borderRadius: 14, borderWidth: 1, borderColor: '#30363D',
    overflow: 'hidden', marginBottom: 20,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#1E242C',
  },
  prayerName: { fontSize: 16, color: '#F0F0F0', fontWeight: '500' },
  prayerTime: { fontSize: 16, color: '#D4AF37', fontWeight: '700' },
  notifRow: {
    backgroundColor: '#161B22', borderRadius: 14, borderWidth: 1, borderColor: '#30363D',
    padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14,
  },
  notifLabel: { color: '#F0F0F0', fontSize: 15, marginBottom: 4 },
  notifSub: { color: '#8B949E', fontSize: 12 },
  methodText: { color: '#8B949E', fontSize: 12, textAlign: 'center' },
  loadingText: { color: '#8B949E', marginTop: 12, fontSize: 14 },
  errorText: { color: '#FF6B6B', textAlign: 'center', lineHeight: 22 },
  retryBtn: { marginTop: 16, backgroundColor: '#1B4332', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#D4AF37', fontWeight: '600' },
});
