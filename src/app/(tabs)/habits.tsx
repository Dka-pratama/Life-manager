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
import { getHabitLogByDate } from "@/repositories/HabitLogRepository";

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
  const completedHabits = habits.filter((h) => {
    const log = habitLogs.get(h.id);
    return log && log.progress >= 1;
  }).length;
  const habitPercent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

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
                    {completedHabits} of {totalHabits} habits completed today
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
                <View style={[styles.badge, { borderColor: `${IconColors.teal}33` }]}>
                  <Text variant="caption" style={{ color: IconColors.teal }}>
                    {completedHabits}/{totalHabits} Done
                  </Text>
                </View>
                <View style={[styles.badge, { borderColor: `${IconColors.indigo}33` }]}>
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
                  const done = log && log.progress >= 1;
                  const habitColor = habit.color || IconColors.indigo;

                  return (
                    <Card key={habit.id} padding={Spacing.md} radius={20}>
                      <View style={styles.habitRow}>
                        <View style={styles.habitLeft}>
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
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.checkBtn,
                            done
                              ? { backgroundColor: `${IconColors.teal}15`, borderColor: `${IconColors.teal}33` }
                              : { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
                          ]}
                          activeOpacity={0.7}
                        >
                          {done ? (
                            <Ionicons name="checkmark-circle" size={24} color={IconColors.teal} />
                          ) : (
                            <View style={[styles.emptyCheck, { borderColor: colors.outline }]} />
                          )}
                        </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
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
  checkBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
});
