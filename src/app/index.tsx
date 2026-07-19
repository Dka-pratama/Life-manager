import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import SplashScreenView from "@/components/splash/SplashScreen";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const timer = setTimeout(() => {
      setReady(true);
      SplashScreen.hideAsync();
      router.replace("/(tabs)/Dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (ready) return null;

  return <SplashScreenView />;
}
