import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
  shadow?: boolean;
};

export default function Card({
  children,
  style,
  padding = 16,
  radius = 12,
  shadow = true,
}: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles(colors).card,
        {
          padding,
          borderRadius: radius,
        },
        shadow && styles(colors).shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.glassCard,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    shadow: {
      shadowColor: colors.glassShadow,
      shadowOpacity: 0,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 0,
    },
  });