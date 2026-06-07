import { View, Text } from 'react-native';
import Screen from '@/components/layout/Screen';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { getTasks, getTaskById, updateTask, deleteTask, createTask } from '@/repositories/TaskRepository';

export default function ProfileScreen() {
  const { colors, changeTheme, themeMode } = useTheme();

  async function testCrud() {
  const id = await createTask({
    title: "CRUD Test",
    description: "Testing",
  });

  console.log("Created:", id);

  const task = await getTaskById(Number(id));
  console.log("Read:", task);

  await updateTask(Number(id), {
    title: "Updated Task",
  });

  const updated = await getTaskById(Number(id));
  console.log("Updated:", updated);

  await deleteTask(Number(id));

  const deleted = await getTaskById(Number(id));
  console.log("Deleted:", deleted);
}
    useEffect(() => {
      async function testDb() {
        await createTask({
          title: "Test Task",
          description: "This is a test task"
        });
      }
  
    }, []);
    const [tasks, setTasks] = useState<Task[]>([]);
  
    useEffect(() => {
      loadTasks();
    }, []);
  
    async function loadTasks() {
      const data = await getTasks();
      setTasks(data);
    }
  return (
    <Screen>
      <Text> Test satuuuuu</Text>
      <Button
  title="Test CRUD"
  onPress={testCrud}
/>
    <View>
      
    </View>
    </Screen>
  );
}