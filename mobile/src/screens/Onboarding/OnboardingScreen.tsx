import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';

const LANGUAGES = [
  { code: 'en' as const, label: 'English', nativeLabel: 'English' },
  { code: 'ur' as const, label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'bn' as const, label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'hi' as const, label: 'Hindi', nativeLabel: 'हिंदी' },
];

const THEMES = [
  { code: 'dark' as const, label: 'Dark', description: 'Easy on the eyes at night' },
  { code: 'light' as const, label: 'Light', description: 'Clean and bright' },
  { code: 'system' as const, label: 'System Default', description: 'Follows your phone setting' },
];

export default function OnboardingScreen() {
  const { setLanguage, setTheme, setOnboardingComplete } = useSettingsStore();
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<'en' | 'ur' | 'bn' | 'hi'>('en');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('dark');

  function handleFinish() {
    setLanguage(selectedLang);
    setTheme(selectedTheme);
    setOnboardingComplete();
  }

  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.appName}>نور</Text>
          <Text style={styles.title}>Welcome to Noor</Text>
          <Text style={styles.subtitle}>Your complete Islamic companion</Text>

          <Text style={styles.sectionLabel}>SELECT YOUR LANGUAGE</Text>

          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.option,
                selectedLang === lang.code && styles.optionSelected,
              ]}
              onPress={() => setSelectedLang(lang.code)}
            >
              <Text style={styles.optionNative}>{lang.nativeLabel}</Text>
              <Text style={styles.optionEnglish}>{lang.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose your theme</Text>
          <Text style={styles.subtitle}>You can always change this in settings</Text>

          <Text style={styles.sectionLabel}>THEME</Text>

          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.code}
              style={[
                styles.option,
                selectedTheme === t.code && styles.optionSelected,
              ]}
              onPress={() => setSelectedTheme(t.code)}
            >
              <Text style={styles.optionNative}>{t.label}</Text>
              <Text style={styles.optionEnglish}>{t.description}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  bismillah: {
    fontSize: 20,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  appName: {
    fontSize: 52,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    color: '#F0F0F0',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B949E',
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    color: '#8B949E',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  option: {
    backgroundColor: '#161B22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#30363D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#D4AF37',
    backgroundColor: '#1A2A1A',
  },
  optionNative: {
    fontSize: 16,
    color: '#F0F0F0',
    fontWeight: '600',
  },
  optionEnglish: {
    fontSize: 13,
    color: '#8B949E',
  },
  button: {
    backgroundColor: '#1B4332',
    borderRadius: 14,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  buttonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
