import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import AlertDialog from "@/components/feedback/AlertDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";
import { ICON_OPTIONS, COLOR_OPTIONS, type IconOption, type ColorOption } from "@/constants/iconOptions";

import { getHabitById, updateHabit, deleteHabit } from "@/repositories/HabitRepository";

import type { Habit } from "@/types/habit";

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [habit, setHabit] = useState<Habit | null>(null);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconOption>(ICON_OPTIONS[0]);
  const [color, setColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [target, setTarget] = useState(1);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [infoDialogTitle, setInfoDialogTitle] = useState("");
  const [infoDialogMessage, setInfoDialogMessage] = useState("");
  const [infoDialogType, setInfoDialogType] = useState<"error" | "warning" | "info">("info");

  useEffect(() => {
    if (id) loadHabit(Number(id));
  }, [id]);

  const loadHabit = async (habitId: number) => {
    try {
      const h = await getHabitById(habitId);
      if (h) {
        setHabit(h);
        setName(h.name);
        if (h.icon && ICON_OPTIONS.includes(h.icon as IconOption)) setIcon(h.icon as IconOption);
        if (h.color && COLOR_OPTIONS.includes(h.color as ColorOption)) setColor(h.color as ColorOption);
        setTarget(h.target_per_day || 1);
      }
    } catch (e) {
      console.error("Load habit error:", e);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setInfoDialogTitle("Validation");
      setInfoDialogMessage("Habit name is required.");
      setInfoDialogType("warning");
      setInfoDialogVisible(true);
      return;
    }
    if (!id) return;

    try {
      setLoading(true);
      await updateHabit(Number(id), {
        name: name.trim(),
        icon,
        color,
        target_per_day: target,
      });
      router.back();
    } catch (e) {
      console.error(e);
      setInfoDialogTitle("Error");
      setInfoDialogMessage("Failed to update habit.");
      setInfoDialogType("error");
      setInfoDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteHabit(Number(id));
      setDeleteDialogVisible(false);
      router.back();
    } catch (e) {
      console.error(e);
      setDeleteLoading(false);
    }
  };

  if (!habit) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text variant="bodySmall" color="secondary">Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.glassBorder, backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text variant="heading3">Edit Habit</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={IconColors.expense} />
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
            {loading ? "Saving..." : "Update Habit"}
          </Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={deleteDialogVisible}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone."
        type="error"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />

      <AlertDialog
        visible={infoDialogVisible}
        title={infoDialogTitle}
        message={infoDialogMessage}
        type={infoDialogType}
        confirmText="OK"
        onConfirm={() => setInfoDialogVisible(false)}
      />
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
