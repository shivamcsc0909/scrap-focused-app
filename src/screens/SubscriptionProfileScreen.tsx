import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Crown,
  ShieldCheck,
  Zap,
  Clock,
  Calendar,
  CheckCircle,
  Sparkles,
  RefreshCcw,
  Receipt,
  User,
  Phone,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { SUBSCRIPTION_PLANS } from '../constants/plans';
import { SubscriptionPlan, SubscriptionPlanId } from '../types';
import { useScrapStore } from '../store/useScrapStore';
import { PaymentModal } from '../components/PaymentModal';

export const SubscriptionProfileScreen: React.FC = () => {
  const {
    subscription,
    subscribeToPlan,
    cancelSubscription,
    userRole,
    setUserRole,
    resetToDefaults,
  } = useScrapStore();

  const [selectedPlanForPay, setSelectedPlanForPay] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.planId);

  // Calculate remaining days/hours
  const getRemainingTimeStr = () => {
    if (!subscription.active || !subscription.expiryDate) {
      return 'No active subscription';
    }
    const now = new Date().getTime();
    const expiry = new Date(subscription.expiryDate).getTime();
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} Days ${hours} Hours Remaining`;
    return `${hours} Hours Remaining`;
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForPay(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (plan: SubscriptionPlan) => {
    subscribeToPlan(plan.id);
    setShowPaymentModal(false);
    Alert.alert('Plan Activated!', `Congratulations! ${plan.name} is now active.`);
  };

  const handleCancelSub = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to revert to Free mode?',
      [
        { text: 'Keep Plan', style: 'cancel' },
        {
          text: 'Revert to Free',
          style: 'destructive',
          onPress: () => cancelSubscription(),
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Database',
      'This will reset all seller leads, warehouse stock, and mock passes back to original demo values.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset All', style: 'destructive', onPress: () => resetToDefaults() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Plans & Profile"
        subtitle="Dealer Membership, Pass & Wallet"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Membership Status Card */}
        <View style={[styles.membershipCard, subscription.active && styles.membershipCardActive]}>
          <View style={styles.membershipTop}>
            <View style={styles.badgeGroup}>
              <View style={[styles.planPill, { backgroundColor: subscription.active ? THEME.colors.primary : THEME.colors.accent }]}>
                <Crown size={12} color="#0B1120" />
                <Text style={styles.planPillText}>
                  {subscription.active && activePlan ? activePlan.name.toUpperCase() : 'FREE PLAN'}
                </Text>
              </View>
              {subscription.active && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={12} color={THEME.colors.primaryLight} />
                  <Text style={styles.verifiedText}>VERIFIED RECYCLER</Text>
                </View>
              )}
            </View>

            {subscription.active && (
              <TouchableOpacity onPress={handleCancelSub}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.membershipTitle}>
            {subscription.active && activePlan
              ? activePlan.tagline
              : 'Upgrade to Dealer Pass to Unlock Leads'}
          </Text>

          {/* Time & Leads Remaining */}
          <View style={styles.statusBoxRow}>
            <View style={styles.statusBox}>
              <Clock size={14} color={THEME.colors.accent} />
              <Text style={styles.statusBoxVal}>{getRemainingTimeStr()}</Text>
            </View>
            <View style={styles.statusBox}>
              <Zap size={14} color={THEME.colors.primaryLight} />
              <Text style={styles.statusBoxVal}>
                {subscription.active
                  ? subscription.totalLeadsAllowed >= 9999
                    ? 'Unlimited Leads'
                    : `${subscription.totalLeadsAllowed - subscription.leadsUnlockedCount} Passes Left`
                  : '0 Active Passes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Card & Role Switcher */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <User size={22} color={THEME.colors.primaryLight} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Harish Chandra (Scrap Yard Owner)</Text>
              <Text style={styles.userPhone}>+91 98102 33491 • GST: 07AAACG9921D1Z4</Text>
            </View>
          </View>

          <View style={styles.roleSwitchSection}>
            <Text style={styles.roleSwitchLabel}>Current Active View Perspective:</Text>
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[styles.roleTab, userRole === 'DEALER' && styles.roleTabActive]}
                onPress={() => setUserRole('DEALER')}
              >
                <Text style={[styles.roleTabText, userRole === 'DEALER' && styles.roleTabTextActive]}>
                  Dealer / Buyer Mode
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, userRole === 'SELLER' && styles.roleTabActive]}
                onPress={() => setUserRole('SELLER')}
              >
                <Text style={[styles.roleTabText, userRole === 'SELLER' && styles.roleTabTextActive]}>
                  Seller / Kabadi Mode
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Subscription Plans Section */}
        <View style={styles.sectionHeader}>
          <Sparkles size={16} color={THEME.colors.accent} />
          <Text style={styles.sectionTitle}>Dealer Membership Tiers (Choose Plan)</Text>
        </View>

        <View style={styles.plansList}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = subscription.active && subscription.planId === plan.id;
            return (
              <View
                key={plan.id}
                style={[
                  styles.planItemCard,
                  plan.popular && styles.planItemCardPopular,
                  isCurrent && styles.planItemCardCurrent,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularRibbon}>
                    <Text style={styles.popularRibbonText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.planItemHeader}>
                  <View>
                    <Text style={styles.planItemName}>{plan.name}</Text>
                    <Text style={styles.planItemHindi}>{plan.hindiBadge}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.itemOriginalPrice}>₹{plan.originalPrice}</Text>
                    <Text style={styles.itemPrice}>₹{plan.price}</Text>
                    <Text style={styles.itemDuration}>
                      /{plan.durationDays === 1 ? 'day' : `${plan.durationDays}d`}
                    </Text>
                  </View>
                </View>

                {/* Features List */}
                <View style={styles.planFeatures}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featRow}>
                      <CheckCircle size={13} color={THEME.colors.primaryLight} />
                      <Text style={styles.featText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                {/* Button */}
                <TouchableOpacity
                  style={[
                    styles.planSubscribeBtn,
                    isCurrent && styles.planCurrentBtn,
                  ]}
                  onPress={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.planSubscribeBtnText, isCurrent && styles.planCurrentBtnText]}>
                    {isCurrent ? 'CURRENT ACTIVE PLAN' : `SUBSCRIBE FOR ₹${plan.price}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Billing & Tax Invoices Section */}
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <Receipt size={16} color={THEME.colors.primaryLight} />
            <Text style={styles.invoiceTitle}>Recent Invoices & GST Receipts</Text>
          </View>
          <View style={styles.invoiceItem}>
            <View>
              <Text style={styles.invNumber}>INV-2026-SCRAP-904</Text>
              <Text style={styles.invDate}>Monthly Pro Trader • Paid via UPI</Text>
            </View>
            <TouchableOpacity
              style={styles.invDownloadBtn}
              onPress={() => Alert.alert('GST Invoice', 'Downloading simulated Tax Invoice PDF...')}
            >
              <FileText size={12} color={THEME.colors.primaryLight} />
              <Text style={styles.invDownloadText}>PDF Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Tools Box */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Prototype & Testing Tools</Text>
          <Text style={styles.demoSub}>
            Quickly test different roles, restore pre-seeded leads, or clear local storage.
          </Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
            <RefreshCcw size={14} color="#FFFFFF" />
            <Text style={styles.resetBtnText}>Reset Demo Leads & Storage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Gateway Modal */}
      <PaymentModal
        visible={showPaymentModal}
        plan={selectedPlanForPay}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 60,
    gap: 14,
  },
  membershipCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
  },
  membershipCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  membershipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  planPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  planPillText: {
    color: '#0B1120',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  verifiedText: {
    color: THEME.colors.primaryLight,
    fontSize: 9,
    fontWeight: '800',
  },
  cancelText: {
    color: THEME.colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  membershipTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  statusBoxRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    gap: 8,
  },
  statusBoxVal: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  profileCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  userPhone: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  roleSwitchSection: {
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  roleSwitchLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  roleTab: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  roleTabActive: {
    backgroundColor: THEME.colors.primarySoft,
    borderColor: THEME.colors.primary,
  },
  roleTabText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  roleTabTextActive: {
    color: THEME.colors.primaryLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  plansList: {
    gap: 12,
  },
  planItemCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    overflow: 'hidden',
  },
  planItemCardPopular: {
    borderColor: THEME.colors.accent,
  },
  planItemCardCurrent: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  popularRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  popularRibbonText: {
    color: '#0B1120',
    fontSize: 8,
    fontWeight: '900',
  },
  planItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planItemName: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  planItemHindi: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemOriginalPrice: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  itemPrice: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  itemDuration: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  planFeatures: {
    gap: 6,
    marginVertical: 10,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  planSubscribeBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 6,
  },
  planSubscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  planCurrentBtn: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  planCurrentBtnText: {
    color: THEME.colors.primaryLight,
  },
  invoiceCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoiceTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 8,
    borderRadius: 6,
  },
  invNumber: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  invDate: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  invDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  invDownloadText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  demoCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  demoTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  demoSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  resetBtn: {
    backgroundColor: THEME.colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    marginTop: 6,
    gap: 6,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
