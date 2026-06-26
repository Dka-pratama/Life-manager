import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import Header from "@/components/layout/Header";
import Screen from "@/components/layout/Screen";
import TaskForm from "@/components/task/TaskForm";

import * as Repo from "@/repositories/TaskRepository";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul task wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await Repo.createTask({
        title,
        description,
        due_date: dueDate.toISOString(),
      });

      Alert.alert("Berhasil", "Task berhasil ditambahkan.");

      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal menambahkan task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Create Task" />

      <Screen>
        <TaskForm
          title={title}
          description={description}
          dueDate={dueDate}
          loading={loading}
          submitTitle="Save Task"
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDueDateChange={setDueDate}
          onSubmit={handleCreate}
        />
      </Screen>
    </>
  );
}