import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Clock,
  PhoneCall,
  ArrowUpRight,
  ArrowDownLeft,
  PackagePlus,
  Scale,
  Calendar,
} from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';
import { OrderTrackStatus } from '../types';

interface Props {
  navigation: any;
}

export const TrackStatusScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { language, sellListings, buyInquiries, categoryRequests } = useSahiStore();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'ALL' | 'SELL' | 'BUY' | 'CATEGORY'>('ALL');

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const getStatusBadge = (status: OrderTrackStatus | string) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: t.statusReceived,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#F59E0B',
          dot: '🟡',
        };
      case 'CALL_SCHEDULED':
        return {
          label: t.statusCallScheduled,
          bg: 'rgba(56, 189, 248, 0.15)',
          color: '#38BDF8',
          dot: '🔵',
        };
      case 'DEAL_FINALIZED':
        return {
          label: t.statusDealFinalized,
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#10B981',
          dot: '🟢',
        };
      case 'COMPLETED':
        return {
          label: t.statusCompleted,
          bg: 'rgba(148, 163, 184, 0.15)',
          color: '#94A3B8',
          dot: '⚪',
        };
      case 'UNDER_REVIEW':
        return {
          label: t.statusUnderReview,
          bg: 'rgba(168, 85, 247, 0.15)',
          color: '#A855F7',
          dot: '🟣',
        };
      case 'ADDED':
        return {
          label: t.statusAdded,
          bg: 'rgba(16, 185, 129, 0.2)',
          color: '#10B981',
          dot: '✅',
        };
      default:
        return {
          label: status,
          bg: 'rgba(148, 163, 184, 0.15)',
          color: '#94A3B8',
          dot: '⚪',
        };
    }
  };

  // Compile combined list
  const combinedList = [
    ...sellListings.map((s) => ({
      id: s.id,
      categoryId: s.categoryId,
      categoryName: s.categoryName,
      categoryNameHi: s.categoryNameHi,
      displayQty: s.quantity,
      displayPrice: s.expectedPrice,
      unit: s.unit,
      city: s.city,
      status: s.status,
      createdAt: s.createdAt,
      notes: s.notes,
      itemType: 'SELL' as const,
    })),
    ...buyInquiries.map((b) => ({
      id: b.id,
      categoryId: b.categoryId,
      categoryName: b.categoryName,
      categoryNameHi: b.categoryNameHi,
      displayQty: b.requestedQuantity,
      displayPrice: b.offeredPrice || 0,
      unit: b.unit,
      city: b.city,
      status: b.status,
      createdAt: b.createdAt,
      notes: b.notes,
      itemType: 'BUY' as const,
    })),
    ...categoryRequests.map((c) => ({
      id: c.id,
      categoryId: 'custom',
      categoryName: c.itemName,
      categoryNameHi: c.itemName,
      displayQty: c.expectedQuantity,
      displayPrice: 0,
      unit: c.unit,
      city: 'Custom Category',
      status: c.status as any,
      createdAt: c.createdAt,
      notes: c.description,
      itemType: 'CATEGORY' as const,
    })),
  ].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  const filteredItems = combinedList.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.itemType === activeTab;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.screenTitle}>{t.trackScreenTitle}</Text>
          <Text style={styles.screenSub}>{t.trackScreenSub}</Text>
        </View>
        <TouchableOpacity style={styles.callSupportBtn} onPress={handleCall}>
          <PhoneCall size={16} color="#FFFFFF" />
          <Text style={styles.callSupportText}>{t.callNow}</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'ALL' && styles.tabItemActive]}
          onPress={() => setActiveTab('ALL')}
        >
          <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
            {t.tabAll} ({combinedList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'SELL' && styles.tabItemActive]}
          onPress={() => setActiveTab('SELL')}
        >
          <Text style={[styles.tabText, activeTab === 'SELL' && styles.tabTextActive]}>
            {t.tabSell} ({sellListings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'BUY' && styles.tabItemActive]}
          onPress={() => setActiveTab('BUY')}
        >
          <Text style={[styles.tabText, activeTab === 'BUY' && styles.tabTextActive]}>
            {t.tabBuy} ({buyInquiries.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CATEGORY' && styles.tabItemActive]}
          onPress={() => setActiveTab('CATEGORY')}
        >
          <Text style={[styles.tabText, activeTab === 'CATEGORY' && styles.tabTextActive]}>
            {t.tabCategory} ({categoryRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={52} color="#334155" />
            <Text style={styles.emptyTitle}>{t.noOrders}</Text>
            <Text style={styles.emptySub}>
              {language === 'hi'
                ? 'कबाड़ बेचने या खरीदने की रिक्वेस्ट डालें, वो यहाँ दिखेगी।'
                : 'Post a sell listing or buy inquiry to track progress here.'}
            </Text>
            <View style={styles.emptyBtnRow}>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('Sell')}
              >
                <Text style={styles.emptyBtnText}>+ {t.navSell}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: '#1E293B' }]}
                onPress={() => navigation.navigate('Buy')}
              >
                <Text style={styles.emptyBtnText}>+ {t.navBuy}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          filteredItems.map((item) => {
            const badge = getStatusBadge(item.status);
            const isSell = item.itemType === 'SELL';
            const isBuy = item.itemType === 'BUY';

            return (
              <View key={item.id} style={styles.orderCard}>
                {/* Card Top */}
                <View style={styles.cardHeader}>
                  <View style={styles.typeBadgeRow}>
                    <View
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor: isSell
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isBuy
                            ? 'rgba(56, 189, 248, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        },
                      ]}
                    >
                      {isSell && <ArrowUpRight size={14} color={THEME.colors.primary} />}
                      {isBuy && <ArrowDownLeft size={14} color="#38BDF8" />}
                      {item.itemType === 'CATEGORY' && <PackagePlus size={14} color="#F59E0B" />}
                      <Text
                        style={[
                          styles.typeBadgeText,
                          {
                            color: isSell
                              ? THEME.colors.primaryLight
                              : isBuy
                              ? '#38BDF8'
                              : '#F59E0B',
                          },
                        ]}
                      >
                        {isSell
                          ? language === 'hi'
                            ? 'बेचने का ऑर्डर'
                            : 'Sell Offer'
                          : isBuy
                          ? language === 'hi'
                            ? 'खरीद पूछताछ'
                            : 'Buy Inquiry'
                          : language === 'hi'
                          ? 'नई कैटेगरी रिक्वेस्ट'
                          : 'New Category'}
                      </Text>
                    </View>
                    <Text style={styles.orderIdText}>#{item.id}</Text>
                  </View>

                  {/* Status Pill */}
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={styles.statusDot}>{badge.dot}</Text>
                    <Text style={[styles.statusText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Title & Material */}
                <Text style={styles.materialName}>
                  {language === 'hi' ? item.categoryNameHi : item.categoryName}
                </Text>

                {/* Details Grid */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t.quantity}</Text>
                    <Text style={styles.detailValue}>
                      {item.displayQty.toLocaleString('en-IN')}{' '}
                      {item.unit === 'kg' ? (language === 'hi' ? 'किग्रा' : 'Kg') : (language === 'hi' ? 'टन' : 'Ton')}
                    </Text>
                  </View>

                  {item.displayPrice > 0 && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>
                        {isSell ? t.expectedRate : t.targetBudgetRate}
                      </Text>
                      <Text style={[styles.detailValue, { color: THEME.colors.primaryLight }]}>
                        ₹{item.displayPrice}/{item.unit}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t.city}</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {item.city}
                    </Text>
                  </View>
                </View>

                {/* Notes if available */}
                {item.notes ? (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText} numberOfLines={2}>
                      📝 {item.notes}
                    </Text>
                  </View>
                ) : null}

                {/* Footer with date & quick helpline call */}
                <View style={styles.cardFooter}>
                  <View style={styles.dateRow}>
                    <Calendar size={13} color="#64748B" />
                    <Text style={styles.dateText}>{item.createdAt}</Text>
                  </View>

                  <TouchableOpacity style={styles.discussBtn} onPress={handleCall}>
                    <PhoneCall size={14} color="#A7F3D0" />
                    <Text style={styles.discussBtnText}>
                      {language === 'hi' ? 'बात करें' : 'Discuss Deal'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
  callSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  callSupportText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  tabItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#111C2E',
  },
  tabItemActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#111C2E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  orderIdText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    fontSize: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  materialName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131D31',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  notesText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    color: '#64748B',
    fontSize: 11,
  },
  discussBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  discussBtnText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  emptySub: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  emptyBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
