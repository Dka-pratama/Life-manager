import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import Text from "../ui/Text";

interface LoadingProps {
  text?: string;
}

export default function LoadingState({
  text,
}: LoadingProps) {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <ActivityIndicator
            color={colors.primary}
            size="large"/>
            <Text
            variant="body">
            {text ?? "Loading"}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
