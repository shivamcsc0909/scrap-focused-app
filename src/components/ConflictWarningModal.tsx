import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ShieldAlert, Scale, X, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { THEME } from '../theme';
import { MarketListing } from '../types';

interface ConflictWarningModalProps {
  visible: boolean;
  conflictingListing: MarketListing | null;
  attemptedType: 'SELL_OFFER' | 'BUY_RFQ';
  onClose: () => void;
  onManageExisting: () => void;
}

export const ConflictWarningModal: React.FC<ConflictWarningModalProps> = ({
  visible,
  conflictingListing,
  attemptedType,
  onClose,
  onManageExisting,
}) => {
  if (!conflictingListing) return null;

  const existingTypeLabel =
    conflictingListing.type === 'SELL_OFFER'
      ? 'Active Sell Offer (Stock Available)'
      : 'Active Buy Requirement (RFQ)';

  const attemptedTypeLabel =
    attemptedType === 'SELL_OFFER'
      ? 'Sell Offer'
      : 'Buy Requirement';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <ShieldAlert size={28} color={THEME.colors.warning} />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Anti-Conflict Policy Enforced</Text>
            <Text style={styles.subtitle}>
              Indian B2B Marketplace & Fair Trade Compliance Rule
            </Text>

            {/* Explanation Box */}
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                You already have an <Text style={styles.highlightText}>{existingTypeLabel}</Text> for{' '}
                <Text style={styles.boldText}>{conflictingListing.subcategoryName}</Text> (ID: {conflictingListing.id}).
              </Text>
              <Text style={[styles.noticeText, { marginTop: 8 }]}>
                To prevent <Text style={styles.boldText}>self-dealing, circular trading, and artificial market distortion</Text>, you cannot post a <Text style={styles.highlightText}>{attemptedTypeLabel}</Text> for the exact same scrap material at the same time.
              </Text>
            </View>

            {/* Existing Active Listing Preview */}
            <View style={styles.listingCard}>
              <View style={styles.listingHeader}>
                <Text style={styles.listingId}>{conflictingListing.id}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{conflictingListing.status}</Text>
                </View>
              </View>
              <Text style={styles.listingTitle}>{conflictingListing.title}</Text>
              <View style={styles.listingMeta}>
                <Text style={styles.listingQty}>
                  Qty: {conflictingListing.quantity} {conflictingListing.unit}
                </Text>
                <Text style={styles.listingPrice}>
                  Target Rate: ₹{conflictingListing.targetPrice}/{conflictingListing.unit}
                </Text>
              </View>
            </View>

            {/* What you can do */}
            <Text style={styles.optionsHeader}>What can you do instead?</Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletRow}>
                <CheckCircle2 size={14} color={THEME.colors.primary} />
                <Text style={styles.bulletText}>
                  Post a {attemptedTypeLabel} for a <Text style={styles.boldText}>different scrap material</Text> (e.g. Aluminium, Battery, Iron, Brass).
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <CheckCircle2 size={14} color={THEME.colors.primary} />
                <Text style={styles.bulletText}>
                  <Text style={styles.boldText}>Close or Cancel</Text> your existing {existingTypeLabel} before submitting this new one.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => {
                onClose();
                onManageExisting();
              }}
            >
              <Text style={styles.manageBtnText}>Manage Existing Listing</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
              <Text style={styles.dismissBtnText}>Choose Different Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    width: '100%',
    maxHeight: '85%',
    borderWidth: 1.5,
    borderColor: THEME.colors.warning,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.warningSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: THEME.colors.warning,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 12,
  },
  noticeBox: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: 12,
  },
  noticeText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  highlightText: {
    color: THEME.colors.warning,
    fontWeight: '800',
  },
  boldText: {
    color: THEME.colors.textPrimary,
    fontWeight: '800',
  },
  listingCard: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorderHighlight,
    marginBottom: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingId: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  listingTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  listingQty: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  listingPrice: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  optionsHeader: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  bulletList: {
    gap: 8,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  actionsRow: {
    gap: 8,
  },
  manageBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  manageBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  dismissBtn: {
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  dismissBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
});
