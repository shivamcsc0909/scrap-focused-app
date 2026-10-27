import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Crown, Check, Sparkles, X, PhoneCall, Shield, Zap, TrendingUp } from 'lucide-react-native';
import { THEME } from '../theme';
import { SUBSCRIPTION_PLANS } from '../constants/plans';
import { SubscriptionPlan, SubscriptionPlanId } from '../types';
import { useScrapStore } from '../store/useScrapStore';
import { PaymentModal } from './PaymentModal';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  targetLeadTitle?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  targetLeadTitle,
}) => {
  const { subscription, subscribeToPlan } = useScrapStore();
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('MONTHLY_PRO');
  const [showCheckout, setShowCheckout] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleSelectPlanAndPay = (planId: SubscriptionPlanId) => {
    setSelectedPlanId(planId);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (plan: SubscriptionPlan) => {
    subscribeToPlan(plan.id);
    setShowCheckout(false);
    onClose();
  };

  return (
    <>
      <Modal visible={visible && !showCheckout} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.sheetContainer}>
            {/* Modal Header */}
            <View style={styles.topHeader}>
              <View style={styles.badgeRow}>
                <View style={styles.proCrownBadge}>
                  <Crown size={14} color="#0B1120" />
                  <Text style={styles.proBadgeText}>DEALER PASS REQUIRED</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Pitch Title */}
              <Text style={styles.heading}>Unlock Direct Seller Contacts & Pan-India Lots</Text>
              <Text style={styles.subheading}>
                {targetLeadTitle ? (
                  `To call the seller for "${targetLeadTitle}", please choose an active Dealer Pass.`
                ) : (
                  'Connect directly with genuine factory owners, scrap yards & verified household sellers with 0% middleman margin.'
                )}
              </Text>

              {/* Locked Preview Box */}
              <View style={styles.lockedPreviewBox}>
                <View style={styles.previewRow}>
                  <PhoneCall size={16} color={THEME.colors.accent} />
                  <Text style={styles.previewText}>Phone: <Text style={styles.maskedText}>+91 98731 •••••</Text> (Locked)</Text>
                </View>
                <View style={styles.previewRow}>
                  <Shield size={16} color={THEME.colors.primary} />
                  <Text style={styles.previewText}>Address: <Text style={styles.maskedText}>Mayur Vihar, Delhi •••••</Text> (Locked)</Text>
                </View>
              </View>

              {/* Key Dealer Advantages */}
              <View style={styles.perksGrid}>
                <View style={styles.perkItem}>
                  <Zap size={16} color={THEME.colors.primary} />
                  <Text style={styles.perkText}>Instant WhatsApp Leads</Text>
                </View>
                <View style={styles.perkItem}>
                  <TrendingUp size={16} color={THEME.colors.accent} />
                  <Text style={styles.perkText}>Live Mandi Margin Rates</Text>
                </View>
                <View style={styles.perkItem}>
                  <Shield size={16} color={THEME.colors.cyan} />
                  <Text style={styles.perkText}>100% Verified Sellers</Text>
                </View>
              </View>

              {/* Subscription Plans List */}
              <Text style={styles.sectionTitle}>Choose Your Plan</Text>

              <View style={styles.plansContainer}>
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const discountPercent = Math.round(
                    ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                  );

                  return (
                    <TouchableOpacity
                      key={plan.id}
                      style={[
                        styles.planCard,
                        isSelected && styles.planCardSelected,
                        plan.popular && styles.planCardPopular,
                      ]}
                      onPress={() => setSelectedPlanId(plan.id)}
                      activeOpacity={0.85}
                    >
                      {plan.popular && (
                        <View style={styles.popularBanner}>
                          <Sparkles size={11} color="#0B1120" />
                          <Text style={styles.popularBannerText}>MOST POPULAR • BEST ROI</Text>
                        </View>
                      )}

                      <View style={styles.planCardHeader}>
                        <View style={styles.planInfo}>
                          <Text style={styles.planCardName}>{plan.name}</Text>
                          <Text style={styles.planHindiBadge}>{plan.hindiBadge}</Text>
                        </View>
                        <View style={styles.pricingBox}>
                          <View style={styles.priceRow}>
                            <Text style={styles.originalPrice}>₹{plan.originalPrice}</Text>
                            <Text style={styles.planPrice}>₹{plan.price}</Text>
                          </View>
                          <Text style={styles.planDuration}>
                            /{plan.durationDays === 1 ? 'day' : `${plan.durationDays} days`}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.featuresList}>
                        {plan.features.slice(0, 3).map((feat, idx) => (
                          <View key={idx} style={styles.featureItem}>
                            <Check size={14} color={THEME.colors.primary} />
                            <Text style={styles.featureText}>{feat}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>Save {discountPercent}% Special Launch Offer</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Bottom Sticky Action */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => handleSelectPlanAndPay(selectedPlanId)}
                activeOpacity={0.85}
              >
                <Text style={styles.continueButtonText}>
                  ACTIVATE {selectedPlan.name.toUpperCase()} (₹{selectedPlan.price})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Gateway Modal */}
      <PaymentModal
        visible={showCheckout}
        plan={selectedPlan}
        onClose={() => setShowCheckout(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.backdrop,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: THEME.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorderHighlight,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  proCrownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    gap: 5,
  },
  proBadgeText: {
    color: '#0B1120',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  heading: {
    color: THEME.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 26,
  },
  subheading: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  lockedPreviewBox: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginTop: THEME.spacing.md,
    gap: 8,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  maskedText: {
    color: THEME.colors.accent,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  perksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.md,
    gap: 6,
  },
  perkItem: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: 8,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  perkText: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  planCardPopular: {
    borderColor: THEME.colors.accent,
  },
  popularBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularBannerText: {
    color: '#0B1120',
    fontSize: 9,
    fontWeight: '900',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planInfo: {
    flex: 1,
  },
  planCardName: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  planHindiBadge: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  pricingBox: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPrice: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  planPrice: {
    color: THEME.colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  planDuration: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  featuresList: {
    gap: 6,
    marginTop: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  discountBadge: {
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  discountText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  continueButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
