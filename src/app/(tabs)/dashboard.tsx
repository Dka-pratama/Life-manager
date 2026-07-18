import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { getHabits } from "@/repositories/HabitRepository";
import { getHabitLogByDate } from "@/repositories/HabitLogRepository";
import { getFinanceTransactions } from "@/repositories/FinanceTransactionRepository";
import { getTasks } from "@/repositories/TaskRepository";

import type { Habit } from "@/types/habit";
import type { HabitLog } from "@/types/habitLog";
import type { FinanceTransaction } from "@/types/financeTransaction";
import type { Task } from "@/types/task";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RING_RADIUS = 52;
const RING_STROKE = 8;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Map<number, HabitLog>>(new Map());
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadData = useCallback(async () => {
    try {
      const [habitsData, transactionsData, tasksData] = await Promise.all([
        getHabits(),
        getFinanceTransactions(),
        getTasks(),
      ]);

      setHabits(habitsData);
      setTransactions(transactionsData);
      setTasks(tasksData);

      // Fetch today's logs for each habit
      const logsMap = new Map<number, HabitLog>();
      await Promise.all(
        habitsData.map(async (h) => {
          const log = await getHabitLogByDate(h.id, today);
          if (log) logsMap.set(h.id, log);
        })
      );
      setHabitLogs(logsMap);
    } catch (e) {
      console.error("Dashboard load error:", e);
    }
  }, [today]);

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

  // Compute habit stats
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => {
    const log = habitLogs.get(h.id);
    return log && log.progress >= 1;
  }).length;
  const habitPercent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Compute finance stats for current month
  const monthTransactions = transactions.filter((t) =>
    t.transaction_date.startsWith(currentMonth)
  );
  const income = monthTransactions
    .filter((t: any) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = monthTransactions
    .filter((t: any) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get active day index from today
  const dayOfWeek = new Date().getDay();
  const activeDayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Get dates for this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - activeDayIdx);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d.getDate();
  });

  // Urgent tasks: due within 7 days and not done
  const now = new Date();
  const weekLater = new Date(now);
  weekLater.setDate(weekLater.getDate() + 7);
  const urgentTasks = tasks
    .filter((t) => {
      if (t.status === "done") return false;
      if (!t.due_date) return false;
      const due = new Date(t.due_date);
      return due >= now && due <= weekLater;
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

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
          {/* Weekly Calendar */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">Weekly Flow</Text>
              <Text variant="bodySmall" color="secondary">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.weekRow}>
                {DAYS.map((day, i) => {
                  const isActive = i === activeDayIdx;
                  return (
                    <TouchableOpacity
                      key={day}
                      activeOpacity={0.7}
                      style={[
                        styles.dayCell,
                        {
                          backgroundColor: isActive ? "transparent" : colors.glassCard,
                          borderColor: isActive ? "transparent" : colors.glassBorder,
                        },
                        isActive && styles.dayCellActive,
                      ]}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: isActive ? "#fff" : colors.textSecondary,
                          textTransform: "uppercase",
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        {day}
                      </Text>
                      <Text
                        variant="heading3"
                        style={{ color: isActive ? "#fff" : colors.text }}
                      >
                        {weekDates[i]}
                      </Text>
                      {isActive && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Progress Ring Hero */}
          <View style={styles.section}>
            <Card padding={Spacing.md} radius={20} style={styles.heroCard}>
              <View style={styles.heroRow}>
                <View style={styles.ringContainer}>
                  <Svg width={128} height={128}>
                    <Defs>
                      <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={IconColors.indigo} />
                        <Stop offset="100%" stopColor={IconColors.teal} />
                      </LinearGradient>
                    </Defs>
                    <Circle
                      cx={64} cy={64} r={RING_RADIUS}
                      stroke={colors.glassBorder}
                      strokeWidth={RING_STROKE} fill="none"
                    />
                    <Circle
                      cx={64} cy={64} r={RING_RADIUS}
                      stroke="url(#ringGrad)"
                      strokeWidth={RING_STROKE} fill="none"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={RING_CIRCUMFERENCE * (1 - habitPercent / 100)}
                      strokeLinecap="round"
                      rotation="-90" origin="64, 64"
                    />
                  </Svg>
                  <View style={styles.ringCenter}>
                    <Text variant="heading1" style={{ color: colors.text }}>
                      {habitPercent}%
                    </Text>
                  </View>
                </View>
                <View style={styles.heroInfo}>
                  <Text variant="heading3">Today's Progress</Text>
                  <Text variant="bodySmall" color="secondary" style={{ marginTop: 4, marginBottom: Spacing.sm }}>
                    {completedHabits} of {totalHabits} habits completed. Stay consistent!
                  </Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { borderColor: `${IconColors.teal}33` }]}>
                      <Text variant="caption" style={{ color: IconColors.teal }}>
                        {completedHabits}/{totalHabits}
                      </Text>
                    </View>
                    <View style={[styles.badge, { borderColor: `${IconColors.indigo}33` }]}>
                      <Text variant="caption" style={{ color: IconColors.indigo }}>
                        {habitPercent}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Row 1: Habits */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">Habits</Text>
              <Text variant="caption" color="secondary">{completedHabits}/{totalHabits}</Text>
            </View>
            <Card padding={Spacing.md} radius={20}>
              {habits.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Ionicons name="repeat" size={24} color={colors.outline} />
                  <Text variant="bodySmall" color="secondary">No habits yet</Text>
                </View>
              ) : (
                habits.map((habit, idx) => {
                  const log = habitLogs.get(habit.id);
                  const done = log && log.progress >= 1;
                  return (
                    <View
                      key={habit.id}
                      style={[styles.listRow, idx < habits.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.glassBorder }]}
                    >
                      <View style={[styles.iconSmall, { backgroundColor: `${habit.color || IconColors.indigo}20` }]}>
                        <Ionicons name={(habit.icon as any) || "repeat"} size={18} color={habit.color || IconColors.indigo} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" style={{ fontWeight: "600" }}>{habit.name}</Text>
                        <Text variant="caption" color="secondary">{habit.target_per_day}x daily</Text>
                      </View>
                      {done ? (
                        <Ionicons name="checkmark-circle" size={22} color={IconColors.done} />
                      ) : (
                        <View style={[styles.circleOutline, { borderColor: colors.outline }]} />
                      )}
                    </View>
                  );
                })
              )}
            </Card>
          </View>

          {/* Row 2: Finance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">Finance</Text>
              <Text variant="caption" color="secondary">
                {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </Text>
            </View>
            <Card padding={Spacing.md} radius={20}>
              <View style={styles.financeRow}>
                {/* Income */}
                <View style={styles.financeCol}>
                  <View style={[styles.iconSmall, { backgroundColor: `${IconColors.income}20` }]}>
                    <Ionicons name="trending-up" size={18} color={IconColors.income} />
                  </View>
                  <Text variant="caption" color="secondary" style={{ marginTop: Spacing.sm }}>Income</Text>
                  <Text variant="body" style={{ fontWeight: "700", color: IconColors.income }}>
                    {formatCurrency(income)}
                  </Text>
                </View>
                {/* Divider */}
                <View style={{ width: 1, height: 60, backgroundColor: colors.glassBorder }} />
                {/* Expense */}
                <View style={styles.financeCol}>
                  <View style={[styles.iconSmall, { backgroundColor: `${IconColors.expense}20` }]}>
                    <Ionicons name="trending-down" size={18} color={IconColors.expense} />
                  </View>
                  <Text variant="caption" color="secondary" style={{ marginTop: Spacing.sm }}>Expense</Text>
                  <Text variant="body" style={{ fontWeight: "700", color: IconColors.expense }}>
                    {formatCurrency(expense)}
                  </Text>
                </View>
              </View>
              {/* Net */}
              <View style={[styles.netRow, { borderTopWidth: 1, borderTopColor: colors.glassBorder, marginTop: Spacing.md }]}>
                <Text variant="bodySmall" color="secondary">Net</Text>
                <Text
                  variant="body"
                  style={{ fontWeight: "700", color: income - expense >= 0 ? IconColors.income : IconColors.expense }}
                >
                  {formatCurrency(income - expense)}
                </Text>
              </View>
            </Card>
          </View>

          {/* Row 3: Urgent Tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">Upcoming Tasks</Text>
              <Text variant="caption" color="secondary">{urgentTasks.length} due this week</Text>
            </View>
            <Card padding={Spacing.md} radius={20}>
              {urgentTasks.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Ionicons name="checkmark-done" size={24} color={colors.outline} />
                  <Text variant="bodySmall" color="secondary">No urgent tasks</Text>
                </View>
              ) : (
                urgentTasks.map((task, idx) => {
                  const daysLeft = getDaysLeft(task.due_date!);
                  const urgencyColor = daysLeft <= 1 ? IconColors.urgent : daysLeft <= 3 ? IconColors.high : IconColors.medium;
                  return (
                    <View
                      key={task.id}
                      style={[styles.listRow, idx < urgentTasks.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.glassBorder }]}
                    >
                      <View style={[styles.iconSmall, { backgroundColor: `${urgencyColor}20` }]}>
                        <Ionicons name="alert-circle" size={18} color={urgencyColor} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" style={{ fontWeight: "600" }}>{task.title}</Text>
                        <Text variant="caption" color="secondary">
                          {daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Due tomorrow" : `${daysLeft} days left`}
                        </Text>
                      </View>
                      <View style={[styles.urgencyBadge, { backgroundColor: `${urgencyColor}20` }]}>
                        <Text variant="caption" style={{ color: urgencyColor, fontWeight: "600" }}>
                          {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </Card>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function getDaysLeft(dueDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  weekRow: { flexDirection: "row", gap: 8 },
  dayCell: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    minWidth: 56,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  dayCellActive: {
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    shadowColor: "#6366f1",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  heroCard: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroRow: { flexDirection: "row", alignItems: "center", gap: Spacing.lg },
  ringContainer: { width: 128, height: 128, justifyContent: "center", alignItems: "center" },
  ringCenter: { position: "absolute", alignItems: "center" },
  heroInfo: { flex: 1 },
  badgeRow: { flexDirection: "row", gap: 8 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: 10,
  },
  iconSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  circleOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  emptyRow: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  financeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  financeCol: { alignItems: "center", flex: 1 },
  netRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
