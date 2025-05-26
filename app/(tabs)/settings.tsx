// app/settings.tsx
import { ThemeContext } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, StyleSheet, SafeAreaView, Pressable } from "react-native";

export default function Settings() {
  const { colorScheme, setColorScheme, theme } = useContext<any>(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.paragraph}>Change the theme:</Text>
      <Pressable
        onPress={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        style={{ marginLeft: 10 }}
      >
        <Octicons
          name={colorScheme === "dark" ? "moon" : "sun"}
          size={36}
          color={theme.text}
          selectable={undefined}
          style={{ width: 36 }}
        />
      </Pressable>
    </SafeAreaView>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 26,
      fontWeight: "700",
      color: colorScheme === "dark" ? "white" : "black",
      marginBottom: 16,
    },
    paragraph: {
      fontSize: 16,
      color: colorScheme === "dark" ? "white" : "black",
      marginBottom: 10,
    },
  });
}
