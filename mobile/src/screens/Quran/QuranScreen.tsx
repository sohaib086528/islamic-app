import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '../../services/api';

export default function QuranScreen({ navigation }: any) {
  const { data: surahs, isLoading, isError } = useQuery({
    queryKey: ['surahs'],
    queryFn: quranApi.getSurahs,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#D4AF37" size="large" />
        <Text style={styles.loadingText}>Loading Surahs...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load Quran. Check your connection.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>القرآن الكريم</Text>
      <FlatList
        data={surahs}
        keyExtractor={(item: any) => item.number.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('SurahReader', {
                surahId: item.number,
                surahName: item.englishName,
              })
            }
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.number}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.englishName}>{item.englishName}</Text>
              <Text style={styles.meta}>
                {item.englishNameTranslation} · {item.numberOfAyahs} ayahs · {item.revelationType}
              </Text>
            </View>
            <Text style={styles.arabicName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1117' },
  title: { fontSize: 24, color: '#D4AF37', textAlign: 'center', paddingVertical: 16, fontWeight: '700' },
  loadingText: { color: '#8B949E', marginTop: 12 },
  errorText: { color: '#FF6B6B', textAlign: 'center', paddingHorizontal: 30 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  badge: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#1B4332',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
    borderWidth: 1, borderColor: '#2D6A4F',
  },
  badgeText: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  info: { flex: 1 },
  englishName: { color: '#F0F0F0', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  meta: { color: '#8B949E', fontSize: 12 },
  arabicName: { color: '#D4AF37', fontSize: 20, marginLeft: 10 },
  separator: { height: 1, backgroundColor: '#30363D', marginHorizontal: 20 },
});
