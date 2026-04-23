import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { prayerApi } from '../../services/api';
import { useSettingsStore } from '../../store/settingsStore';

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qi'dah", 'Dhul Hijjah',
];

const ISLAMIC_EVENTS: Record<string, string> = {
  '1-1': 'Islamic New Year',
  '10-1': "Day of Ashura",
  '12-3': "Mawlid al-Nabi",
  '27-7': "Isra and Mi\'raj",
  '15-8': "Laylat al-Bara\'at",
  '1-9': 'First day of Ramadan',
  '27-9': 'Laylat al-Qadr',
  '1-10': 'Eid al-Fitr',
  '10-12': 'Eid al-Adha',
};

export default function CalendarScreen() {
  const { hijriOffset, setHijriOffset } = useSettingsStore();

  const { data, isLoading } = useQuery({
    queryKey: ['hijri'],
    queryFn: () => prayerApi.getHijriDate(),
    staleTime: 1000 * 60 * 60,
  });

  const gregorianToday = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const hijri = data?.hijri;
  const adjustedDay = hijri
    ? (parseInt(hijri.day) + hijriOffset + 30) % 30 || 30
    : null;
  const eventKey = hijri ? `${adjustedDay}-${hijri.month?.number}` : null;
  const todayEvent = eventKey ? ISLAMIC_EVENTS[eventKey] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Islamic Calendar</Text>

      {isLoading ? (
        <ActivityIndicator color="#D4AF37" style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.dateCard}>
            <Text style={styles.gregorianDate}>{gregorianToday}</Text>
            {hijri && (
              <>
                <Text style={styles.hijriDate}>
                  {adjustedDay} {hijri.month?.en} {hijri.year} AH
                </Text>
                <Text style={styles.hijriArabic}>
                  {adjustedDay} {hijri.month?.ar} {hijri.year}
                </Text>
              </>
            )}
            {todayEvent && (
              <View style={styles.eventBadge}>
                <Text style={styles.eventText}>{todayEvent}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionLabel}>ADJUST HIJRI DATE</Text>
          <Text style={styles.offsetNote}>
            Some regions differ by 1-2 days. Adjust here.
          </Text>
          <View style={styles.offsetRow}>
            <TouchableOpacity
              style={styles.offsetBtn}
              onPress={() => setHijriOffset(Math.max(-4, hijriOffset - 1))}
            >
              <Text style={styles.offsetBtnText}>-1</Text>
            </TouchableOpacity>
            <Text style={styles.offsetValue}>
              {hijriOffset === 0
                ? 'Default'
                : hijriOffset > 0
                ? `+${hijriOffset} day${hijriOffset > 1 ? 's' : ''}`
                : `${hijriOffset} day${hijriOffset < -1 ? 's' : ''}`}
            </Text>
            <TouchableOpacity
              style={styles.offsetBtn}
              onPress={() => setHijriOffset(Math.min(4, hijriOffset + 1))}
            >
              <Text style={styles.offsetBtnText}>+1</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>HIJRI MONTHS</Text>
          <View style={styles.monthGrid}>
            {HIJRI_MONTHS.map((month, i) => (
              <View
                key={month}
                style={[
                  styles.monthCard,
                  hijri && parseInt(hijri.month?.number) === i + 1 && styles.monthCardActive,
                ]}
              >
                <Text style={styles.monthNum}>{i + 1}</Text>
                <Text style={styles.monthName}>{month}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', marginBottom: 20, marginTop: 10 },
  dateCard: {
    backgroundColor: '#161B22', borderRadius: 16, padding: 24, alignItems: 'center',
    marginBottom: 28, borderWidth: 1, borderColor: '#30363D',
  },
  gregorianDate: { fontSize: 14, color: '#8B949E', marginBottom: 12 },
  hijriDate: { fontSize: 24, fontWeight: '700', color: '#D4AF37', marginBottom: 4 },
  hijriArabic: { fontSize: 20, color: '#F0F0F0', marginBottom: 12 },
  eventBadge: {
    backgroundColor: '#1B4332', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2D6A4F',
  },
  eventText: { color: '#D4AF37', fontSize: 13, fontWeight: '600' },
  sectionLabel: { fontSize: 11, color: '#8B949E', letterSpacing: 1.5, marginBottom: 8 },
  offsetNote: { fontSize: 13, color: '#8B949E', marginBottom: 16 },
  offsetRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 24, marginBottom: 28,
  },
  offsetBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#161B22',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D',
  },
  offsetBtnText: { color: '#D4AF37', fontSize: 18, fontWeight: '700' },
  offsetValue: { color: '#F0F0F0', fontSize: 16, fontWeight: '600', minWidth: 80, textAlign: 'center' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthCard: {
    width: '30%', backgroundColor: '#161B22', borderRadius: 10, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: '#30363D',
  },
  monthCardActive: { borderColor: '#D4AF37', backgroundColor: '#1A2A1A' },
  monthNum: { color: '#8B949E', fontSize: 11, marginBottom: 4 },
  monthName: { color: '#F0F0F0', fontSize: 11, textAlign: 'center', fontWeight: '500' },
});
