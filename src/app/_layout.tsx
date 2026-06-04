import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DatabaseProvider from "../database/DatabaseProvider";
import {ThemeProvider} from "../contexts/ThemeContext";
import { useFonts } from "expo-font";

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
        <DatabaseProvider>
          <Stack />
        </DatabaseProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
