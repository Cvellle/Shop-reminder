import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";
import { RecoilRoot } from "recoil";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inLoginPage = segments[0] === "login";
    if (!user && !inLoginPage) {
      router.replace("/login");
    } else if (user && inLoginPage) {
      router.replace("/");
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="shopItems/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <RecoilRoot>
      <AuthProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <RootLayoutNav />
          </SafeAreaProvider>
        </ThemeProvider>
      </AuthProvider>
    </RecoilRoot>
  );
}
