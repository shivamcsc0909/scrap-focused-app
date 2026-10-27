import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { MapPin, Crown, ArrowRightLeft } from 'lucide-react-native';
import { THEME } from '../theme';
import { useScrapStore } from '../store/useScrapStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenPaywall?: () => void;
  showRoleToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ScrapBazaar Pro',
  subtitle,
  onOpenPaywall,
  showRoleToggle = true,
}) => {
  const { userRole, setUserRole, subscription, selectedCity, setSelectedCity } = useScrapStore();

  const toggleRole = () => {
    setUserRole(userRole === 'DEALER' ? 'SELLER' : 'DEALER');
  };

  const cities = ['All India', 'Delhi NCR', 'Mumbai', 'Ahmedabad', 'Surat', 'Pune', 'Bengaluru'];

  const cycleCity = () => {
    const currentIndex = cities.indexOf(selectedCity);
    const nextCity = cities[(currentIndex + 1) % cities.length];
    setSelectedCity(nextCity);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      
      {/* Top Location & Role Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.locationPill} onPress={cycleCity} activeOpacity={0.7}>
          <MapPin size={14} color={THEME.colors.primary} />
          <Text style={styles.locationText}>{selectedCity}</Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {showRoleToggle && (
            <TouchableOpacity style={styles.roleToggle} onPress={toggleRole} activeOpacity={0.8}>
              <ArrowRightLeft size={12} color={userRole === 'DEALER' ? THEME.colors.accent : THEME.colors.primary} />
              <Text
                style={[
                  styles.roleText,
                  { color: userRole === 'DEALER' ? THEME.colors.accent : THEME.colors.primaryLight },
                ]}
              >
                {userRole === 'DEALER' ? 'Dealer View' : 'Seller View'}
              </Text>
            </TouchableOpacity>
          )}

          {subscription.active ? (
            <TouchableOpacity style={styles.vipBadge} onPress={onOpenPaywall} activeOpacity={0.8}>
              <Crown size={13} color="#FFFFFF" />
              <Text style={styles.vipText}>PRO DEALER</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.upgradeBtn} onPress={onOpenPaywall} activeOpacity={0.8}>
              <Crown size={13} color={THEME.colors.accent} />
              <Text style={styles.upgradeText}>Upgrade Pro</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Header Title */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.brandTitle}>{title}</Text>
          {subtitle ? <Text style={styles.brandSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 5,
  },
  locationText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  vipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    gap: 4,
  },
  upgradeText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
