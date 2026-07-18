import AlertDialog from "@/components/feedback/AlertDialog";
import Screen from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FloatingButton from "@/components/ui/FloatingButton";
import SearchInput from "@/components/ui/SearchInput";
import Text from "@/components/ui/Text";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import EmptyState from "@/components/feedback/EmptyState";
import LoadingState from "@/components/feedback/LoadingState";

import * as Repo from "@/repositories";
import { Task } from "@/types/task";

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const loadTasks = async () => {
    try {
      setLoading(true);

      const data = await Repo.getTasks();

      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const [showDelete, setShowDelete] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }
  const filteredTasks = tasks.filter((task) => {
    const keyword = search.toLowerCase();

    return (
      task.title.toLowerCase().includes(keyword) ||
      (task.description ?? "").toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <Screen>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cari task..."
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="Belum ada task"
              description="Tambahkan task pertama kamu"
            />
          ) : (
            <View style={{ gap: 12 }}>
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <Text variant="heading3">{task.title}</Text>
                  {task.description && <Text>{task.description}</Text>}
                  <Text>Deadline: {task.due_date ?? "-"}</Text>
                  <Text>Status: {task.status}</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      marginTop: 12,
                    }}>
                    <Button
                      title="Edit"
                      onPress={() =>
                        router.push({
                          pathname: "/task/edit",
                          params: {
                            id: task.id,
                          },
                        })
                      }
                    />

                    <Button
                      title="Delete"
                      onPress={() => {
                        setSelectedTaskId(task.id);
                        setShowDelete(true);
                      }}
                    />
                    <AlertDialog
                      visible={showDelete}
                      type="warning"
                      title="Delete Task"
                      message="Yakin menghapus task ini?"
                      showCancel
                      confirmText="Delete"
                      cancelText="Cancel"
                      onCancel={() => setShowDelete(false)}
                      onConfirm={async () => {
                        if (selectedTaskId === null) return;

                        await Repo.deleteTask(selectedTaskId);
                        setShowDelete(false);
                        setSelectedTaskId(null);

                        loadTasks();
                      }}
                    />
                  </View>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
        <FloatingButton onPress={() => router.push("/task/create")} />
      </Screen>
    </>
  );
}
