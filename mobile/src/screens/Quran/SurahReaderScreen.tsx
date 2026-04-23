import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Switch, Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '../../services/api';
import { useSettingsStore } from '../../store/settingsStore';
import { useBookmarksStore } from '../../store/bookmarksStore';

export default function SurahReaderScreen({ route, navigation }: any) {
  const { surahId, surahName } = route.params;
  const { translationEdition } = useSettingsStore();
  const { addBookmark, isBookmarked, removeBookmark } = useBookmarksStore();
  const [showTranslation, setShowTranslation] = useState(true);
  const [arabicSize, setArabicSize] = useState(24);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['surah', surahId, translationEdition],
    queryFn: () => quranApi.getSurahWithTranslation(surahId, translationEdition),
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#D4AF37" size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load surah.</Text>
      </View>
    );
  }

  const ayahs = data.arabic?.ayahs || [];
  const translations = data.translation?.ayahs || [];

  function toggleBookmark(item: any) {
    const ayahNumber = item.numberInSurah;
    if (isBookmarked(surahId, ayahNumber)) {
      removeBookmark(surahId, ayahNumber);
      Alert.alert('Bookmark removed', `${surahName} ayah ${ayahNumber} was removed.`);
      return;
    }

    addBookmark({
      surahId,
      surahName,
      ayahNumber,
      ayahText: item.text,
      savedAt: Date.now(),
    });
    Alert.alert('Bookmarked', `${surahName} ayah ${ayahNumber} was saved.`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{surahName}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Translation</Text>
          <Switch
            value={showTranslation}
            onValueChange={setShowTranslation}
            trackColor={{ false: '#30363D', true: '#1B4332' }}
            thumbColor={showTranslation ? '#D4AF37' : '#8B949E'}
          />
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={() => setArabicSize(s => Math.max(16, s - 2))}>
            <Text style={styles.sizeBtn}>A-</Text>
          </TouchableOpacity>
          <Text style={styles.controlLabel}>Arabic Size</Text>
          <TouchableOpacity onPress={() => setArabicSize(s => Math.min(40, s + 2))}>
            <Text style={styles.sizeBtn}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bismillahContainer}>
        {surahId !== 1 && surahId !== 9 && (
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        )}
      </View>

      <FlatList
        data={ayahs}
        keyExtractor={(item: any) => item.numberInSurah.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            style={styles.ayahCard}
            activeOpacity={0.95}
            onLongPress={() => toggleBookmark(item)}
          >
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>{item.numberInSurah}</Text>
            </View>
            <Text style={[styles.arabicText, { fontSize: arabicSize, lineHeight: arabicSize * 1.9 }]}>
              {item.text}
            </Text>
            {showTranslation && translations[index] && (
              <Text style={styles.translationText}>
                {translations[index].text}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1117' },
  errorText: { color: '#FF6B6B', fontSize: 14 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#30363D',
  },
  backBtn: { padding: 4 },
  backText: { color: '#D4AF37', fontSize: 15, fontWeight: '600' },
  headerTitle: { color: '#F0F0F0', fontSize: 17, fontWeight: '700' },
  headerRight: { width: 60 },
  controls: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#30363D',
  },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlLabel: { color: '#8B949E', fontSize: 13 },
  sizeBtn: { color: '#D4AF37', fontSize: 16, fontWeight: '700', paddingHorizontal: 8 },
  bismillahContainer: { alignItems: 'center', paddingVertical: 16 },
  bismillah: { fontSize: 20, color: '#D4AF37', lineHeight: 36 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  ayahCard: {
    paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#1E242C',
  },
  ayahNumber: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#1B4332',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 10,
    borderWidth: 1, borderColor: '#2D6A4F',
  },
  ayahNumberText: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  arabicText: { color: '#F0F0F0', textAlign: 'right', lineHeight: 48, fontWeight: '400' },
  translationText: { color: '#8B949E', fontSize: 14, lineHeight: 22, marginTop: 10 },
});
