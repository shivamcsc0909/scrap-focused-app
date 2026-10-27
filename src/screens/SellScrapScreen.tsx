import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Scale,
  Camera,
  CheckCircle2,
  MapPin,
  PlusSquare,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { SAHI_CATEGORIES, ScrapCategoryItem } from '../constants/scrapData';
import { CategoryMultiImageSlider } from "../components/CategoryMultiImageSlider";
import { UI_IMAGES } from "../constants/assets";

import { NewCategoryRequestModal } from './NewCategoryRequestModal';

interface Props {
  navigation: any;
  route?: any;
}

export const SellScrapScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { language, user, addSellListing } = useSahiStore();
  const t = TRANSLATIONS[language];

  // Pre-selected category if opened from home card
  const initialCatId = route?.params?.categoryId || 'iron-steel';
  const [selectedCat, setSelectedCat] = useState<ScrapCategoryItem>(
    SAHI_CATEGORIES.find((c) => c.id === initialCatId) || SAHI_CATEGORIES[0]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [rate, setRate] = useState(selectedCat.indicativeSellRate.toString());
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'ton'>(selectedCat.defaultUnit);
  const [condition, setCondition] = useState<'CLEAN' | 'MIXED' | 'HEAVY'>('CLEAN');
  const [city, setCity] = useState(user.city || '');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [newCatModalVisible, setNewCatModalVisible] = useState(false);
  const [successSubmittedId, setSuccessSubmittedId] = useState<string | null>(null);

  const handleSelectCategory = (cat: ScrapCategoryItem) => {
    setSelectedCat(cat);
    setRate(cat.indicativeSellRate.toString());
    setUnit(cat.defaultUnit);
    setShowCategoryPicker(false);
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      // In case permissions/simulator fails, set mock image placeholder
      setImageUri('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop');
    }
  };

  const handleSubmit = () => {
    const numQty = parseFloat(quantity);
    const numRate = parseFloat(rate);

    if (!quantity || isNaN(numQty) || numQty <= 0) {
      Alert.alert(
        language === 'hi' ? 'मात्रा भरें' : 'Required',
        language === 'hi' ? 'कृपया स्क्रैप की मात्रा (वजन) दर्ज करें।' : 'Please enter the scrap quantity.'
      );
      return;
    }

    if (!rate || isNaN(numRate) || numRate <= 0) {
      Alert.alert(
        language === 'hi' ? 'भाव भरें' : 'Required',
        language === 'hi' ? 'कृपया अपना अपेक्षित भाव दर्ज करें।' : 'Please enter your expected rate.'
      );
      return;
    }

    const created = addSellListing({
      categoryId: selectedCat.id,
      categoryName: selectedCat.nameEn,
      categoryNameHi: selectedCat.nameHi,
      expectedPrice: numRate,
      unit,
      quantity: numQty,
      city: city || 'Local Yard',
      imageUri: imageUri || undefined,
      notes: notes || undefined,
    });

    setSuccessSubmittedId(created.id);
  };

  const handleReset = () => {
    setSuccessSubmittedId(null);
    setQuantity('');
    setImageUri(null);
    setNotes('');
  };

  const filteredCategories = SAHI_CATEGORIES.filter((c) =>
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameHi.includes(searchQuery)
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>{t.sellScreenTitle}</Text>
          <Text style={styles.screenSub}>{t.sellScreenSub}</Text>
        </View>
        <TouchableOpacity
          style={styles.newCatPromptBtn}
          onPress={() => setNewCatModalVisible(true)}
        >
          <PlusSquare size={16} color={THEME.colors.primary} />
          <Text style={styles.newCatPromptText}>+ नई कैटेगरी</Text>
        </TouchableOpacity>
      </View>

      {successSubmittedId ? (
        <View style={styles.successContainer}>
          <Image source={UI_IMAGES.listingSuccess} style={{ width: 90, height: 90 }} resizeMode="contain" />
          <Text style={styles.successTitle}>{t.sellSuccessTitle}</Text>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>ID: #{successSubmittedId}</Text>
          </View>
          <Text style={styles.successMsg}>{t.sellSuccessMsg}</Text>

          <View style={styles.successActions}>
            <TouchableOpacity
              style={styles.viewStatusBtn}
              onPress={() => {
                handleReset();
                navigation.navigate('Track');
              }}
            >
              <Text style={styles.viewStatusBtnText}>{t.trackOrdersTitle} →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.anotherListingBtn} onPress={handleReset}>
              <Text style={styles.anotherListingBtnText}>+ दूसरा स्क्रैप बेचें</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Select Category */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>{t.selectCategory} *</Text>
            <TouchableOpacity
              style={styles.categoryDropdown}
              activeOpacity={0.8}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <View style={styles.catLeft}>
                <CategoryMultiImageSlider categoryId={selectedCat.id} size={42} />
                <View>
                  <Text style={styles.selectedCatName}>
                    {language === 'hi' ? selectedCat.nameHi : selectedCat.nameEn}
                  </Text>
                  <Text style={styles.selectedCatHint}>
                    {language === 'hi' ? 'बदलने के लिए यहाँ दबाएँ' : 'Tap to change category'}
                  </Text>
                </View>
              </View>
              <View style={styles.benchPill}>
                <Text style={styles.benchPillText}>₹{selectedCat.indicativeSellRate}/{selectedCat.defaultUnit}</Text>
              </View>
            </TouchableOpacity>

            {/* Collapsible Category List */}
            {showCategoryPicker && (
              <View style={styles.pickerBox}>
                <View style={styles.searchInside}>
                  <Search size={16} color="#64748B" />
                  <TextInput
                    style={styles.searchInsideInput}
                    placeholder={t.searchCategoryPlaceholder}
                    placeholderTextColor="#475569"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
                  {filteredCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.pickerItem,
                        selectedCat.id === cat.id && styles.pickerItemActive,
                      ]}
                      onPress={() => handleSelectCategory(cat)}
                    >
                      <Text style={styles.pickerItemText}>
                        {language === 'hi' ? cat.nameHi : cat.nameEn}
                      </Text>
                      <Text style={styles.pickerItemPrice}>₹{cat.indicativeSellRate}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Step 2: Rate & Quantity */}
          <View style={styles.row}>
            {/* Expected Rate */}
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.sectionLabel}>{t.expectedRate} *</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.inputField}
                  keyboardType="numeric"
                  placeholder={t.ratePlaceholder}
                  placeholderTextColor="#475569"
                  value={rate}
                  onChangeText={setRate}
                />
              </View>
            </View>

            {/* Quantity */}
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.sectionLabel}>{t.quantity} *</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputField}
                  keyboardType="numeric"
                  placeholder={t.qtyPlaceholder}
                  placeholderTextColor="#475569"
                  value={quantity}
                  onChangeText={setQuantity}
                />
                <View style={styles.unitToggle}>
                  <TouchableOpacity
                    style={[styles.unitBtn, unit === 'kg' && styles.unitBtnActive]}
                    onPress={() => setUnit('kg')}
                  >
                    <Text style={[styles.unitBtnText, unit === 'kg' && styles.unitBtnTextActive]}>
                      Kg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.unitBtn, unit === 'ton' && styles.unitBtnActive]}
                    onPress={() => setUnit('ton')}
                  >
                    <Text style={[styles.unitBtnText, unit === 'ton' && styles.unitBtnTextActive]}>
                      Ton
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Step 3: Scrap Condition */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>{t.scrapCondition}</Text>
            <View style={styles.conditionRow}>
              {[
                { key: 'CLEAN', label: t.conditionClean },
                { key: 'MIXED', label: t.conditionMixed },
                { key: 'HEAVY', label: t.conditionIndustrial },
              ].map((cond) => (
                <TouchableOpacity
                  key={cond.key}
                  style={[
                    styles.condChip,
                    condition === cond.key && styles.condChipActive,
                  ]}
                  onPress={() => setCondition(cond.key as any)}
                >
                  <Text
                    style={[
                      styles.condText,
                      condition === cond.key && styles.condTextActive,
                    ]}
                  >
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Step 4: Optional Photo Upload */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>{t.addPhotos}</Text>
            <Text style={styles.sectionHint}>{t.addPhotosSub}</Text>

            {imageUri ? (
              <View style={styles.imagePreviewBox}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={handlePickImage}
                >
                  <Text style={styles.changeImageText}>बदलें (Change)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                activeOpacity={0.8}
                onPress={handlePickImage}
              >
                <Camera size={26} color={THEME.colors.primary} />
                <Text style={styles.uploadText}>{t.pickPhotoBtn}</Text>
                <Text style={styles.uploadOptional}>
                  {language === 'hi' ? '(वैकल्पिक - फोटो न हो तो भी बेच सकते हैं)' : '(Optional)'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Step 5: Pickup Location & City */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>{t.pickupCity}</Text>
            <View style={styles.inputWrap}>
              <MapPin size={18} color="#64748B" />
              <TextInput
                style={styles.inputField}
                placeholder={t.cityPlaceholder}
                placeholderTextColor="#475569"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <LinearGradient
              colors={[THEME.colors.primary, THEME.colors.primaryDark]}
              style={styles.submitBtnGradient}
            >
              <Text style={styles.submitBtnText}>{t.submitSellListing}</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* New Category Modal */}
      <NewCategoryRequestModal
        visible={newCatModalVisible}
        onClose={() => setNewCatModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070D18',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#070D18',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  screenSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  newCatPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C2E',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  newCatPromptText: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionHint: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 8,
  },
  categoryDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111C2E',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCatName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  selectedCatHint: {
    color: '#64748B',
    fontSize: 11,
  },
  benchPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benchPillText: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  pickerBox: {
    backgroundColor: '#131D31',
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
  },
  searchInside: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
    marginBottom: 8,
  },
  searchInsideInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  pickerItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
  },
  pickerItemText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  pickerItemPrice: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  currencyPrefix: {
    color: THEME.colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  inputField: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 2,
  },
  unitBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  unitBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  condChip: {
    flex: 1,
    backgroundColor: '#111C2E',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  condChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  condText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  condTextActive: {
    color: '#FFFFFF',
  },
  uploadBox: {
    backgroundColor: '#111C2E',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#334155',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  uploadText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  uploadOptional: {
    color: '#64748B',
    fontSize: 11,
  },
  imagePreviewBox: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    height: 140,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  changeImageBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  submitBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 14,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  orderIdBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  orderIdText: {
    color: THEME.colors.primaryLight,
    fontSize: 14,
    fontWeight: '800',
  },
  successMsg: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  successActions: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  viewStatusBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewStatusBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  anotherListingBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  anotherListingBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
