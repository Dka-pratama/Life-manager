import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import Header from "@/components/layout/Header";
import Screen from "@/components/layout/Screen";
import LoadingState from "@/components/feedback/LoadingState";
import TaskForm from "@/components/task/TaskForm";

import * as Repo from "@/repositories/TaskRepository";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const task = await Repo.getTaskById(Number(id));

      if (!task) {
        Alert.alert("Error", "Task tidak ditemukan.");
        router.back();
        return;
      }

      setTitle(task.title);
      setDescription(task.description ?? "");

      if (task.due_date) {
        setDueDate(new Date(task.due_date));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal mengambil data task.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul task wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      await Repo.updateTask(Number(id), {
        title,
        description,
        due_date: dueDate.toISOString(),
      });

      Alert.alert("Berhasil", "Task berhasil diperbarui.");

      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal memperbarui task.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <>
      <Header title="Edit Task" />

      <Screen>
        <TaskForm
          title={title}
          description={description}
          dueDate={dueDate}
          loading={saving}
          submitTitle="Update Task"
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDueDateChange={setDueDate}
          onSubmit={handleUpdate}
        />
      </Screen>
    </>
  );
}