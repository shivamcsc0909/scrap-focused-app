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
  Boxes,
  Plus,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { getScrapImage } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';
import { InventoryItem, InventoryStatus } from '../types';
import { AddInventoryModal } from '../components/AddInventoryModal';

export const InventoryScreen: React.FC = () => {
  const {
    inventory,
    updateInventoryItem,
    deleteInventoryItem,
    mandiRates,
    updateMandiRate,
  } = useScrapStore();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'RATES' | 'BLOCKED'>('STOCK');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [newRateInput, setNewRateInput] = useState('');

  // Calculate stock metrics
  const activeStockItems = inventory.filter((item) => item.status !== 'BLOCKED');
  const blockedItems = inventory.filter((item) => item.status === 'BLOCKED');

  const totalQuantityKg = activeStockItems.reduce((acc, item) => acc + item.quantityKg, 0);
  const totalPurchaseValue = activeStockItems.reduce(
    (acc, item) => acc + item.quantityKg * item.buyPricePerKg,
    0
  );
  const totalMarketValue = activeStockItems.reduce(
    (acc, item) => acc + item.quantityKg * item.currentMandiRate,
    0
  );
  const totalEstProfit = totalMarketValue - totalPurchaseValue;

  const handleToggleStatus = (item: InventoryItem, nextStatus: InventoryStatus) => {
    updateInventoryItem(item.id, { status: nextStatus });
  };

  const handleStartEditRate = (rateId: string, currentVal: number) => {
    setEditingRateId(rateId);
    setNewRateInput(String(currentVal));
  };

  const handleSaveMandiRate = (rateId: string) => {
    const num = parseFloat(newRateInput);
    if (!isNaN(num) && num > 0) {
      updateMandiRate(rateId, num);
      setEditingRateId(null);
      Alert.alert('Rate Updated', `Today's mandi benchmark rate updated to ₹${num}/kg.`);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Inventory & Mandi"
        subtitle="Warehouse Stock Valuation & Price Sheet"
      />

      {/* Top Valuation Summary Header */}
      <View style={styles.valuationCard}>
        <View style={styles.valuationTop}>
          <Text style={styles.valuationLabel}>Total Stock Market Value</Text>
          <View style={styles.profitBadge}>
            <TrendingUp size={12} color={THEME.colors.primaryLight} />
            <Text style={styles.profitBadgeText}>
              +₹{Math.max(0, totalEstProfit).toLocaleString('en-IN')} Margin
            </Text>
          </View>
        </View>

        <Text style={styles.valuationAmount}>
          ₹{totalMarketValue.toLocaleString('en-IN')}
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCol}>
            <Text style={styles.metricVal}>{(totalQuantityKg / 1000).toFixed(2)} Tons</Text>
            <Text style={styles.metricLbl}>Total Weight</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={styles.metricVal}>₹{totalPurchaseValue.toLocaleString('en-IN')}</Text>
            <Text style={styles.metricLbl}>Purchase Cost</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={[styles.metricVal, { color: THEME.colors.accent }]}>
              {activeStockItems.length} Lots
            </Text>
            <Text style={styles.metricLbl}>Active Batches</Text>
          </View>
        </View>
      </View>

      {/* Segmented Tab Selector */}
      <View style={styles.segmentedTabs}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'STOCK' && styles.tabBtnActive]}
          onPress={() => setActiveTab('STOCK')}
        >
          <Boxes size={14} color={activeTab === 'STOCK' ? THEME.colors.primaryLight : THEME.colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'STOCK' && styles.tabBtnTextActive]}>
            Stock ({activeStockItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'RATES' && styles.tabBtnActive]}
          onPress={() => setActiveTab('RATES')}
        >
          <TrendingUp size={14} color={activeTab === 'RATES' ? THEME.colors.primaryLight : THEME.colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'RATES' && styles.tabBtnTextActive]}>
            Mandi Rates ({mandiRates.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'BLOCKED' && styles.tabBtnActive]}
          onPress={() => setActiveTab('BLOCKED')}
        >
          <ShieldAlert size={14} color={activeTab === 'BLOCKED' ? THEME.colors.warning : THEME.colors.textSecondary} />
          <Text style={[styles.tabBtnText, activeTab === 'BLOCKED' && styles.tabBtnTextActive]}>
            Quarantine ({blockedItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: ACTIVE WAREHOUSE STOCK */}
        {activeTab === 'STOCK' && (
          <>
            {/* Add Stock Action Row */}
            <View style={styles.actionRow}>
              <View style={styles.searchBox}>
                <Search size={14} color={THEME.colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Filter stock by SKU or name..."
                  placeholderTextColor={THEME.colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <TouchableOpacity
                style={styles.addStockBtn}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.85}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addStockBtnText}>Add Batch</Text>
              </TouchableOpacity>
            </View>

            {/* Inventory Items List */}
            <View style={styles.itemsList}>
              {activeStockItems.map((item) => {
                const estLotProfit = Math.round(
                  item.quantityKg * (item.currentMandiRate - item.buyPricePerKg)
                );

                return (
                  <View key={item.id} style={styles.stockCard}>
                    <View style={styles.stockCardTop}>
                      <View style={styles.skuBadge}>
                        <Text style={styles.skuText}>{item.sku}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          item.status === 'IN_STOCK'
                            ? styles.statusInStock
                            : item.status === 'RESERVED'
                            ? styles.statusReserved
                            : styles.statusSold,
                        ]}
                      >
                        <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
                      </View>
                    </View>

                    <View style={styles.stockBody}>
                      <Image
                        source={getScrapImage(item.imageKey)}
                        style={styles.stockThumb}
                        resizeMode="cover"
                      />
                      <View style={styles.stockDetails}>
                        <Text style={styles.stockName}>{item.name}</Text>
                        <Text style={styles.stockLocation}>📍 {item.warehouseLocation}</Text>

                        {/* Price & Weight Matrix */}
                        <View style={styles.matrixRow}>
                          <View>
                            <Text style={styles.matrixLbl}>Quantity</Text>
                            <Text style={styles.matrixVal}>{item.quantityKg} kg</Text>
                          </View>
                          <View>
                            <Text style={styles.matrixLbl}>Buy Price</Text>
                            <Text style={styles.matrixVal}>₹{item.buyPricePerKg}/kg</Text>
                          </View>
                          <View>
                            <Text style={styles.matrixLbl}>Mandi Rate</Text>
                            <Text style={[styles.matrixVal, { color: THEME.colors.primaryLight }]}>
                              ₹{item.currentMandiRate}/kg
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Footer Actions */}
                    <View style={styles.stockFooter}>
                      <View>
                        <Text style={styles.footerProfitLbl}>Estimated Lot Profit</Text>
                        <Text
                          style={[
                            styles.footerProfitVal,
                            { color: estLotProfit >= 0 ? THEME.colors.primaryLight : THEME.colors.error },
                          ]}
                        >
                          {estLotProfit >= 0 ? `+₹${estLotProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(estLotProfit)}`}
                        </Text>
                      </View>

                      <View style={styles.stockBtnGroup}>
                        <TouchableOpacity
                          style={styles.actionPill}
                          onPress={() =>
                            handleToggleStatus(
                              item,
                              item.status === 'IN_STOCK' ? 'RESERVED' : 'IN_STOCK'
                            )
                          }
                        >
                          <Text style={styles.actionPillText}>
                            {item.status === 'IN_STOCK' ? 'Reserve' : 'Make In-Stock'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionPill, styles.actionPillBlock]}
                          onPress={() => handleToggleStatus(item, 'BLOCKED')}
                        >
                          <Text style={styles.actionPillBlockText}>Quarantine</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* TAB 2: LIVE MANDI DAILY RATE MANAGER */}
        {activeTab === 'RATES' && (
          <View style={styles.ratesSection}>
            <View style={styles.ratesHeaderBox}>
              <Text style={styles.ratesHeaderTitle}>Live Daily Scrap Price Sheet</Text>
              <Text style={styles.ratesHeaderSub}>
                Real-time wholesale mandi quotes. Tap "Edit" to customize your yard's purchase board.
              </Text>
            </View>

            <View style={styles.ratesTable}>
              {mandiRates.map((rate) => {
                const isEditing = editingRateId === rate.id;
                const isPositive = rate.changeToday >= 0;

                return (
                  <View key={rate.id} style={styles.rateTableRow}>
                    <Image
                      source={getScrapImage(rate.imageKey)}
                      style={styles.tableThumb}
                      resizeMode="cover"
                    />

                    <View style={styles.tableMaterialInfo}>
                      <Text style={styles.tableMaterialName}>{rate.materialName}</Text>
                      <Text style={styles.tableCategory}>{rate.categoryName} • {rate.marketLocation}</Text>
                    </View>

                    {isEditing ? (
                      <View style={styles.editRateRow}>
                        <TextInput
                          style={styles.editRateInput}
                          value={newRateInput}
                          onChangeText={setNewRateInput}
                          keyboardType="numeric"
                          autoFocus
                        />
                        <TouchableOpacity
                          style={styles.saveRateBtn}
                          onPress={() => handleSaveMandiRate(rate.id)}
                        >
                          <CheckCircle size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.tablePriceCol}>
                        <Text style={styles.tablePrice}>₹{rate.currentRate}/{rate.unit}</Text>
                        <View style={styles.rateTrendRow}>
                          {isPositive ? (
                            <TrendingUp size={10} color={THEME.colors.primaryLight} />
                          ) : (
                            <TrendingDown size={10} color={THEME.colors.error} />
                          )}
                          <Text
                            style={[
                              styles.rateTrendText,
                              { color: isPositive ? THEME.colors.primaryLight : THEME.colors.error },
                            ]}
                          >
                            {isPositive ? `+₹${rate.changeToday}` : `-₹${Math.abs(rate.changeToday)}`}
                          </Text>
                        </View>
                      </View>
                    )}

                    {!isEditing && (
                      <TouchableOpacity
                        style={styles.editIconBtn}
                        onPress={() => handleStartEditRate(rate.id, rate.currentRate)}
                      >
                        <Edit2 size={13} color={THEME.colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 3: BLOCKED / QUARANTINE ITEMS */}
        {activeTab === 'BLOCKED' && (
          <View style={styles.blockedSection}>
            <View style={styles.blockedNotice}>
              <ShieldAlert size={18} color={THEME.colors.warning} />
              <Text style={styles.blockedNoticeText}>
                These scrap lots are quarantined for quality verification or flagged as draft.
              </Text>
            </View>

            {blockedItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No quarantined or blocked scrap items.</Text>
              </View>
            ) : (
              blockedItems.map((item) => (
                <View key={item.id} style={styles.stockCard}>
                  <View style={styles.stockCardTop}>
                    <Text style={styles.skuText}>{item.sku}</Text>
                    <View style={[styles.statusBadge, styles.statusBlocked]}>
                      <Text style={styles.statusBlockedText}>BLOCKED / INSPECTION</Text>
                    </View>
                  </View>

                  <View style={styles.stockBody}>
                    <Image source={getScrapImage(item.imageKey)} style={styles.stockThumb} resizeMode="cover" />
                    <View style={styles.stockDetails}>
                      <Text style={styles.stockName}>{item.name}</Text>
                      <Text style={styles.stockLocation}>{item.quantityKg} kg • Cost ₹{item.buyPricePerKg}/kg</Text>
                      {item.notes && <Text style={styles.notesText}>{item.notes}</Text>}
                    </View>
                  </View>

                  <View style={styles.stockFooter}>
                    <TouchableOpacity
                      style={styles.unblockBtn}
                      onPress={() => handleToggleStatus(item, 'IN_STOCK')}
                    >
                      <Text style={styles.unblockBtnText}>Unblock & Move to Active Stock</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Inventory Modal */}
      <AddInventoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  valuationCard: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  valuationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valuationLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  profitBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  valuationAmount: {
    color: THEME.colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    marginTop: 6,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  metricLbl: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 18,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  segmentedTabs: {
    flexDirection: 'row',
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: THEME.colors.surface,
  },
  tabBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: THEME.colors.primaryLight,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 60,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
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
  addStockBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 4,
  },
  addStockBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  itemsList: {
    gap: 12,
  },
  stockCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  stockCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skuBadge: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skuText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  statusInStock: {
    backgroundColor: THEME.colors.primarySoft,
  },
  statusReserved: {
    backgroundColor: THEME.colors.accentSoft,
  },
  statusSold: {
    backgroundColor: THEME.colors.surfaceBorder,
  },
  statusBlocked: {
    backgroundColor: THEME.colors.warningSoft,
  },
  statusText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  statusBlockedText: {
    color: THEME.colors.warning,
    fontSize: 10,
    fontWeight: '800',
  },
  stockBody: {
    flexDirection: 'row',
    gap: 10,
  },
  stockThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  stockLocation: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    backgroundColor: THEME.colors.surface,
    padding: 6,
    borderRadius: 6,
  },
  matrixLbl: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  matrixVal: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  stockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  footerProfitLbl: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  footerProfitVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  stockBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  actionPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  actionPillText: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  actionPillBlock: {
    borderColor: THEME.colors.warning,
  },
  actionPillBlockText: {
    color: THEME.colors.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  ratesSection: {
    gap: 12,
  },
  ratesHeaderBox: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  ratesHeaderTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  ratesHeaderSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  ratesTable: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  rateTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
    gap: 10,
  },
  tableThumb: {
    width: 38,
    height: 38,
    borderRadius: 6,
  },
  tableMaterialInfo: {
    flex: 1,
  },
  tableMaterialName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  tableCategory: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  tablePriceCol: {
    alignItems: 'flex-end',
  },
  tablePrice: {
    color: THEME.colors.primaryLight,
    fontSize: 14,
    fontWeight: '900',
  },
  rateTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  rateTrendText: {
    fontSize: 9,
    fontWeight: '700',
  },
  editIconBtn: {
    padding: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: 6,
  },
  editRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editRateInput: {
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    width: 70,
  },
  saveRateBtn: {
    backgroundColor: THEME.colors.primary,
    padding: 6,
    borderRadius: 4,
  },
  blockedSection: {
    gap: 12,
  },
  blockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.warningSoft,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.colors.warning,
  },
  blockedNoticeText: {
    color: THEME.colors.warning,
    fontSize: 11,
    flex: 1,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  notesText: {
    color: THEME.colors.warning,
    fontSize: 10,
    marginTop: 4,
  },
  unblockBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    width: '100%',
  },
  unblockBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
