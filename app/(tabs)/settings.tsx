import { ThemeContext } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import { useContext, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { useRecoilState } from "recoil";
import { unitsState } from "@/store/store";

export default function Settings() {
  const { colorScheme, setColorScheme, theme } = useContext<any>(ThemeContext);
  const [units, setUnits] = useRecoilState(unitsState);
  const [newUnit, setNewUnit] = useState("");
  const styles = createStyles(theme, colorScheme);

  const addUnit = () => {
    if (!newUnit.trim()) return;
    if (units.includes(newUnit.trim())) return;
    setUnits([...units, newUnit.trim()]);
    setNewUnit("");
  };

  const removeUnit = (unit: string) => {
    setUnits(units.filter((u) => u !== unit));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.optionLabel}>App Theme</Text>
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={[
            styles.toggleButton,
            colorScheme === "dark" ? styles.darkButton : styles.lightButton,
          ]}
        >
          <Octicons
            name={colorScheme === "dark" ? "moon" : "sun"}
            size={28}
            color={theme.text}
          />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.optionLabel}>Units Configuration</Text>
        <View style={styles.addUnitRow}>
          <TextInput
            placeholder="Add new unit"
            placeholderTextColor="#999"
            value={newUnit}
            onChangeText={setNewUnit}
            style={[styles.input, { flex: 1 }]}
          />
          <Pressable style={styles.addButton} onPress={addUnit}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={units}
          keyExtractor={(item) => item}
          style={{ marginTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.unitRow}>
              <Text style={styles.unitText}>{item}</Text>
              <Pressable onPress={() => removeUnit(item)}>
                <Octicons name="x-circle-fill" size={24} color="red" />
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    heading: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFF",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
    toggleButton: {
      width: 50,
      height: 30,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    lightButton: {
      backgroundColor: "#FFDD33",
    },
    darkButton: {
      backgroundColor: "#333333",
    },
    addUnitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 16,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      color: colorScheme === "dark" ? "black" : "white",
      fontWeight: "600",
    },
    unitRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    unitText: {
      fontSize: 16,
      color: theme.text,
    },
  });
}
