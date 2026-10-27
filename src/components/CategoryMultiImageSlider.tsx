import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { CATEGORY_MULTI_IMAGES, getScrapImage } from "../constants/assets";

interface Props {
  categoryId: string;
  size?: number;
  height?: number;
  aspectRatio?: number;
  fullWidth?: boolean;
  autoRotate?: boolean;
  borderRadius?: number;
}

export const CategoryMultiImageSlider: React.FC<Props> = ({
  categoryId,
  size,
  height,
  aspectRatio,
  fullWidth = false,
  autoRotate = true,
  borderRadius = 4,
}) => {
  const images = CATEGORY_MULTI_IMAGES[categoryId] || [getScrapImage(categoryId)];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [categoryId, autoRotate, images.length]);

  const containerStyle = fullWidth
    ? { width: '100%' as const, height: height || 160, borderRadius }
    : size
    ? { width: size, height: size, borderRadius }
    : aspectRatio
    ? { width: '100%' as const, aspectRatio, borderRadius }
    : { width: 54, height: 54, borderRadius };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={images[currentIndex]}
        style={styles.image}
        resizeMode="cover"
      />
      {images.length > 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#131D31",
    borderWidth: 1,
    borderColor: "#1E293B",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
});
