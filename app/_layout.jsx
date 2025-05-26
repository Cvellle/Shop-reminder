import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" screenOptions={{ headerShown: false }}/>
            <Stack.Screen name="shopItems/[id]" screenOptions={{ headerShown: false }}/>
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
