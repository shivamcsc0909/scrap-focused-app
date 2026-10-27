import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Search,
  Truck,
  Building2,
  Lock,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  CheckCircle,
  Plus,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { SCRAP_CATEGORIES } from '../constants/categories';
import { getScrapImage } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';
import { MarketListing, ListingType } from '../types';
import { PaywallModal } from '../components/PaywallModal';

interface OrderBookScreenProps {
  navigation: any;
  route?: any;
}

export const OrderBookScreen: React.FC<OrderBookScreenProps> = ({ navigation, route }) => {
  const { listings, isLeadUnlocked, createOrGetThread, deleteListing } = useScrapStore();

  const initialTab: 'SELL_OFFERS' | 'BUY_RFQS' | 'MY_LISTINGS' =
    route?.params?.initialTab || 'BUY_RFQS';

  const [activeTab, setActiveTab] = useState<'SELL_OFFERS' | 'BUY_RFQS' | 'MY_LISTINGS'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTargetTitle, setPaywallTargetTitle] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleStartChatOrNegotiate = (item: MarketListing) => {
    const unlocked = isLeadUnlocked(item.id);
    if (!unlocked) {
      setPaywallTargetTitle(item.title);
      setShowPaywall(true);
      return;
    }

    const thread = createOrGetThread(
      item.id,
      item.title,
      item.type,
      {
        id: item.user.id,
        name: item.user.name,
        businessName: item.user.businessName || item.user.name,
        phone: item.user.phone,
        maskedPhone: item.user.maskedPhone,
        isVerified: item.user.isVerified,
        rating: item.user.rating,
      },
      item.imageKey
    );

    navigation.navigate('Chat & Deals', { activeThreadId: thread.id });
  };

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'MY_LISTINGS') {
      if (!item.isCurrentUserListing) return false;
    } else if (activeTab === 'SELL_OFFERS') {
      if (item.type !== 'SELL_OFFER') return false;
    } else if (activeTab === 'BUY_RFQS') {
      if (item.type !== 'BUY_RFQ') return false;
    }

    if (selectedCatFilter !== 'ALL' && item.categoryId !== selectedCatFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.subcategoryName.toLowerCase().includes(q) ||
        item.address.city.toLowerCase().includes(q) ||
        (item.user.businessName && item.user.businessName.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Live Orderbook & RFQs"
        subtitle="National Dual Scrap Exchange Feed"
        onOpenPaywall={() => {
          setPaywallTargetTitle('');
          setShowPaywall(true);
        }}
      />

      {/* Segmented Dual Orderbook Selector */}
      <View style={styles.segmentedTabWrapper}>
        <TouchableOpacity
          style={[styles.segTab, activeTab === 'BUY_RFQS' && styles.segTabActiveBuy]}
          onPress={() => setActiveTab('BUY_RFQS')}
        >
          <Building2 size={13} color={activeTab === 'BUY_RFQS' ? '#0B1120' : THEME.colors.textSecondary} />
          <Text style={[styles.segTabText, activeTab === 'BUY_RFQS' && styles.segTabTextActiveBuy]}>
            Buyer Demands (RFQs)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segTab, activeTab === 'SELL_OFFERS' && styles.segTabActiveSell]}
          onPress={() => setActiveTab('SELL_OFFERS')}
        >
          <Truck size={13} color={activeTab === 'SELL_OFFERS' ? '#FFFFFF' : THEME.colors.textSecondary} />
          <Text style={[styles.segTabText, activeTab === 'SELL_OFFERS' && styles.segTabTextActiveSell]}>
            Available Stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segTab, activeTab === 'MY_LISTINGS' && styles.segTabActiveMy]}
          onPress={() => setActiveTab('MY_LISTINGS')}
        >
          <Text style={[styles.segTabText, activeTab === 'MY_LISTINGS' && styles.segTabTextActiveMy]}>
            My Active ({listings.filter((l) => l.isCurrentUserListing).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={14} color={THEME.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search material, buyer foundry, city..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Horizontal Chips */}
      <View style={styles.catChipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catChipsScroll}>
          <TouchableOpacity
            style={[styles.catChip, selectedCatFilter === 'ALL' && styles.catChipActive]}
            onPress={() => setSelectedCatFilter('ALL')}
          >
            <Text style={[styles.catChipText, selectedCatFilter === 'ALL' && styles.catChipTextActive]}>
              All Categories
            </Text>
          </TouchableOpacity>

          {SCRAP_CATEGORIES.map((cat) => {
            const isSelected = selectedCatFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, isSelected && styles.catChipActive]}
                onPress={() => setSelectedCatFilter(cat.id)}
              >
                <Image source={getScrapImage(cat.imageKey)} style={styles.catChipThumb} resizeMode="cover" />
                <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orderbook Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {filteredListings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Orders in this View</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'MY_LISTINGS'
                ? 'You have not posted any active buy or sell listings yet.'
                : 'No listings match your current search and category filters.'}
            </Text>
            {activeTab === 'MY_LISTINGS' && (
              <TouchableOpacity
                style={styles.createFirstBtn}
                onPress={() => navigation.navigate('Post Deal')}
              >
                <Plus size={14} color="#FFFFFF" />
                <Text style={styles.createFirstBtnText}>Post First Scrap Deal</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredListings.map((item) => {
            const unlocked = isLeadUnlocked(item.id);
            const isSell = item.type === 'SELL_OFFER';

            return (
              <View
                key={item.id}
                style={[
                  styles.orderCard,
                  isSell ? styles.orderCardSell : styles.orderCardBuy,
                ]}
              >
                {/* Header */}
                <View style={styles.orderCardHeader}>
                  <View style={styles.idAndTagRow}>
                    <View style={styles.idBadge}>
                      <Text style={styles.idBadgeText}>{item.id}</Text>
                    </View>
                    <View style={isSell ? styles.sellTag : styles.buyTag}>
                      <Text style={isSell ? styles.sellTagText : styles.buyTagText}>
                        {isSell ? 'STOCK FOR SALE' : 'BUY REQUIREMENT (RFQ)'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.orderBody}>
                  <Image source={getScrapImage(item.imageKey)} style={styles.orderThumb} resizeMode="cover" />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.orderUser}>
                      👤 {item.user.businessName || item.user.name} ({item.user.userType.replace('_', ' ')})
                    </Text>
                    <View style={styles.orderPriceRow}>
                      <Text style={styles.orderQty}>Quantity: {item.quantity} {item.unit}</Text>
                      <Text style={styles.orderPrice}>
                        {isSell ? 'Asking: ' : 'Budget: '}
                        <Text style={styles.orderPriceHighlight}>₹{item.targetPrice}/{item.unit}</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Location & Slot */}
                <View style={styles.orderMetaBox}>
                  <View style={styles.orderMetaRow}>
                    <MapPin size={12} color={THEME.colors.primary} />
                    <Text style={styles.orderMetaText} numberOfLines={1}>
                      {unlocked
                        ? `${item.address.street}, ${item.address.area}, ${item.address.city}`
                        : `${item.address.area}, ${item.address.city} (Subscribe to view full plot/street address)`}
                    </Text>
                  </View>
                  <View style={styles.orderMetaRow}>
                    <Clock size={12} color={THEME.colors.textMuted} />
                    <Text style={styles.orderMetaText}>
                      Slot: {item.preferredSlot.date} ({item.preferredSlot.timeSlot.toLowerCase()})
                    </Text>
                  </View>
                </View>

                {/* Action Row */}
                <View style={styles.orderActions}>
                  <View style={styles.contactPreview}>
                    <Text style={styles.contactLabel}>{isSell ? 'Seller Phone:' : 'Buyer Phone:'}</Text>
                    <Text style={styles.contactVal}>
                      {unlocked ? item.user.phone : item.user.maskedPhone}
                    </Text>
                  </View>

                  {item.isCurrentUserListing ? (
                    <TouchableOpacity
                      style={styles.cancelMyListingBtn}
                      onPress={() => deleteListing(item.id)}
                    >
                      <Text style={styles.cancelMyListingBtnText}>Cancel Order</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={isSell ? styles.chatBtnSell : styles.chatBtnBuy}
                      onPress={() => handleStartChatOrNegotiate(item)}
                      activeOpacity={0.85}
                    >
                      {unlocked ? (
                        <>
                          <MessageSquare size={13} color={isSell ? '#0B1120' : '#FFFFFF'} />
                          <Text style={isSell ? styles.chatBtnTextSell : styles.chatBtnTextBuy}>
                            Chat & Negotiate
                          </Text>
                        </>
                      ) : (
                        <>
                          <Lock size={12} color={isSell ? '#0B1120' : '#FFFFFF'} />
                          <Text style={isSell ? styles.chatBtnTextSell : styles.chatBtnTextBuy}>
                            Unlock Contact
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Paywall Modal */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        targetLeadTitle={paywallTargetTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  segmentedTabWrapper: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    gap: 6,
  },
  segTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 5,
  },
  segTabActiveBuy: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  segTabActiveSell: {
    backgroundColor: '#064E3B',
    borderColor: THEME.colors.primary,
  },
  segTabActiveMy: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderColor: THEME.colors.primaryLight,
  },
  segTabText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  segTabTextActiveBuy: {
    color: '#0B1120',
    fontWeight: '900',
  },
  segTabTextActiveSell: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  segTabTextActiveMy: {
    color: THEME.colors.primaryLight,
    fontWeight: '900',
  },
  searchSection: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 12,
    paddingVertical: 8,
  },
  catChipsWrapper: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  catChipsScroll: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 5,
  },
  catChipActive: {
    backgroundColor: THEME.colors.primarySoft,
    borderColor: THEME.colors.primary,
  },
  catChipThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  catChipText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
  },
  feedScroll: {
    padding: THEME.spacing.lg,
    paddingBottom: 60,
    gap: 12,
  },
  orderCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  orderCardBuy: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  orderCardSell: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idAndTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  idBadge: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  buyTag: {
    backgroundColor: THEME.colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buyTagText: {
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
  statusBadge: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  orderBody: {
    flexDirection: 'row',
    gap: 10,
  },
  orderThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  orderUser: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  orderPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 2,
  },
  orderQty: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  orderPrice: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  orderPriceHighlight: {
    color: THEME.colors.primaryLight,
    fontSize: 13,
    fontWeight: '900',
  },
  orderMetaBox: {
    backgroundColor: THEME.colors.surface,
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderMetaText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  contactPreview: {
    flex: 1,
  },
  contactLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  contactVal: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  chatBtnBuy: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chatBtnTextBuy: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  chatBtnSell: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chatBtnTextSell: {
    color: '#0B1120',
    fontSize: 11,
    fontWeight: '900',
  },
  cancelMyListingBtn: {
    backgroundColor: THEME.colors.errorSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelMyListingBtnText: {
    color: THEME.colors.error,
    fontSize: 10,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 24,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  createFirstBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
