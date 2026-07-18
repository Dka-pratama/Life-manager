import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, ColorValue } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { IconColors } from "@/constants/iconColors";
import Header from "@/components/layout/Header";
import Text from "@/components/ui/Text";

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        header: ({ route, options }) => <Header title={(options.headerTitle as string) || (options.title as string) || route.name} />,
        tabBarActiveTintColor: IconColors.indigo as string,
        tabBarInactiveTintColor: colors.outline as string,
        tabBarStyle: {
          backgroundColor: isDark ? colors.surfaceContainer : colors.glassCard,
          borderTopColor: isDark ? colors.glassBorder : colors.border,
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 28,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "ManropeSemiBold",
          fontSize: 11,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          header: () => <DashboardHeader colors={colors} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Finance"
        options={{
          title: "Wallet",
          headerTitle: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "wallet" : "wallet-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Task"
        options={{
          title: "Task",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "checkmark-circle" : "checkmark-circle-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "repeat" : "repeat-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "document-text" : "document-text-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function DashboardHeader({ colors }: { colors: any }) {
  return (
    <View style={[styles.dashHeader, { borderBottomColor: colors.surfaceContainerHigh, backgroundColor: colors.surfaceContainer }]}>
      <View style={styles.dashHeaderLeft}>
        <Text variant="heading1">Dashboard</Text>
      </View>
      <TouchableOpacity style={[styles.profileIcon, { borderColor: colors.glassBorder, backgroundColor: colors.glassCard }]}>
        <Ionicons name="person" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function TabIcon({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: ColorValue;
  focused: boolean;
}) {
  const hex = typeof color === "string" ? color : "#818cf8";
  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: `${hex}15` }]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  dashHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dashHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
