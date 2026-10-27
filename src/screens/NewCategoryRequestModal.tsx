import React, { useState } from 'react';
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X, PlusCircle, CheckCircle, PackagePlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { UI_IMAGES } from '../constants/assets';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const NewCategoryRequestModal: React.FC<Props> = ({ visible, onClose }) => {
  const { language, user, addCategoryRequest } = useSahiStore();
  const t = TRANSLATIONS[language];

  const [itemName, setItemName] = useState('');
  const [intent, setIntent] = useState<'SELL' | 'BUY'>('SELL');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!itemName.trim()) {
      Alert.alert(
        language === 'hi' ? 'कृपया नाम भरें' : 'Required Field',
        language === 'hi' ? 'कृपया स्क्रैप आइटम का नाम दर्ज करें' : 'Please enter the scrap material name'
      );
      return;
    }

    addCategoryRequest({
      itemName: itemName.trim(),
      intent,
      expectedQuantity: parseFloat(quantity) || 0,
      unit,
      description: description.trim(),
      phone: phone || user.phone,
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setItemName('');
    setQuantity('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleResetAndClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image source={UI_IMAGES.requestNewCategory} style={{ width: 32, height: 32 }} resizeMode="contain" />
              <Text style={styles.headerTitle}>{t.newCatModalTitle}</Text>
            </View>
            <TouchableOpacity onPress={handleResetAndClose} style={styles.closeBtn}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {submitted ? (
            <View style={styles.successBox}>
              <Image source={UI_IMAGES.listingSuccess} style={{ width: 80, height: 80, marginBottom: 4 }} resizeMode="contain" />
              <Text style={styles.successTitle}>{t.catSuccessTitle}</Text>
              <Text style={styles.successMsg}>{t.catSuccessMsg}</Text>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleResetAndClose}
                activeOpacity={0.85}
              >
                <Text style={styles.doneBtnText}>ठीक है (OK)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              <Text style={styles.descText}>{t.newCatModalDesc}</Text>

              {/* Item Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.itemName} *</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.itemNamePlaceholder}
                  placeholderTextColor="#475569"
                  value={itemName}
                  onChangeText={setItemName}
                />
              </View>

              {/* Intent Toggle */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.iWantTo}</Text>
                <View style={styles.intentToggleRow}>
                  <TouchableOpacity
                    style={[styles.intentBtn, intent === 'SELL' && styles.intentBtnActive]}
                    onPress={() => setIntent('SELL')}
                  >
                    <Text style={[styles.intentText, intent === 'SELL' && styles.intentTextActive]}>
                      🟢 {t.iWantToSell}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.intentBtn, intent === 'BUY' && styles.intentBtnActive]}
                    onPress={() => setIntent('BUY')}
                  >
                    <Text style={[styles.intentText, intent === 'BUY' && styles.intentTextActive]}>
                      🔵 {t.iWantToBuy}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quantity & Unit */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={styles.label}>{t.approxQuantity}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="उदा. 500"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>{t.unit}</Text>
                  <View style={styles.unitSelector}>
                    <TouchableOpacity
                      style={[styles.unitPill, unit === 'kg' && styles.unitPillActive]}
                      onPress={() => setUnit('kg')}
                    >
                      <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>
                        Kg
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.unitPill, unit === 'ton' && styles.unitPillActive]}
                      onPress={() => setUnit('ton')}
                    >
                      <Text style={[styles.unitText, unit === 'ton' && styles.unitTextActive]}>
                        Ton
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.additionalNotes}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.notesPlaceholder}
                  placeholderTextColor="#475569"
                  multiline
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Phone number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.mobileNumber}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.mobilePlaceholder}
                  placeholderTextColor="#475569"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
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
                  <PlusCircle size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>{t.submitNewCatRequest}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 6,
  },
  formScroll: {
    paddingTop: 12,
  },
  descText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#131D31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    color: '#F8FAFC',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#131D31',
    borderRadius: 12,
    padding: 4,
    height: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  unitPill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
  unitPillActive: {
    backgroundColor: THEME.colors.primary,
  },
  unitText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  unitTextActive: {
    color: '#FFFFFF',
  },
  intentToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intentBtn: {
    flex: 1,
    backgroundColor: '#131D31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  intentBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  intentText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  intentTextActive: {
    color: '#F8FAFC',
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  successMsg: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  doneBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
