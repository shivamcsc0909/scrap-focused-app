import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Handshake, X, Send } from 'lucide-react-native';
import { THEME } from '../theme';

interface NegotiationModalProps {
  visible: boolean;
  listingTitle: string;
  defaultPrice: number;
  defaultQuantity: number;
  defaultUnit: string;
  onClose: () => void;
  onSubmitOffer: (price: number, quantity: number, notes: string) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  visible,
  listingTitle,
  defaultPrice,
  defaultQuantity,
  defaultUnit,
  onClose,
  onSubmitOffer,
}) => {
  const [offerPrice, setOfferPrice] = useState(String(defaultPrice || '800'));
  const [offerQuantity, setOfferQuantity] = useState(String(defaultQuantity || '100'));
  const [notes, setNotes] = useState('');

  const numPrice = parseFloat(offerPrice) || 0;
  const numQty = parseFloat(offerQuantity) || 0;
  const totalOfferVal = Math.round(numPrice * numQty);

  const handleSend = () => {
    if (numPrice <= 0 || numQty <= 0) {
      Alert.alert('Invalid Offer', 'Please enter a valid price and quantity.');
      return;
    }
    onSubmitOffer(numPrice, numQty, notes);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Handshake size={20} color={THEME.colors.primary} />
              <Text style={styles.title}>Send Counter-Offer</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.listingTitle} numberOfLines={1}>{listingTitle}</Text>

          {/* Inputs */}
          <View style={styles.grid2}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Proposed Rate (₹/{defaultUnit})</Text>
              <TextInput
                style={styles.input}
                value={offerPrice}
                onChangeText={setOfferPrice}
                keyboardType="numeric"
                placeholder="e.g. 810"
                placeholderTextColor={THEME.colors.textMuted}
              />
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.label}>Quantity ({defaultUnit})</Text>
              <TextInput
                style={styles.input}
                value={offerQuantity}
                onChangeText={setOfferQuantity}
                keyboardType="numeric"
                placeholder="e.g. 100"
                placeholderTextColor={THEME.colors.textMuted}
              />
            </View>
          </View>

          {/* Total Value Banner */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Proposed Deal Value</Text>
            <Text style={styles.totalVal}>₹{totalOfferVal.toLocaleString('en-IN')}</Text>
          </View>

          {/* Message Note */}
          <Text style={styles.label}>Negotiation Note / Terms (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Spot cash payment on digital weighbridge inspection."
            placeholderTextColor={THEME.colors.textMuted}
            multiline
            numberOfLines={2}
          />

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSend} activeOpacity={0.85}>
            <Send size={16} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>SEND COUNTER-OFFER</Text>
          </TouchableOpacity>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorderHighlight,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  listingTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  gridCol: {
    flex: 1,
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: THEME.colors.surfaceCard,
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  totalBox: {
    backgroundColor: THEME.colors.primarySoft,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    marginVertical: 4,
  },
  totalLabel: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  totalVal: {
    color: THEME.colors.primaryLight,
    fontSize: 18,
    fontWeight: '900',
  },
  noteInput: {
    backgroundColor: THEME.colors.surfaceCard,
    color: THEME.colors.textPrimary,
    fontSize: 12,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    height: 55,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
