import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, View } from "react-native";

import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";

import Button from "@/components/ui/Button";
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
  const { colors } = useTheme();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
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
    }
  }, [visible]);

  const getColor = () => {
    switch (type) {
      case "success":
        return colors.success;

      case "warning":
        return colors.warning;

      case "error":
        return colors.error;

      default:
        return colors.primary;
    }
  };

  const renderIcon = () => {
    const color = getColor();

    switch (type) {
      case "success":
        return <CircleCheck size={60} color={color} />;

      case "warning":
        return <CircleAlert size={60} color={color} />;

      case "error":
        return <CircleX size={60} color={color} />;

      default:
        return <Info size={60} color={color} />;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity,
          },
        ]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <Animated.View
          style={[
            styles.dialog,
            {
              backgroundColor: colors.surface,

              transform: [{ scale }],
            },
          ]}>
          <View style={styles.iconContainer}>{renderIcon()}</View>

          <Text variant="heading2" style={styles.title}>
            {title}
          </Text>

          <Text
            variant="body"
            style={[
              styles.message,
              {
                color: colors.textSecondary,
              },
            ]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <View style={{ flex: 1 }}>
                <Button
                  title={cancelText}
                  variant="outline"
                  onPress={() => onCancel?.()}
                />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Button
                title={confirmText}
                loading={loading}
                onPress={onConfirm}
              />
            </View>
          </View>
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

    backgroundColor: "rgba(0,0,0,0.45)",

    padding: 24,
  },

  dialog: {
    width: "100%",

    borderRadius: 24,

    padding: 24,
  },

  iconContainer: {
    alignItems: "center",

    marginBottom: Spacing.lg,
  },

  title: {
    textAlign: "center",

    marginBottom: 12,
  },

  message: {
    textAlign: "center",

    lineHeight: 24,

    marginBottom: 24,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
});
