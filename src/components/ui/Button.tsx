import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "glass";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disable?: boolean;
    loading?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = "primary",
    disable = false,
    loading = false,
}: ButtonProps) {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        switch (variant) {
            case "secondary":
                return colors.surfaceContainer;
            case "outline":
                return "transparent";
            case "glass":
                return colors.glassCard;
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case "primary":
                return colors.onPrimary;
            default:
                return colors.text;
        }
    }

    const getborderColor = () => {
        switch (variant) {
            case "glass":
                return colors.glassBorder;
            case "outline":
                return colors.outline;
            case "secondary":
                return  colors.border;
            default:
                return "transparent";
        }
    }
    
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disable || loading}
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getborderColor(),
                    opacity: disable ? 0.5 : 1,
                },
                variant === "outline" && styles.outline,
            ]}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <Text
                        style = {[
                            styles.text,
                            {
                                color: getTextColor(),
                            },
                        ]}
                        >
                            {title}
                        </Text>
                )}
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    outline: {
        borderWidth: 1,
    },

    text: {
        fontFamily: "ManropeSemiBold",
        fontSize: 16,
    }
});