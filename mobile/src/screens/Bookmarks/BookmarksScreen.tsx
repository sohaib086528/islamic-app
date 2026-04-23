import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useBookmarksStore } from '../../store/bookmarksStore';

export default function BookmarksScreen({ navigation }: any) {
  const { bookmarks, removeBookmark } = useBookmarksStore();

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Bookmarks</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          <Text style={styles.emptySubtext}>Long press any ayah to bookmark it</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bookmarks</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => `${item.surahId}-${item.ayahNumber}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() =>
                navigation.navigate('SurahReader', {
                  surahId: item.surahId,
                  surahName: item.surahName,
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardSurah}>{item.surahName}</Text>
                <Text style={styles.cardAyah}>Ayah {item.ayahNumber}</Text>
              </View>
              <Text style={styles.cardText} numberOfLines={2}>{item.ayahText}</Text>
              <Text style={styles.cardDate}>
                {new Date(item.savedAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeBookmark(item.surahId, item.ayahNumber)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  title: { fontSize: 26, fontWeight: '700', color: '#F0F0F0', padding: 20, paddingBottom: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#F0F0F0', fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#8B949E' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#161B22', borderRadius: 14, borderWidth: 1, borderColor: '#30363D',
    flexDirection: 'row', alignItems: 'center',
  },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardSurah: { color: '#D4AF37', fontSize: 15, fontWeight: '700' },
  cardAyah: { color: '#8B949E', fontSize: 13 },
  cardText: { color: '#8B949E', fontSize: 14, lineHeight: 22, textAlign: 'right', direction: 'rtl' },
  cardDate: { color: '#8B949E', fontSize: 11, marginTop: 8 },
  deleteBtn: { padding: 16 },
  deleteText: { color: '#FF6B6B', fontSize: 18, fontWeight: '700' },
});
