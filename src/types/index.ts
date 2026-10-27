import { ScrapImageKey } from '../constants/assets';

export type UserRole = 'SELLER' | 'DEALER' | 'BOTH';

export type ListingType = 'SELL_OFFER' | 'BUY_RFQ';

export type LeadStatus = 'OPEN' | 'IN_NEGOTIATION' | 'INSPECTION_PENDING' | 'DEAL_CLOSED' | 'CANCELLED';

export type InventoryStatus = 'IN_STOCK' | 'RESERVED' | 'SOLD_OUT' | 'BLOCKED';

export type SubscriptionPlanId = 'FREE' | 'DAILY_PASS' | 'MONTHLY_PRO' | 'QUARTERLY_MEGA' | 'ANNUAL_ENTERPRISE';

export interface ScrapCategory {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  imageKey: ScrapImageKey;
  description: string;
  defaultUnit: 'kg' | 'quintal' | 'ton' | 'piece';
  typicalPricePerKg: number;
  subcategories: ScrapSubcategory[];
}

export interface ScrapSubcategory {
  id: string;
  name: string;
  hindiName: string;
  imageKey: ScrapImageKey;
  mandiRate: number; // ₹ per unit benchmark
  highestBuyDemand: number; // Top buyer bid
  lowestSellOffer: number; // Lowest seller offer
  unit: string;
  rateChangeToday: number;
  purityGrade?: string;
}

export interface MarketListing {
  id: string; // e.g. SCRAP-L-1001 or RFQ-B-2001
  type: ListingType; // SELL_OFFER (I have stock to sell) vs BUY_RFQ (I want to buy stock)
  title: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  imageKey: ScrapImageKey;
  customImageUri?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | 'piece';
  targetPrice: number; // Expected selling price or maximum buying budget per unit
  expectedPrice?: number;
  priceType: 'PER_UNIT' | 'LUMP_SUM';
  calculatedTotalValue: number;
  calculatedMarketValue?: number;
  condition: 'SEGREGATED' | 'MIXED' | 'DISMANTLED' | 'RAW';
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  user: {
    id: string; // 'current_user' or dealer id
    name: string;
    phone: string;
    maskedPhone: string;
    businessName?: string;
    isVerified: boolean;
    rating: number;
    userType: 'SCRAP_GENERATOR' | 'RECYCLER_YARD' | 'SMELTER_FOUNDRY' | 'TRADER';
  };
  seller?: {
    name: string;
    phone: string;
    maskedPhone: string;
    isVerified: boolean;
    rating: number;
  };
  preferredSlot: {
    date: string;
    timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  };
  pickupSlot?: {
    date: string;
    timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  };
  status: LeadStatus;
  createdAt: string; // ISO string
  urgent: boolean;
  notes?: string;
  isCurrentUserListing?: boolean;
}

// Backward compatibility alias
export type SellerLead = MarketListing;

export interface PriceAlert {
  id: string;
  materialId: string;
  materialName: string;
  imageKey: ScrapImageKey;
  alertType: 'BUY_BELOW' | 'SELL_ABOVE';
  targetPrice: number;
  currentPrice: number;
  unit: string;
  createdAt: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerPrice?: number;
  offerQuantity?: number;
  offerUnit?: string;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface NegotiationThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: ListingType;
  materialImageKey: ScrapImageKey;
  participant: {
    id: string;
    name: string;
    businessName: string;
    phone: string;
    maskedPhone: string;
    isVerified: boolean;
    rating: number;
  };
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
  messages: ChatMessage[];
  dealAgreed: boolean;
  agreedAmount?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  imageKey: ScrapImageKey;
  quantityKg: number;
  buyPricePerKg: number;
  currentMandiRate: number;
  targetSellPricePerKg: number;
  warehouseLocation: string;
  status: InventoryStatus;
  lastUpdated: string;
  notes?: string;
}

export interface MandiRate {
  id: string;
  categoryName: string;
  materialName: string;
  imageKey: ScrapImageKey;
  currentRate: number; // ₹/kg
  highestBuyDemand?: number; // Top Buyer Bid
  highestBuyBid?: number;
  lowestSellOffer?: number; // Top Seller Ask
  lowestSellAsk?: number;
  previousRate: number;
  changeToday: number;
  changePercent: number;
  unit: string;
  marketLocation: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  hindiBadge: string;
  tagline: string;
  price: number;
  originalPrice: number;
  durationDays: number;
  leadLimit: number | 'UNLIMITED';
  popular?: boolean;
  color: string;
  features: string[];
}

export interface UserSubscription {
  planId: SubscriptionPlanId;
  active: boolean;
  startDate: string | null;
  expiryDate: string | null;
  leadsUnlockedCount: number;
  totalLeadsAllowed: number;
  unlockedLeadIds: string[];
}

// Sahi Bhaav Additions
export type AppLanguage = 'hi' | 'en';

export type UserBusinessType =
  | 'CUSTOMER'
  | 'DEALER'
  | 'TRADER'
  | 'PLANT_OWNER'
  | 'SUPPLIER'
  | 'OTHER';

export interface SahiUserProfile {
  id: string;
  name: string;
  phone: string;
  businessType: UserBusinessType;
  customRoleMessage?: string;
  gstin?: string;
  businessName?: string;
  city: string;
  isGuest: boolean;
  isOnboarded?: boolean;
}

export type OrderTrackStatus = 'RECEIVED' | 'CALL_SCHEDULED' | 'DEAL_FINALIZED' | 'COMPLETED' | 'CANCELLED';

export interface SahiSellListing {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryNameHi: string;
  expectedPrice: number;
  unit: string;
  quantity: number;
  imageUri?: string;
  city: string;
  status: OrderTrackStatus;
  createdAt: string;
  notes?: string;
}

export interface SahiBuyInquiry {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryNameHi: string;
  requestedQuantity: number;
  unit: string;
  offeredPrice?: number;
  city: string;
  status: OrderTrackStatus;
  createdAt: string;
  notes?: string;
}

export interface SahiCategoryRequest {
  id: string;
  itemName: string;
  intent: 'SELL' | 'BUY';
  expectedQuantity: number;
  unit: string;
  description?: string;
  phone: string;
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'ADDED';
  createdAt: string;
}
