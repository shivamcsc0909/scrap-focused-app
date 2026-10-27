import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, ShieldCheck, Zap, ArrowRight } from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { BRANDING_IMAGES } from '../constants/assets';

interface Props {
  navigation: any;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language } = useSahiStore();
  const t = TRANSLATIONS[language];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]}>
      {/* Background Glow */}
      <View style={styles.glowCircle} />

      {/* Top Branding */}
      <View style={styles.topSection}>
        <View style={styles.logoBadge}>
          <Image source={BRANDING_IMAGES.appIcon} style={{ width: 88, height: 88, borderRadius: 22 }} resizeMode="contain" />
        </View>

        <Text style={styles.brandTitle}>सही भाव</Text>
        <Text style={styles.brandSubtitle}>SAHI BHAAV</Text>
        <View style={styles.taglineChip}>
          <Text style={styles.taglineText}>⚖️ {t.tagline}</Text>
        </View>

        <Text style={styles.descriptionText}>
          {t.subTagline}
        </Text>
      </View>

      {/* Value Proposition Highlights for Local & Illiterate Users */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Scale size={24} color={THEME.colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === 'hi' ? '100% सही तोल और भाव' : '100% Honest Weight & Rate'}
            </Text>
            <Text style={styles.featureDesc}>
              {language === 'hi' ? 'सीधा कंपनी से सौदा, कोई बिचौलिया नहीं' : 'Direct company trading, no middlemen'}
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Zap size={24} color={THEME.colors.accent} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === 'hi' ? '30 मिनट में कॉल और पक्की डील' : 'Fast Call & Deal Finalization'}
            </Text>
            <Text style={styles.featureDesc}>
              {language === 'hi' ? 'रिक्वेस्ट डालते ही हमारी टीम कॉल करेगी' : 'Sales team calls back immediately'}
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <ShieldCheck size={24} color="#38BDF8" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === 'hi' ? 'प्लांट व डीलर्स का विश्वास' : 'Trusted by Plants & Dealers'}
            </Text>
            <Text style={styles.featureDesc}>
              {language === 'hi' ? 'तुरंत भुगतान और सुरक्षित डिलीवरी' : 'Guaranteed payment and verified logistics'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('LanguageSelect')}
        >
          <LinearGradient
            colors={[THEME.colors.primary, THEME.colors.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>{t.getStarted} / Continue</Text>
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
  glowCircle: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBadge: {
    marginBottom: 16,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 12,
  },
  taglineChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 12,
  },
  taglineText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
  },
  descriptionText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  featuresContainer: {
    backgroundColor: '#111C2E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    color: '#64748B',
    fontSize: 12,
  },
  bottomSection: {
    marginTop: 10,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
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
