import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { getFinanceCategories } from "@/repositories/FinanceCategoryRepository";
import { CreateFinanceTransaction } from "@/repositories/FinanceTransactionRepository";

import type { FinanceCategory } from "@/types/financeCategorie";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const KEYPAD_BTN_SIZE = (SCREEN_WIDTH - 48) / 3;

export default function CreateTransactionScreen() {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  // Form state
  const [amount, setAmount] = useState("0");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FinanceCategory | null>(null);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getFinanceCategories();
      setCategories(data);
    } catch (e) {
      console.error("Load categories error:", e);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleKeyPress = (key: string) => {
    if (key === "del") {
      setAmount((prev) => {
        const next = prev.slice(0, -1);
        return next === "" || next === "-" ? "0" : next;
      });
      return;
    }

    setAmount((prev) => {
      if (prev === "0" && key !== "0") return key;
      if (prev === "0" && key === "0") return prev;
      return prev + key;
    });
  };

  const formatDisplay = (val: string): string => {
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return "0";
    return num.toLocaleString("id-ID");
  };

  const handleSave = async () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!numAmount || numAmount <= 0) {
      Alert.alert("Validation", "Amount must be greater than 0.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Validation", "Please select a category.");
      return;
    }

    try {
      setLoading(true);

      const dateStr = transactionDate.toISOString().split("T")[0];
      const title = note.trim() || selectedCategory.name;

      await CreateFinanceTransaction({
        category_id: selectedCategory.id,
        title,
        amount: numAmount,
        transaction_date: dateStr,
      });

      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save transaction.");
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
            <Ionicons name="close" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text variant="heading3">Add Transaction</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Amount Display */}
        <View style={styles.amountSection}>
          <Text variant="caption" color="secondary" style={styles.amountLabel}>
            ENTER AMOUNT
          </Text>
          <View style={styles.amountRow}>
            <Text variant="heading1" style={{ color: colors.primary, marginRight: 4 }}>Rp</Text>
            <Text variant="displayLarge" style={{ color: colors.text }}>
              {formatDisplay(amount)}
            </Text>
          </View>
        </View>

        {/* Type Toggle */}
        <View style={[styles.typeToggle, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}>
          <TouchableOpacity
            style={[styles.typeBtn, type === "expense" && { backgroundColor: IconColors.expense }]}
            onPress={() => { setType("expense"); setSelectedCategory(null); }}
          >
            <Text variant="bodySmall" style={{ color: type === "expense" ? "#fff" : colors.textSecondary, fontWeight: "700" }}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === "income" && { backgroundColor: IconColors.income }]}
            onPress={() => { setType("income"); setSelectedCategory(null); }}
          >
            <Text variant="bodySmall" style={{ color: type === "income" ? "#fff" : colors.textSecondary, fontWeight: "700" }}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="caption" color="secondary" style={styles.label}>CATEGORY</Text>
            <TouchableOpacity onPress={() => router.push(`/wallet/categories?type=${type}`)}>
              <Text variant="bodySmall" style={{ color: colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {filteredCategories.length === 0 ? (
              <Text variant="bodySmall" color="secondary">No categories available</Text>
            ) : (
              filteredCategories.map((cat) => {
                const isActive = selectedCategory?.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    style={styles.categoryItem}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <View style={[
                      styles.categoryIcon,
                      {
                        backgroundColor: isActive ? `${cat.color || IconColors.indigo}30` : colors.surfaceContainer,
                        borderColor: isActive ? cat.color || IconColors.indigo : colors.glassBorder,
                      },
                    ]}>
                      <Ionicons
                        name={(cat.icon as any) || "wallet"}
                        size={22}
                        color={isActive ? cat.color || IconColors.indigo : colors.textSecondary}
                      />
                    </View>
                    <Text variant="caption" style={{ color: isActive ? cat.color || colors.primary : colors.textSecondary, fontWeight: isActive ? "700" : "500" }}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Date & Note */}
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="secondary" style={styles.label}>DATE</Text>
            <TouchableOpacity
              style={[styles.fieldBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text variant="bodySmall" style={{ fontWeight: "600" }}>
                {transactionDate.toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="secondary" style={styles.label}>NOTE</Text>
            <TextInput
              style={[styles.noteInput, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder, color: colors.text }]}
              placeholder="Add memo..."
              placeholderTextColor={colors.outline}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={transactionDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) setTransactionDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* Numeric Keypad */}
      <View style={[styles.keypadContainer, { borderTopColor: colors.glassBorder }]}>
        <View style={styles.keypadGrid}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key, i) => {
            if (key === "") return <View key={i} style={styles.keypadBtn} />;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.keypadBtn, key === "del" && { backgroundColor: "transparent" }]}
                activeOpacity={0.7}
                onPress={() => handleKeyPress(key)}
              >
                {key === "del" ? (
                  <Ionicons name="backspace-outline" size={24} color={colors.error || "#ffb4ab"} />
                ) : (
                  <Text variant="heading2" style={{ color: colors.text }}>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmBtn, { shadowColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <Text variant="body" style={{ color: "#fff", fontWeight: "700" }}>
            {loading ? "Saving..." : "Confirm Transaction"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  amountSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  amountLabel: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  typeToggle: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  typeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  categoryScroll: {
    gap: 16,
    paddingVertical: 4,
  },
  categoryItem: {
    alignItems: "center",
    gap: 6,
    minWidth: 72,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  fieldBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  noteInput: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: "ManropeRegular",
  },
  keypadContainer: {
    borderTopWidth: 1,
    paddingBottom: 32,
  },
  keypadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keypadBtn: {
    width: KEYPAD_BTN_SIZE,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: IconColors.indigo,
    marginHorizontal: Spacing.md,
    paddingVertical: 16,
    borderRadius: 14,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
