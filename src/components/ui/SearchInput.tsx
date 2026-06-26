import React from "react";
import { Ionicons } from "@expo/vector-icons";

import Input from "./Input";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchInputProps) {
  const { colors } = useTheme();

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leftIcon={
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
        />
      }
      rightIcon={
        value ? (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textSecondary}
            onPress={() => onChangeText("")}
          />
        ) : undefined
      }
    />
  );
}