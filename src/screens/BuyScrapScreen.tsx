import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShoppingBag,
  PhoneCall,
  Scale,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { SAHI_CATEGORIES, ScrapCategoryItem } from '../constants/scrapData';
import { CategoryMultiImageSlider } from "../components/CategoryMultiImageSlider";
import { UI_IMAGES, getScrapImage } from "../constants/assets";
import { Image } from "react-native";


interface Props {
  navigation: any;
}

export const BuyScrapScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, user, addBuyInquiry } = useSahiStore();
  const t = TRANSLATIONS[language];

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inquiry Modal State
  const [modalItem, setModalItem] = useState<ScrapCategoryItem | null>(null);
  const [reqQuantity, setReqQuantity] = useState('');
  const [deliveryCity, setDeliveryCity] = useState(user.city || '');
  const [targetRate, setTargetRate] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleOpenInquiry = (cat: ScrapCategoryItem) => {
    setModalItem(cat);
    setTargetRate(cat.indicativeBuyRate.toString());
    setReqQuantity('');
    setSuccessId(null);
  };

  const handleCloseModal = () => {
    setModalItem(null);
    setSuccessId(null);
  };

  const handleSubmitInquiry = () => {
    if (!modalItem) return;
    const numQty = parseFloat(reqQuantity);

    if (!reqQuantity || isNaN(numQty) || numQty <= 0) {
      Alert.alert(
        language === 'hi' ? 'मात्रा भरें' : 'Required',
        language === 'hi' ? 'कृपया आवश्यक मात्रा (वजन) दर्ज करें।' : 'Please enter the required quantity.'
      );
      return;
    }

    const created = addBuyInquiry({
      categoryId: modalItem.id,
      categoryName: modalItem.nameEn,
      categoryNameHi: modalItem.nameHi,
      requestedQuantity: numQty,
      unit: modalItem.defaultUnit,
      offeredPrice: parseFloat(targetRate) || modalItem.indicativeBuyRate,
      city: deliveryCity || 'Plant Site',
      notes: inquiryNotes.trim() || undefined,
    });

    setSuccessId(created.id);
  };

  const filteredCategories = SAHI_CATEGORIES.filter((c) => {
    const matchesFilter = selectedFilter === 'ALL' || c.id === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.nameEn.toLowerCase().includes(q) ||
      c.nameHi.includes(q) ||
      c.descriptionEn.toLowerCase().includes(q) ||
      c.descriptionHi.includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>{t.buyScreenTitle}</Text>
          <Text style={styles.screenSub}>{t.buyScreenSub}</Text>
        </View>
        <TouchableOpacity
          style={styles.directCallBtn}
          onPress={() => Alert.alert('Helpline', 'Call our desk at: +91 98765 43210')}
        >
          <PhoneCall size={16} color="#FFFFFF" />
          <Text style={styles.directCallText}>{t.callNow}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchCategoryPlaceholder}
            placeholderTextColor="#475569"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filterScrollWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('ALL')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'ALL' && styles.filterChipTextActive]}>
              {t.filterAll}
            </Text>
          </TouchableOpacity>
          {SAHI_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, selectedFilter === cat.id && styles.filterChipActive]}
              onPress={() => setSelectedFilter(cat.id)}
            >
              <Text style={[styles.filterChipText, selectedFilter === cat.id && styles.filterChipTextActive]}>
                {language === 'hi' ? cat.nameHi : cat.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Inventory Stock Cards List */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stockList}>
          {filteredCategories.map((item) => (
            <View key={item.id} style={styles.stockCard}>
              {/* Full width rectangular image with 0 inner padding */}
              <View style={styles.stockImageWrap}>
                <CategoryMultiImageSlider categoryId={item.id} fullWidth height={160} borderRadius={4} />
                <View style={styles.stockRateBadge}>
                  <Text style={styles.stockRateValue}>₹{item.indicativeBuyRate}/{item.defaultUnit}</Text>
                </View>
              </View>

              <View style={styles.stockCardBody}>
                <View style={styles.stockHeaderRow}>
                  <Text style={styles.stockTitle}>
                    {language === 'hi' ? item.nameHi : item.nameEn}
                  </Text>
                  <View style={styles.stockQtyBadge}>
                    <Text style={styles.stockQtyText}>
                      📦 {t.inStock}: {item.companyStockQty.toLocaleString('en-IN')}{' '}
                      {item.defaultUnit === 'kg' ? (language === 'hi' ? 'किग्रा' : 'Kg') : (language === 'hi' ? 'टन' : 'Ton')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.stockSub} numberOfLines={2}>
                  {language === 'hi' ? item.descriptionHi : item.descriptionEn}
                </Text>

                {/* Subtypes */}
                <View style={styles.subtypesRow}>
                  {(language === 'hi' ? item.subtypesHi : item.subtypesEn).slice(0, 3).map((sub, i) => (
                    <View key={i} style={styles.subtypeBadge}>
                      <Text style={styles.subtypeBadgeText}>{sub}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.requestBuyBtn}
                  activeOpacity={0.85}
                  onPress={() => handleOpenInquiry(item)}
                >
                  <LinearGradient
                    colors={[THEME.colors.primary, THEME.colors.primaryDark]}
                    style={styles.btnGradient}
                  >
                    <ShoppingBag size={18} color="#FFFFFF" />
                    <Text style={styles.requestBuyText}>{t.requestQuoteBtn}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Buy Inquiry Modal */}
      {modalItem && (
        <Modal visible={true} transparent animationType="slide" onRequestClose={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{t.buyModalTitle}</Text>
                  <Text style={styles.modalSub}>
                    {language === 'hi' ? modalItem.nameHi : modalItem.nameEn}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseBtn}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {successId ? (
                <View style={styles.modalSuccessBox}>
                  <Image source={UI_IMAGES.listingSuccess} style={{ width: 80, height: 80, marginBottom: 8 }} resizeMode="contain" />
                  <Text style={styles.modalSuccessTitle}>{t.buySuccessTitle}</Text>
                  <View style={styles.inquiryBadge}>
                    <Text style={styles.inquiryBadgeText}>Inquiry #{successId}</Text>
                  </View>
                  <Text style={styles.modalSuccessMsg}>{t.buySuccessMsg}</Text>

                  <TouchableOpacity
                    style={styles.modalDoneBtn}
                    onPress={() => {
                      handleCloseModal();
                      navigation.navigate('Track');
                    }}
                  >
                    <Text style={styles.modalDoneBtnText}>{t.trackOrdersTitle} →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalFormScroll}>
                  {/* Call Notice Highlight with 3D Illustration */}
                  <View style={styles.callNoticeCard}>
                    <Image source={UI_IMAGES.callDeal} style={{ width: 44, height: 44, borderRadius: 8 }} resizeMode="contain" />
                    <Text style={styles.callNoticeText}>{t.callNotice}</Text>
                  </View>

                  {/* Required Quantity */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {t.requiredQty} ({modalItem.defaultUnit.toUpperCase()}) *
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="उदा. 1500"
                      placeholderTextColor="#475569"
                      value={reqQuantity}
                      onChangeText={setReqQuantity}
                    />
                  </View>

                  {/* Expected Rate */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.targetBudgetRate}</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="उदा. 770"
                      placeholderTextColor="#475569"
                      value={targetRate}
                      onChangeText={setTargetRate}
                    />
                  </View>

                  {/* Delivery Location */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.deliveryCity}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t.cityPlaceholder}
                      placeholderTextColor="#475569"
                      value={deliveryCity}
                      onChangeText={setDeliveryCity}
                    />
                  </View>

                  {/* Additional Remarks */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.additionalNotes}</Text>
                    <TextInput
                      style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
                      placeholder="कोई विशेष ग्रेड, साइज या डिलीवरी समय..."
                      placeholderTextColor="#475569"
                      multiline
                      value={inquiryNotes}
                      onChangeText={setInquiryNotes}
                    />
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.submitInquiryBtn}
                    activeOpacity={0.85}
                    onPress={handleSubmitInquiry}
                  >
                    <LinearGradient
                      colors={[THEME.colors.primary, THEME.colors.primaryDark]}
                      style={styles.submitInquiryGradient}
                    >
                      <PhoneCall size={18} color="#FFFFFF" />
                      <Text style={styles.submitInquiryText}>{t.submitBuyRequest}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      )}
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
  directCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  directCallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C2E',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
  },
  filterScrollWrap: {
    paddingVertical: 8,
  },
  filterBar: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#111C2E',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  filterChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 40,
  },
  stockList: {
    gap: 12,
  },
  stockCard: {
    backgroundColor: '#0D1524',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  stockImageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: '#060B13',
    position: 'relative',
    padding: 0,
  },
  stockRateBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stockRateValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  stockCardBody: {
    padding: 14,
    gap: 8,
  },
  stockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  stockTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
    flex: 1,
  },
  stockQtyBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockQtyText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
  },
  stockSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  subtypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  subtypeBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  subtypeBadgeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  requestBuyBtn: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  requestBuyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalFormScroll: {
    paddingTop: 14,
  },
  callNoticeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  callNoticeText: {
    color: '#FDE68A',
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#131D31',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    height: 46,
    color: '#F8FAFC',
    fontSize: 14,
  },
  submitInquiryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  submitInquiryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitInquiryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalSuccessBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  modalSuccessTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  inquiryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  inquiryBadgeText: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
    fontSize: 13,
  },
  modalSuccessMsg: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  modalDoneBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
