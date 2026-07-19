import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import FloatingButton from "@/components/ui/FloatingButton";
import AlertDialog from "@/components/feedback/AlertDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";
import { ICON_OPTIONS, COLOR_OPTIONS, type IconOption, type ColorOption } from "@/constants/iconOptions";

import { getFinanceCategories, CreateFinanceCategory, DeleteFinanceCategory } from "@/repositories/FinanceCategoryRepository";

import type { FinanceCategory, FinanceCategoryType } from "@/types/financeCategorie";

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ type?: string }>();
  const [type, setType] = useState<FinanceCategoryType>((params.type as FinanceCategoryType) || "expense");
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New category form
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<IconOption>(ICON_OPTIONS[0]);
  const [newColor, setNewColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinanceCategory | null>(null);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [infoDialogTitle, setInfoDialogTitle] = useState("");
  const [infoDialogMessage, setInfoDialogMessage] = useState("");
  const [infoDialogType, setInfoDialogType] = useState<"error" | "warning" | "info">("info");

  const loadData = useCallback(async () => {
    try {
      const data = await getFinanceCategories();
      setCategories(data);
    } catch (e) {
      console.error("Load categories error:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filtered = categories.filter((c) => c.type === type);

  const handleAdd = async () => {
    if (!newName.trim()) {
      setInfoDialogTitle("Validation");
      setInfoDialogMessage("Category name is required.");
      setInfoDialogType("warning");
      setInfoDialogVisible(true);
      return;
    }

    try {
      await CreateFinanceCategory({
        name: newName.trim(),
        type,
        icon: newIcon,
        color: newColor,
      });

      setShowAddModal(false);
      setNewName("");
      setNewIcon(ICON_OPTIONS[0]);
      setNewColor(COLOR_OPTIONS[0]);
      loadData();
    } catch (e) {
      console.error(e);
      setInfoDialogTitle("Error");
      setInfoDialogMessage("Failed to add category.");
      setInfoDialogType("error");
      setInfoDialogVisible(true);
    }
  };

  const handleDelete = (cat: FinanceCategory) => {
    setDeleteTarget(cat);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await DeleteFinanceCategory(deleteTarget.id);
      setDeleteDialogVisible(false);
      setDeleteTarget(null);
      loadData();
    } catch (e) {
      console.error(e);
      setDeleteLoading(false);
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
          <Text variant="heading3">Categories</Text>
        </View>
      </View>

      {/* Type Toggle */}
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
        <View style={[styles.typeToggle, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={[styles.typeBtn, type === "expense" && { backgroundColor: IconColors.expense }]}
            onPress={() => setType("expense")}
          >
            <Text variant="bodySmall" style={{ color: type === "expense" ? "#fff" : colors.textSecondary, fontWeight: "700" }}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === "income" && { backgroundColor: IconColors.income }]}
            onPress={() => setType("income")}
          >
            <Text variant="bodySmall" style={{ color: type === "income" ? "#fff" : colors.textSecondary, fontWeight: "700" }}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color={colors.outline} />
            <Text variant="bodySmall" color="secondary">No {type} categories yet</Text>
            <Text variant="caption" color="secondary">Tap + to add one</Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            {filtered.map((cat) => (
              <View
                key={cat.id}
                style={[styles.categoryItem, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${cat.color || IconColors.indigo}20` }]}>
                    <Ionicons name={(cat.icon as any) || "wallet"} size={22} color={cat.color || IconColors.indigo} />
                  </View>
                  <Text variant="body" style={{ fontWeight: "600" }}>{cat.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(cat)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.outline} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingButton onPress={() => setShowAddModal(true)} />

      {/* Add Category Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.surfaceContainer }]} onPress={(e) => e.stopPropagation()}>
            <Text variant="heading3" style={{ marginBottom: Spacing.md }}>Add Category</Text>

            {/* Name */}
            <Text variant="caption" color="secondary" style={styles.label}>NAME</Text>
            <TextInput
              style={[styles.nameInput, { color: colors.text, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
              placeholder="Category name"
              placeholderTextColor={colors.outline}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            {/* Icon */}
            <Text variant="caption" color="secondary" style={[styles.label, { marginTop: Spacing.md }]}>ICON</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => {
                const isActive = newIcon === icon;
                return (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor: isActive ? `${newColor}30` : colors.background,
                        borderColor: isActive ? newColor : colors.glassBorder,
                      },
                    ]}
                    onPress={() => setNewIcon(icon)}
                  >
                    <Ionicons name={icon as any} size={20} color={isActive ? newColor : colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Color */}
            <Text variant="caption" color="secondary" style={[styles.label, { marginTop: Spacing.md }]}>COLOR</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => {
                const isActive = newColor === color;
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: color },
                      isActive && styles.colorBtnActive,
                    ]}
                    onPress={() => setNewColor(color)}
                  >
                    {isActive && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text variant="bodySmall" style={{ color: colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleAdd}
              >
                <Text variant="bodySmall" style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <AlertDialog
        visible={deleteDialogVisible}
        title="Delete Category"
        message={deleteTarget ? `Delete "${deleteTarget.name}"? Transactions using this category will become uncategorized.` : ""}
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
  typeToggle: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  nameInput: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
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
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.lg,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 20,
    padding: Spacing.lg,
  },
});
