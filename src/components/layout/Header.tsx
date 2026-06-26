import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"

import { useTheme } from "@/contexts/ThemeContext";
import Text from "../ui/Text";

interface HeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
}

export default function Header({
    title,
    subtitle,
    showBackButton = false,
    rightComponent
}: HeaderProps) {
    const { colors } = useTheme();

    return (
  <View style={styles(colors).container}>
    <View style={styles(colors).row}>
      <View style={styles(colors).leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
            />
          </TouchableOpacity>
        )}

        <View>
          <Text variant="heading1">{title}</Text>

          {subtitle && (
            <Text
              variant="bodySmall"
              color="secondary"
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightComponent}
    </View>
  </View>
);
}

const styles = (colors : any) => 
  StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors.surfaceContainerHigh,
        backgroundColor: colors.surfaceContainer,
    },
    backButton: {
        marginBottom: 12,
    },
    subtitle: {
        marginTop: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    }
})