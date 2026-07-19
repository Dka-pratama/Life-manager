import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
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

import { getTasks, toggleTaskStatus } from "@/repositories/TaskRepository";

import type { Task } from "@/types/task";

const DAYS_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - Spacing.md * 2 - 16) / 7);

const CATEGORY_COLORS: Record<string, string> = {
  personal: IconColors.indigo,
  work: IconColors.teal,
  fitness: "#fb923c",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: IconColors.low,
  med: IconColors.medium,
  high: IconColors.urgent,
};

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TaskScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadData = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      console.error("Tasks load error:", e);
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

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Monday=0 ... Sunday=6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const calendarDays: (number | null)[] = [];
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push(prevMonthLastDay - i);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }
  // Next month padding
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  // Map due_date -> count of tasks
  const tasksByDate = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((t) => {
      if (t.due_date) {
        const key = t.due_date.split("T")[0];
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return map;
  }, [tasks]);

  const today = new Date();
  const todayStr = formatDateStr(today);

  const selectedDateStr = formatDateStr(selectedDate);

  // Tasks for selected date
  const selectedTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!t.due_date) return false;
        return t.due_date.split("T")[0] === selectedDateStr;
      })
      .sort((a, b) => {
        if (a.status === "done" && b.status !== "done") return 1;
        if (a.status !== "done" && b.status === "done") return -1;
        return 0;
      });
  }, [tasks, selectedDateStr]);

  const remainingCount = selectedTasks.filter((t) => t.status !== "done").length;

  const navigateMonth = (dir: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + dir);
    setCurrentMonth(next);
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await toggleTaskStatus(task.id, newStatus);
    loadData();
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dayLabel = selectedDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric" });

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
          {/* Calendar Section */}
          <View style={styles.section}>
            <View style={styles.calHeader}>
              <View>
                <Text variant="heading2">{monthLabel}</Text>
                <Text variant="bodySmall" color="secondary">Today is {dayLabel}</Text>
              </View>
              <View style={styles.calNav}>
                <TouchableOpacity style={[styles.calNavBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]} onPress={() => navigateMonth(-1)}>
                  <Ionicons name="chevron-back" size={18} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.calNavBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]} onPress={() => navigateMonth(1)}>
                  <Ionicons name="chevron-forward" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <Card padding={Spacing.md} radius={16}>
              {/* Day headers */}
              <View style={styles.calRow}>
                {DAYS_HEADER.map((d) => (
                  <View key={d} style={{ width: CELL_SIZE, alignItems: "center", paddingVertical: 8 }}>
                    <Text variant="caption" color="secondary" style={{ textTransform: "uppercase", letterSpacing: 1 }}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar cells */}
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIdx) => (
                <View key={`week-${weekIdx}`} style={styles.calRow}>
                  {calendarDays.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, colIdx) => {
                    const i = weekIdx * 7 + colIdx;
                    if (day === null) return <View key={`empty-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />;

                    const dateStr = formatDateStr(new Date(year, month, day));
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDateStr && !isToday;
                    const hasTask = tasksByDate.has(dateStr);
                    const isCurrentMonth = i >= startDayOfWeek && i < daysInMonth + startDayOfWeek;

                    return (
                      <TouchableOpacity
                        key={`day-${i}`}
                        activeOpacity={0.7}
                        style={[
                          {
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            gap: 2,
                          },
                          isToday && styles.calCellToday,
                          isSelected && { borderWidth: 1.5, borderColor: colors.primary },
                        ]}
                        onPress={() => setSelectedDate(new Date(year, month, day))}
                      >
                        <Text
                          variant="body"
                          style={{
                            color: isToday ? "#fff" : isCurrentMonth ? colors.text : `${colors.text}30`,
                            fontWeight: isToday || isSelected ? "700" : "400",
                          }}
                        >
                          {day}
                        </Text>
                        {hasTask && (
                          <View style={[styles.calDot, { backgroundColor: isToday ? "#fff" : colors.secondary }]} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </Card>
          </View>

          {/* Tasks Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">
                {selectedDateStr === todayStr ? "Today's Focus" : selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
              <Text variant="bodySmall" color="secondary">{remainingCount} Task{remainingCount !== 1 ? "s" : ""} Remaining</Text>
            </View>

            {selectedTasks.length === 0 ? (
              <Card padding={Spacing.lg} radius={16}>
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={40} color={colors.outline} />
                  <Text variant="bodySmall" color="secondary" style={{ marginTop: Spacing.sm }}>
                    No tasks for this date
                  </Text>
                </View>
              </Card>
            ) : (
              <View style={{ gap: 12 }}>
                {selectedTasks.map((task) => {
                  const done = task.status === "done";
                  const catColor = CATEGORY_COLORS[task.category] || IconColors.indigo;
                  const timeStr = task.due_date
                    ? new Date(task.due_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    : null;

                  return (
                    <TouchableOpacity
                      key={task.id}
                      activeOpacity={0.7}
                      onPress={() => router.push(`/task/edit?id=${task.id}`)}
                    >
                    <Card padding={Spacing.md} radius={16} style={done ? { opacity: 0.5 } : undefined}>
                      <View style={styles.taskRow}>
                        {/* Checkbox */}
                        <TouchableOpacity onPress={() => handleToggle(task)} activeOpacity={0.7}>
                          <View style={[
                            styles.checkbox,
                            done
                              ? { backgroundColor: `${catColor}30`, borderColor: catColor }
                              : { borderColor: catColor },
                          ]}>
                            {done && <Ionicons name="checkmark" size={14} color={catColor} />}
                          </View>
                        </TouchableOpacity>

                        {/* Content */}
                        <View style={{ flex: 1 }}>
                          <View style={styles.taskTop}>
                            <Text
                              variant="body"
                              style={{
                                fontWeight: "600",
                                color: done ? colors.textSecondary : colors.text,
                                textDecorationLine: done ? "line-through" : "none",
                                textDecorationColor: `${catColor}80`,
                                flex: 1,
                              }}
                            >
                              {task.title}
                            </Text>
                            {timeStr && (
                              <View style={styles.timeBadge}>
                                <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                                <Text variant="caption" color="secondary">{timeStr}</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.tagRow}>
                            <View style={[styles.tag, { backgroundColor: `${catColor}15`, borderColor: `${catColor}25` }]}>
                              <Text variant="caption" style={{ color: catColor }}>
                                {task.category || "personal"}
                              </Text>
                            </View>
                            {task.priority && task.priority !== "med" && (
                              <View style={[styles.tag, { backgroundColor: `${PRIORITY_COLORS[task.priority] || colors.outline}15`, borderColor: `${PRIORITY_COLORS[task.priority] || colors.outline}25` }]}>
                                <Text variant="caption" style={{ color: PRIORITY_COLORS[task.priority] || colors.outline }}>
                                  {task.priority}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </Card>
                    </TouchableOpacity>
                  );
                })}

                {/* Add task for this date */}
                <TouchableOpacity
                  style={[styles.addTaskBtn, { borderColor: `${colors.textSecondary}20` }]}
                  activeOpacity={0.7}
                  onPress={() => router.push("/task/create")}
                >
                  <Ionicons name="add" size={18} color={colors.textSecondary} />
                  <Text variant="bodySmall" color="secondary">Add task for this date</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bento Cards */}
          <View style={styles.bentoRow}>
            <Card padding={Spacing.md} radius={16} style={styles.bentoCard}>
              <View style={styles.bentoOverlay} />
              <View style={styles.bentoContent}>
                <Text variant="body" style={{ color: colors.primary, fontWeight: "600" }}>Daily Insights</Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
                  You have {remainingCount} task{remainingCount !== 1 ? "s" : ""} left today. Stay focused!
                </Text>
              </View>
            </Card>

            <View pointerEvents="none" style={{ opacity: 0.4 }}>
            <Card padding={Spacing.md} radius={16} style={{ ...styles.bentoCard, borderColor: `${IconColors.teal}25` }}>
              <View style={[styles.bentoIcon, { backgroundColor: `${IconColors.teal}15` }]}>
                <Ionicons name="sparkles" size={28} color={IconColors.teal} />
              </View>
              <View style={styles.bentoContent}>
                <Text variant="body" style={{ color: IconColors.teal, fontWeight: "600" }}>AI Schedule</Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
                  Coming soon
                </Text>
              </View>
            </Card>
            </View>
          </View>
        </View>
      </ScrollView>

      <FloatingButton onPress={() => router.push("/task/create")} />
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
  calHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  calNav: { flexDirection: "row", gap: 8 },
  calNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calRow: {
    flexDirection: "row",
  },
  calCellToday: {
    backgroundColor: IconColors.indigo,
    shadowColor: IconColors.indigo,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  taskTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagRow: { flexDirection: "row", gap: 6 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  addTaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
  bentoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.sm,
  },
  bentoCard: {
    flex: 1,
    minHeight: 140,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bentoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  bentoIcon: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  bentoContent: {
    zIndex: 1,
  },
});
