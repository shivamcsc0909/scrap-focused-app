import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {
  MessageSquare,
  Send,
  Phone,
  Handshake,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ShieldCheck,
  Tag,
  DollarSign,
  FileCheck,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { THEME } from '../theme';
import { getScrapImage } from '../constants/assets';
import { useScrapStore } from '../store/useScrapStore';
import { NegotiationThread, ChatMessage } from '../types';
import { NegotiationModal } from '../components/NegotiationModal';

interface ChatScreenProps {
  navigation: any;
  route?: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { threads, sendMessage, respondToOffer } = useScrapStore();

  const initialThreadId = route?.params?.activeThreadId || (threads.length > 0 ? threads[0].id : null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId);
  const [messageInput, setMessageInput] = useState('');
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);

  const activeThread = threads.find((t) => t.id === selectedThreadId) || null;

  const handleSendTextMessage = () => {
    if (!selectedThreadId || !messageInput.trim()) return;
    sendMessage(selectedThreadId, messageInput.trim());
    setMessageInput('');
  };

  const handleSendCounterOffer = (price: number, qty: number, notes: string) => {
    if (!selectedThreadId) return;
    const text = notes
      ? `Proposed Counter-Offer: ₹${price}/kg for ${qty}kg. Note: ${notes}`
      : `Proposed Counter-Offer: ₹${price}/kg for ${qty}kg`;
    sendMessage(selectedThreadId, text, true, price, qty, 'kg');
  };

  const handleCallUser = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {
      Alert.alert('Phone Call', `Dialing ${name} at ${phone}`);
    });
  };

  // If viewing thread list
  if (!activeThread) {
    return (
      <View style={styles.container}>
        <Header
          title="Direct Negotiations"
          subtitle="In-App Buyer & Seller Chat Threads"
        />

        <ScrollView contentContainerStyle={styles.threadsList}>
          {threads.length === 0 ? (
            <View style={styles.emptyCard}>
              <MessageSquare size={32} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>No Active Chats</Text>
              <Text style={styles.emptySub}>
                Browse the orderbook to negotiate directly with scrap buyers & sellers.
              </Text>
            </View>
          ) : (
            threads.map((thread) => (
              <TouchableOpacity
                key={thread.id}
                style={[
                  styles.threadCard,
                  thread.dealAgreed && styles.threadCardAgreed,
                ]}
                onPress={() => setSelectedThreadId(thread.id)}
                activeOpacity={0.85}
              >
                <Image source={getScrapImage(thread.materialImageKey)} style={styles.threadThumb} resizeMode="cover" />

                <View style={styles.threadInfo}>
                  <View style={styles.threadTop}>
                    <Text style={styles.participantName}>{thread.participant.businessName || thread.participant.name}</Text>
                    <Text style={styles.threadTime}>{thread.lastUpdated}</Text>
                  </View>

                  <Text style={styles.threadListingTitle} numberOfLines={1}>
                    📦 {thread.listingTitle}
                  </Text>

                  <Text style={styles.lastMsgText} numberOfLines={1}>
                    {thread.lastMessage}
                  </Text>

                  {thread.dealAgreed && (
                    <View style={styles.dealBadge}>
                      <CheckCircle2 size={11} color={THEME.colors.primaryLight} />
                      <Text style={styles.dealBadgeText}>DEAL CONFIRMED</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Active Chat Room
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Room Top Bar */}
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedThreadId(null)}>
          <ChevronLeft size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        <Image source={getScrapImage(activeThread.materialImageKey)} style={styles.headerThumb} resizeMode="cover" />

        <View style={styles.headerTitles}>
          <Text style={styles.headerName} numberOfLines={1}>
            {activeThread.participant.businessName || activeThread.participant.name}
          </Text>
          <Text style={styles.headerListing} numberOfLines={1}>
            {activeThread.listingTitle}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => handleCallUser(activeThread.participant.phone, activeThread.participant.name)}
        >
          <Phone size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Deal Agreed Sticky Banner */}
      {activeThread.dealAgreed && (
        <View style={styles.agreedBanner}>
          <CheckCircle2 size={16} color={THEME.colors.primaryLight} />
          <View style={styles.agreedInfo}>
            <Text style={styles.agreedTitle}>Trade Price Agreed & Locked</Text>
            <Text style={styles.agreedSub}>
              Physical pickup and certified weighbridge inspection scheduled.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.invoiceBtn}
            onPress={() => Alert.alert('Contract / PO', 'Generating physical commodity purchase agreement...')}
          >
            <FileCheck size={13} color={THEME.colors.primaryLight} />
            <Text style={styles.invoiceBtnText}>View PO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages Scroll Area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.messagesScroll}>
        {activeThread.messages.map((msg) => {
          const isMe = msg.senderId === 'current_user';

          return (
            <View key={msg.id} style={[styles.msgWrapper, isMe ? styles.msgWrapperMe : styles.msgWrapperThem]}>
              <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem]}>
                {!isMe && <Text style={styles.senderName}>{msg.senderName}</Text>}

                {/* Counter-Offer Interactive Card */}
                {msg.isOffer ? (
                  <View style={styles.offerCard}>
                    <View style={styles.offerHeader}>
                      <Handshake size={14} color={THEME.colors.accent} />
                      <Text style={styles.offerTitle}>OFFICIAL COUNTER-OFFER</Text>
                    </View>

                    <Text style={styles.offerPriceText}>
                      ₹{msg.offerPrice}/{msg.offerUnit || 'kg'} • {msg.offerQuantity}{msg.offerUnit || 'kg'}
                    </Text>

                    <Text style={styles.offerTotalText}>
                      Total: ₹{((msg.offerPrice || 0) * (msg.offerQuantity || 1)).toLocaleString('en-IN')}
                    </Text>

                    {msg.offerStatus === 'PENDING' ? (
                      !isMe ? (
                        <View style={styles.offerActionsRow}>
                          <TouchableOpacity
                            style={styles.acceptOfferBtn}
                            onPress={() => respondToOffer(activeThread.id, msg.id, true)}
                          >
                            <CheckCircle2 size={13} color="#FFFFFF" />
                            <Text style={styles.acceptOfferBtnText}>Accept Rate</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.declineOfferBtn}
                            onPress={() => respondToOffer(activeThread.id, msg.id, false)}
                          >
                            <XCircle size={13} color={THEME.colors.error} />
                            <Text style={styles.declineOfferBtnText}>Decline</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.pendingStatusBadge}>
                          <Text style={styles.pendingStatusText}>Awaiting partner acceptance</Text>
                        </View>
                      )
                    ) : (
                      <View
                        style={[
                          styles.offerResultBadge,
                          msg.offerStatus === 'ACCEPTED' ? styles.resultAccepted : styles.resultDeclined,
                        ]}
                      >
                        <Text style={styles.offerResultText}>
                          {msg.offerStatus === 'ACCEPTED' ? '✓ Offer Accepted' : '✗ Offer Declined'}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>
                    {msg.text}
                  </Text>
                )}

                <Text style={styles.msgTime}>{msg.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Negotiation Bottom Action Bar */}
      <View style={styles.chatBottomBar}>
        <TouchableOpacity
          style={styles.counterOfferBtn}
          onPress={() => setShowNegotiationModal(true)}
          activeOpacity={0.85}
        >
          <Handshake size={14} color={THEME.colors.accent} />
          <Text style={styles.counterOfferBtnText}>Counter-Offer</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.chatInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type trade message / payment terms..."
          placeholderTextColor={THEME.colors.textMuted}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSendTextMessage}>
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Counter-Offer Modal */}
      <NegotiationModal
        visible={showNegotiationModal}
        listingTitle={activeThread.listingTitle}
        defaultPrice={815}
        defaultQuantity={100}
        defaultUnit="kg"
        onClose={() => setShowNegotiationModal(false)}
        onSubmitOffer={handleSendCounterOffer}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  threadsList: {
    padding: THEME.spacing.lg,
    gap: 10,
  },
  emptyCard: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 30,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  threadCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 12,
  },
  threadCardAgreed: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  threadThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  threadInfo: {
    flex: 1,
  },
  threadTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  threadTime: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  threadListingTitle: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  lastMsgText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  dealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  dealBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 9,
    fontWeight: '900',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  headerTitles: {
    flex: 1,
  },
  headerName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  headerListing: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  callBtn: {
    backgroundColor: THEME.colors.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  agreedInfo: {
    flex: 1,
  },
  agreedTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  agreedSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
  },
  invoiceBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 3,
  },
  invoiceBtnText: {
    color: '#0B1120',
    fontSize: 10,
    fontWeight: '900',
  },
  messagesScroll: {
    padding: THEME.spacing.lg,
    paddingBottom: 20,
    gap: 12,
  },
  msgWrapper: {
    flexDirection: 'row',
  },
  msgWrapperMe: {
    justifyContent: 'flex-end',
  },
  msgWrapperThem: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: THEME.borderRadius.lg,
  },
  msgBubbleMe: {
    backgroundColor: '#064E3B',
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  msgBubbleThem: {
    backgroundColor: THEME.colors.surfaceCard,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  senderName: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  msgText: {
    fontSize: 12,
    lineHeight: 16,
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTextThem: {
    color: THEME.colors.textPrimary,
  },
  msgTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  offerCard: {
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    gap: 4,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offerTitle: {
    color: THEME.colors.accent,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offerPriceText: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
  },
  offerTotalText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  offerActionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  acceptOfferBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  acceptOfferBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  declineOfferBtn: {
    flex: 1,
    backgroundColor: THEME.colors.errorSoft,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  declineOfferBtnText: {
    color: THEME.colors.error,
    fontSize: 10,
    fontWeight: '800',
  },
  pendingStatusBadge: {
    backgroundColor: THEME.colors.surfaceCard,
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  pendingStatusText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
  },
  offerResultBadge: {
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  resultAccepted: {
    backgroundColor: THEME.colors.primarySoft,
  },
  resultDeclined: {
    backgroundColor: THEME.colors.errorSoft,
  },
  offerResultText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chatBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  counterOfferBtn: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterOfferBtnText: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  chatInput: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  sendBtn: {
    backgroundColor: THEME.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
