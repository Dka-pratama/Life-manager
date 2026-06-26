import { View, StyleSheet } from "react-native";
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
import  Button  from "@/components/ui/Button"
import  Input  from "@/components/ui/Input"
import Header from "@/components/layout/Header";


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
      <Header 
      title="Dashboard"
      subtitle="halloo, ini sub"
      />
      <Button
        title="Go to Profile"
        onPress={() => router.push("/(tabs)/Dashboard")}
      />
      <Button
        title="Go to Test"
        onPress={() => router.push("/dev/database-test")}
      />
      <Input
        label="Email"
        placeholder="Masukkan email"
      />
      <Input
        label="Description"
        multiline
        numberOfLines={4}
      />
      <Text variant="heading2">Testing database.</Text>
              <Text
      style={{ 
        color: colors.text,
        marginBottom: 20
       }}>Theme : {themeMode}</Text>

       <Button
        title="Light Mode"
        onPress={() => changeTheme('light')}
        variant="secondary"
       />
        <Button
        title="Dark Mode"
        onPress={() => changeTheme('dark')}
        variant="outline"
       />
       <Button
        title="System Default"
        variant="glass"
        onPress={() => changeTheme('system')}
       />
    </View>
  );
}

const styles = (Colors : any) =>
  StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
    justifyContent: "center",
  },
});
