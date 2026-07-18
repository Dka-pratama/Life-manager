import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  borderRadius?: number;
}

export default function ProgressBar({
  value,
  max = 100,
  height = 8,
  borderRadius = 999,
}: ProgressBarProps) {
  const { colors } = useTheme();

  const percentage = Math.max(0, Math.min((value / max) * 100, 100));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderRadius,
          backgroundColor: colors.surfaceContainerHigh,
        },
      ]}
    >
      <View
        style={{
          width: `${percentage}%`,
          height: "100%",
          borderRadius,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});