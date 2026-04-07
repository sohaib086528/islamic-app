import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { prayerApi } from '../../services/api';

const QUICK_ACTIONS = [
  { label: 'Quran', icon: '📖', screen: 'Quran' },
  { label: 'Prayer Times', icon: '🕌', screen: 'Prayer' },
  { label: 'Qibla', icon: '🧭', screen: 'Qibla' },
  { label: 'Calendar', icon: '📅', screen: 'Calendar' },
];

export default function HomeScreen({ navigation }: any) {
  const { data: hijri } = useQuery({
    queryKey: ['hijri'],
    queryFn: () => prayerApi.getHijriDate(),
    staleTime: 1000 * 60 * 60,
  });

  const gregorian = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.greeting}>Assalamu Alaikum</Text>
          <Text style={styles.gregorian}>{gregorian}</Text>
          {hijri && (
            <Text style={styles.hijri}>
              {hijri.hijri?.day} {hijri.hijri?.month?.en} {hijri.hijri?.year} AH
            </Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>

        <View style={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.card}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Text style={styles.cardIcon}>{action.icon}</Text>
              <Text style={styles.cardLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>TODAY</Text>

        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>Verse of the Day</Text>
          <Text style={styles.todayArabic}>إِنَّ مَعَ الْعُسْرِ يُسْرًا</Text>
          <Text style={styles.todayTranslation}>
            Indeed, with hardship comes ease. (94:6)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  bismillah: {
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 12,
    lineHeight: 32,
  },
  greeting: {
    fontSize: 22,
    color: '#F0F0F0',
    fontWeight: '700',
    marginBottom: 6,
  },
  gregorian: {
    fontSize: 13,
    color: '#8B949E',
    marginBottom: 4,
  },
  hijri: {
    fontSize: 15,
    color: '#D4AF37',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#8B949E',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  card: {
    width: '47%',
    backgroundColor: '#161B22',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: '#F0F0F0',
    fontWeight: '600',
    textAlign: 'center',
  },
  todayCard: {
    backgroundColor: '#161B22',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  todayLabel: {
    fontSize: 11,
    color: '#8B949E',
    letterSpacing: 1,
    marginBottom: 12,
  },
  todayArabic: {
    fontSize: 22,
    color: '#D4AF37',
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 10,
  },
  todayTranslation: {
    fontSize: 14,
    color: '#8B949E',
    lineHeight: 22,
  },
});
