import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Bookmark {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  savedAt: number;
}

interface BookmarksState {
  bookmarks: Bookmark[];
  addBookmark: (b: Bookmark) => void;
  removeBookmark: (surahId: number, ayahNumber: number) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (b) => {
        const exists = get().bookmarks.some(
          (item) => item.surahId === b.surahId && item.ayahNumber === b.ayahNumber
        );
        if (exists) {
          return;
        }
        set({ bookmarks: [b, ...get().bookmarks] });
      },

      removeBookmark: (surahId, ayahNumber) => {
        set({
          bookmarks: get().bookmarks.filter(
            (b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber)
          ),
        });
      },

      isBookmarked: (surahId, ayahNumber) =>
        get().bookmarks.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber),
    }),
    {
      name: 'bookmarks-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
