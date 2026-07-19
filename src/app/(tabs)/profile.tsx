import { useState, useEffect } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";
import { Spacing } from "@/constants/Spacing";
import { IconColors } from "@/constants/iconColors";

import { getSetting, setSetting } from "@/repositories/SettingsRepository";

const THEMES: { key: ThemeMode; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
  { key: "light", label: "Light", icon: "sunny" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "system", label: "System", icon: "phone-portrait" },
];

export default function ProfileScreen() {
  const { colors, isDark, themeMode, changeTheme } = useTheme();

  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [aiToken, setAiToken] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const nameSetting = await getSetting("profile_name");
    if (nameSetting?.value) setName(nameSetting.value);

    const apiKeySetting = await getSetting("api_key");
    if (apiKeySetting?.value) setApiKey(apiKeySetting.value);

    const aiTokenSetting = await getSetting("ai_token");
    if (aiTokenSetting?.value) setAiToken(aiTokenSetting.value);
  };

  const handleNameChange = async (text: string) => {
    setName(text);
    await setSetting("profile_name", text);
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.glassBorder, backgroundColor: colors.background }]}>
        <Text variant="heading3">Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}40` }]}>
              <Ionicons name="person" size={48} color={colors.primary} />
            </View>
            <Text variant="bodySmall" color="secondary" style={{ marginTop: 8 }}>
              Your profile
            </Text>
          </View>

          {/* Name */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>NAME</Text>
            <View style={[styles.inputRow, { borderColor: colors.glassBorder, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }]}>
              <Ionicons name="person-outline" size={18} color={colors.outline} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your name"
                placeholderTextColor={colors.outline}
                value={name}
                onChangeText={handleNameChange}
              />
            </View>
          </View>

          {/* Theme */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>THEME</Text>
            <View style={styles.themeRow}>
              {THEMES.map((t) => {
                const active = themeMode === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    style={[
                      styles.themeBtn,
                      {
                        borderColor: active ? colors.primary : colors.glassBorder,
                        backgroundColor: active ? `${colors.primary}15` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      },
                    ]}
                    onPress={() => changeTheme(t.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={t.icon} size={20} color={active ? colors.primary : colors.outline} />
                    <Text
                      variant="bodySmall"
                      style={{ color: active ? colors.primary : colors.textSecondary, fontWeight: active ? "700" : "500" }}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* API Key */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>API KEY</Text>
            <View style={[styles.inputRow, { borderColor: colors.glassBorder, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", opacity: 0.5 }]}>
              <Ionicons name="key-outline" size={18} color={colors.outline} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Coming soon..."
                placeholderTextColor={colors.outline}
                value={apiKey}
                onChangeText={setApiKey}
                editable={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Ionicons name="lock-closed-outline" size={16} color={colors.outline} />
            </View>
            <Text variant="caption" color="secondary" style={{ marginTop: 6 }}>
              Database via Express (coming soon)
            </Text>
          </View>

          {/* AI Token */}
          <View style={styles.section}>
            <Text variant="caption" color="secondary" style={styles.label}>AI TOKEN</Text>
            <View style={[styles.inputRow, { borderColor: colors.glassBorder, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", opacity: 0.5 }]}>
              <Ionicons name="sparkles-outline" size={18} color={colors.outline} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Coming soon..."
                placeholderTextColor={colors.outline}
                value={aiToken}
                onChangeText={setAiToken}
                editable={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Ionicons name="lock-closed-outline" size={16} color={colors.outline} />
            </View>
            <Text variant="caption" color="secondary" style={{ marginTop: 6 }}>
              AI features (coming soon)
            </Text>
          </View>

          {/* App Info */}
          <View style={[styles.infoCard, { borderColor: colors.glassBorder, backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }]}>
            <Ionicons name="information-circle-outline" size={18} color={colors.outline} />
            <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
              Life Manager v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "ManropeRegular",
    padding: 0,
  },
  themeRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
});
