import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building2, X } from 'lucide-react-native';
import { THEME } from '../theme';
import { SubscriptionPlan } from '../types';

interface PaymentModalProps {
  visible: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onPaymentSuccess: (plan: SubscriptionPlan) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  plan,
  onClose,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!plan) return null;

  const handlePayNow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess(plan);
      }, 1400);
    }, 1500);
  };

  const gst = Math.round(plan.price * 0.18);
  const totalAmount = plan.price + gst;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <ShieldCheck size={20} color={THEME.colors.primary} />
              <Text style={styles.headerTitle}>Secure Payment Gateway</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {isSuccess ? (
            <View style={styles.successState}>
              <CheckCircle2 size={64} color={THEME.colors.primary} />
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successSubtitle}>
                {plan.name} has been activated on your account.
              </Text>
            </View>
          ) : (
            <>
              {/* Plan Summary Card */}
              <View style={styles.orderCard}>
                <View style={styles.planBadgeRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={[styles.durationBadge, { backgroundColor: plan.color + '25' }]}>
                    <Text style={[styles.durationText, { color: plan.color }]}>
                      {plan.durationDays} Days Pass
                    </Text>
                  </View>
                </View>

                <View style={styles.priceBreakdown}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Plan Subscription Fee</Text>
                    <Text style={styles.priceValue}>₹{plan.price.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>GST (18% Recycling Input Credit)</Text>
                    <Text style={styles.priceValue}>₹{gst.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>Total Payable Amount</Text>
                    <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
              </View>

              {/* Payment Methods */}
              <Text style={styles.methodTitle}>Select Payment Method</Text>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  selectedMethod === 'UPI' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('UPI')}
                activeOpacity={0.8}
              >
                <Smartphone size={20} color={selectedMethod === 'UPI' ? THEME.colors.primary : THEME.colors.textSecondary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Instant UPI (GPay, PhonePe, Paytm)</Text>
                  <Text style={styles.methodDesc}>Zero convenience charges</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'UPI' && styles.radioActive]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  selectedMethod === 'CARD' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('CARD')}
                activeOpacity={0.8}
              >
                <CreditCard size={20} color={selectedMethod === 'CARD' ? THEME.colors.primary : THEME.colors.textSecondary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Credit / Debit Card</Text>
                  <Text style={styles.methodDesc}>Visa, MasterCard, RuPay</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'CARD' && styles.radioActive]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  selectedMethod === 'NETBANKING' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('NETBANKING')}
                activeOpacity={0.8}
              >
                <Building2 size={20} color={selectedMethod === 'NETBANKING' ? THEME.colors.primary : THEME.colors.textSecondary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Net Banking / Corporate Account</Text>
                  <Text style={styles.methodDesc}>All 40+ major Indian banks</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'NETBANKING' && styles.radioActive]} />
              </TouchableOpacity>

              {/* Pay Button */}
              <TouchableOpacity
                style={[styles.payButton, loading && styles.payButtonDisabled]}
                onPress={handlePayNow}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.payButtonText}>
                    PAY ₹{totalAmount.toLocaleString('en-IN')} & UNLOCK LEADS
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.securityFooter}>
                <ShieldCheck size={12} color={THEME.colors.textMuted} />
                <Text style={styles.securityText}>256-Bit Encrypted ScrapBazaar Verified Merchant</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.backdrop,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorderHighlight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  orderCard: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  planName: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceBreakdown: {
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  priceValue: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
    marginVertical: 4,
  },
  totalLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: THEME.colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  methodTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: THEME.spacing.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: 8,
    gap: 12,
  },
  methodCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  methodDesc: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: THEME.colors.surfaceBorderHighlight,
  },
  radioActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primary,
  },
  payButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    gap: 6,
  },
  securityText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 12,
  },
  successTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  successSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
