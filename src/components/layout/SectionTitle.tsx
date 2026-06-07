import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native"

import { useTheme } from "@/contexts/ThemeContext";
import Text from "../ui/Text";

interface SectionProps {
    title: string,
    actionText?: string,
    onActionPress?: VoidFunction,
}

export default function SectionTitle({
    title,
    actionText,
    onActionPress
}: SectionProps) {
    const { colors } = useTheme();
    return (
        <View style={ styles.container }>
            <Text
            variant="heading3"
            color="primary"
            >
                {title}
            </Text>
            {actionText && (
                <TouchableOpacity onPress= { onActionPress }>
                    <Text style={{ 
                        color: colors.primary
                     }}
                     variant="caption">
                        {actionText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    }
})