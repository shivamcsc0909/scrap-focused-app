import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Languages, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { AppLanguage } from '../types';

interface Props {
  navigation: any;
}

export const LanguageSelectScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useSahiStore();
  const t = TRANSLATIONS[language];

  const handleSelect = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Languages size={28} color={THEME.colors.primary} />
        </View>
        <Text style={styles.title}>{t.selectLanguage}</Text>
        <Text style={styles.subtitle}>Choose your preferred language</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Hindi Card */}
        <TouchableOpacity
          style={[styles.langCard, language === 'hi' && styles.selectedCard]}
          activeOpacity={0.8}
          onPress={() => handleSelect('hi')}
        >
          <View style={styles.cardLeft}>
            <View style={styles.flagBadge}>
              <Text style={styles.flagText}>🇮🇳</Text>
            </View>
            <View>
              <Text style={styles.langName}>हिंदी (Hindi)</Text>
              <Text style={styles.langDesc}>सभी जानकारी सरल हिंदी में</Text>
            </View>
          </View>
          <View style={[styles.radioCircle, language === 'hi' && styles.radioSelected]}>
            {language === 'hi' && <Check size={16} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>

        {/* English Card */}
        <TouchableOpacity
          style={[styles.langCard, language === 'en' && styles.selectedCard]}
          activeOpacity={0.8}
          onPress={() => handleSelect('en')}
        >
          <View style={styles.cardLeft}>
            <View style={styles.flagBadge}>
              <Text style={styles.flagText}>🌐</Text>
            </View>
            <View>
              <Text style={styles.langName}>English</Text>
              <Text style={styles.langDesc}>Use the full app in English</Text>
            </View>
          </View>
          <View style={[styles.radioCircle, language === 'en' && styles.radioSelected]}>
            {language === 'en' && <Check size={16} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 {language === 'hi' ? 'आप इसे बाद में भी प्रोफाइल में जाकर कभी भी बदल सकते हैं।' : 'You can switch between Hindi and English anytime from settings.'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={handleContinue}>
          <LinearGradient
            colors={[THEME.colors.primary, THEME.colors.primaryDark]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{t.continueBtn}</Text>
            <ArrowRight size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D18',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  cardsContainer: {
    gap: 16,
    marginVertical: 20,
  },
  langCard: {
    backgroundColor: '#111C2E',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flagBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 22,
  },
  langName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  langDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primary,
  },
  tipBox: {
    backgroundColor: '#131D31',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 8,
  },
  tipText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  bottomSection: {
    marginBottom: 10,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
