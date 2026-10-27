import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  UserCheck,
  Phone,
  ArrowRight,
  User,
  FileText,
  Check,
  ShieldCheck,
  Building,
} from "lucide-react-native";
import { THEME } from "../theme";
import { useSahiStore } from "../store/useSahiStore";
import { TRANSLATIONS } from "../constants/translations";
import { UserBusinessType } from "../types";
import { BRANDING_IMAGES } from "../constants/assets";

interface Props {
  navigation: any;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, loginAsGuest, loginWithPhone, completeOnboarding } = useSahiStore();
  const t = TRANSLATIONS[language];

  // Login inputs
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 2-Step Onboarding Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [isCurrentGuest, setIsCurrentGuest] = useState(true);

  // Modal Step 1 State: Name & Role
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserBusinessType>("CUSTOMER");
  const [customRoleText, setCustomRoleText] = useState("");

  // Modal Step 2 State: GST
  const [gstin, setGstin] = useState("");

  // 1. Guest Mode Click -> Open Step 1 Modal
  const handleGuestClick = () => {
    loginAsGuest();
    setIsCurrentGuest(true);
    setFullName("");
    setSelectedRole("CUSTOMER");
    setCustomRoleText("");
    setGstin("");
    setModalStep(1);
    setIsModalOpen(true);
  };

  // 2. Phone Login Click -> Validate Phone & Open Step 1 Modal
  const handlePhoneClick = () => {
    const cleaned = phoneNumber.replace(/[^0-9]/g, "");
    if (cleaned.length !== 10) {
      setPhoneError(language === "hi" ? "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें" : "Please enter valid 10-digit mobile number");
      return;
    }
    setPhoneError("");
    loginWithPhone(cleaned);
    setIsCurrentGuest(false);
    setFullName("");
    setSelectedRole("DEALER");
    setCustomRoleText("");
    setGstin("");
    setModalStep(1);
    setIsModalOpen(true);
  };

  // Step 1 Modal -> Step 2
  const handleStep1Next = () => {
    if (!fullName.trim()) {
      setNameError(language === "hi" ? "कृपया अपना नाम दर्ज करें" : "Please enter your name");
      return;
    }
    setNameError("");
    setModalStep(2);
  };

  // Step 2 Modal -> Complete & Navigate to MainTabs
  const handleFinalSubmit = (skipGst = false) => {
    completeOnboarding({
      name: fullName.trim(),
      businessType: selectedRole,
      customRoleMessage: selectedRole === "OTHER" ? customRoleText.trim() : undefined,
      gstin: skipGst ? undefined : gstin.trim().toUpperCase(),
      phone: isCurrentGuest ? "+91 98000 00000" : phoneNumber.replace(/[^0-9]/g, ""),
      isGuest: isCurrentGuest,
    });

    setIsModalOpen(false);
    // Reliable navigation reset straight into MainTabs
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  const roleOptions: { key: UserBusinessType; label: string; icon: string }[] = [
    { key: "CUSTOMER", label: t.roleCustomer, icon: "👤" },
    { key: "DEALER", label: t.roleDealer, icon: "🏪" },
    { key: "TRADER", label: t.roleTrader, icon: "💼" },
    { key: "PLANT_OWNER", label: t.rolePlantOwner, icon: "🏭" },
    { key: "SUPPLIER", label: t.roleSupplier, icon: "🚛" },
    { key: "OTHER", label: t.roleOther, icon: "✍️" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image source={BRANDING_IMAGES.appIcon} style={styles.appLogo} resizeMode="contain" />
          <Text style={styles.brandName}>सही भाव</Text>
          <Text style={styles.brandTagline}>{t.tagline}</Text>
          <View style={styles.dividerAccent} />
        </View>

        {/* Crisp Card with strictly 2 Clean Options */}
        <View style={styles.loginCard}>
          {/* OPTION 1: Continue as Guest */}
          <View style={styles.optionSection}>
            <View style={styles.optionHeader}>
              <View style={styles.optionBadge}>
                <Text style={styles.optionBadgeText}>1</Text>
              </View>
              <Text style={styles.optionTitle}>{t.guestModeBtn}</Text>
            </View>
            <Text style={styles.optionDesc}>{t.guestModeDesc}</Text>

            <TouchableOpacity
              style={styles.guestBtn}
              activeOpacity={0.85}
              onPress={handleGuestClick}
            >
              <UserCheck size={18} color="#060B13" />
              <Text style={styles.guestBtnText}>{t.guestModeBtn}</Text>
              <ArrowRight size={18} color="#060B13" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orMobile}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OPTION 2: Mobile Number */}
          <View style={styles.optionSection}>
            <View style={styles.optionHeader}>
              <View style={[styles.optionBadge, styles.optionBadgeDark]}>
                <Text style={styles.optionBadgeText}>2</Text>
              </View>
              <Text style={styles.optionTitle}>{t.mobileNumber}</Text>
            </View>

            <View style={[styles.phoneInputRow, phoneError ? styles.inputRowError : null]}>
              <View style={styles.countryCodeBadge}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneTextInput}
                placeholder={t.mobilePlaceholder}
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (phoneError) setPhoneError("");
                }}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            <TouchableOpacity
              style={styles.phoneSubmitBtn}
              activeOpacity={0.85}
              onPress={handlePhoneClick}
            >
              <Phone size={16} color="#FFFFFF" />
              <Text style={styles.phoneSubmitText}>{t.loginBtn}</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Security / Quality Assurance Footer */}
        <View style={styles.footerNote}>
          <ShieldCheck size={14} color="#64748B" />
          <Text style={styles.footerNoteText}>
            {language === "hi"
              ? "सुरक्षित व पारदर्शी स्क्रैप व्यापार • 100% सटीक तोल व सही भाव"
              : "Secure & Transparent Scrap Trading • 100% Fair Rates & Direct Weighing"}
          </Text>
        </View>
      </ScrollView>

      {/* 2-STEP ONBOARDING MODAL */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalCenterWrap}
          >
            <View style={styles.modalCard}>
              {/* Step Progress Indicators (Sharp Fintech Style) */}
              <View style={styles.stepProgressBar}>
                <View style={[styles.stepItem, modalStep >= 1 && styles.stepItemActive]}>
                  <Text style={[styles.stepNumber, modalStep >= 1 && styles.stepNumberActive]}>1</Text>
                  <Text style={[styles.stepLabel, modalStep >= 1 && styles.stepLabelActive]}>
                    {language === "hi" ? "प्रोफाइल" : "Profile"}
                  </Text>
                </View>
                <View style={[styles.stepConnector, modalStep === 2 && styles.stepConnectorActive]} />
                <View style={[styles.stepItem, modalStep === 2 && styles.stepItemActive]}>
                  <Text style={[styles.stepNumber, modalStep === 2 && styles.stepNumberActive]}>2</Text>
                  <Text style={[styles.stepLabel, modalStep === 2 && styles.stepLabelActive]}>
                    {language === "hi" ? "GST विवरण" : "GST Details"}
                  </Text>
                </View>
              </View>

              {/* STEP 1: NAME & ROLE */}
              {modalStep === 1 && (
                <View style={styles.stepContent}>
                  <Text style={styles.modalHeading}>{t.onboardingTitle}</Text>
                  <Text style={styles.modalSub}>{t.onboardingSub}</Text>

                  {/* Name Input */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      {t.yourName} <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={[styles.fieldInputWrapper, nameError ? styles.inputRowError : null]}>
                      <User size={16} color="#94A3B8" />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder={t.yourNamePlaceholder}
                        placeholderTextColor="#64748B"
                        value={fullName}
                        onChangeText={(val) => {
                          setFullName(val);
                          if (nameError) setNameError("");
                        }}
                      />
                    </View>
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                  </View>

                  {/* Who Are You (Role Selection) */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{t.whoAreYou}</Text>
                    <View style={styles.rolesGrid}>
                      {roleOptions.map((role) => {
                        const isSelected = selectedRole === role.key;
                        return (
                          <TouchableOpacity
                            key={role.key}
                            style={[styles.roleSharpCard, isSelected && styles.roleSharpCardActive]}
                            activeOpacity={0.8}
                            onPress={() => setSelectedRole(role.key)}
                          >
                            <Text style={styles.roleCardIcon}>{role.icon}</Text>
                            <Text
                              style={[
                                styles.roleCardText,
                                isSelected && styles.roleCardTextActive,
                              ]}
                              numberOfLines={1}
                            >
                              {role.label}
                            </Text>
                            {isSelected && (
                              <View style={styles.roleCheckBadge}>
                                <Check size={12} color="#060B13" />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Custom Message Box if OTHER selected */}
                  {selectedRole === "OTHER" && (
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>{t.otherRoleLabel}</Text>
                      <TextInput
                        style={styles.customRoleTextArea}
                        placeholder={t.otherRolePlaceholder}
                        placeholderTextColor="#64748B"
                        multiline
                        numberOfLines={3}
                        value={customRoleText}
                        onChangeText={setCustomRoleText}
                      />
                    </View>
                  )}

                  {/* Next Step Button */}
                  <TouchableOpacity
                    style={styles.stepNextBtn}
                    activeOpacity={0.85}
                    onPress={handleStep1Next}
                  >
                    <Text style={styles.stepNextText}>{t.stepNext}</Text>
                    <ArrowRight size={18} color="#060B13" />
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: GST DETAILS (OPTIONAL) */}
              {modalStep === 2 && (
                <View style={styles.stepContent}>
                  <Text style={styles.modalHeading}>{t.gstTitle}</Text>
                  <Text style={styles.modalSub}>{t.gstSub}</Text>

                  {/* GSTIN Input */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{t.gstLabel}</Text>
                    <View style={styles.fieldInputWrapper}>
                      <Building size={16} color="#94A3B8" />
                      <TextInput
                        style={[styles.fieldInput, { textTransform: "uppercase" }]}
                        placeholder={t.gstPlaceholder}
                        placeholderTextColor="#64748B"
                        autoCapitalize="characters"
                        value={gstin}
                        onChangeText={setGstin}
                        maxLength={15}
                      />
                    </View>
                  </View>

                  {/* Informational Callout */}
                  <View style={styles.optionalNotice}>
                    <FileText size={16} color="#10B981" />
                    <Text style={styles.optionalNoticeText}>
                      {language === 'hi'
                        ? 'GST नंबर अनिवार्य नहीं है। यदि आपके पास नहीं है, तो आप सीधे छोड़ें दबाकर ऐप शुरू कर सकते हैं।'
                        : 'GSTIN is optional. If you do not have one right now, simply click Skip to proceed into the app.'}
                    </Text>
                  </View>

                  {/* Action Buttons: Skip vs Submit */}
                  <View style={styles.modalDualActions}>
                    <TouchableOpacity
                      style={styles.skipBtn}
                      activeOpacity={0.8}
                      onPress={() => handleFinalSubmit(true)}
                    >
                      <Text style={styles.skipBtnText}>{t.skipBtn}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitBtn}
                      activeOpacity={0.85}
                      onPress={() => handleFinalSubmit(false)}
                    >
                      <Text style={styles.submitBtnText}>{t.submitProfileBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#060B13",
  },
  container: {
    paddingHorizontal: 18,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  appLogo: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  brandName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "700",
    marginTop: 4,
  },
  dividerAccent: {
    width: 48,
    height: 2,
    backgroundColor: "#10B981",
    marginTop: 10,
  },
  loginCard: {
    backgroundColor: "#0D1524",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 6,
    padding: 18,
  },
  optionSection: {
    paddingVertical: 4,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  optionBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  optionBadgeDark: {
    backgroundColor: "#334155",
  },
  optionBadgeText: {
    color: "#060B13",
    fontSize: 12,
    fontWeight: "900",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  optionDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 14,
    lineHeight: 17,
  },
  guestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 4,
    height: 48,
    gap: 8,
  },
  guestBtnText: {
    color: "#060B13",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E293B",
  },
  dividerText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060B13",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 4,
    height: 48,
    marginBottom: 6,
  },
  inputRowError: {
    borderColor: "#EF4444",
  },
  countryCodeBadge: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#1E293B",
    backgroundColor: "#0E1726",
  },
  countryCodeText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  phoneTextInput: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 14,
    paddingHorizontal: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
  },
  phoneSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 4,
    height: 48,
    gap: 8,
    marginTop: 6,
  },
  phoneSubmitText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 10,
  },
  footerNoteText: {
    color: "#64748B",
    fontSize: 11,
    textAlign: "center",
  },

  /* MODAL STYLES (SHARP-EDGE) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(6, 11, 19, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCenterWrap: {
    width: "100%",
    maxWidth: 420,
  },
  modalCard: {
    backgroundColor: "#0D1524",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 6,
    padding: 20,
    elevation: 12,
  },
  stepProgressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    opacity: 0.45,
  },
  stepItemActive: {
    opacity: 1,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: "#1E293B",
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 20,
  },
  stepNumberActive: {
    backgroundColor: "#10B981",
    color: "#060B13",
  },
  stepLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  stepLabelActive: {
    color: "#F8FAFC",
  },
  stepConnector: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E293B",
    marginHorizontal: 12,
  },
  stepConnectorActive: {
    backgroundColor: "#10B981",
  },
  stepContent: {
    gap: 14,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
    textAlign: "center",
  },
  modalSub: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: -8,
    marginBottom: 6,
    lineHeight: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#CBD5E1",
  },
  requiredStar: {
    color: "#EF4444",
  },
  fieldInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060B13",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 4,
    height: 46,
    paddingHorizontal: 12,
    gap: 8,
  },
  fieldInput: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleSharpCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060B13",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 6,
  },
  roleSharpCardActive: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  roleCardIcon: {
    fontSize: 14,
  },
  roleCardText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    flex: 1,
  },
  roleCardTextActive: {
    color: "#F8FAFC",
  },
  roleCheckBadge: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  customRoleTextArea: {
    backgroundColor: "#060B13",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 4,
    color: "#F8FAFC",
    fontSize: 13,
    padding: 10,
    textAlignVertical: "top",
    minHeight: 64,
  },
  stepNextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 4,
    height: 48,
    gap: 8,
    marginTop: 8,
  },
  stepNextText: {
    color: "#060B13",
    fontSize: 14,
    fontWeight: "800",
  },
  optionalNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
    borderRadius: 4,
    padding: 12,
    gap: 8,
  },
  optionalNoticeText: {
    flex: 1,
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 16,
  },
  modalDualActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  skipBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E1726",
  },
  skipBtnText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  submitBtn: {
    flex: 2,
    height: 48,
    backgroundColor: "#10B981",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#060B13",
    fontSize: 13,
    fontWeight: "800",
  },
});
