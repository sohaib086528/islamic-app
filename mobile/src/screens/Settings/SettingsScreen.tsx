import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, Modal, FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../../store/settingsStore';
import { quranApi } from '../../services/api';

const PRAYER_METHODS = [
  { id: 1, name: 'Muslim World League' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Egyptian General Authority of Survey' },
  { id: 4, name: 'Umm al-Qura, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 7, name: 'Institute of Geophysics, Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura' },
  { id: 12, name: 'UOIF — France' },
];

const LANGUAGES = [
  { code: 'en' as const, label: 'English' },
  { code: 'ur' as const, label: 'Urdu — اردو' },
  { code: 'bn' as const, label: 'Bengali — বাংলা' },
  { code: 'hi' as const, label: 'Hindi — हिंदी' },
];

const THEMES = [
  { code: 'dark' as const, label: 'Dark' },
  { code: 'light' as const, label: 'Light' },
  { code: 'system' as const, label: 'System Default' },
];

export default function SettingsScreen() {
  const {
    theme, setTheme,
    language, setLanguage,
    translationEdition, setTranslationEdition,
    reciterEdition, setReciterEdition,
    arabicScript, setArabicScript,
    tajweedMode, setTajweedMode,
    prayerMethod, setPrayerMethod,
    madhab, setMadhab,
    hijriOffset, setHijriOffset,
  } = useSettingsStore();

  const [modal, setModal] = useState<null | 'translation' | 'reciter' | 'method' | 'language' | 'theme'>(null);

  const { data: translations } = useQuery({
    queryKey: ['translations'],
    queryFn: quranApi.getTranslations,
    staleTime: Infinity,
  });

  const { data: reciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: quranApi.getReciters,
    staleTime: Infinity,
  });

  function SettingRow({
    label, value, onPress,
  }: { label: string; value: string; onPress: () => void }) {
    return (
      <TouchableOpacity style={styles.row} onPress={onPress}>
        <Text style={styles.rowLabel}>{label}</Text>
        <View style={styles.rowRight}>
          <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function SwitchRow({ label, value, onValueChange }: any) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#30363D', true: '#1B4332' }}
          thumbColor={value ? '#D4AF37' : '#8B949E'}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.section}>APPEARANCE</Text>
        <View style={styles.group}>
          <SettingRow
            label="Theme"
            value={THEMES.find(t => t.code === theme)?.label || theme}
            onPress={() => setModal('theme')}
          />
          <SettingRow
            label="App Language"
            value={LANGUAGES.find(l => l.code === language)?.label || language}
            onPress={() => setModal('language')}
          />
        </View>

        <Text style={styles.section}>QURAN</Text>
        <View style={styles.group}>
          <SettingRow
            label="Translation"
            value={translationEdition}
            onPress={() => setModal('translation')}
          />
          <SettingRow
            label="Reciter"
            value={reciterEdition}
            onPress={() => setModal('reciter')}
          />
          <SettingRow
            label="Arabic Script"
            value={arabicScript === 'uthmani' ? 'Uthmani (Standard)' : 'Indo-Pak'}
            onPress={() => setArabicScript(arabicScript === 'uthmani' ? 'indopak' : 'uthmani')}
          />
          <SwitchRow
            label="Tajweed Mode"
            value={tajweedMode}
            onValueChange={setTajweedMode}
          />
        </View>

        <Text style={styles.section}>PRAYER TIMES</Text>
        <View style={styles.group}>
          <SettingRow
            label="Calculation Method"
            value={PRAYER_METHODS.find(m => m.id === prayerMethod)?.name || `Method ${prayerMethod}`}
            onPress={() => setModal('method')}
          />
          <SettingRow
            label="Madhab (Asr)"
            value={madhab === 1 ? 'Shafi\'i / Hanbali / Maliki' : 'Hanafi'}
            onPress={() => setMadhab(madhab === 1 ? 0 : 1)}
          />
        </View>

        <Text style={styles.section}>CALENDAR</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Hijri Date Offset</Text>
            <View style={styles.offsetControl}>
              <TouchableOpacity onPress={() => setHijriOffset(Math.max(-4, hijriOffset - 1))}>
                <Text style={styles.offsetBtn}>-</Text>
              </TouchableOpacity>
              <Text style={styles.offsetVal}>
                {hijriOffset === 0 ? '0' : hijriOffset > 0 ? `+${hijriOffset}` : `${hijriOffset}`}
              </Text>
              <TouchableOpacity onPress={() => setHijriOffset(Math.min(4, hijriOffset + 1))}>
                <Text style={styles.offsetBtn}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.versionText}>Quran Verse v1.0.0</Text>
      </ScrollView>

      <Modal visible={modal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {modal === 'translation' && 'Select Translation'}
              {modal === 'reciter' && 'Select Reciter'}
              {modal === 'method' && 'Calculation Method'}
              {modal === 'language' && 'App Language'}
              {modal === 'theme' && 'Theme'}
            </Text>

            {modal === 'translation' && (
              <FlatList
                data={translations?.filter((t: any) =>
                  ['en', 'ur', 'bn', 'hi', 'fr', 'tr', 'de', 'id'].some(l =>
                    t.identifier.includes(l)
                  )
                ).slice(0, 30)}
                keyExtractor={(item: any) => item.identifier}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={[styles.modalItem, translationEdition === item.identifier && styles.modalItemActive]}
                    onPress={() => { setTranslationEdition(item.identifier); setModal(null); }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.modalItemSub}>{item.identifier}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {modal === 'reciter' && (
              <FlatList
                data={reciters?.slice(0, 30)}
                keyExtractor={(item: any) => item.identifier}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={[styles.modalItem, reciterEdition === item.identifier && styles.modalItemActive]}
                    onPress={() => { setReciterEdition(item.identifier); setModal(null); }}
                  >
                    <Text style={styles.modalItemText}>{item.englishName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {modal === 'method' && (
              <FlatList
                data={PRAYER_METHODS}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, prayerMethod === item.id && styles.modalItemActive]}
                    onPress={() => { setPrayerMethod(item.id); setModal(null); }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {modal === 'language' && (
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, language === item.code && styles.modalItemActive]}
                    onPress={() => { setLanguage(item.code); setModal(null); }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {modal === 'theme' && (
              <FlatList
                data={THEMES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, theme === item.code && styles.modalItemActive]}
                    onPress={() => { setTheme(item.code); setModal(null); }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity style={styles.modalClose} onPress={() => setModal(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', marginBottom: 24, marginTop: 10 },
  section: { fontSize: 11, color: '#8B949E', letterSpacing: 1.5, marginBottom: 8, marginTop: 20 },
  group: {
    backgroundColor: '#161B22', borderRadius: 14, borderWidth: 1, borderColor: '#30363D',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E242C',
  },
  rowLabel: { color: '#F0F0F0', fontSize: 15 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' },
  rowValue: { color: '#8B949E', fontSize: 13, maxWidth: 180, textAlign: 'right' },
  chevron: { color: '#8B949E', fontSize: 18 },
  offsetControl: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  offsetBtn: { color: '#D4AF37', fontSize: 22, fontWeight: '700', paddingHorizontal: 6 },
  offsetVal: { color: '#F0F0F0', fontSize: 16, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  versionText: { color: '#8B949E', fontSize: 12, textAlign: 'center', marginTop: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#161B22', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: '70%',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: '#30363D', borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: { color: '#F0F0F0', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalItem: {
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4,
  },
  modalItemActive: { backgroundColor: '#1B4332' },
  modalItemText: { color: '#F0F0F0', fontSize: 15 },
  modalItemSub: { color: '#8B949E', fontSize: 12, marginTop: 2 },
  modalClose: {
    backgroundColor: '#30363D', borderRadius: 12, padding: 14, marginTop: 12, alignItems: 'center',
  },
  modalCloseText: { color: '#F0F0F0', fontWeight: '600' },
});
