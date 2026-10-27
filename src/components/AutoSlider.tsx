import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react-native";
import { THEME } from "../theme";
import { HOME_SLIDER_ITEMS } from "../constants/assets";
import { useSahiStore } from "../store/useSahiStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 24, 480);

interface Props {
  onSelectItem?: (categoryId: string) => void;
}

export const AutoSlider: React.FC<Props> = ({ onSelectItem }) => {
  const { language } = useSahiStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isAutoScrolling = useRef(true);

  // Auto-swiping timer (swipes every 3.2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAutoScrolling.current) return;
      const nextIndex = (activeIndex + 1) % HOME_SLIDER_ITEMS.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + 12),
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3200);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (CARD_WIDTH + 12));
    if (index !== activeIndex && index >= 0 && index < HOME_SLIDER_ITEMS.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Slider Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleBadge}>
          <Sparkles size={14} color={THEME.colors.primary} />
          <Text style={styles.headerLabel}>
            {language === "hi" ? "आज के खास कबाड़ सौदे" : "Top Live Scrap Deals"}
          </Text>
        </View>
        <Text style={styles.counterText}>
          {activeIndex + 1} / {HOME_SLIDER_ITEMS.length}
        </Text>
      </View>

      {/* Auto-Swiping Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={() => {
          isAutoScrolling.current = false;
        }}
        onTouchEnd={() => {
          isAutoScrolling.current = true;
        }}
      >
        {HOME_SLIDER_ITEMS.map((item, index) => {
          const title = language === "hi" ? item.titleHi : item.titleEn;
          const tag = language === "hi" ? item.tagHi : item.tagEn;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.slideCard,
                { width: CARD_WIDTH },
                index === activeIndex && styles.activeSlideCard,
              ]}
              activeOpacity={0.9}
              onPress={() => onSelectItem && onSelectItem(item.categoryId)}
            >
              <Image source={item.image} style={styles.slideImage} resizeMode="cover" />

              {/* Gradient Scrim for Readability */}
              <LinearGradient
                colors={["rgba(7, 13, 24, 0.1)", "rgba(7, 13, 24, 0.8)", "#070D18"]}
                style={styles.gradientOverlay}
              >
                {/* Top Badge: Live Rate */}
                <View style={styles.slideTop}>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                  <View style={styles.rateBadge}>
                    <TrendingUp size={12} color="#FFFFFF" />
                    <Text style={styles.rateText}>
                      {item.rate}/{item.unit}
                    </Text>
                  </View>
                </View>

                {/* Bottom Title & Action CTA */}
                <View style={styles.slideBottom}>
                  <Text style={styles.slideTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <View style={styles.actionRow}>
                    <Text style={styles.actionHint}>
                      {language === "hi" ? "सौदा पक्का करें" : "View & Trade"}
                    </Text>
                    <ArrowRight size={14} color={THEME.colors.primaryLight} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pagination Dot Indicators */}
      <View style={styles.dotsRow}>
        {HOME_SLIDER_ITEMS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  titleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerLabel: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  counterText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  slideCard: {
    height: 220,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#111C2E",
    borderWidth: 1.5,
    borderColor: "#1E293B",
  },
  activeSlideCard: {
    borderColor: THEME.colors.primary,
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: "space-between",
  },
  slideTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tagText: {
    color: "#D1FAE5",
    fontSize: 12,
    fontWeight: "800",
  },
  rateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 6,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  rateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  slideBottom: {
    gap: 6,
  },
  slideTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionHint: {
    color: THEME.colors.primaryLight,
    fontSize: 14,
    fontWeight: "800",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#334155",
  },
  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
  },
});
