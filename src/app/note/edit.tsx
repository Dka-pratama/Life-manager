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

import { getNoteById, UpdateNote, DeleteNote } from "@/repositories/NoteRepository";

import type { Note } from "@/types/note";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [infoDialogTitle, setInfoDialogTitle] = useState("");
  const [infoDialogMessage, setInfoDialogMessage] = useState("");
  const [infoDialogType, setInfoDialogType] = useState<"error" | "warning" | "info">("info");

  useEffect(() => {
    if (id) loadNote(Number(id));
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      const n = await getNoteById(noteId);
      if (n) {
        setNote(n);
        setTitle(n.title);
        setContent(n.content || "");
      }
    } catch (e) {
      console.error("Load note error:", e);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setInfoDialogTitle("Validation");
      setInfoDialogMessage("Note title is required.");
      setInfoDialogType("warning");
      setInfoDialogVisible(true);
      return;
    }
    if (!id) return;

    try {
      setLoading(true);
      await UpdateNote(Number(id), {
        title: title.trim(),
        content: content.trim() || undefined,
      });
      router.back();
    } catch (e) {
      console.error(e);
      setInfoDialogTitle("Error");
      setInfoDialogMessage("Failed to update note.");
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
      await DeleteNote(Number(id));
      setDeleteDialogVisible(false);
      router.back();
    } catch (e) {
      console.error(e);
      setDeleteLoading(false);
    }
  };

  if (!note) {
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
          <Text variant="heading3">Edit Note</Text>
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
          {/* Note Title */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>TITLE</Text>
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="Note title"
              placeholderTextColor={colors.outline}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Note Content */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>CONTENT</Text>
            <View style={[styles.contentBox, { backgroundColor: colors.surfaceContainer, borderColor: colors.glassBorder }]}>
              <TextInput
                style={[styles.contentInput, { color: colors.text }]}
                placeholder="Write your note here..."
                placeholderTextColor={colors.outline}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
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
            {loading ? "Saving..." : "Update Note"}
          </Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={deleteDialogVisible}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
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
  titleInput: {
    fontSize: 28,
    fontFamily: "ManropeBold",
    lineHeight: 36,
    padding: 0,
    minHeight: 56,
  },
  contentBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minHeight: 200,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: "ManropeRegular",
    lineHeight: 24,
    minHeight: 180,
    padding: 0,
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
