import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import UserHeader from "@/components/UserHeader";

export default function TabsLayout() {
  const { user } =
    (useAuth() as unknown as { user?: { role: string } | null }) ?? {};
  const isAdvanced = user?.role === "advancedUser";

  return (
    <View style={{ flex: 1 }}>
      <UserHeader />
      <Tabs
        screenOptions={({ route }) => {
          let tabBarLabel = "";
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") {
            tabBarLabel = "Home";
            iconName = "home-outline";
          } else if (route.name === "settings") {
            tabBarLabel = "Settings";
            iconName = "settings-outline";
          } else if (route.name === "tags") {
            tabBarLabel = "Tags";
            iconName = "pricetag-outline";
          } else {
            tabBarLabel = route.name;
            iconName = "ellipse-outline";
          }

          return {
            headerShown: false,
            tabBarStyle: { backgroundColor: "#161b22" },
            tabBarActiveTintColor: "#58a6ff",
            tabBarInactiveTintColor: "#8b949e",
            tabBarLabel,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={iconName} size={size} color={color} />
            ),
          };
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen
          name="tags"
          options={{ href: isAdvanced ? undefined : null }}
        />
      </Tabs>
    </View>
  );
}
