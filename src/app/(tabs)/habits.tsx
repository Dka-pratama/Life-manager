import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import FloatingButton from "@/components/ui/FloatingButton";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { getHabits } from "@/repositories/HabitRepository";
import { getHabitLogByDate, saveHabitProgress } from "@/repositories/HabitLogRepository";

import type { Habit } from "@/types/habit";
import type { HabitLog } from "@/types/habitLog";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitsScreen() {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Map<number, HabitLog>>(new Map());

  const today = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    try {
      const habitsData = await getHabits();
      setHabits(habitsData);

      const logsMap = new Map<number, HabitLog>();
      await Promise.all(
        habitsData.map(async (h) => {
          const log = await getHabitLogByDate(h.id, today);
          if (log) logsMap.set(h.id, log);
        })
      );
      setHabitLogs(logsMap);
    } catch (e) {
      console.error("Habits load error:", e);
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

  const totalHabits = habits.length;
  const totalProgress = habits.reduce((sum, h) => {
    const log = habitLogs.get(h.id);
    const current = log ? Math.min(log.progress, h.target_per_day) : 0;
    return sum + current;
  }, 0);
  const totalTarget = habits.reduce((sum, h) => sum + h.target_per_day, 0);
  const habitPercent = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;

  const dayOfWeek = new Date().getDay();
  const activeDayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - activeDayIdx);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d.getDate();
  });

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

          {/* Daily Progress Bar */}
          <View style={styles.section}>
            <Card padding={Spacing.md} radius={20} style={styles.heroCard}>
              <View style={styles.progressHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="heading3">Daily Progress</Text>
                  <Text variant="body" color="secondary" style={{ marginTop: 2 }}>
                    {Math.round(totalProgress)} of {totalTarget} targets completed
                  </Text>
                </View>
                <Text variant="heading1" style={{ color: colors.primary }}>
                  {habitPercent}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${habitPercent}%` },
                  ]}
                />
              </View>

              {/* Badges */}
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: `${IconColors.teal}15` }]}>
                  <Ionicons name="checkmark-circle" size={12} color={IconColors.teal} />
                  <Text variant="caption" style={{ color: IconColors.teal }}>
                    {Math.round(totalProgress)}/{totalTarget} Done
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${IconColors.indigo}15` }]}>
                  <Ionicons name="trending-up" size={12} color={IconColors.indigo} />
                  <Text variant="caption" style={{ color: IconColors.indigo }}>
                    {habitPercent}%
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Habit List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">My Habits</Text>
              <Text variant="caption" color="secondary">{totalHabits} total</Text>
            </View>

            {habits.length === 0 ? (
              <Card padding={Spacing.lg} radius={20}>
                <View style={styles.emptyState}>
                  <Ionicons name="repeat-outline" size={40} color={colors.outline} />
                  <Text variant="body" color="secondary" style={{ marginTop: Spacing.sm }}>
                    No habits yet. Tap + to add one.
                  </Text>
                </View>
              </Card>
            ) : (
              <View style={{ gap: 12 }}>
                {habits.map((habit) => {
                  const log = habitLogs.get(habit.id);
                  const currentProgress = log ? Math.min(log.progress, habit.target_per_day) : 0;
                  const done = currentProgress >= habit.target_per_day;
                  const habitColor = habit.color || IconColors.indigo;

                  const handleIncrement = async () => {
                    if (done) return;
                    const newProgress = currentProgress + 1;
                    const today = new Date().toISOString().split("T")[0];
                    try {
                      await saveHabitProgress({
                        habit_id: habit.id,
                        progress: newProgress,
                        completed_date: today,
                      });
                      loadData();
                    } catch (e) {
                      console.error("Increment error:", e);
                    }
                  };

                  const handleDecrement = async () => {
                    if (currentProgress <= 0) return;
                    const newProgress = currentProgress - 1;
                    const today = new Date().toISOString().split("T")[0];
                    try {
                      await saveHabitProgress({
                        habit_id: habit.id,
                        progress: newProgress,
                        completed_date: today,
                      });
                      loadData();
                    } catch (e) {
                      console.error("Decrement error:", e);
                    }
                  };

                  return (
                    <Card key={habit.id} padding={Spacing.md} radius={20}>
                      <View style={styles.habitRow}>
                        <TouchableOpacity
                          style={styles.habitLeft}
                          activeOpacity={0.7}
                          onPress={() => router.push(`/habit/edit?id=${habit.id}`)}
                        >
                          <View
                            style={[
                              styles.habitIcon,
                              { backgroundColor: `${habitColor}20` },
                            ]}
                          >
                            <Ionicons
                              name={(habit.icon as any) || "repeat"}
                              size={22}
                              color={habitColor}
                            />
                          </View>
                          <View>
                            <Text variant="heading3" style={{ lineHeight: 28 }}>
                              {habit.name}
                            </Text>
                            <Text variant="caption" color="secondary">
                              {habit.target_per_day}x daily target
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Progress Controls */}
                        <View style={styles.progressControls}>
                          <TouchableOpacity
                            style={[styles.progressBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
                            onPress={handleDecrement}
                            disabled={currentProgress <= 0}
                          >
                            <Ionicons name="remove" size={16} color={currentProgress <= 0 ? colors.outline : colors.text} />
                          </TouchableOpacity>

                          <View style={styles.progressValue}>
                            {done ? (
                              <Ionicons name="checkmark-circle" size={22} color={IconColors.teal} />
                            ) : (
                              <Text variant="bodySmall" style={{ fontWeight: "700", color: habitColor }}>
                                {currentProgress}/{habit.target_per_day}
                              </Text>
                            )}
                          </View>

                          <TouchableOpacity
                            style={[styles.progressBtn, done ? { backgroundColor: `${IconColors.teal}15`, borderColor: `${IconColors.teal}33` } : { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
                            onPress={handleIncrement}
                            disabled={done}
                          >
                            <Ionicons name="add" size={16} color={done ? IconColors.teal : colors.text} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <FloatingButton onPress={() => router.push("/habit/create")} />
    </Screen>
  );
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
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  heroCard: {},
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: IconColors.indigo,
  },
  badgeRow: { flexDirection: "row", gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  progressControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressValue: {
    minWidth: 48,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
});
