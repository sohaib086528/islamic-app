import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '../../services/api';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data: surahs, isLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: quranApi.getSurahs,
    staleTime: Infinity,
  });

  const results = submitted && surahs
    ? (surahs as any[]).filter((s: any) =>
        s.englishName.toLowerCase().includes(submitted.toLowerCase()) ||
        s.englishNameTranslation.toLowerCase().includes(submitted.toLowerCase()) ||
        s.number.toString() === submitted
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search surahs..."
          placeholderTextColor="#8B949E"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => setSubmitted(query)}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setSubmitted(''); }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <ActivityIndicator color="#D4AF37" style={{ marginTop: 40 }} />
      )}

      {submitted.length > 0 && results.length === 0 && !isLoading && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No results for "{submitted}"</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item: any) => item.number.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() =>
              navigation.navigate('SurahReader', {
                surahId: item.number,
                surahName: item.englishName,
              })
            }
          >
            <View style={styles.resultBadge}>
              <Text style={styles.resultNum}>{item.number}</Text>
            </View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.englishName}</Text>
              <Text style={styles.resultMeta}>{item.englishNameTranslation}</Text>
            </View>
            <Text style={styles.resultArabic}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', padding: 20, paddingBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22',
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#30363D', marginBottom: 16,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, color: '#F0F0F0', fontSize: 15 },
  clearBtn: { color: '#8B949E', fontSize: 16, paddingLeft: 8 },
  noResults: { alignItems: 'center', marginTop: 40 },
  noResultsText: { color: '#8B949E', fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  result: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  resultBadge: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#1B4332',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
    borderWidth: 1, borderColor: '#2D6A4F',
  },
  resultNum: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  resultInfo: { flex: 1 },
  resultName: { color: '#F0F0F0', fontSize: 15, fontWeight: '600' },
  resultMeta: { color: '#8B949E', fontSize: 12, marginTop: 2 },
  resultArabic: { color: '#D4AF37', fontSize: 20 },
  separator: { height: 1, backgroundColor: '#30363D' },
});
