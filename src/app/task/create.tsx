import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { createTask } from "@/repositories/TaskRepository";
import { getNotes, CreateNote } from "@/repositories/NoteRepository";
import { CreateTaskNote } from "@/repositories/TaskNoteRepository";

import type { Note } from "@/types/note";

const CATEGORIES = [
  { key: "personal", label: "Personal", icon: "person" as const, color: IconColors.indigo },
  { key: "work", label: "Work", icon: "briefcase" as const, color: IconColors.teal },
  { key: "fitness", label: "Fitness", icon: "fitness" as const, color: "#fb923c" },
];

const PRIORITIES = [
  { key: "low", label: "Low", color: IconColors.low },
  { key: "med", label: "Med", color: IconColors.medium },
  { key: "high", label: "High", color: IconColors.urgent },
];

export default function CreateTaskScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("med");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<number>>(new Set());
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (e) {
      console.error("Load notes error:", e);
    }
  };

  const toggleNote = (id: number) => {
    setSelectedNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Task name is required.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create task
      const taskId = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate.toISOString(),
        category,
        priority,
      });

      // 2. Create new notes if any
      let allNoteIds = Array.from(selectedNoteIds);
      if (newNoteTitle.trim()) {
        const noteId = await CreateNote({
          title: newNoteTitle.trim(),
          content: newNoteContent.trim() || undefined,
        });
        allNoteIds.push(Number(noteId));
      }

      // 3. Link all notes to task
      await Promise.all(
        allNoteIds.map((noteId) =>
          CreateTaskNote({ task_id: Number(taskId), note_id: noteId })
        )
      );

      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text variant="heading3">Add Task</Text>
        </View>
        <TouchableOpacity onPress={() => { setTitle(""); setDescription(""); setCategory("personal"); setPriority("med"); setSelectedNoteIds(new Set()); setNewNoteTitle(""); setNewNoteContent(""); setShowNewNote(false); }}>
          <Text variant="bodySmall" style={{ color: colors.primary, textTransform: "uppercase", letterSpacing: 1 }}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          {/* Task Title */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>TASK NAME</Text>
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.outline}
              value={title}
              onChangeText={setTitle}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Category Grid */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>CATEGORY</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isActive = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    activeOpacity={0.7}
                    style={[
                      styles.categoryBtn,
                      {
                        borderColor: isActive ? colors.primary : colors.border,
                        backgroundColor: colors.surfaceContainer,
                      },
                      isActive && { shadowColor: "#818cf8", shadowOpacity: 0.1, shadowRadius: 12, elevation: 2 },
                    ]}
                    onPress={() => setCategory(cat.key)}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: isActive ? `${cat.color}30` : `${cat.color}15` }]}>
                      <Ionicons name={cat.icon} size={20} color={cat.color} />
                    </View>
                    <Text variant="bodySmall" style={{ color: isActive ? colors.text : colors.textSecondary }}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Priority & Due Date Row */}
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="secondary" style={styles.label}>PRIORITY</Text>
              <View style={[styles.priorityBar, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}>
                {PRIORITIES.map((p) => {
                  const isActive = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      activeOpacity={0.7}
                      style={[styles.priorityBtn, isActive && { backgroundColor: p.color, shadowColor: p.color, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }]}
                      onPress={() => setPriority(p.key)}
                    >
                      <Text variant="caption" style={{ color: isActive ? "#fff" : colors.textSecondary, fontWeight: "700" }}>{p.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text variant="caption" color="secondary" style={styles.label}>DUE DATE</Text>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <View>
                  <Text variant="bodySmall" style={{ fontWeight: "600" }}>
                    {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Text>
                  <Text variant="caption" color="secondary">
                    {dueDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
                <Ionicons name="pencil" size={14} color={colors.outline} style={{ marginLeft: "auto" }} />
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>NOTES</Text>
            <View style={[styles.notesBox, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}>
              <TextInput
                style={[styles.notesInput, { color: colors.textSecondary }]}
                placeholder="Add extra details, links, or subtasks..."
                placeholderTextColor={colors.outline}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ─── Linked Notes Section ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="caption" color="secondary" style={styles.label}>LINKED NOTES</Text>
              <TouchableOpacity onPress={() => setShowNewNote(!showNewNote)}>
                <Ionicons name={showNewNote ? "close" : "add-circle"} size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* New Note Form */}
            {showNewNote && (
              <Card padding={Spacing.md} radius={14} style={{ marginBottom: 12, borderColor: colors.primary, borderWidth: 1 }}>
                <TextInput
                  style={[styles.newNoteTitle, { color: colors.text }]}
                  placeholder="Note title"
                  placeholderTextColor={colors.outline}
                  value={newNoteTitle}
                  onChangeText={setNewNoteTitle}
                />
                <TextInput
                  style={[styles.newNoteContent, { color: colors.textSecondary }]}
                  placeholder="Note content (optional)"
                  placeholderTextColor={colors.outline}
                  value={newNoteContent}
                  onChangeText={setNewNoteContent}
                  multiline
                  textAlignVertical="top"
                />
              </Card>
            )}

            {/* Existing Notes List */}
            {notes.length === 0 ? (
              <Text variant="bodySmall" color="secondary" style={{ paddingHorizontal: 4 }}>
                No notes available. Create one above.
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {notes.map((note) => {
                  const isSelected = selectedNoteIds.has(note.id);
                  return (
                    <TouchableOpacity
                      key={note.id}
                      activeOpacity={0.7}
                      style={[
                        styles.noteItem,
                        {
                          backgroundColor: isSelected ? `${IconColors.indigo}15` : colors.surfaceContainer,
                          borderColor: isSelected ? IconColors.indigo : colors.border,
                        },
                      ]}
                      onPress={() => toggleNote(note.id)}
                    >
                      <View style={styles.noteLeft}>
                        <View style={[styles.noteIcon, { backgroundColor: `${IconColors.indigo}20` }]}>
                          <Ionicons name="document-text" size={18} color={IconColors.indigo} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text variant="bodySmall" style={{ fontWeight: "600" }}>{note.title}</Text>
                          {note.content ? (
                            <Text variant="caption" color="secondary" numberOfLines={1}>{note.content}</Text>
                          ) : null}
                        </View>
                      </View>
                      <View style={[styles.checkbox, isSelected && { backgroundColor: IconColors.indigo, borderColor: IconColors.indigo }]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Quote Card */}
          <View style={[styles.quoteCard, { borderColor: colors.border }]}>
            <View style={styles.quoteOverlay} />
            <View style={styles.quoteContent}>
              <Text variant="caption" style={{ color: colors.primary, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                Inspiration
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ fontStyle: "italic", marginTop: 4 }}>
                "The secret of getting ahead is getting started."
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { shadowColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <Ionicons name="checkmark" size={22} color="#fff" />
          <Text variant="body" style={{ color: "#fff", fontWeight: "700" }}>
            {loading ? "Saving..." : "Save Task"}
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  titleInput: {
    fontSize: 28,
    fontFamily: "ManropeBold",
    lineHeight: 36,
    padding: 0,
    minHeight: 72,
  },
  categoryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  categoryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  priorityBar: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  priorityBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  notesBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  notesInput: {
    fontSize: 14,
    fontFamily: "ManropeRegular",
    lineHeight: 22,
    minHeight: 80,
    padding: 0,
  },
  newNoteTitle: {
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
    padding: 0,
    marginBottom: 8,
  },
  newNoteContent: {
    fontSize: 14,
    fontFamily: "ManropeRegular",
    lineHeight: 20,
    minHeight: 48,
    padding: 0,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  noteLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  noteIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255,255,255,0.2)",
  },
  quoteCard: {
    height: 128,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  quoteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  quoteContent: {
    padding: 16,
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
