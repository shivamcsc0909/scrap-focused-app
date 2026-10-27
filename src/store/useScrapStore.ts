import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserRole,
  ListingType,
  MarketListing,
  PriceAlert,
  NegotiationThread,
  ChatMessage,
  InventoryItem,
  MandiRate,
  UserSubscription,
  SubscriptionPlanId,
  LeadStatus,
} from '../types';
import {
  INITIAL_MARKET_LISTINGS,
  INITIAL_PRICE_ALERTS,
  INITIAL_NEGOTIATION_THREADS,
  INITIAL_INVENTORY,
  SUBSCRIPTION_PLANS,
} from '../constants/plans';
import { INITIAL_MANDI_RATES } from '../constants/categories';

interface ConflictCheckResult {
  allowed: boolean;
  conflictingListing?: MarketListing;
  reason?: string;
}

interface ScrapStoreState {
  // Active perspective
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Selected Location for filters
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Dual Orderbook Listings (Sell Offers & Buy RFQs)
  listings: MarketListing[];
  validateListingCreation: (subcategoryId: string, listingType: ListingType) => ConflictCheckResult;
  addListing: (listing: Omit<MarketListing, 'id' | 'createdAt' | 'status' | 'isCurrentUserListing'>) => MarketListing;
  updateListingStatus: (id: string, status: LeadStatus) => void;
  deleteListing: (id: string) => void;

  // Price Target Alerts ("Buy Low / Sell High")
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'active'>) => PriceAlert;
  togglePriceAlert: (id: string) => void;
  deletePriceAlert: (id: string) => void;

  // In-App Direct Chat & Negotiation
  threads: NegotiationThread[];
  createOrGetThread: (
    listingId: string,
    listingTitle: string,
    listingType: ListingType,
    participant: NegotiationThread['participant'],
    materialImageKey: any
  ) => NegotiationThread;
  sendMessage: (
    threadId: string,
    text: string,
    isOffer?: boolean,
    offerPrice?: number,
    offerQuantity?: number,
    offerUnit?: string
  ) => void;
  respondToOffer: (threadId: string, messageId: string, accept: boolean) => void;

  // Dealer Subscription & Paywall
  subscription: UserSubscription;
  subscribeToPlan: (planId: SubscriptionPlanId) => void;
  cancelSubscription: () => void;
  unlockLead: (leadId: string) => boolean;
  isLeadUnlocked: (leadId: string) => boolean;

  // Warehouse Inventory Management
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'sku' | 'lastUpdated'>) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Live Mandi Rates
  mandiRates: MandiRate[];
  updateMandiRate: (id: string, newRate: number) => void;

  // Reset database for testing
  resetToDefaults: () => void;
}

const DEFAULT_SUBSCRIPTION: UserSubscription = {
  planId: 'FREE',
  active: false,
  startDate: null,
  expiryDate: null,
  leadsUnlockedCount: 0,
  totalLeadsAllowed: 0,
  unlockedLeadIds: [],
};

export const useScrapStore = create<ScrapStoreState>()(
  persist(
    (set, get) => ({
      userRole: 'BOTH',
      setUserRole: (userRole) => set({ userRole }),

      selectedCity: 'All India',
      setSelectedCity: (selectedCity) => set({ selectedCity }),

      listings: INITIAL_MARKET_LISTINGS,

      validateListingCreation: (subcategoryId: string, listingType: ListingType): ConflictCheckResult => {
        const state = get();
        // A user cannot simultaneously have an active SELL_OFFER and an active BUY_RFQ for the SAME subcategory
        const oppositeType: ListingType = listingType === 'SELL_OFFER' ? 'BUY_RFQ' : 'SELL_OFFER';

        const conflicting = state.listings.find(
          (item) =>
            item.isCurrentUserListing &&
            item.subcategoryId === subcategoryId &&
            item.type === oppositeType &&
            (item.status === 'OPEN' || item.status === 'IN_NEGOTIATION')
        );

        if (conflicting) {
          const oppositeLabel = oppositeType === 'SELL_OFFER' ? 'Sell Offer (Stock Available)' : 'Buy Requirement (RFQ)';
          const attemptLabel = listingType === 'SELL_OFFER' ? 'Sell Offer' : 'Buy Requirement';
          return {
            allowed: false,
            conflictingListing: conflicting,
            reason: `Conflict of Interest Policy: You already have an active ${oppositeLabel} for "${conflicting.subcategoryName}". To prevent wash-trading and maintain compliance with Indian B2B Marketplace regulations, you cannot post a ${attemptLabel} for the same item at the same time. Please close or cancel your existing listing first.`,
          };
        }

        return { allowed: true };
      },

      addListing: (listingData) => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const prefix = listingData.type === 'SELL_OFFER' ? 'SELL-L' : 'BUY-RFQ';
        const newListing: MarketListing = {
          ...listingData,
          id: `${prefix}-${randomNum}`,
          status: 'OPEN',
          createdAt: new Date().toISOString(),
          isCurrentUserListing: true,
        };

        set((state) => ({
          listings: [newListing, ...state.listings],
        }));

        return newListing;
      },

      updateListingStatus: (id, status) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, status } : l)),
        }));
      },

      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        }));
      },

      priceAlerts: INITIAL_PRICE_ALERTS,

      addPriceAlert: (alertData) => {
        const newAlert: PriceAlert = {
          ...alertData,
          id: `ALT-${Date.now()}`,
          createdAt: 'Just now',
          active: true,
        };

        set((state) => ({
          priceAlerts: [newAlert, ...state.priceAlerts],
        }));

        return newAlert;
      },

      togglePriceAlert: (id) => {
        set((state) => ({
          priceAlerts: state.priceAlerts.map((a) =>
            a.id === id ? { ...a, active: !a.active } : a
          ),
        }));
      },

      deletePriceAlert: (id) => {
        set((state) => ({
          priceAlerts: state.priceAlerts.filter((a) => a.id !== id),
        }));
      },

      threads: INITIAL_NEGOTIATION_THREADS,

      createOrGetThread: (listingId, listingTitle, listingType, participant, materialImageKey) => {
        const state = get();
        const existing = state.threads.find(
          (t) => t.listingId === listingId && t.participant.id === participant.id
        );

        if (existing) return existing;

        const newThread: NegotiationThread = {
          id: `TH-${Date.now()}`,
          listingId,
          listingTitle,
          listingType,
          materialImageKey,
          participant,
          lastMessage: 'Negotiation started',
          lastUpdated: 'Just now',
          unreadCount: 0,
          dealAgreed: false,
          messages: [
            {
              id: `M-${Date.now()}`,
              senderId: 'current_user',
              senderName: 'You',
              text: `Hello ${participant.name}, I am interested in your ${listingType === 'SELL_OFFER' ? 'Sell Offer' : 'Buy Requirement'}: "${listingTitle}". Let's discuss pricing and pickup terms.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };

        set({ threads: [newThread, ...state.threads] });
        return newThread;
      },

      sendMessage: (threadId, text, isOffer = false, offerPrice, offerQuantity, offerUnit = 'kg') => {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: ChatMessage = {
          id: `MSG-${Date.now()}`,
          senderId: 'current_user',
          senderName: 'You',
          text,
          timestamp: timeNow,
          isOffer,
          offerPrice,
          offerQuantity,
          offerUnit,
          offerStatus: isOffer ? 'PENDING' : undefined,
        };

        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id === threadId) {
              return {
                ...t,
                lastMessage: isOffer ? `Sent offer: ₹${offerPrice}/${offerUnit} for ${offerQuantity}${offerUnit}` : text,
                lastUpdated: 'Just now',
                messages: [...t.messages, newMessage],
              };
            }
            return t;
          }),
        }));
      },

      respondToOffer: (threadId, messageId, accept) => {
        set((state) => ({
          threads: state.threads.map((t) => {
            if (t.id === threadId) {
              const updatedMessages = t.messages.map((m) => {
                if (m.id === messageId) {
                  return { ...m, offerStatus: accept ? ('ACCEPTED' as const) : ('REJECTED' as const) };
                }
                return m;
              });

              const acceptedOffer = updatedMessages.find((m) => m.id === messageId);
              const totalAgreed =
                acceptedOffer && acceptedOffer.offerPrice && acceptedOffer.offerQuantity
                  ? acceptedOffer.offerPrice * acceptedOffer.offerQuantity
                  : undefined;

              return {
                ...t,
                dealAgreed: accept ? true : t.dealAgreed,
                agreedAmount: accept ? totalAgreed : t.agreedAmount,
                lastMessage: accept ? `Deal agreed at ₹${acceptedOffer?.offerPrice}/${acceptedOffer?.offerUnit}` : 'Offer declined',
                lastUpdated: 'Just now',
                messages: updatedMessages,
              };
            }
            return t;
          }),
        }));
      },

      subscription: DEFAULT_SUBSCRIPTION,

      subscribeToPlan: (planId: SubscriptionPlanId) => {
        const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
        if (!plan) return;

        const now = new Date();
        const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

        set({
          subscription: {
            planId,
            active: true,
            startDate: now.toISOString(),
            expiryDate: expiry.toISOString(),
            leadsUnlockedCount: 0,
            totalLeadsAllowed: plan.leadLimit === 'UNLIMITED' ? 99999 : plan.leadLimit,
            unlockedLeadIds: [],
          },
        });
      },

      cancelSubscription: () => {
        set({ subscription: DEFAULT_SUBSCRIPTION });
      },

      unlockLead: (leadId: string) => {
        const state = get();
        const sub = state.subscription;

        if (sub.unlockedLeadIds.includes(leadId)) {
          return true;
        }

        if (sub.active && sub.leadsUnlockedCount < sub.totalLeadsAllowed) {
          set({
            subscription: {
              ...sub,
              leadsUnlockedCount: sub.leadsUnlockedCount + 1,
              unlockedLeadIds: [...sub.unlockedLeadIds, leadId],
            },
          });
          return true;
        }

        return false;
      },

      isLeadUnlocked: (leadId: string) => {
        const sub = get().subscription;
        if (!sub.active) return false;
        if (sub.totalLeadsAllowed >= 9999) return true;
        return sub.unlockedLeadIds.includes(leadId);
      },

      inventory: INITIAL_INVENTORY,

      addInventoryItem: (itemData) => {
        const randomNum = Math.floor(100 + Math.random() * 900);
        const skuPrefix = itemData.categoryId.replace('cat-', '').substring(0, 3).toUpperCase();
        const newItem: InventoryItem = {
          ...itemData,
          id: `INV-${Date.now()}`,
          sku: `SB-${skuPrefix}-${randomNum}`,
          lastUpdated: 'Just now',
        };

        set((state) => ({
          inventory: [newItem, ...state.inventory],
        }));

        return newItem;
      },

      updateInventoryItem: (id, updates) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id ? { ...item, ...updates, lastUpdated: 'Just now' } : item
          ),
        }));
      },

      deleteInventoryItem: (id) => {
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== id),
        }));
      },

      mandiRates: INITIAL_MANDI_RATES,

      updateMandiRate: (id, newRate) => {
        set((state) => ({
          mandiRates: state.mandiRates.map((rate) => {
            if (rate.id === id) {
              const diff = newRate - rate.currentRate;
              const percent = Number(((diff / rate.currentRate) * 100).toFixed(2));
              return {
                ...rate,
                previousRate: rate.currentRate,
                currentRate: newRate,
                highestBuyBid: newRate + 5,
                lowestSellAsk: newRate - 5,
                changeToday: diff,
                changePercent: percent,
                updatedAt: 'Just now',
              };
            }
            return rate;
          }),
        }));
      },

      resetToDefaults: () => {
        set({
          userRole: 'BOTH',
          selectedCity: 'All India',
          listings: INITIAL_MARKET_LISTINGS,
          priceAlerts: INITIAL_PRICE_ALERTS,
          threads: INITIAL_NEGOTIATION_THREADS,
          subscription: DEFAULT_SUBSCRIPTION,
          inventory: INITIAL_INVENTORY,
          mandiRates: INITIAL_MANDI_RATES,
        });
      },
    }),
    {
      name: 'scrapbazaar-legal-market-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
