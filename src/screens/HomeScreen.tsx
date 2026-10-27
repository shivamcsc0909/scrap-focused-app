import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  PhoneCall,
  PlusCircle,
  ShoppingBag,
  PlusSquare,
  Clock,
  Languages,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  TrendingUp,
} from "lucide-react-native";
import { THEME } from "../theme";
import { useSahiStore } from "../store/useSahiStore";
import { TRANSLATIONS } from "../constants/translations";
import { SAHI_CATEGORIES, ScrapCategoryItem } from "../constants/scrapData";
import { BRANDING_IMAGES, UI_IMAGES } from "../constants/assets";
import { AutoSlider } from "../components/AutoSlider";
import { CategoryMultiImageSlider } from "../components/CategoryMultiImageSlider";
import { NewCategoryRequestModal } from "./NewCategoryRequestModal";

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, user } = useSahiStore();
  const t = TRANSLATIONS[language];

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  const handleCallHelpline = () => {
    Linking.openURL("tel:+919876543210");
  };

  const filteredCategories = SAHI_CATEGORIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.nameEn.toLowerCase().includes(q) ||
      c.nameHi.includes(q) ||
      c.descriptionEn.toLowerCase().includes(q) ||
      c.descriptionHi.includes(q)
    );
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image source={BRANDING_IMAGES.appIcon} style={styles.appIconLogo} resizeMode="contain" />
          <View>
            <Text style={styles.brandName}>सही भाव</Text>
            <Text style={styles.brandSub}>SAHI BHAAV</Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          {/* Quick Language Toggle */}
          <TouchableOpacity style={styles.langPill} onPress={toggleLanguage} activeOpacity={0.8}>
            <Languages size={14} color="#10B981" />
            <Text style={styles.langPillText}>{language === "hi" ? "ENG" : "हिन्दी"}</Text>
          </TouchableOpacity>

          {/* User Profile Pill */}
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.profileAvatarText}>
              {user.name ? user.name[0].toUpperCase() : "G"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Tagline Banner */}
        <View style={styles.bannerCard}>
          <LinearGradient
            colors={["#059669", "#064E3B"]}
            style={styles.bannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTagRow}>
                <ShieldCheck size={18} color="#D1FAE5" />
                <Text style={styles.bannerTag}>{t.tagline}</Text>
              </View>
              <Text style={styles.bannerGreeting}>
                {t.homeWelcome}, {user.name || t.guestUser}!
              </Text>
              <Text style={styles.bannerSubtext}>
                {language === "hi"
                  ? "डीलर्स, ट्रेडर्स और प्लांट्स के लिए सीधा और पारदर्शी स्क्रैप व्यापार"
                  : "Direct & transparent scrap marketplace for dealers, traders & plants"}
              </Text>
            </View>

            {/* Helpline Call Button */}
            <TouchableOpacity
              style={styles.helplineBtn}
              activeOpacity={0.85}
              onPress={handleCallHelpline}
            >
              <PhoneCall size={16} color="#064E3B" />
              <Text style={styles.helplineBtnText}>{t.callNow}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* SEARCH BAR (LOCATED DIRECTLY ABOVE THE CAROUSEL / SLIDER AS REQUESTED) */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#10B981" />
            <TextInput
              style={styles.searchInput}
              placeholder={
                language === "hi"
                  ? "स्क्रैप खोजें (उदा. लोहा, तांबा, पीतल, बैटरी, गाड़ी)..."
                  : "Search scrap (e.g. Iron, Copper, Battery, Brass)..."
              }
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearchBtn}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 10+ IMAGES AUTO-MOVING / SWIPING HERO SLIDER (FULL WIDTH) */}
        <AutoSlider
          onSelectItem={(categoryId) => {
            navigation.navigate("Buy", { categoryId });
          }}
        />

        {/* 4 CORE QUICK ACTIONS (CLEAN, SHARP-EDGE, LARGE TOUCH TARGETS) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.quickActions}</Text>
        </View>

        <View style={styles.actionGrid}>
          {/* 1. Sell Scrap Card */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "rgba(16, 185, 129, 0.4)" }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Sell")}
          >
            <View style={styles.actionCardInner}>
              <View style={[styles.actionIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                <PlusCircle size={28} color="#10B981" />
              </View>
              <Text style={styles.actionCardTitle}>{t.sellScrapTitle}</Text>
              <Text style={styles.actionCardDesc}>{t.sellScrapDesc}</Text>
              <View style={styles.actionCardArrow}>
                <Text style={[styles.arrowText, { color: "#10B981" }]}>
                  {language === "hi" ? "रेट डालें" : "Post Rate"} →
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 2. Buy Scrap Card */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "rgba(56, 189, 248, 0.4)" }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Buy")}
          >
            <View style={styles.actionCardInner}>
              <View style={[styles.actionIconBox, { backgroundColor: "rgba(56, 189, 248, 0.15)" }]}>
                <ShoppingBag size={28} color="#38BDF8" />
              </View>
              <Text style={styles.actionCardTitle}>{t.buyScrapTitle}</Text>
              <Text style={styles.actionCardDesc}>{t.buyScrapDesc}</Text>
              <View style={styles.actionCardArrow}>
                <Text style={[styles.arrowText, { color: "#38BDF8" }]}>
                  {language === "hi" ? "स्टॉक देखें" : "View Stock"} →
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 3. Request New Category Modal */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "rgba(245, 158, 11, 0.4)" }]}
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.actionCardInner}>
              <View style={[styles.actionIconBox, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                <PlusSquare size={28} color="#F59E0B" />
              </View>
              <Text style={styles.actionCardTitle}>{t.requestNewCategory}</Text>
              <Text style={styles.actionCardDesc}>{t.requestNewCategoryDesc}</Text>
              <View style={styles.actionCardArrow}>
                <Text style={[styles.arrowText, { color: "#F59E0B" }]}>
                  {language === "hi" ? "अनुरोध भेजें" : "Request"} →
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 4. Track Status Card */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: "rgba(168, 85, 247, 0.4)" }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Track")}
          >
            <View style={styles.actionCardInner}>
              <View style={[styles.actionIconBox, { backgroundColor: "rgba(168, 85, 247, 0.15)" }]}>
                <Clock size={28} color="#A855F7" />
              </View>
              <Text style={styles.actionCardTitle}>{t.trackOrdersTitle}</Text>
              <Text style={styles.actionCardDesc}>{t.trackOrdersDesc}</Text>
              <View style={styles.actionCardArrow}>
                <Text style={[styles.arrowText, { color: "#A855F7" }]}>
                  {language === "hi" ? "स्टेटस देखें" : "Live Status"} →
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* SCRAP CATEGORIES (FULL-WIDTH RECTANGULAR SHOWCASE CARDS WITH 0 PADDING ON IMAGES) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.availableCategories}</Text>
          <Text style={styles.categoryCount}>({filteredCategories.length})</Text>
        </View>

        <View style={styles.categoriesList}>
          {filteredCategories.map((cat) => (
            <View key={cat.id} style={styles.showcaseCard}>
              {/* Rectangular Full-Width Image Banner (0 padding) */}
              <View style={styles.imageBannerWrapper}>
                <CategoryMultiImageSlider
                  categoryId={cat.id}
                  fullWidth
                  height={180}
                  borderRadius={4}
                />
                <View style={styles.imageRateOverlay}>
                  <View style={styles.ratePill}>
                    <TrendingUp size={14} color="#FFFFFF" />
                    <Text style={styles.ratePillPrice}>₹{cat.indicativeSellRate}</Text>
                    <Text style={styles.ratePillUnit}>/{cat.defaultUnit}</Text>
                  </View>
                </View>
              </View>

              {/* Card Details (Big Bold Readable Typography) */}
              <View style={styles.cardDetails}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>
                    {language === "hi" ? cat.nameHi : cat.nameEn}
                  </Text>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockBadgeText}>
                      📦 {t.companyStock}: {cat.companyStockQty.toLocaleString("en-IN")}{" "}
                      {cat.defaultUnit === "kg"
                        ? language === "hi" ? "किग्रा" : "Kg"
                        : language === "hi" ? "टन" : "Ton"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDesc}>
                  {language === "hi" ? cat.descriptionHi : cat.descriptionEn}
                </Text>

                {/* Direct Action Buttons: Sell vs Buy */}
                <View style={styles.cardActionRow}>
                  <TouchableOpacity
                    style={styles.btnSell}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Sell", { categoryId: cat.id })}
                  >
                    <PlusCircle size={16} color="#060B13" />
                    <Text style={styles.btnSellText}>
                      {language === "hi" ? "बेचना है (Sell)" : "Sell Scrap"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnBuy}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Buy", { categoryId: cat.id })}
                  >
                    <ShoppingBag size={16} color="#FFFFFF" />
                    <Text style={styles.btnBuyText}>
                      {language === "hi" ? "खरीदना है (Buy)" : "Buy Scrap"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Missing Item Footer Prompt */}
        <TouchableOpacity
          style={styles.missingItemFooter}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <Image source={UI_IMAGES.requestNewCategory} style={styles.newCatIcon} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.missingItemTitle}>
              {language === "hi" ? "माल लिस्ट में नहीं मिल रहा है?" : "Can not find your scrap item?"}
            </Text>
            <Text style={styles.missingItemSub}>
              {language === "hi"
                ? "यहाँ नई कैटेगरी / प्रोडक्ट जोड़ने का अनुरोध करें →"
                : "Submit a request to add custom scrap item →"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* New Category Modal */}
      <NewCategoryRequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#060B13",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#060B13",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  appIconLogo: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  brandName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 2,
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1524",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 4,
    gap: 6,
  },
  langPillText: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "800",
  },
  profileBadge: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  profileAvatarText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 36,
  },
  bannerCard: {
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#059669",
  },
  bannerGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  bannerTag: {
    color: "#D1FAE5",
    fontSize: 13,
    fontWeight: "800",
  },
  bannerGreeting: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  bannerSubtext: {
    color: "#A7F3D0",
    fontSize: 12,
    lineHeight: 16,
  },
  helplineBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  helplineBtnText: {
    color: "#064E3B",
    fontWeight: "900",
    fontSize: 14,
  },
  searchContainer: {
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1524",
    borderRadius: 4,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: "#1E293B",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
  },
  clearSearchBtn: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 6,
    gap: 8,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 19,
    fontWeight: "900",
  },
  categoryCount: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  actionCard: {
    width: "48.5%",
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: "#0D1524",
    overflow: "hidden",
  },
  actionCardInner: {
    padding: 14,
    minHeight: 140,
    justifyContent: "space-between",
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionCardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  actionCardDesc: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 16,
  },
  actionCardArrow: {
    marginTop: 8,
  },
  arrowText: {
    fontSize: 13,
    fontWeight: "800",
  },
  categoriesList: {
    gap: 16,
  },
  showcaseCard: {
    backgroundColor: "#0D1524",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
    overflow: "hidden",
  },
  imageBannerWrapper: {
    width: "100%",
    height: 180,
    padding: 0,
    position: "relative",
    backgroundColor: "#060B13",
  },
  imageRateOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  ratePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#047857",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  ratePillPrice: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  ratePillUnit: {
    color: "#D1FAE5",
    fontSize: 12,
    fontWeight: "700",
  },
  cardDetails: {
    padding: 14,
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F8FAFC",
    flex: 1,
  },
  stockBadge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockBadgeText: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "700",
  },
  cardDesc: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  cardActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  btnSell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    height: 44,
    borderRadius: 4,
    gap: 6,
  },
  btnSellText: {
    color: "#060B13",
    fontSize: 14,
    fontWeight: "800",
  },
  btnBuy: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0284C7",
    height: 44,
    borderRadius: 4,
    gap: 6,
  },
  btnBuyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  missingItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1524",
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(16, 185, 129, 0.4)",
    marginTop: 18,
    gap: 14,
  },
  newCatIcon: {
    width: 48,
    height: 48,
  },
  missingItemTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  missingItemSub: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "700",
  },
});
