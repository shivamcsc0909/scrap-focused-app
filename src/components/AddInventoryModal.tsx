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
import { PackagePlus, X, Check } from 'lucide-react-native';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage, ScrapImageKey } from '../constants/assets';
import { InventoryStatus } from '../types';
import { useScrapStore } from '../store/useScrapStore';

interface AddInventoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  visible,
  onClose,
}) => {
  const { addInventoryItem } = useScrapStore();

  const [selectedCatId, setSelectedCatId] = useState(SCRAP_CATEGORIES[0].id);
  const [itemName, setItemName] = useState('Pure Copper Winding Wire Lot');
  const [selectedImageKey, setSelectedImageKey] = useState<ScrapImageKey>('copper');
  const [quantityKg, setQuantityKg] = useState('250');
  const [buyPrice, setBuyPrice] = useState('780');
  const [targetSellPrice, setTargetSellPrice] = useState('830');
  const [warehouseLocation, setWarehouseLocation] = useState('Yard Bay 1 - Section A');
  const [status, setStatus] = useState<InventoryStatus>('IN_STOCK');
  const [notes, setNotes] = useState('');

  const selectedCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCatId) || SCRAP_CATEGORIES[0];

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    const cat = SCRAP_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setSelectedImageKey(cat.imageKey);
      if (cat.subcategories.length > 0) {
        setItemName(`${cat.subcategories[0].name} Lot`);
        setBuyPrice(String(Math.round(cat.subcategories[0].mandiRate * 0.95)));
        setTargetSellPrice(String(Math.round(cat.subcategories[0].mandiRate * 1.05)));
      }
    }
  };

  const handleSave = () => {
    if (!itemName || !quantityKg || !buyPrice || !targetSellPrice) {
      Alert.alert('Required Fields', 'Please fill in all inventory item details');
      return;
    }

    addInventoryItem({
      name: itemName,
      categoryId: selectedCatId,
      imageKey: selectedImageKey,
      quantityKg: parseFloat(quantityKg) || 0,
      buyPricePerKg: parseFloat(buyPrice) || 0,
      currentMandiRate: parseFloat(buyPrice) * 1.04,
      targetSellPricePerKg: parseFloat(targetSellPrice) || 0,
      warehouseLocation: warehouseLocation || 'Main Scrap Yard',
      status,
      notes,
    });

    Alert.alert('Added to Stock', `${itemName} (${quantityKg} kg) added to warehouse inventory.`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Top Header */}
          <View style={styles.topHeader}>
            <View style={styles.headerTitleRow}>
              <PackagePlus size={18} color={THEME.colors.primary} />
              <Text style={styles.headerTitle}>Add Scrap Inventory Stock</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Category Selector */}
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
                    <Image source={getScrapImage(cat.imageKey)} style={styles.chipImage} resizeMode="cover" />
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Subcategory Presets */}
            <Text style={styles.label}>Material Thumbnail & Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subThumbRow}>
              {selectedCategory.subcategories.map((sub) => {
                const isSelected = selectedImageKey === sub.imageKey;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.thumbCard, isSelected && styles.thumbCardSelected]}
                    onPress={() => {
                      setSelectedImageKey(sub.imageKey);
                      setItemName(`${sub.name} Lot`);
                      setBuyPrice(String(Math.round(sub.mandiRate * 0.95)));
                      setTargetSellPrice(String(Math.round(sub.mandiRate * 1.05)));
                    }}
                  >
                    <Image source={getScrapImage(sub.imageKey)} style={styles.thumbImage} resizeMode="cover" />
                    <Text style={styles.thumbName} numberOfLines={1}>{sub.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Item Title Input */}
            <Text style={styles.label}>Batch / Item Name</Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g. Copper Armature Wire Lot"
              placeholderTextColor={THEME.colors.textMuted}
            />

            {/* Quantity and Prices */}
            <View style={styles.grid2}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Stock Quantity (Kg)</Text>
                <TextInput
                  style={styles.input}
                  value={quantityKg}
                  onChangeText={setQuantityKg}
                  keyboardType="numeric"
                  placeholder="e.g. 250"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Purchase Cost (₹/Kg)</Text>
                <TextInput
                  style={styles.input}
                  value={buyPrice}
                  onChangeText={setBuyPrice}
                  keyboardType="numeric"
                  placeholder="e.g. 780"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.grid2}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Target Sell Rate (₹/Kg)</Text>
                <TextInput
                  style={styles.input}
                  value={targetSellPrice}
                  onChangeText={setTargetSellPrice}
                  keyboardType="numeric"
                  placeholder="e.g. 830"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Warehouse Location</Text>
                <TextInput
                  style={styles.input}
                  value={warehouseLocation}
                  onChangeText={setWarehouseLocation}
                  placeholder="e.g. Yard Bay 1"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
            </View>

            {/* Status Selector */}
            <Text style={styles.label}>Initial Inventory Status</Text>
            <View style={styles.statusRow}>
              {(['IN_STOCK', 'RESERVED', 'BLOCKED'] as InventoryStatus[]).map((s) => {
                const isActive = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusBtn, isActive && styles.statusBtnActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.statusBtnText, isActive && styles.statusBtnTextActive]}>
                      {s.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notes */}
            <Text style={styles.label}>Batch Notes / Inspection Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Clean segregated material ready for smelting foundry."
              placeholderTextColor={THEME.colors.textMuted}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.footerBar}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>SAVE TO WAREHOUSE INVENTORY</Text>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
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
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 12,
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
  chipImage: {
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
  subThumbRow: {
    gap: 8,
  },
  thumbCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.md,
    padding: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    width: 80,
  },
  thumbCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  thumbImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginBottom: 4,
  },
  thumbName: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    backgroundColor: THEME.colors.surfaceCard,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCol: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  statusBtnActive: {
    backgroundColor: THEME.colors.primarySoft,
    borderColor: THEME.colors.primary,
  },
  statusBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBtnTextActive: {
    color: THEME.colors.primaryLight,
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
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
