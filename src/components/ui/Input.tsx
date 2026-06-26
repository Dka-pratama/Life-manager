import React from "react";
import { StyleSheet, TextInput, TextInputProps, View, Pressable } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import Text from "./Text";
import { Spacing } from "@/constants/Spacing";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  onPress,
  ...props
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="bodySmall" style={styles.label}>
          {label}
        </Text>
      )}

      <Pressable
      disabled={!onPress}
      onPress={onPress}
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceContainer,
            borderColor: error ? colors.error : colors.border,
          },
        ]}>
        {leftIcon}

        <TextInput
          placeholderTextColor={colors.textSecondary}
          textAlignVertical="top"
          style={[
            styles.input,
            props.multiline && styles.multiline,
            {
              color: colors.text,
            },
            style,
          ]}
          {...props}
        />

        {rightIcon}
      </Pressable>
      {error && (
        <Text
          variant="caption"
          style={{
            color: colors.error,
            marginTop: 4,
          }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: Spacing.lg,
  },

  label: {
    marginLeft: 4,
  },

  input: {
    flex: 1,

    fontFamily: "ManropeRegular",
    fontSize: 16,
},
  multiline: {
    minHeight: 120,
    paddingTop: 14,
  },
  inputContainer: {
    minHeight: 52,

    borderWidth: 1,
    borderRadius: 16,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
