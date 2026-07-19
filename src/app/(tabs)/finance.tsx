import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import FloatingButton from "@/components/ui/FloatingButton";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { getFinanceTransactions } from "@/repositories/FinanceTransactionRepository";

import type { FinanceTransaction } from "@/types/financeTransaction";

const RING_RADIUS = 80;
const RING_STROKE = 12;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function FinanceScreen() {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadData = useCallback(async () => {
    try {
      const data = await getFinanceTransactions();
      setTransactions(data);
    } catch (e) {
      console.error("Wallet load error:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Current month transactions
  const monthTx = transactions.filter((t) =>
    t.transaction_date.startsWith(currentMonth)
  );

  const income = monthTx
    .filter((t: any) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = monthTx
    .filter((t: any) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // Category breakdown for spending ring
  const categoryMap = new Map<string, { amount: number; color: string; icon: string }>();
  monthTx
    .filter((t: any) => t.type === "expense")
    .forEach((t: any) => {
      const name = t.category_name || "Other";
      const existing = categoryMap.get(name);
      if (existing) {
        existing.amount += t.amount;
      } else {
        categoryMap.set(name, {
          amount: t.amount,
          color: t.color || IconColors.indigo,
          icon: t.icon || "wallet",
        });
      }
    });

  const categories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount);

  // Recent 5 transactions
  const recentTx = transactions.slice(0, 5);

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
      >
        <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
          {/* Total Balance Hero */}
          <Card padding={Spacing.lg} radius={24} style={styles.heroCard}>
            <View style={styles.heroIconBg}>
              <Ionicons name="wallet" size={80} color={colors.primary} style={{ opacity: 0.15 }} />
            </View>
            <View style={styles.heroContent}>
              <Text variant="bodySmall" color="secondary" style={styles.heroLabel}>
                TOTAL BALANCE
              </Text>
              <Text variant="displayLarge" style={[styles.heroAmount, { color: colors.text }]}>
                {formatCurrency(balance)}
              </Text>
              <View style={styles.heroSummaryRow}>
                <View style={styles.heroSummaryItem}>
                  <Ionicons name="arrow-up" size={14} color={IconColors.income} />
                  <Text variant="caption" color="secondary">{formatCurrencyShort(income)}</Text>
                </View>
                <View style={styles.heroSummaryItem}>
                  <Ionicons name="arrow-down" size={14} color={IconColors.expense} />
                  <Text variant="caption" color="secondary">{formatCurrencyShort(expense)}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Pengeluaran Bulan Ini */}
          <Card padding={Spacing.md} radius={20} style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Text variant="heading3">Pengeluaran Bulan Ini</Text>
            </View>

            <View style={styles.ringContainer}>
              <Svg width={192} height={192}>
                <Circle
                  cx={96} cy={96} r={RING_RADIUS}
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                  strokeWidth={RING_STROKE} fill="none"
                />
                {categories.length > 0 ? (
                  categories.map((cat, i) => {
                    const catPercent = expense > 0 ? cat.amount / expense : 0;
                    const prevOffset = categories
                      .slice(0, i)
                      .reduce((sum, c) => sum + (expense > 0 ? c.amount / expense : 0) * RING_CIRCUMFERENCE, 0);
                    return (
                      <Circle
                        key={cat.name}
                        cx={96} cy={96} r={RING_RADIUS}
                        stroke={cat.color}
                        strokeWidth={RING_STROKE}
                        fill="none"
                        strokeDasharray={`${RING_CIRCUMFERENCE * catPercent} ${RING_CIRCUMFERENCE}`}
                        strokeDashoffset={-prevOffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="96, 96"
                      />
                    );
                  })
                ) : (
                  <Circle
                    cx={96} cy={96} r={RING_RADIUS}
                    stroke={colors.primary}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="96, 96"
                  />
                )}
              </Svg>
              <View style={styles.ringCenter}>
                <Text variant="heading2" style={{ color: colors.text }}>
                  {formatCurrencyShort(expense)}
                </Text>
                <Text variant="caption" color="secondary">Total</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {categories.length === 0 ? (
                <Text variant="bodySmall" color="secondary" style={{ textAlign: "center" }}>
                  Belum ada pengeluaran
                </Text>
              ) : (
                categories.map((cat) => {
                  const percent = expense > 0 ? Math.round((cat.amount / expense) * 100) : 0;
                  return (
                    <View key={cat.name} style={styles.legendRow}>
                      <View style={styles.legendLeft}>
                        <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                        <Text variant="bodySmall" color="secondary">{cat.name}</Text>
                      </View>
                      <Text variant="bodySmall" style={{ fontWeight: "600" }}>{percent}%</Text>
                    </View>
                  );
                })
              )}
            </View>
          </Card>

          {/* Recent Transactions */}
          <Card padding={Spacing.md} radius={20}>
            <View style={styles.cardHeader}>
              <Text variant="heading3">Transaksi Terakhir</Text>
            </View>

            <View style={styles.txList}>
              {recentTx.length === 0 ? (
                <View style={styles.emptyTx}>
                  <Ionicons name="receipt-outline" size={32} color={colors.outline} />
                  <Text variant="bodySmall" color="secondary">Belum ada transaksi</Text>
                </View>
              ) : (
                recentTx.map((tx) => {
                  const isIncome = (tx as any).type === "income";
                  return (
                    <View key={tx.id} style={styles.txItem}>
                      <View style={styles.txLeft}>
                        <View
                          style={[
                            styles.txIcon,
                            {
                              backgroundColor: isIncome
                                ? `${IconColors.income}20`
                                : `${IconColors.expense}20`,
                            },
                          ]}
                        >
                          <Ionicons
                            name={(tx as any).icon || (isIncome ? "trending-up" : "trending-down")}
                            size={20}
                            color={isIncome ? IconColors.income : IconColors.expense}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text variant="bodySmall" style={{ fontWeight: "600" }}>{tx.title}</Text>
                          <Text variant="caption" color="secondary">
                            {(tx as any).category_name || "Unknown"} · {formatDate(tx.transaction_date)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        variant="bodySmall"
                        style={{
                          fontWeight: "700",
                          color: isIncome ? IconColors.income : IconColors.expense,
                        }}
                      >
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </Card>
        </View>
      </ScrollView>

      <FloatingButton onPress={() => router.push("/wallet/create")} />
    </Screen>
  );
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) return `Rp${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000) return `Rp${(amount / 1_000).toFixed(0)}rb`;
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  heroIconBg: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: Spacing.lg,
  },
  heroContent: {
    zIndex: 1,
  },
  heroLabel: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroAmount: {
    color: "#fff",
    marginBottom: Spacing.md,
  },
  heroSummaryRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  heroSummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  ringContainer: {
    width: 192,
    height: 192,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  txList: {
    gap: 8,
  },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTx: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    gap: 8,
  },
});
