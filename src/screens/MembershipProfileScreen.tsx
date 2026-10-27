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
  CheckCircle,
  Sparkles,
  RefreshCcw,
  Receipt,
  User,
  Bell,
  Scale,
  Trash2,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { SUBSCRIPTION_PLANS } from '../constants/plans';
import { SubscriptionPlan, SubscriptionPlanId } from '../types';
import { useScrapStore } from '../store/useScrapStore';
import { PaymentModal } from '../components/PaymentModal';
import { PriceAlertModal } from '../components/PriceAlertModal';

export const MembershipProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    subscription,
    subscribeToPlan,
    cancelSubscription,
    priceAlerts,
    togglePriceAlert,
    deletePriceAlert,
    listings,
    deleteListing,
    resetToDefaults,
  } = useScrapStore();

  const [selectedPlanForPay, setSelectedPlanForPay] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);

  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.planId);
  const myListings = listings.filter((l) => l.isCurrentUserListing);

  const getRemainingTimeStr = () => {
    if (!subscription.active || !subscription.expiryDate) {
      return 'No active member pass';
    }
    const now = new Date().getTime();
    const expiry = new Date(subscription.expiryDate).getTime();
    const diff = expiry - now;

    if (diff <= 0) return 'Pass Expired';

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
    Alert.alert('Membership Pass Activated!', `You have unlocked unlimited buyer & seller contacts.`);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Database',
      'This will restore all default market listings, price alerts, and sample chats.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset All', style: 'destructive', onPress: () => resetToDefaults() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Membership & Profile"
        subtitle="Trader Pass, Price Alerts & My Listings"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Membership Status Banner */}
        <View style={[styles.passCard, subscription.active && styles.passCardActive]}>
          <View style={styles.passHeader}>
            <View style={styles.badgeRow}>
              <View style={[styles.tierPill, { backgroundColor: subscription.active ? THEME.colors.primary : THEME.colors.accent }]}>
                <Crown size={12} color="#0B1120" />
                <Text style={styles.tierPillText}>
                  {subscription.active && activePlan ? activePlan.name.toUpperCase() : 'FREE VISITOR PASS'}
                </Text>
              </View>
              {subscription.active && (
                <View style={styles.verifiedPill}>
                  <ShieldCheck size={12} color={THEME.colors.primaryLight} />
                  <Text style={styles.verifiedPillText}>VERIFIED B2B TRADER</Text>
                </View>
              )}
            </View>

            {subscription.active && (
              <TouchableOpacity onPress={() => cancelSubscription()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.passTitle}>
            {subscription.active && activePlan
              ? activePlan.tagline
              : 'Subscribe to Unlock Direct Contacts & Unlimited In-App Chat'}
          </Text>

          <View style={styles.passStatsRow}>
            <View style={styles.passStatBox}>
              <Clock size={14} color={THEME.colors.accent} />
              <Text style={styles.passStatText}>{getRemainingTimeStr()}</Text>
            </View>
            <View style={styles.passStatBox}>
              <Zap size={14} color={THEME.colors.primaryLight} />
              <Text style={styles.passStatText}>
                {subscription.active
                  ? subscription.totalLeadsAllowed >= 9999
                    ? 'Unlimited Contacts Unlocked'
                    : `${subscription.totalLeadsAllowed - subscription.leadsUnlockedCount} Lead Passes Remaining`
                  : '0 Active Lead Passes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Business Trader Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBox}>
              <User size={22} color={THEME.colors.primaryLight} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.businessName}>Chandra Metal Traders</Text>
              <Text style={styles.profileSub}>Harish Chandra • GST: 07AAACG9921D1Z4</Text>
              <Text style={styles.profileRole}>Role: Registered Buyer & Seller (Dual License)</Text>
            </View>
          </View>
        </View>

        {/* SECTION: MY ACTIVE LISTINGS & ANTI-CONFLICT STATUS */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <Scale size={16} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>My Active Orders ({myListings.length})</Text>
          </View>
          <TouchableOpacity
            style={styles.newOrderBtn}
            onPress={() => navigation.navigate('Post Deal')}
          >
            <Plus size={12} color="#FFFFFF" />
            <Text style={styles.newOrderBtnText}>New Listing</Text>
          </TouchableOpacity>
        </View>

        {myListings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>You have no active orders in the marketplace.</Text>
          </View>
        ) : (
          myListings.map((item) => (
            <View key={item.id} style={styles.myListingCard}>
              <View style={styles.myListingTop}>
                <View style={styles.myTagRow}>
                  <View style={item.type === 'SELL_OFFER' ? styles.sellBadge : styles.buyBadge}>
                    <Text style={item.type === 'SELL_OFFER' ? styles.sellBadgeText : styles.buyBadgeText}>
                      {item.type === 'SELL_OFFER' ? 'ACTIVE SELL' : 'ACTIVE BUY RFQ'}
                    </Text>
                  </View>
                  <Text style={styles.myListingId}>{item.id}</Text>
                </View>

                <TouchableOpacity onPress={() => deleteListing(item.id)}>
                  <Trash2 size={14} color={THEME.colors.error} />
                </TouchableOpacity>
              </View>

              <Text style={styles.myListingTitle}>{item.title}</Text>
              <View style={styles.myListingMeta}>
                <Text style={styles.myListingQty}>{item.quantity} {item.unit}</Text>
                <Text style={styles.myListingPrice}>Target: ₹{item.targetPrice}/{item.unit}</Text>
              </View>
            </View>
          ))
        )}

        {/* SECTION: SMART PRICE TARGET ALERTS ("Buy Low / Sell High") */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <Bell size={16} color={THEME.colors.accent} />
            <Text style={styles.sectionTitle}>Smart Price Target Alerts ({priceAlerts.length})</Text>
          </View>
          <TouchableOpacity
            style={styles.addAlertBtn}
            onPress={() => setShowPriceAlertModal(true)}
          >
            <Plus size={12} color="#0B1120" />
            <Text style={styles.addAlertBtnText}>Add Alert</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alertsList}>
          {priceAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTypeTag}>
                  {alert.alertType === 'BUY_BELOW' ? (
                    <TrendingDown size={12} color={THEME.colors.primaryLight} />
                  ) : (
                    <TrendingUp size={12} color={THEME.colors.accent} />
                  )}
                  <Text style={styles.alertTypeText}>
                    {alert.alertType === 'BUY_BELOW' ? 'BUY LOW TARGET' : 'SELL HIGH TARGET'}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => deletePriceAlert(alert.id)}>
                  <Trash2 size={13} color={THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.alertMaterial}>{alert.materialName}</Text>
              <View style={styles.alertPriceRow}>
                <Text style={styles.alertTarget}>
                  Trigger: {alert.alertType === 'BUY_BELOW' ? 'Drops below ' : 'Rises above '}
                  <Text style={styles.alertTargetVal}>₹{alert.targetPrice}/{alert.unit}</Text>
                </Text>
                <Text style={styles.alertCurrent}>Benchmark: ₹{alert.currentPrice}/{alert.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SECTION: MEMBERSHIP PLANS */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <Crown size={16} color={THEME.colors.accent} />
            <Text style={styles.sectionTitle}>Dealer Membership Passes</Text>
          </View>
        </View>

        <View style={styles.plansList}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = subscription.active && subscription.planId === plan.id;
            return (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.popular && styles.planCardPopular,
                  isCurrent && styles.planCardCurrent,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planHindi}>{plan.hindiBadge}</Text>
                  </View>
                  <View style={styles.planPriceBox}>
                    <Text style={styles.planOrigPrice}>₹{plan.originalPrice}</Text>
                    <Text style={styles.planPrice}>₹{plan.price}</Text>
                    <Text style={styles.planDuration}>/{plan.durationDays === 1 ? 'day' : `${plan.durationDays}d`}</Text>
                  </View>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featRow}>
                      <CheckCircle size={13} color={THEME.colors.primaryLight} />
                      <Text style={styles.featText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.subscribeBtn, isCurrent && styles.subscribeBtnCurrent]}
                  onPress={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                >
                  <Text style={[styles.subscribeBtnText, isCurrent && styles.subscribeBtnTextCurrent]}>
                    {isCurrent ? 'ACTIVE PLAN' : `SUBSCRIBE FOR ₹${plan.price}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Demo Tools */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Prototype Database Reset</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
            <RefreshCcw size={13} color="#FFFFFF" />
            <Text style={styles.resetBtnText}>Reset Orders, RFQs & Chats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <PaymentModal
        visible={showPaymentModal}
        plan={selectedPlanForPay}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <PriceAlertModal
        visible={showPriceAlertModal}
        onClose={() => setShowPriceAlertModal(false)}
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
  passCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  passCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  tierPillText: {
    color: '#0B1120',
    fontSize: 9,
    fontWeight: '900',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  verifiedPillText: {
    color: THEME.colors.primaryLight,
    fontSize: 9,
    fontWeight: '800',
  },
  cancelText: {
    color: THEME.colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  passTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  passStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  passStatBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  passStatText: {
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  businessName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  profileSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  profileRole: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  newOrderBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  newOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  addAlertBtn: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addAlertBtnText: {
    color: '#0B1120',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 16,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  myListingCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  myListingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellBadge: {
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sellBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 8,
    fontWeight: '900',
  },
  buyBadge: {
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buyBadgeText: {
    color: THEME.colors.accent,
    fontSize: 8,
    fontWeight: '900',
  },
  myListingId: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontFamily: 'monospace',
  },
  myListingTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  myListingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myListingQty: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  myListingPrice: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  alertsList: {
    gap: 8,
  },
  alertCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertTypeText: {
    color: THEME.colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },
  alertMaterial: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  alertPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTarget: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  alertTargetVal: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
  },
  alertCurrent: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  plansList: {
    gap: 10,
  },
  planCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    overflow: 'hidden',
  },
  planCardPopular: {
    borderColor: THEME.colors.accent,
  },
  planCardCurrent: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  popularBadgeText: {
    color: '#0B1120',
    fontSize: 8,
    fontWeight: '900',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  planName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  planHindi: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  planPriceBox: {
    alignItems: 'flex-end',
  },
  planOrigPrice: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  planPrice: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  planDuration: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
  },
  planFeatures: {
    gap: 4,
    marginVertical: 8,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  subscribeBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  subscribeBtnCurrent: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  subscribeBtnTextCurrent: {
    color: THEME.colors.primaryLight,
  },
  demoBox: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 12,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  demoTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  resetBtn: {
    backgroundColor: THEME.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
