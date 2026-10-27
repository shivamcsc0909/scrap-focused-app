import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Truck,
  Building2,
  ShieldCheck,
  Bell,
  Scale,
  Flame,
  ChevronRight,
  Clock,
  MapPin,
  Lock,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';
import { MarketListing } from '../types';
import { PaywallModal } from '../components/PaywallModal';
import { PriceAlertModal } from '../components/PriceAlertModal';

const { width } = Dimensions.get('window');

interface SpotMarketScreenProps {
  navigation: any;
}

export const SpotMarketScreen: React.FC<SpotMarketScreenProps> = ({ navigation }) => {
  const { mandiRates, listings, subscription, isLeadUnlocked } = useScrapStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [paywallTargetTitle, setPaywallTargetTitle] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleOpenPaywall = (targetTitle?: string) => {
    setPaywallTargetTitle(targetTitle || '');
    setShowPaywall(true);
  };

  const sellOffers = listings.filter((l) => l.type === 'SELL_OFFER').slice(0, 3);
  const buyRFQs = listings.filter((l) => l.type === 'BUY_RFQ').slice(0, 3);

  return (
    <View style={styles.container}>
      <Header
        title="ScrapBazaar Spot Market"
        subtitle="Physical Recyclable Commodities & Mandi Spread"
        onOpenPaywall={() => handleOpenPaywall()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {/* Compliance Legal Badge Banner */}
        <View style={styles.legalBanner}>
          <Scale size={14} color={THEME.colors.primaryLight} />
          <Text style={styles.legalBannerText}>
            100% Physical Commodity Marketplace • Verified Yard Deliveries & GST Invoicing
          </Text>
        </View>

        {/* Hero Card with Live Market Spread Stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Sparkles size={12} color={THEME.colors.accent} />
            <Text style={styles.heroBadgeText}>REAL-TIME MANDI ORDERBOOK</Text>
          </View>

          <Text style={styles.heroTitle}>Physical Scrap Spot Exchange</Text>
          <Text style={styles.heroSubtitle}>
            Direct transparent trade quotes between 4,800+ foundries, yards & recyclers across India.
          </Text>

          {/* Quick Dual Action Bar */}
          <View style={styles.dualActionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.sellActionBtn]}
              onPress={() => navigation.navigate('Post Deal', { mode: 'SELL' })}
              activeOpacity={0.85}
            >
              <Truck size={18} color="#FFFFFF" />
              <View>
                <Text style={styles.actionBtnTitle}>I Want to Sell Scrap</Text>
                <Text style={styles.actionBtnSub}>Post Available Stock Offer</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.buyActionBtn]}
              onPress={() => navigation.navigate('Post Deal', { mode: 'BUY' })}
              activeOpacity={0.85}
            >
              <Building2 size={18} color="#0B1120" />
              <View>
                <Text style={[styles.actionBtnTitle, { color: '#0B1120' }]}>I Want to Buy Scrap</Text>
                <Text style={[styles.actionBtnSub, { color: 'rgba(11,17,32,0.8)' }]}>Post Purchase RFQ Demand</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Mandi Rates & Spread Ticker */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <TrendingUp size={16} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Mandi Spread & Benchmark Rates</Text>
          </View>
          <TouchableOpacity
            style={styles.alertBtn}
            onPress={() => setShowPriceAlertModal(true)}
          >
            <Bell size={13} color={THEME.colors.accent} />
            <Text style={styles.alertBtnText}>Set Price Alert</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ratesScroll}
        >
          {mandiRates.map((rate) => {
            const isPositive = rate.changeToday >= 0;
            const buyBid = rate.highestBuyBid ?? rate.highestBuyDemand ?? rate.currentRate;
            const sellAsk = rate.lowestSellAsk ?? rate.lowestSellOffer ?? rate.currentRate;
            const spread = Math.abs(buyBid - sellAsk);

            return (
              <TouchableOpacity
                key={rate.id}
                style={styles.rateCard}
                onPress={() => setShowPriceAlertModal(true)}
                activeOpacity={0.85}
              >
                <View style={styles.rateCardTop}>
                  <Image source={getScrapImage(rate.imageKey)} style={styles.rateThumb} resizeMode="cover" />
                  <View style={styles.rateInfo}>
                    <Text style={styles.rateName} numberOfLines={1}>{rate.materialName}</Text>
                    <Text style={styles.rateLoc}>{rate.marketLocation}</Text>
                  </View>
                </View>

                {/* Benchmark Rate */}
                <View style={styles.ratePriceRow}>
                  <Text style={styles.mandiVal}>
                    ₹{rate.currentRate}
                    <Text style={styles.unitLbl}>/{rate.unit}</Text>
                  </Text>
                  <View
                    style={[
                      styles.trendBadge,
                      { backgroundColor: isPositive ? THEME.colors.primarySoft : THEME.colors.errorSoft },
                    ]}
                  >
                    {isPositive ? <TrendingUp size={10} color={THEME.colors.primaryLight} /> : <TrendingDown size={10} color={THEME.colors.error} />}
                    <Text style={[styles.trendText, { color: isPositive ? THEME.colors.primaryLight : THEME.colors.error }]}>
                      {isPositive ? `+₹${rate.changeToday}` : `-₹${Math.abs(rate.changeToday)}`}
                    </Text>
                  </View>
                </View>

                {/* Best Buy Bid vs Best Sell Ask */}
                <View style={styles.bidAskBox}>
                  <View style={styles.bidAskCol}>
                    <Text style={styles.bidLabel}>Best Buy Demand</Text>
                    <Text style={styles.bidVal}>₹{buyBid}</Text>
                  </View>
                  <View style={styles.spreadDivider} />
                  <View style={styles.bidAskCol}>
                    <Text style={styles.askLabel}>Lowest Sell Offer</Text>
                    <Text style={styles.askVal}>₹{sellAsk}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION: TOP BUY DEMANDS (Sell directly to these buyers) */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <Building2 size={16} color={THEME.colors.accent} />
            <Text style={styles.sectionTitle}>High-Budget Buyer Demands (RFQs)</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Orderbook', { initialTab: 'BUY_RFQS' })}
          >
            <Text style={styles.seeAllText}>All Demands</Text>
            <ChevronRight size={13} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listingsList}>
          {buyRFQs.map((item) => {
            const unlocked = isLeadUnlocked(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.listingCard, styles.buyListingCard]}
                onPress={() => {
                  if (unlocked) {
                    navigation.navigate('Chat & Deals', { listing: item });
                  } else {
                    handleOpenPaywall(item.title);
                  }
                }}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.rfqTag}>
                    <Text style={styles.rfqTagText}>BUY DEMAND</Text>
                  </View>
                  <Text style={styles.cardTime}>Posted {item.preferredSlot.date}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Image source={getScrapImage(item.imageKey)} style={styles.cardThumb} resizeMode="cover" />
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.cardUser}>{item.user.businessName || item.user.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardQty}>{item.quantity} {item.unit}</Text>
                      <Text style={styles.cardPrice}>Paying: ₹{item.targetPrice}/{item.unit}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.locBox}>
                    <MapPin size={11} color={THEME.colors.textMuted} />
                    <Text style={styles.locText} numberOfLines={1}>{item.address.city}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.sellToBuyerBtn}
                    onPress={() => {
                      if (unlocked) {
                        navigation.navigate('Chat & Deals', { listing: item });
                      } else {
                        handleOpenPaywall(item.title);
                      }
                    }}
                  >
                    {unlocked ? (
                      <Text style={styles.sellToBuyerBtnText}>Negotiate & Sell</Text>
                    ) : (
                      <View style={styles.lockedBtnRow}>
                        <Lock size={11} color="#FFFFFF" />
                        <Text style={styles.sellToBuyerBtnText}>Unlock Buyer Contact</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SECTION: AVAILABLE STOCK OFFERS (Buy from these sellers) */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithIcon}>
            <Truck size={16} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Ready Scrap Stock for Sale</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Orderbook', { initialTab: 'SELL_OFFERS' })}
          >
            <Text style={styles.seeAllText}>All Stock</Text>
            <ChevronRight size={13} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listingsList}>
          {sellOffers.map((item) => {
            const unlocked = isLeadUnlocked(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.listingCard}
                onPress={() => {
                  if (unlocked) {
                    navigation.navigate('Chat & Deals', { listing: item });
                  } else {
                    handleOpenPaywall(item.title);
                  }
                }}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.sellTag}>
                    <Text style={styles.sellTagText}>STOCK AVAILABLE</Text>
                  </View>
                  <Text style={styles.cardTime}>📍 {item.address.area}, {item.address.city}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Image source={getScrapImage(item.imageKey)} style={styles.cardThumb} resizeMode="cover" />
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.cardUser}>{item.user.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardQty}>Stock: {item.quantity} {item.unit}</Text>
                      <Text style={styles.cardPrice}>Asking: ₹{item.targetPrice}/{item.unit}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.conditionText}>Condition: {item.condition}</Text>

                  <TouchableOpacity
                    style={styles.buyFromSellerBtn}
                    onPress={() => {
                      if (unlocked) {
                        navigation.navigate('Chat & Deals', { listing: item });
                      } else {
                        handleOpenPaywall(item.title);
                      }
                    }}
                  >
                    {unlocked ? (
                      <Text style={styles.buyFromSellerBtnText}>Chat & Buy</Text>
                    ) : (
                      <View style={styles.lockedBtnRow}>
                        <Lock size={11} color="#0B1120" />
                        <Text style={[styles.buyFromSellerBtnText, { color: '#0B1120' }]}>Unlock Seller</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modals */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        targetLeadTitle={paywallTargetTitle}
      />

      <PriceAlertModal
        visible={showPriceAlertModal}
        onClose={() => setShowPriceAlertModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  legalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  legalBannerText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
  },
  heroCard: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  heroBadgeText: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  heroSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sellActionBtn: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  buyActionBtn: {
    backgroundColor: THEME.colors.accent,
  },
  actionBtnTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  actionBtnSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  alertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  alertBtnText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  ratesScroll: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 10,
  },
  rateCard: {
    width: 200,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  rateCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  rateInfo: {
    flex: 1,
  },
  rateName: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  rateLoc: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  ratePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mandiVal: {
    color: THEME.colors.primaryLight,
    fontSize: 16,
    fontWeight: '900',
  },
  unitLbl: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
    gap: 2,
  },
  trendText: {
    fontSize: 9,
    fontWeight: '800',
  },
  bidAskBox: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    padding: 6,
    borderRadius: 6,
    justifyContent: 'space-between',
  },
  bidAskCol: {
    alignItems: 'center',
    flex: 1,
  },
  bidLabel: {
    color: THEME.colors.accent,
    fontSize: 8,
    fontWeight: '700',
  },
  bidVal: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1,
  },
  spreadDivider: {
    width: 1,
    height: '100%',
    backgroundColor: THEME.colors.surfaceBorder,
  },
  askLabel: {
    color: THEME.colors.primaryLight,
    fontSize: 8,
    fontWeight: '700',
  },
  askVal: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1,
  },
  listingsList: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 12,
  },
  listingCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  buyListingCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rfqTag: {
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rfqTagText: {
    color: THEME.colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },
  sellTag: {
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sellTagText: {
    color: THEME.colors.primaryLight,
    fontSize: 9,
    fontWeight: '900',
  },
  cardTime: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  cardBody: {
    flexDirection: 'row',
    gap: 10,
  },
  cardThumb: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  cardUser: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardQty: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  cardPrice: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  locBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  conditionText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  sellToBuyerBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
  },
  sellToBuyerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  buyFromSellerBtn: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
  },
  buyFromSellerBtnText: {
    color: '#0B1120',
    fontSize: 11,
    fontWeight: '800',
  },
  lockedBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
