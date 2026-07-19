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

import { getNotes, DeleteNote } from "@/repositories/NoteRepository";
import { getTasksByNoteId } from "@/repositories/TaskNoteRepository";

import type { Note } from "@/types/note";

export default function NotesScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTaskCounts, setNoteTaskCounts] = useState<Map<number, number>>(new Map());

  const loadData = useCallback(async () => {
    try {
      const data = await getNotes();
      setNotes(data);

      const counts = new Map<number, number>();
      await Promise.all(
        data.map(async (n) => {
          const tasks = await getTasksByNoteId(n.id);
          counts.set(n.id, tasks.length);
        })
      );
      setNoteTaskCounts(counts);
    } catch (e) {
      console.error("Notes load error:", e);
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
          {notes.length === 0 ? (
            <Card padding={Spacing.xl} radius={20}>
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color={colors.outline} />
                <Text variant="body" color="secondary" style={{ marginTop: Spacing.sm }}>
                  No notes yet. Tap + to create one.
                </Text>
              </View>
            </Card>
          ) : (
            <View style={{ gap: 12 }}>
              {notes.map((note) => {
                const taskCount = noteTaskCounts.get(note.id) || 0;
                return (
                  <Card key={note.id} padding={Spacing.md} radius={20}>
                    <View style={styles.noteRow}>
                      <TouchableOpacity
                        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: Spacing.sm }}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/note/edit?id=${note.id}`)}
                      >
                        <View style={[styles.noteIcon, { backgroundColor: `${IconColors.indigo}20` }]}>
                          <Ionicons name="document-text" size={20} color={IconColors.indigo} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text variant="heading3" style={{ lineHeight: 28 }}>{note.title}</Text>
                          <Text variant="caption" color="secondary">
                            {taskCount > 0 ? `${taskCount} task${taskCount > 1 ? "s" : ""} linked` : "No tasks linked"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          await DeleteNote(note.id);
                          loadData();
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.outline} />
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <FloatingButton onPress={() => router.push("/note/create")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  noteIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
