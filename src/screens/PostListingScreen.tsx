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
import {
  Truck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Scale,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage, ScrapImageKey } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';
import { ListingType, MarketListing } from '../types';
import { ConflictWarningModal } from '../components/ConflictWarningModal';

interface PostListingScreenProps {
  navigation: any;
  route?: any;
}

export const PostListingScreen: React.FC<PostListingScreenProps> = ({ navigation, route }) => {
  const { addListing, validateListingCreation } = useScrapStore();

  const initialMode: ListingType = route?.params?.mode === 'BUY' ? 'BUY_RFQ' : 'SELL_OFFER';
  const [listingType, setListingType] = useState<ListingType>(initialMode);
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections
  const [selectedCatId, setSelectedCatId] = useState(SCRAP_CATEGORIES[0].id);
  const [selectedSubId, setSelectedSubId] = useState(SCRAP_CATEGORIES[0].subcategories[0]?.id);
  const [selectedImageKey, setSelectedImageKey] = useState<ScrapImageKey>(SCRAP_CATEGORIES[0].imageKey);

  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState<'kg' | 'quintal' | 'ton' | 'piece'>('kg');
  const [targetPrice, setTargetPrice] = useState('815');
  const [condition, setCondition] = useState<'SEGREGATED' | 'MIXED' | 'DISMANTLED' | 'RAW'>('SEGREGATED');
  const [notes, setNotes] = useState('');

  // Contact & Location
  const [userName, setUserName] = useState('Harish Chandra');
  const [businessName, setBusinessName] = useState('Chandra Metal Traders');
  const [userPhone, setUserPhone] = useState('+91 98102 33491');
  const [userType, setUserType] = useState<'SCRAP_GENERATOR' | 'RECYCLER_YARD' | 'SMELTER_FOUNDRY' | 'TRADER'>('TRADER');
  const [streetAddress, setStreetAddress] = useState('Plot 15, Mayapuri Industrial Phase 1');
  const [area, setArea] = useState('Mayapuri');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110064');
  const [preferredDate, setPreferredDate] = useState('Today');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('AFTERNOON');

  // Conflict Modal State
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictingListing, setConflictingListing] = useState<MarketListing | null>(null);

  // Success State
  const [createdListing, setCreatedListing] = useState<MarketListing | null>(null);

  const selectedCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCatId) || SCRAP_CATEGORIES[0];
  const selectedSub =
    selectedCategory.subcategories.find((s) => s.id === selectedSubId) ||
    selectedCategory.subcategories[0];

  const handleSelectSubcategory = (subId: string) => {
    setSelectedSubId(subId);
    const sub = selectedCategory.subcategories.find((s) => s.id === subId);
    if (sub) {
      setSelectedImageKey(sub.imageKey);
      setTargetPrice(String(listingType === 'SELL_OFFER' ? sub.lowestSellOffer : sub.highestBuyDemand));
    }
  };

  const handleSwitchType = (type: ListingType) => {
    setListingType(type);
    if (selectedSub) {
      setTargetPrice(String(type === 'SELL_OFFER' ? selectedSub.lowestSellOffer : selectedSub.highestBuyDemand));
    }
  };

  const calculateTotalVal = () => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(targetPrice) || 0;
    return Math.round(q * p);
  };

  const handleValidateAndProceedToStep2 = () => {
    // RUN STRICT ANTI-CONFLICT / ANTI-WASH TRADE CHECK
    const check = validateListingCreation(selectedSub?.id || selectedCatId, listingType);
    if (!check.allowed && check.conflictingListing) {
      setConflictingListing(check.conflictingListing);
      setConflictModalVisible(true);
      return;
    }

    setCurrentStep(2);
  };

  const handleSubmit = () => {
    // Final validation check before creation
    const check = validateListingCreation(selectedSub?.id || selectedCatId, listingType);
    if (!check.allowed && check.conflictingListing) {
      setConflictingListing(check.conflictingListing);
      setConflictModalVisible(true);
      return;
    }

    const masked =
      userPhone.length > 6 ? userPhone.slice(0, 8) + ' •••••' : '+91 98*** *****';

    const newListing = addListing({
      type: listingType,
      title: `${listingType === 'SELL_OFFER' ? 'AVAILABLE STOCK' : 'PURCHASE RFQ'}: ${
        selectedSub?.name || selectedCategory.name
      } (${quantity} ${unit})`,
      categoryId: selectedCatId,
      categoryName: selectedCategory.name,
      subcategoryId: selectedSub?.id || selectedCatId,
      subcategoryName: selectedSub?.name || selectedCategory.name,
      imageKey: selectedImageKey,
      quantity: parseFloat(quantity) || 1,
      unit,
      targetPrice: parseFloat(targetPrice) || 0,
      priceType: 'PER_UNIT',
      calculatedTotalValue: calculateTotalVal(),
      condition,
      address: {
        street: streetAddress,
        area,
        city,
        state: 'Delhi NCR',
        pincode,
      },
      user: {
        id: 'current_user',
        name: userName,
        businessName,
        phone: userPhone,
        maskedPhone: masked,
        isVerified: true,
        rating: 5.0,
        userType,
      },
      preferredSlot: {
        date: preferredDate,
        timeSlot: preferredTimeSlot,
      },
      urgent: true,
      notes,
    });

    setCreatedListing(newListing);
  };

  if (createdListing) {
    return (
      <View style={styles.container}>
        <Header title="Listing Broadcast Live" subtitle="Physical Commodity Order Live" />
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successCard}>
            <View style={styles.successCircle}>
              <CheckCircle2 size={48} color={THEME.colors.primary} />
            </View>

            <Text style={styles.successTitle}>
              {createdListing.type === 'SELL_OFFER' ? 'Stock Offer Published!' : 'Purchase RFQ Broadcasted!'}
            </Text>
            <Text style={styles.successSub}>
              {createdListing.type === 'SELL_OFFER'
                ? 'Your available scrap stock has been added to the national orderbook.'
                : 'Your purchase requirement has been broadcasted to verified scrap yards.'}
            </Text>

            <View style={styles.refIdBox}>
              <Text style={styles.refIdLabel}>ORDER REFERENCE ID</Text>
              <Text style={styles.refIdVal}>{createdListing.id}</Text>
            </View>

            <View style={styles.listingSummary}>
              <Image source={getScrapImage(createdListing.imageKey)} style={styles.summaryImg} resizeMode="cover" />
              <View style={styles.summaryDetails}>
                <Text style={styles.summaryTitle}>{createdListing.title}</Text>
                <Text style={styles.summaryPrice}>
                  Total Value: ₹{createdListing.calculatedTotalValue.toLocaleString('en-IN')} (₹{createdListing.targetPrice}/{createdListing.unit})
                </Text>
                <Text style={styles.summaryLoc}>📍 {createdListing.address.area}, {createdListing.address.city}</Text>
              </View>
            </View>

            <View style={styles.successActions}>
              <TouchableOpacity
                style={styles.viewInBookBtn}
                onPress={() => {
                  setCreatedListing(null);
                  navigation.navigate('Orderbook', {
                    initialTab: createdListing.type === 'SELL_OFFER' ? 'SELL_OFFERS' : 'BUY_RFQS',
                  });
                }}
              >
                <Text style={styles.viewInBookBtnText}>VIEW IN LIVE ORDERBOOK</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postAnotherBtn}
                onPress={() => {
                  setCreatedListing(null);
                  setCurrentStep(1);
                }}
              >
                <Text style={styles.postAnotherBtnText}>+ Create Another Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Post Scrap Deal"
        subtitle="Create Stock Offer or Purchase RFQ"
      />

      {/* Primary Deal Type Selector: SELL vs BUY */}
      <View style={styles.typeSelectorRow}>
        <TouchableOpacity
          style={[styles.typeBtn, listingType === 'SELL_OFFER' && styles.typeBtnActiveSell]}
          onPress={() => handleSwitchType('SELL_OFFER')}
        >
          <Truck size={16} color={listingType === 'SELL_OFFER' ? '#FFFFFF' : THEME.colors.textSecondary} />
          <Text style={[styles.typeBtnText, listingType === 'SELL_OFFER' && styles.typeBtnTextActive]}>
            I Have Stock (SELL)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeBtn, listingType === 'BUY_RFQ' && styles.typeBtnActiveBuy]}
          onPress={() => handleSwitchType('BUY_RFQ')}
        >
          <Building2 size={16} color={listingType === 'BUY_RFQ' ? '#0B1120' : THEME.colors.textSecondary} />
          <Text style={[styles.typeBtnText, listingType === 'BUY_RFQ' && styles.typeBtnTextActiveBuy]}>
            I Want to Buy (RFQ)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.stepPill,
              currentStep === s && styles.stepPillActive,
              currentStep > s && styles.stepPillDone,
            ]}
          >
            <Text style={[styles.stepPillText, (currentStep === s || currentStep > s) && styles.stepPillTextActive]}>
              {s === 1 ? '1. Material & Conflict Check' : s === 2 ? '2. Rate & Quantity' : '3. Location & Post'}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
        {/* STEP 1: MATERIAL & CONFLICT CHECK */}
        {currentStep === 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {listingType === 'SELL_OFFER' ? '1. Select Stock to Sell' : '1. Select Scrap Material to Buy (RFQ)'}
            </Text>
            <Text style={styles.cardSub}>
              Choose the exact commodity grade. Anti-conflict check will run automatically.
            </Text>

            {/* Category horizontal scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catChips}>
              {SCRAP_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCatId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, isSelected && styles.catCardSelected]}
                    onPress={() => {
                      setSelectedCatId(cat.id);
                      if (cat.subcategories.length > 0) {
                        setSelectedSubId(cat.subcategories[0].id);
                        setSelectedImageKey(cat.subcategories[0].imageKey);
                        setTargetPrice(
                          String(
                            listingType === 'SELL_OFFER'
                              ? cat.subcategories[0].lowestSellOffer
                              : cat.subcategories[0].highestBuyDemand
                          )
                        );
                      }
                    }}
                  >
                    <Image source={getScrapImage(cat.imageKey)} style={styles.catImg} resizeMode="cover" />
                    <Text style={[styles.catName, isSelected && styles.catNameActive]}>{cat.name}</Text>
                    <Text style={styles.catHindi}>{cat.hindiName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Subcategories list */}
            <Text style={styles.sectionLabel}>Select Specific Material Grade</Text>
            <View style={styles.subList}>
              {selectedCategory.subcategories.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.subItem, isSelected && styles.subItemSelected]}
                    onPress={() => handleSelectSubcategory(sub.id)}
                  >
                    <Image source={getScrapImage(sub.imageKey)} style={styles.subImg} resizeMode="cover" />
                    <View style={styles.subInfo}>
                      <Text style={styles.subName}>{sub.name}</Text>
                      <Text style={styles.subHindi}>{sub.hindiName}</Text>
                      <View style={styles.subPriceRow}>
                        <Text style={styles.subMandi}>Mandi: ₹{sub.mandiRate}/{sub.unit}</Text>
                        <Text style={styles.subSpread}>
                          {listingType === 'SELL_OFFER'
                            ? `Best Sell Ask: ₹${sub.lowestSellOffer}`
                            : `Top Buy Bid: ₹${sub.highestBuyDemand}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={handleValidateAndProceedToStep2}>
              <Text style={styles.nextBtnText}>VERIFY & CONTINUE TO PRICING</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: PRICING & QUANTITY */}
        {currentStep === 2 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>2. Target Price & Quantity</Text>
            <Text style={styles.cardSub}>Set your physical commodity order specifications</Text>

            {/* Quantity */}
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TextInput
                style={styles.mainInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="e.g. 100"
                placeholderTextColor={THEME.colors.textMuted}
              />
              <View style={styles.unitPills}>
                {(['kg', 'quintal', 'ton', 'piece'] as const).map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitPill, unit === u && styles.unitPillActive]}
                    onPress={() => setUnit(u)}
                  >
                    <Text style={[styles.unitPillText, unit === u && styles.unitPillTextActive]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target Price */}
            <Text style={styles.fieldLabel}>
              {listingType === 'SELL_OFFER' ? `Expected Selling Rate (₹/${unit})` : `Maximum Purchase Budget (₹/${unit})`}
            </Text>
            <View style={styles.currencyInputRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.currencyInput}
                value={targetPrice}
                onChangeText={setTargetPrice}
                keyboardType="numeric"
                placeholder="e.g. 815"
                placeholderTextColor={THEME.colors.textMuted}
              />
              <Text style={styles.unitSuffix}>/{unit}</Text>
            </View>

            {/* Estimated Order Total */}
            <View style={styles.totalBox}>
              <Text style={styles.totalLbl}>Total Physical Order Value</Text>
              <Text style={styles.totalVal}>₹{calculateTotalVal().toLocaleString('en-IN')}</Text>
            </View>

            {/* Condition */}
            <Text style={styles.fieldLabel}>Material Sorting Condition</Text>
            <View style={styles.conditionGrid}>
              {[
                { key: 'SEGREGATED', label: 'Segregated / Pure' },
                { key: 'MIXED', label: 'Mixed Scrap' },
                { key: 'DISMANTLED', label: 'Dismantled Lot' },
                { key: 'RAW', label: 'Raw Uncleaned' },
              ].map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.condBtn, condition === c.key && styles.condBtnActive]}
                  onPress={() => setCondition(c.key as any)}
                >
                  <Text style={[styles.condBtnText, condition === c.key && styles.condBtnTextActive]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation buttons */}
            <View style={styles.wizardBtnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentStep(1)}>
                <ChevronLeft size={16} color={THEME.colors.textSecondary} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtnFlex} onPress={() => setCurrentStep(3)}>
                <Text style={styles.nextBtnText}>CONTINUE TO LOCATION</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: LOCATION & SUBMIT */}
        {currentStep === 3 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>3. Yard Location & Contact</Text>
            <Text style={styles.cardSub}>Pickup / Delivery address for physical logistics</Text>

            <Text style={styles.fieldLabel}>Business / Yard Name</Text>
            <TextInput
              style={styles.textInput}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g. Chandra Metal Traders"
              placeholderTextColor={THEME.colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Contact Person</Text>
            <TextInput
              style={styles.textInput}
              value={userName}
              onChangeText={setUserName}
              placeholder="Your Full Name"
              placeholderTextColor={THEME.colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={userPhone}
              onChangeText={setUserPhone}
              keyboardType="phone-pad"
              placeholder="+91 98102 00000"
              placeholderTextColor={THEME.colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Yard / Warehouse Street Address</Text>
            <TextInput
              style={styles.textInput}
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="Plot No. 15, Gali 2"
              placeholderTextColor={THEME.colors.textMuted}
            />

            <View style={styles.grid2}>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="New Delhi"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Pincode</Text>
                <TextInput
                  style={styles.textInput}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  placeholder="110064"
                  placeholderTextColor={THEME.colors.textMuted}
                />
              </View>
            </View>

            {/* Notes */}
            <Text style={styles.fieldLabel}>Material Notes & Delivery Terms</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Weighing at certified weighbridge. Payment terms spot RTGS/Cash."
              placeholderTextColor={THEME.colors.textMuted}
              multiline
              numberOfLines={2}
            />

            <View style={styles.wizardBtnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentStep(2)}>
                <ChevronLeft size={16} color={THEME.colors.textSecondary} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>PUBLISH TO ORDERBOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Conflict Modal */}
      <ConflictWarningModal
        visible={conflictModalVisible}
        conflictingListing={conflictingListing}
        attemptedType={listingType}
        onClose={() => setConflictModalVisible(false)}
        onManageExisting={() => navigation.navigate('Plans & Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  typeBtnActiveSell: {
    backgroundColor: '#064E3B',
    borderColor: THEME.colors.primary,
  },
  typeBtnActiveBuy: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  typeBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  typeBtnTextActiveBuy: {
    color: '#0B1120',
  },
  stepRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 10,
    gap: 6,
  },
  stepPill: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  stepPillActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  stepPillDone: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primary,
  },
  stepPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  stepPillTextActive: {
    color: '#FFFFFF',
  },
  formScroll: {
    padding: THEME.spacing.lg,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  cardTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  cardSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  catChips: {
    gap: 8,
    paddingBottom: 8,
  },
  catCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 8,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  catCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  catImg: {
    width: 55,
    height: 55,
    borderRadius: 6,
    marginBottom: 4,
  },
  catName: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  catNameActive: {
    color: THEME.colors.primaryLight,
  },
  catHindi: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  sectionLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },
  subList: {
    gap: 8,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 10,
  },
  subItemSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  subImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  subInfo: {
    flex: 1,
  },
  subName: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  subHindi: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  subPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  subMandi: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  subSpread: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  nextBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  fieldLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mainInput: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  unitPills: {
    flexDirection: 'row',
    gap: 4,
  },
  unitPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  unitPillActive: {
    backgroundColor: THEME.colors.primarySoft,
    borderColor: THEME.colors.primary,
  },
  unitPillText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  unitPillTextActive: {
    color: THEME.colors.primaryLight,
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 10,
  },
  unitSuffix: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  totalBox: {
    backgroundColor: THEME.colors.primarySoft,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalLbl: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  totalVal: {
    color: THEME.colors.primaryLight,
    fontSize: 18,
    fontWeight: '900',
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  condBtn: {
    width: '48.5%',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  condBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primarySoft,
  },
  condBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  condBtnTextActive: {
    color: THEME.colors.primaryLight,
  },
  textInput: {
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCol: {
    flex: 1,
  },
  textArea: {
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    fontSize: 12,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    height: 60,
    textAlignVertical: 'top',
  },
  wizardBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  backBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  nextBtnFlex: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successContainer: {
    padding: THEME.spacing.lg,
  },
  successCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  successSub: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  refIdBox: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  refIdLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  refIdVal: {
    color: THEME.colors.primaryLight,
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  listingSummary: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    width: '100%',
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  summaryImg: {
    width: 55,
    height: 55,
    borderRadius: 6,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryPrice: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  summaryLoc: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  successActions: {
    width: '100%',
    gap: 10,
    marginTop: 14,
  },
  viewInBookBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  },
  viewInBookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  postAnotherBtn: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  postAnotherBtnText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
