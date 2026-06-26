import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/contexts/ThemeContext";

interface FloatingButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function FloatingButton({
  onPress,
  icon = "add",
}: FloatingButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={28}
        color={colors.onPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 20,

    width: 56,
    height: 56,
    borderRadius: 28,

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
  },
});