import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppLanguage,
  SahiUserProfile,
  UserBusinessType,
  SahiSellListing,
  SahiBuyInquiry,
  SahiCategoryRequest,
  OrderTrackStatus,
} from '../types';
import { INITIAL_TRACKING_ORDERS } from '../constants/scrapData';

interface SahiStoreState {
  language: AppLanguage;
  hasSeenWelcome: boolean;
  isGuest: boolean;
  user: SahiUserProfile;

  // Tracked Orders
  sellListings: SahiSellListing[];
  buyInquiries: SahiBuyInquiry[];
  categoryRequests: SahiCategoryRequest[];

  // Actions
  setLanguage: (lang: AppLanguage) => void;
  setHasSeenWelcome: (val: boolean) => void;
  setUser: (profile: Partial<SahiUserProfile>) => void;
  loginAsGuest: () => void;
  loginWithPhone: (phone: string, name?: string, city?: string, businessType?: any) => void;
  completeOnboarding: (data: {
    name: string;
    businessType: UserBusinessType;
    customRoleMessage?: string;
    gstin?: string;
    phone?: string;
    isGuest?: boolean;
  }) => void;
  logout: () => void;

  // Submissions
  addSellListing: (listing: Omit<SahiSellListing, 'id' | 'createdAt' | 'status'>) => SahiSellListing;
  addBuyInquiry: (inquiry: Omit<SahiBuyInquiry, 'id' | 'createdAt' | 'status'>) => SahiBuyInquiry;
  addCategoryRequest: (req: Omit<SahiCategoryRequest, 'id' | 'createdAt' | 'status'>) => SahiCategoryRequest;
  updateOrderStatus: (id: string, newStatus: OrderTrackStatus) => void;
}

const DEFAULT_USER: SahiUserProfile = {
  id: 'guest_user',
  name: 'Guest Trader',
  phone: '+91 98000 00000',
  businessType: 'CUSTOMER',
  businessName: 'Local Scrap Enterprise',
  city: 'Indore, MP',
  isGuest: true,
  isOnboarded: false,
};

// Initial state with pre-populated sample orders
const INITIAL_SELL_LISTINGS: SahiSellListing[] = [
  {
    id: 'SB-8821',
    categoryId: 'iron-steel',
    categoryName: 'Iron & Steel Scrap',
    categoryNameHi: 'लोहा और एमएस स्क्रैप',
    expectedPrice: 39,
    quantity: 3500,
    unit: 'kg',
    city: 'Indore, MP',
    status: 'DEAL_FINALIZED',
    createdAt: '2026-10-12 14:30',
    notes: 'HMS 1 structural beams ready for dispatch',
  },
  {
    id: 'SB-8819',
    categoryId: 'aluminium',
    categoryName: 'Aluminium Scrap',
    categoryNameHi: 'एल्युमिनियम स्क्रैप',
    expectedPrice: 198,
    quantity: 1200,
    unit: 'kg',
    city: 'Pithampur, MP',
    status: 'CALL_SCHEDULED',
    createdAt: '2026-10-13 09:20',
    notes: 'Section 6063 clean cut pieces',
  }
];

const INITIAL_BUY_INQUIRIES: SahiBuyInquiry[] = [
  {
    id: 'SB-8822',
    categoryId: 'copper',
    categoryName: 'Copper Scrap',
    categoryNameHi: 'तांबा स्क्रैप',
    requestedQuantity: 800,
    unit: 'kg',
    offeredPrice: 765,
    city: 'Ahmedabad, Gujarat',
    status: 'CALL_SCHEDULED',
    createdAt: '2026-10-13 11:15',
    notes: 'Buyer requested Millberry wire for smelting plant',
  }
];

const INITIAL_CATEGORY_REQUESTS: SahiCategoryRequest[] = [
  {
    id: 'SB-8823',
    itemName: 'Lead Armored Cable (लेड केबल)',
    intent: 'SELL',
    expectedQuantity: 1200,
    unit: 'kg',
    phone: '+91 98222 11111',
    status: 'UNDER_REVIEW',
    createdAt: '2026-10-13 16:45',
    description: 'Request to add underground heavy power lead scrap',
  }
];

export const useSahiStore = create<SahiStoreState>()(
  persist(
    (set, get) => ({
      language: 'hi', // Default to Hindi as per target Indian market requirement
      hasSeenWelcome: false,
      isGuest: true,
      user: DEFAULT_USER,

      sellListings: INITIAL_SELL_LISTINGS,
      buyInquiries: INITIAL_BUY_INQUIRIES,
      categoryRequests: INITIAL_CATEGORY_REQUESTS,

      setLanguage: (lang) => set({ language: lang }),
      setHasSeenWelcome: (val) => set({ hasSeenWelcome: val }),
      
      setUser: (profile) =>
        set((state) => ({
          user: { ...state.user, ...profile },
        })),

      loginAsGuest: () =>
        set((state) => ({
          isGuest: true,
          user: {
            ...DEFAULT_USER,
            id: 'guest_' + Math.floor(1000 + Math.random() * 9000),
            isGuest: true,
            isOnboarded: false,
          },
        })),

      loginWithPhone: (phone, name, city, businessType) =>
        set((state) => ({
          isGuest: false,
          user: {
            id: 'user_' + Math.floor(10000 + Math.random() * 90000),
            phone: phone || '+91 98000 00000',
            name: name || '',
            city: city || 'Local Yard',
            businessType: businessType || 'CUSTOMER',
            isGuest: false,
            isOnboarded: false,
          },
        })),

      completeOnboarding: (data) =>
        set((state) => ({
          hasSeenWelcome: true,
          isGuest: data.isGuest !== undefined ? data.isGuest : state.isGuest,
          user: {
            ...state.user,
            name: data.name.trim() || (state.isGuest ? 'Guest User' : 'Scrap Partner'),
            businessType: data.businessType,
            customRoleMessage: data.customRoleMessage?.trim() || undefined,
            gstin: data.gstin?.trim() || undefined,
            phone: data.phone || state.user.phone,
            isGuest: data.isGuest !== undefined ? data.isGuest : state.isGuest,
            isOnboarded: true,
          },
        })),

      logout: () =>
        set({
          isGuest: true,
          hasSeenWelcome: false,
          user: DEFAULT_USER,
        }),

      addSellListing: (listing) => {
        const id = 'SB-S' + Math.floor(1000 + Math.random() * 9000);
        const newListing: SahiSellListing = {
          ...listing,
          id,
          status: 'RECEIVED',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({
          sellListings: [newListing, ...state.sellListings],
        }));
        return newListing;
      },

      addBuyInquiry: (inquiry) => {
        const id = 'SB-B' + Math.floor(1000 + Math.random() * 9000);
        const newInquiry: SahiBuyInquiry = {
          ...inquiry,
          id,
          status: 'RECEIVED',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({
          buyInquiries: [newInquiry, ...state.buyInquiries],
        }));
        return newInquiry;
      },

      addCategoryRequest: (req) => {
        const id = 'SB-CR' + Math.floor(1000 + Math.random() * 9000);
        const newReq: SahiCategoryRequest = {
          ...req,
          id,
          status: 'RECEIVED',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({
          categoryRequests: [newReq, ...state.categoryRequests],
        }));
        return newReq;
      },

      updateOrderStatus: (id, newStatus) => {
        set((state) => ({
          sellListings: state.sellListings.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          ),
          buyInquiries: state.buyInquiries.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          ),
        }));
      },
    }),
    {
      name: 'sahibhaav-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
