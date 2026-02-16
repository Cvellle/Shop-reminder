import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let tabBarLabel = "";
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "index") {
          // override
          tabBarLabel = "Home";
          iconName = "home-outline";
        } else if (route.name === "settings") {
          tabBarLabel = "Settings";
          iconName = "settings-outline";
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
    </Tabs>
  );
}
