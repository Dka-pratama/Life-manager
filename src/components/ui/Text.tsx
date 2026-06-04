import React from "react";

import {
  Text as RNText,
  TextProps,
  StyleSheet,
} from "react-native";

import { Typography } from "../../constants/Typography";
import { useTheme } from "../../contexts/ThemeContext";

type Variant =
  | "displayLarge"
  | "displayMedium"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "caption";

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: "primary" | "secondary";
}

export default function Text({
  variant = "body",
  color = "primary",
  style,
  children,
  ...props
}: AppTextProps) {
  const { colors } = useTheme();

  return (
    <RNText
      style={[
        Typography[variant],
        {
          color: 
          color === "secondary"
          ? colors.textSecondary
          : colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}