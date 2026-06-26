import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface TaskFormProps {
  title: string;
  description: string;
  dueDate: Date;

  loading?: boolean;
  submitTitle: string;

  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onDueDateChange: (date: Date) => void;
  onSubmit: () => void;
}

export default function TaskForm({
  title,
  description,
  dueDate,

  loading = false,
  submitTitle,

  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onSubmit,
}: TaskFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Input
        label="Title"
        placeholder="Masukkan judul task"
        value={title}
        onChangeText={onTitleChange}
      />

      <Input
        label="Description"
        placeholder="Masukkan deskripsi task"
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        numberOfLines={4}
      />

      <Input
        label="Due Date"
        value={dueDate.toLocaleDateString("id-ID")}
        editable={false}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onValueChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              onDueDateChange(selectedDate);
            }
          }}
        />
      )}

      <Button
        title={submitTitle}
        onPress={onSubmit}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});