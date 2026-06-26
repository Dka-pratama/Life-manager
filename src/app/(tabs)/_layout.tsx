import Header from "@/components/layout/Header";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({route}) => <Header title={route.name}/>,
      }}/>
  );
}
