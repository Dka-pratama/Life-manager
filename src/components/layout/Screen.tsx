import React from "react";
import { View, StyleSheet, ViewProps } from "react-native"

import { useTheme } from "@/contexts/ThemeContext";

interface ScreenProps extends ViewProps {
    children: React.ReactNode;
}

export default function Screen({
    children,
    style,
    ...props
}: ScreenProps) {
    const { colors } = useTheme();

    return (
        <View
        style={[
            styles.container,
            {
                backgroundColor: colors.background,
            },
            style,
        ]}
        {...props}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    }
})