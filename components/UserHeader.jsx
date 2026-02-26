import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function UserHeader() {
  const { user, logout } = useAuth() ?? {};
  const { colorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  if (!user) return null;

  const isDark = colorScheme === "dark";

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
    // leave c
    // Alert.alert("Sign out", "Are you sure you want to sign out?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Sign out",
    //     style: "destructive",
    //     onPress: async () => {
    //       await logout();
    //       router.replace("/login");
    //     },
    //   },
    // ]);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#161b22" : "#f0f2f5",
          borderBottomColor: isDark ? "#30363d" : "#d8dde3",
        },
      ]}
    >
      <MaterialCommunityIcons
        name="account-circle-outline"
        size={28}
        color={isDark ? "#8b949e" : "#666"}
        style={{ marginRight: 8 }}
      />
      <View style={styles.info}>
        <Text
          style={[styles.name, { color: isDark ? "#e6edf3" : theme.text }]}
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <Text
          style={[styles.email, { color: isDark ? "#8b949e" : "#666" }]}
          numberOfLines={1}
        >
          {user.email}
        </Text>
      </View>
      <View
        style={[
          styles.badge,
          user.role === "advancedUser"
            ? styles.badgeAdvanced
            : styles.badgeBasic,
        ]}
      >
        <Text style={styles.badgeText}>{user.role}</Text>
      </View>
      <Pressable onPress={handleSignOut} style={styles.signOutBtn} hitSlop={8}>
        <Text>Logout</Text>
        {/* <MaterialCommunityIcons
          name="logout"
          size={20}
          color={isDark ? "#8b949e" : "#999"}
        /> */}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  info: { flex: 1, marginRight: 10 },
  name: { fontSize: 13, fontWeight: "600" },
  email: { fontSize: 11, marginTop: 1 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  badgeBasic: {
    backgroundColor: "#1f6feb18",
    borderColor: "#1f6feb",
  },
  badgeAdvanced: {
    backgroundColor: "#23863618",
    borderColor: "#238636",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#58a6ff",
  },
  signOutBtn: {
    padding: 4,
  },
});
