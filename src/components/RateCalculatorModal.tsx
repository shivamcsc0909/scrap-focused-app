import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { Calculator, X, Sparkles, TrendingUp } from 'lucide-react-native';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage } from '../constants/assets';

interface RateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMaterialForPost?: (category: string, subcategory: string, estPrice: number) => void;
}

export const RateCalculatorModal: React.FC<RateCalculatorModalProps> = ({
  visible,
  onClose,
  onSelectMaterialForPost,
}) => {
  const [selectedCatId, setSelectedCatId] = useState(SCRAP_CATEGORIES[0].id);
  const [selectedSubId, setSelectedSubId] = useState(SCRAP_CATEGORIES[0].subcategories[0]?.id);
  const [quantity, setQuantity] = useState('50');

  const selectedCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCatId) || SCRAP_CATEGORIES[0];
  const selectedSubcategory =
    selectedCategory.subcategories.find((s) => s.id === selectedSubId) ||
    selectedCategory.subcategories[0];

  const ratePerUnit = selectedSubcategory ? selectedSubcategory.mandiRate : selectedCategory.typicalPricePerKg;
  const numQty = parseFloat(quantity) || 0;
  const estimatedEarnings = Math.round(numQty * ratePerUnit);

  const handleCategorySelect = (catId: string) => {
    setSelectedCatId(catId);
    const cat = SCRAP_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubId(cat.subcategories[0].id);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.topHeader}>
            <View style={styles.calcBadge}>
              <Calculator size={15} color={THEME.colors.primary} />
              <Text style={styles.calcBadgeText}>LIVE MANDI PRICE ESTIMATOR</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.heading}>Calculate Your Scrap Value (कबाड़ की कीमत)</Text>
            <Text style={styles.subheading}>
              Check real-time mandi prices and calculate your payout instantly.
            </Text>

            {/* Estimated Total Card */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Estimated Payout Value</Text>
                <View style={styles.trendPill}>
                  <TrendingUp size={12} color={THEME.colors.primaryLight} />
                  <Text style={styles.trendText}>Live Rate</Text>
                </View>
              </View>
              <Text style={styles.resultValue}>₹{estimatedEarnings.toLocaleString('en-IN')}</Text>
              <Text style={styles.rateExplanation}>
                Based on current market rate of ₹{ratePerUnit} per {selectedSubcategory?.unit || 'kg'} for {selectedSubcategory?.name || selectedCategory.name}
              </Text>
            </View>

            {/* Quantity Input */}
            <Text style={styles.sectionLabel}>Enter Scrap Quantity ({selectedSubcategory?.unit || 'kg'})</Text>
            <View style={styles.qtyRow}>
              <TextInput
                style={styles.qtyInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="e.g. 50"
                placeholderTextColor={THEME.colors.textMuted}
              />
              <View style={styles.presetButtons}>
                {['10', '25', '50', '100', '500'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetBtn, quantity === preset && styles.presetBtnActive]}
                    onPress={() => setQuantity(preset)}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        quantity === preset && styles.presetBtnTextActive,
                      ]}
                    >
                      +{preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Chips Horizontal */}
            <Text style={styles.sectionLabel}>Select Scrap Material Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catChipsRow}>
              {SCRAP_CATEGORIES.map((cat) => {
                const isActive = cat.id === selectedCatId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, isActive && styles.catChipActive]}
                    onPress={() => handleCategorySelect(cat.id)}
                    activeOpacity={0.8}
                  >
                    <Image source={getScrapImage(cat.imageKey)} style={styles.chipImg} resizeMode="cover" />
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Subcategories Grid */}
            <Text style={styles.sectionLabel}>Select Specific Scrap Item</Text>
            <View style={styles.subGrid}>
              {selectedCategory.subcategories.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.subCard, isSelected && styles.subCardSelected]}
                    onPress={() => setSelectedSubId(sub.id)}
                    activeOpacity={0.8}
                  >
                    <Image source={getScrapImage(sub.imageKey)} style={styles.subCardImg} resizeMode="cover" />
                    <View style={styles.subCardInfo}>
                      <Text style={styles.subCardName} numberOfLines={1}>{sub.name}</Text>
                      <Text style={styles.subCardHindi} numberOfLines={1}>{sub.hindiName}</Text>
                      <View style={styles.subCardRateRow}>
                        <Text style={styles.subCardRate}>₹{sub.mandiRate}/{sub.unit}</Text>
                        <Text
                          style={[
                            styles.subCardChange,
                            { color: sub.rateChangeToday >= 0 ? THEME.colors.primaryLight : THEME.colors.error },
                          ]}
                        >
                          {sub.rateChangeToday >= 0 ? `+₹${sub.rateChangeToday}` : `-₹${Math.abs(sub.rateChangeToday)}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action CTA */}
          <View style={styles.footerBar}>
            <TouchableOpacity
              style={styles.postNowBtn}
              onPress={() => {
                if (onSelectMaterialForPost) {
                  onSelectMaterialForPost(selectedCategory.name, selectedSubcategory?.name || '', estimatedEarnings);
                }
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Sparkles size={16} color="#FFFFFF" />
              <Text style={styles.postNowBtnText}>SCHEDULE PICKUP FOR ₹{estimatedEarnings.toLocaleString('en-IN')}</Text>
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
    paddingBottom: THEME.spacing.sm,
  },
  calcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  calcBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 90,
  },
  heading: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  subheading: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: THEME.spacing.md,
  },
  resultCard: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  trendText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  resultValue: {
    color: THEME.colors.primaryLight,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  rateExplanation: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  sectionLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  qtyRow: {
    marginBottom: THEME.spacing.md,
  },
  qtyInput: {
    backgroundColor: THEME.colors.surfaceCard,
    color: THEME.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: 8,
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  presetBtnActive: {
    backgroundColor: THEME.colors.primarySoft,
    borderColor: THEME.colors.primary,
  },
  presetBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  presetBtnTextActive: {
    color: THEME.colors.primaryLight,
  },
  catChipsRow: {
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  catChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  chipImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  chipText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
  },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subCard: {
    width: '48.5%',
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  subCardImg: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.sm,
  },
  subCardInfo: {
    flex: 1,
  },
  subCardName: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  subCardHindi: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  subCardRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  subCardRate: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  subCardChange: {
    fontSize: 9,
    fontWeight: '700',
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  postNowBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  postNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
