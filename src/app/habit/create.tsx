import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";
import { ICON_OPTIONS, COLOR_OPTIONS, type IconOption, type ColorOption } from "@/constants/iconOptions";

import { createHabit } from "@/repositories/HabitRepository";

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function CreateHabitScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconOption>(ICON_OPTIONS[0]);
  const [color, setColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [target, setTarget] = useState(1);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Habit name is required.");
      return;
    }

    try {
      setLoading(true);
      await createHabit({
        name: name.trim(),
        icon,
        color,
        target_per_day: target,
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save habit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.glassBorder, backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text variant="heading3">Add Habit</Text>
        </View>
        <TouchableOpacity onPress={() => { setName(""); setIcon(ICON_OPTIONS[0]); setColor(COLOR_OPTIONS[0]); setTarget(1); }}>
          <Text variant="bodySmall" style={{ color: colors.primary, textTransform: "uppercase", letterSpacing: 1 }}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          {/* Habit Name */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>HABIT NAME</Text>
            <TextInput
              style={[styles.nameInput, { color: colors.text }]}
              placeholder="What habit do you want to build?"
              placeholderTextColor={colors.outline}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Icon */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>ICON</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((ic) => {
                const isActive = icon === ic;
                return (
                  <TouchableOpacity
                    key={ic}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor: isActive ? `${color}30` : colors.surfaceContainer,
                        borderColor: isActive ? color : colors.glassBorder,
                      },
                    ]}
                    onPress={() => setIcon(ic)}
                  >
                    <Ionicons name={ic as any} size={20} color={isActive ? color : colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Color */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>COLOR</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((c) => {
                const isActive = color === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: c },
                      isActive && styles.colorBtnActive,
                    ]}
                    onPress={() => setColor(c)}
                  >
                    {isActive && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Target Per Day */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>TARGET PER DAY</Text>
            <View style={styles.targetRow}>
              {TARGET_OPTIONS.map((t) => {
                const isActive = target === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.targetBtn,
                      {
                        backgroundColor: isActive ? color : colors.surfaceContainer,
                        borderColor: isActive ? color : colors.glassBorder,
                      },
                    ]}
                    onPress={() => setTarget(t)}
                  >
                    <Text variant="body" style={{ color: isActive ? "#fff" : colors.text, fontWeight: "700" }}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>PREVIEW</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}>
              <View style={[styles.previewIcon, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon as any} size={28} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontWeight: "700" }}>{name || "Habit Name"}</Text>
                <Text variant="caption" color="secondary">{target}x per day</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { shadowColor: color }]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <Ionicons name="checkmark" size={22} color="#fff" />
          <Text variant="body" style={{ color: "#fff", fontWeight: "700" }}>
            {loading ? "Saving..." : "Save Habit"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  nameInput: {
    fontSize: 28,
    fontFamily: "ManropeBold",
    lineHeight: 36,
    padding: 0,
    minHeight: 56,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  colorBtnActive: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  targetRow: {
    flexDirection: "row",
    gap: 8,
  },
  targetBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  previewIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 32,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: IconColors.indigo,
    paddingVertical: 16,
    borderRadius: 14,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
