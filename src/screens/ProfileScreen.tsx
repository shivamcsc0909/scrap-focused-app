import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Phone,
  MapPin,
  Building2,
  Languages,
  PhoneCall,
  Mail,
  ShieldCheck,
  Check,
  Edit3,
  X,
  Scale,
  FileText,
} from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { UserBusinessType } from '../types';

interface Props {
  navigation: any;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, user, setUser, logout } = useSahiStore();
  const t = TRANSLATIONS[language];

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editCity, setEditCity] = useState(user.city);
  const [editRole, setEditRole] = useState<UserBusinessType>(user.businessType);

  const handleSaveProfile = () => {
    setUser({
      name: editName,
      phone: editPhone,
      city: editCity,
      businessType: editRole,
      isGuest: false,
    });
    setEditModalVisible(false);
    Alert.alert(
      language === 'hi' ? 'सफल' : 'Success',
      language === 'hi' ? 'प्रोफाइल सुरक्षित कर दी गई है।' : 'Profile updated successfully.'
    );
  };

  const getRoleLabel = (role: UserBusinessType) => {
    switch (role) {
      case 'CUSTOMER':
        return t.roleCustomer || 'ग्राहक (Customer)';
      case 'DEALER':
        return t.roleDealer || t.dealer;
      case 'TRADER':
        return t.roleTrader || t.trader;
      case 'PLANT_OWNER':
        return t.rolePlantOwner || t.plantOwner;
      case 'SUPPLIER':
        return t.roleSupplier || 'स्क्रैप सप्लायर (Supplier)';
      case 'OTHER':
        return t.roleOther || 'अन्य (Other)';
      default:
        return role;
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>{t.profileTitle}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setEditName(user.name);
            setEditPhone(user.phone);
            setEditCity(user.city);
            setEditRole(user.businessType);
            setEditModalVisible(true);
          }}
        >
          <Edit3 size={15} color={THEME.colors.primary} />
          <Text style={styles.editBtnText}>{t.editProfile}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user.name ? user.name[0].toUpperCase() : 'S'}
              </Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.userName}>{user.name || t.guestUser}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  🏢 {getRoleLabel(user.businessType)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfoList}>
            <View style={styles.infoRow}>
              <Phone size={16} color="#64748B" />
              <Text style={styles.infoText}>{user.phone || '+91 98000 00000'}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.infoText}>{user.city || 'Indore, MP'}</Text>
            </View>
            {user.gstin ? (
              <View style={styles.infoRow}>
                <Building2 size={16} color="#10B981" />
                <Text style={styles.infoText}>GSTIN: {user.gstin}</Text>
              </View>
            ) : null}
            {user.customRoleMessage ? (
              <View style={styles.infoRow}>
                <FileText size={16} color="#38BDF8" />
                <Text style={styles.infoText}>{user.customRoleMessage}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Language Selection Setting */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{t.switchLanguage}</Text>
          <View style={styles.langToggleRow}>
            <TouchableOpacity
              style={[styles.langChoiceBtn, language === 'hi' && styles.langChoiceActive]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={styles.flagIcon}>🇮🇳</Text>
              <Text style={[styles.langChoiceText, language === 'hi' && styles.langChoiceTextActive]}>
                हिंदी (Hindi)
              </Text>
              {language === 'hi' && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langChoiceBtn, language === 'en' && styles.langChoiceActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={styles.flagIcon}>🌐</Text>
              <Text style={[styles.langChoiceText, language === 'en' && styles.langChoiceTextActive]}>
                English
              </Text>
              {language === 'en' && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Company Helpline & Desk */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{t.companyHelpline}</Text>
          <Text style={styles.sectionHeaderSub}>{t.helplineText}</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <View style={styles.contactIconWrap}>
              <PhoneCall size={18} color={THEME.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{t.companyHelpline}</Text>
              <Text style={styles.contactValue}>{t.companyPhone}</Text>
            </View>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>{t.callNow}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:support@sahibhaav.com')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Mail size={18} color="#38BDF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>{t.companyEmail}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Sahi Bhaav */}
        <View style={styles.sectionCard}>
          <View style={styles.aboutHeader}>
            <Scale size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionHeaderTitle}>{t.aboutApp}</Text>
          </View>
          <Text style={styles.aboutText}>{t.aboutText}</Text>
          <View style={styles.trustBadges}>
            <View style={styles.trustPill}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.trustPillText}>100% Verified Weights</Text>
            </View>
            <View style={styles.trustPill}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.trustPillText}>Instant Payouts</Text>
            </View>
          </View>
        </View>

        {/* Reset / Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              language === 'hi' ? 'रीसेट करें?' : 'Reset Session?',
              language === 'hi' ? 'क्या आप वापस वेलकम स्क्रीन पर जाना चाहते हैं?' : 'Return to welcome screen?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'OK',
                  style: 'destructive',
                  onPress: () => {
                    logout();
                    navigation.navigate('Welcome');
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.logoutBtnText}>{t.logoutGuest}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.editProfile}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10 }}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t.enterName}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={t.namePlaceholder}
                  placeholderTextColor="#475569"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t.mobileNumber}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder={t.mobilePlaceholder}
                  placeholderTextColor="#475569"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t.city}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editCity}
                  onChangeText={setEditCity}
                  placeholder={t.cityPlaceholder}
                  placeholderTextColor="#475569"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t.businessType}</Text>
                {(['CUSTOMER', 'DEALER', 'TRADER', 'PLANT_OWNER', 'SUPPLIER', 'OTHER'] as UserBusinessType[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleSelectChip, editRole === r && styles.roleSelectChipActive]}
                    onPress={() => setEditRole(r)}
                  >
                    <Text style={[styles.roleSelectText, editRole === r && styles.roleSelectTextActive]}>
                      {getRoleLabel(r)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>{t.saveChanges}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C2E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 5,
  },
  editBtnText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  profileCard: {
    backgroundColor: '#111C2E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
  },
  profileInfoList: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#111C2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionHeaderSub: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 12,
  },
  langToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  langChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131D31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  langChoiceActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  flagIcon: {
    fontSize: 16,
  },
  langChoiceText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  langChoiceTextActive: {
    color: '#FFFFFF',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 12,
  },
  contactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  contactValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  callBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  callBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aboutText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  trustPillText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  modalInputGroup: {
    marginBottom: 12,
  },
  modalLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#131D31',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    height: 46,
    color: '#F8FAFC',
    fontSize: 14,
  },
  roleSelectChip: {
    backgroundColor: '#131D31',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  roleSelectChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  roleSelectText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  roleSelectTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
