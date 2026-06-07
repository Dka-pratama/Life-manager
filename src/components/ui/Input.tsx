import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import Text from "./Text";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export default function Input({
  label,
  error,
  style,
  ...props
}: InputProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {label && (
                <Text
                variant="bodySmall"
                style={styles.label}
                >
                    {label}
                </Text>
            )}

<TextInput
  placeholderTextColor={colors.textSecondary}
  textAlignVertical="top"
  style={[
    styles.input,
    props.multiline && styles.multiline,
    {
      backgroundColor: colors.surfaceContainer,
      borderColor: error
        ? colors.error
        : colors.border,
      color: colors.text,
    },
    style,
  ]}
  {...props}
/>
            {error && (
                <Text
                variant="caption"
                style={{ 
                    color: colors.error,
                    marginTop: 4
                 }}
                 >
                    {error}
                 </Text>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  label: {
    marginLeft: 4,
  },

  input: {
    minHeight: 52,

    borderWidth: 1,
    borderRadius: 16,

    paddingHorizontal: 16,

    fontFamily: "ManropeRegular",
    fontSize: 16,
  },
  multiline: 
  {
    minHeight: 120,
    paddingTop: 14,
    },
});