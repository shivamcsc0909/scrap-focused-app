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
  Alert,
} from 'react-native';
import { Bell, X, TrendingUp, TrendingDown, Check, Sparkles } from 'lucide-react-native';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';

interface PriceAlertModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ visible, onClose }) => {
  const { addPriceAlert } = useScrapStore();

  const [selectedCatId, setSelectedCatId] = useState(SCRAP_CATEGORIES[0].id);
  const [selectedSubId, setSelectedSubId] = useState(SCRAP_CATEGORIES[0].subcategories[0]?.id);
  const [alertType, setAlertType] = useState<'BUY_BELOW' | 'SELL_ABOVE'>('BUY_BELOW');
  const [targetPrice, setTargetPrice] = useState('800');

  const selectedCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCatId) || SCRAP_CATEGORIES[0];
  const selectedSub =
    selectedCategory.subcategories.find((s) => s.id === selectedSubId) ||
    selectedCategory.subcategories[0];

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    const cat = SCRAP_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubId(cat.subcategories[0].id);
      const benchmark = cat.subcategories[0].mandiRate;
      setTargetPrice(String(alertType === 'BUY_BELOW' ? Math.round(benchmark * 0.95) : Math.round(benchmark * 1.05)));
    }
  };

  const handleSelectSubcategory = (subId: string) => {
    setSelectedSubId(subId);
    const sub = selectedCategory.subcategories.find((s) => s.id === subId);
    if (sub) {
      setTargetPrice(String(alertType === 'BUY_BELOW' ? Math.round(sub.mandiRate * 0.95) : Math.round(sub.mandiRate * 1.05)));
    }
  };

  const handleSaveAlert = () => {
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Rate', 'Please enter a valid target price.');
      return;
    }

    addPriceAlert({
      materialId: selectedSub?.id || selectedCategory.id,
      materialName: selectedSub?.name || selectedCategory.name,
      imageKey: selectedSub?.imageKey || selectedCategory.imageKey,
      alertType,
      targetPrice: priceNum,
      currentPrice: selectedSub?.mandiRate || selectedCategory.typicalPricePerKg,
      unit: selectedSub?.unit || selectedCategory.defaultUnit,
    });

    Alert.alert(
      'Price Alert Activated! 🔔',
      `You will be notified immediately when ${selectedSub?.name} ${
        alertType === 'BUY_BELOW' ? 'drops below' : 'rises above'
      } ₹${priceNum}/${selectedSub?.unit || 'kg'}.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Bell size={18} color={THEME.colors.primary} />
              <Text style={styles.title}>Set Smart Price Target Alert</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subtitle}>
              "Buy Low, Sell High" — Get instant notification alerts when market quotes reach your target buying or selling price.
            </Text>

            {/* Alert Direction Toggle */}
            <Text style={styles.label}>Alert Objective</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, alertType === 'BUY_BELOW' && styles.toggleBtnActive]}
                onPress={() => {
                  setAlertType('BUY_BELOW');
                  if (selectedSub) setTargetPrice(String(Math.round(selectedSub.mandiRate * 0.95)));
                }}
              >
                <TrendingDown size={14} color={alertType === 'BUY_BELOW' ? THEME.colors.primaryLight : THEME.colors.textSecondary} />
                <Text style={[styles.toggleBtnText, alertType === 'BUY_BELOW' && styles.toggleBtnTextActive]}>
                  Buy Low (Price Drops Below)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleBtn, alertType === 'SELL_ABOVE' && styles.toggleBtnActiveGold]}
                onPress={() => {
                  setAlertType('SELL_ABOVE');
                  if (selectedSub) setTargetPrice(String(Math.round(selectedSub.mandiRate * 1.05)));
                }}
              >
                <TrendingUp size={14} color={alertType === 'SELL_ABOVE' ? THEME.colors.accent : THEME.colors.textSecondary} />
                <Text style={[styles.toggleBtnText, alertType === 'SELL_ABOVE' && styles.toggleBtnTextActiveGold]}>
                  Sell High (Price Rises Above)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <Text style={styles.label}>Select Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {SCRAP_CATEGORIES.map((cat) => {
                const isActive = cat.id === selectedCatId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, isActive && styles.catChipActive]}
                    onPress={() => handleSelectCategory(cat.id)}
                  >
                    <Image source={getScrapImage(cat.imageKey)} style={styles.chipImg} resizeMode="cover" />
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Subcategories Horizontal */}
            <Text style={styles.label}>Specific Scrap Material</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {selectedCategory.subcategories.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.subChip, isSelected && styles.subChipActive]}
                    onPress={() => handleSelectSubcategory(sub.id)}
                  >
                    <Image source={getScrapImage(sub.imageKey)} style={styles.subImg} resizeMode="cover" />
                    <View>
                      <Text style={styles.subChipText}>{sub.name}</Text>
                      <Text style={styles.subMandiRate}>Mandi: ₹{sub.mandiRate}/{sub.unit}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Current Price vs Target Input */}
            <View style={styles.priceMatrix}>
              <View style={styles.benchmarkBox}>
                <Text style={styles.benchmarkLabel}>Current Mandi Benchmark</Text>
                <Text style={styles.benchmarkVal}>
                  ₹{selectedSub?.mandiRate || selectedCategory.typicalPricePerKg}
                  <Text style={styles.unitText}>/{selectedSub?.unit || 'kg'}</Text>
                </Text>
              </View>

              <View style={styles.targetInputBox}>
                <Text style={styles.targetLabel}>
                  {alertType === 'BUY_BELOW' ? 'Target Buying Rate (₹)' : 'Target Selling Rate (₹)'}
                </Text>
                <View style={styles.currencyRow}>
                  <Text style={styles.currencySym}>₹</Text>
                  <TextInput
                    style={styles.targetInput}
                    value={targetPrice}
                    onChangeText={setTargetPrice}
                    keyboardType="numeric"
                    placeholder="e.g. 800"
                    placeholderTextColor={THEME.colors.textMuted}
                  />
                  <Text style={styles.targetUnit}>/{selectedSub?.unit || 'kg'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveAlertBtn} onPress={handleSaveAlert} activeOpacity={0.85}>
              <Sparkles size={16} color="#FFFFFF" />
              <Text style={styles.saveAlertBtnText}>ACTIVATE PRICE TARGET ALERT</Text>
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
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorderHighlight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
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
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 90,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  toggleBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  toggleBtnActiveGold: {
    borderColor: THEME.colors.accent,
    backgroundColor: THEME.colors.accentSoft,
  },
  toggleBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: THEME.colors.primaryLight,
  },
  toggleBtnTextActiveGold: {
    color: THEME.colors.accent,
  },
  chipsRow: {
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: 10,
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
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  chipText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
  },
  subChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    padding: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  subChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  subImg: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  subChipText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  subMandiRate: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  priceMatrix: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  benchmarkBox: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceCard,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    justifyContent: 'center',
  },
  benchmarkLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  benchmarkVal: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  unitText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  targetInputBox: {
    flex: 1.2,
    backgroundColor: THEME.colors.surfaceCard,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  targetLabel: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  currencySym: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 4,
  },
  targetInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    padding: 0,
  },
  targetUnit: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  saveAlertBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveAlertBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
