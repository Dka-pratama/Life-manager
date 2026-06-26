import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../contexts/ThemeContext";
import DatabaseProvider from "../database/DatabaseProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    ManropeRegular: require("../../assets/fonts/Manrope-Regular.ttf"),
    ManropeMedium: require("../../assets/fonts/Manrope-Medium.ttf"),
    ManropeSemiBold: require("../../assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("../../assets/fonts/Manrope-Bold.ttf"),
    ManropeExtraBold: require("../../assets/fonts/Manrope-ExtraBold.ttf"),
  });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style= {{ flex:1 }}>
          <DatabaseProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </DatabaseProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
