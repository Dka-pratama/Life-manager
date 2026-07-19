import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/contexts/ThemeContext";
import Text from "@/components/ui/Text";
import { Spacing } from "@/constants/Spacing";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "warning" | "error" | "info";
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function AlertDialog({
  visible,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  loading = false,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const { colors, isDark } = useTheme();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.9);
      backdropOpacity.setValue(0);
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle" as const, color: "#4ade80", bg: "#4ade8020", border: "#4ade8033" };
      case "warning":
        return { name: "warning" as const, color: "#fbbf24", bg: "#fbbf2420", border: "#fbbf2433" };
      case "error":
        return { name: "close-circle" as const, color: "#ffb4ab", bg: "#93000a30", border: "#ffb4ab33" };
      default:
        return { name: "information-circle" as const, color: colors.primary, bg: `${colors.primary}20`, border: `${colors.primary}33` };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <Animated.View
          style={[
            styles.dialog,
            {
              backgroundColor: isDark ? "rgba(23, 31, 51, 0.95)" : "rgba(255,255,255,0.95)",
              borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Gradient Top Glow */}
          <LinearGradient
            colors={[colors.primary, colors.secondary || "#44e2cd"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topGlow}
          />

          <View style={styles.content}>
            {/* Icon Container */}
            <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg, borderColor: iconConfig.border }]}>
              <Ionicons name={iconConfig.name} size={32} color={iconConfig.color} />
            </View>

            {/* Title */}
            <Text variant="heading3" style={styles.title}>
              {title}
            </Text>

            {/* Message */}
            <Text variant="body" style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {showCancel && (
                <Pressable
                  style={[styles.cancelBtn, { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }]}
                  onPress={onCancel}
                >
                  <Text variant="bodySmall" style={{ color: colors.textSecondary, fontWeight: "600" }}>
                    {cancelText}
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
                onPress={onConfirm}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#8083ff", "#03c6b2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmGradient}
                >
                  {loading ? (
                    <Animated.View style={styles.loadingIndicator}>
                      <Ionicons name="sync" size={16} color="#0d0096" />
                    </Animated.View>
                  ) : null}
                  <Text variant="bodySmall" style={{ color: "#0d0096", fontWeight: "700" }}>
                    {loading ? "Loading..." : confirmText}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Bottom Gradient Decoration */}
          <View style={styles.bottomDecoration} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 20,
  },
  topGlow: {
    height: 4,
    width: "100%",
  },
  content: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  message: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  confirmGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loadingIndicator: {
    marginRight: 4,
  },
  bottomDecoration: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
    backgroundColor: "transparent",
  },
});
