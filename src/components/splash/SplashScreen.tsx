import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Text from "@/components/ui/Text";
import { Colors } from "@/constants/colors";

const { width: SCREEN_W } = Dimensions.get("window");

const DARK = Colors.dark;

export default function SplashScreen() {
  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const orb3 = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const lineX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const floatAnim = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );

    floatAnim(orb1, 6000).start();
    floatAnim(orb2, 8000).start();
    floatAnim(orb3, 5000).start();

    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(lineX, {
        toValue: SCREEN_W + 200,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const orbInterpolate = (val: Animated.Value, xRange: number[], yRange: number[]) => ({
    transform: [
      { translateX: val.interpolate({ inputRange: [0, 1], outputRange: xRange }) },
      { translateY: val.interpolate({ inputRange: [0, 1], outputRange: yRange }) },
      { scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
    ],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#131b2e", DARK.background]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.orbBase, styles.orb1, orbInterpolate(orb1, [0, 40], [0, 60])]} />
      <Animated.View style={[styles.orbBase, styles.orb2, orbInterpolate(orb2, [0, -40], [0, -60])]} />
      <Animated.View style={[styles.orbBase, styles.orb3, orbInterpolate(orb3, [0, 30], [0, -40])]} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrap,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        >
          <View style={styles.glow} />
          <View style={styles.iconCircle}>
            <Ionicons name="bar-chart" size={48} color={DARK.primary} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: logoOpacity, alignItems: "center" }}>
          <Text
            variant="displayLarge"
            style={{ color: DARK.primary, letterSpacing: -1 }}
          >
            Life Manager
          </Text>
          <Text
            variant="caption"
            style={{
              color: DARK.textSecondary,
              letterSpacing: 3,
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            Premium Life Manager
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loaderTrack}>
          <Animated.View
            style={[styles.loaderFill, { transform: [{ translateX: lineX }] }]}
          />
        </View>
        <Text
          variant="bodySmall"
          style={{ color: DARK.textSecondary, textAlign: "center", fontStyle: "italic", opacity: 0.4 }}
        >
          Design your life with precision
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK.background,
  },
  orbBase: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(192, 193, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  orb1: { width: 300, height: 300, top: -60, left: -60 },
  orb2: { width: 420, height: 420, bottom: -120, right: -60 },
  orb3: { width: 150, height: 150, top: "40%", right: "8%" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoWrap: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    backgroundColor: `${DARK.primary}20`,
    opacity: 0.5,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    zIndex: 10,
    paddingHorizontal: 32,
    marginBottom: 48,
    gap: 16,
  },
  loaderTrack: {
    width: "100%",
    height: 2,
    borderRadius: 99,
    backgroundColor: "rgba(144,143,160,0.2)",
    overflow: "hidden",
  },
  loaderFill: {
    width: "50%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: DARK.primary,
    opacity: 0.6,
  },
});
