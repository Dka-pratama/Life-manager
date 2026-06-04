import { View, StyleSheet, Button } from "react-native";
import {useEffect, useState} from "react";
import {createTask, getTasks} from "../repositories/TaskRepository";
import {FlatList} from "react-native-gesture-handler";

import { router } from "expo-router";
import {setSetting, getSetting} from "../repositories/SettingsRepository";
import {Task} from "../types/task";
import Card from "@/components/ui/Card"
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import Text from "@/components/ui/Text";


export default function Index() {
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

  async function testSettings() {
    await setSetting("theme", "dark");
    const theme = await getSetting("theme");

    console.log("Theme setting:", theme);
  }

  useEffect(() => {
    testSettings();
  }, []);

  const { colors, changeTheme, themeMode } = useTheme();

  return (
    <View style={styles(colors).container}>
      <Button
        title="Go to Profile"
        onPress={() => router.push("/(tabs)/profile")}
      />
      
      <Text variant="heading2">Testing database.</Text>
      <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <BlurView intensity={30}>
        <Card>
      <Text variant="body">{item.title} {item.id} {item.description}</Text>
      <Text variant="bodySmall" color="secondary">{item.description}</Text>
      <Text variant="caption" color="secondary">{item.title} {item.id} {item.description}</Text>
        </Card>
        </BlurView>
      )}
        />
              <Text
      style={{ 
        color: colors.text,
        marginBottom: 20
       }}>Theme : {themeMode}</Text>

       <Button
        title="Light Mode"
        onPress={() => changeTheme('light')}
        color={colors.primary}
       />
        <Button
        title="Dark Mode"
        onPress={() => changeTheme('dark')}
        color={colors.primary}
       />
       <Button
        title="System Default"
        onPress={() => changeTheme('system')}
        color={colors.primary}
       />
    </View>
  );
}

const styles = (Colors : any) =>
  StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
