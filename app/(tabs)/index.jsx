import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { data } from "@/data/shopItems";
import { useRecoilState } from "recoil";
import { countState } from "@/store/store";

export default function Index() {
  const [shopItems, setShopItems] = useRecoilState(countState);
  const [text, setText] = useState("");
  const { colorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const textColor = colorScheme === "dark" ? "white" : theme.text;
  const [loaded] = useFonts({ Inter_500Medium });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("ShopItemApp");
        const storageShopItems = jsonValue ? JSON.parse(jsonValue) : null;
        setShopItems((storageShopItems || data).sort((a, b) => b.id - a.id));
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("ShopItemApp", JSON.stringify(shopItems)).catch(
      console.error,
    );
  }, [shopItems]);

  if (!loaded) return null;

  const addShopItem = () => {
    if (!text.trim()) return;
    const newId = shopItems.length ? shopItems[0].id + 1 : 1;
    setShopItems([
      { id: newId, title: text, completed: false, amount: 0, unit: "unit" },
      ...shopItems,
    ]);
    setText("");
  };

  const toggleShopItem = (id) => {
    setShopItems(
      shopItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const removeShopItem = (id) => {
    setShopItems(shopItems.filter((item) => item.id !== id));
  };

  const handlePress = (id) => router.push(`/shopItems/${id}`);

  const renderHeader = () => {
    if (!isDesktop) return null;
    return (
      <View style={[styles.row]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Title</Text>
        <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
        <Text style={[styles.cell, styles.headerCell]}>Unit</Text>
        <Text style={[styles.cell, styles.headerCell]}>Completed</Text>
        <Text style={[styles.cell, styles.headerCell]}>Edit</Text>
        <Text style={[styles.cell, styles.headerCell]}>Remove</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const textColor = colorScheme === "dark" ? "white" : theme.text;

    if (isDesktop) {
      return (
        <View style={[styles.row]}>
          <Pressable
            onLongPress={() => toggleShopItem(item.id)}
            style={{ flex: 1 }}
          >
            <Text
              style={[
                styles.cell,
                item.completed && styles.completedText,
                { color: textColor },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </Pressable>
          <Text style={[styles.cell, { color: textColor }]}>
            {item.amount ?? 0}
          </Text>
          <Text style={[styles.cell, { color: textColor }]}>
            {item.unit ?? "unit"}
          </Text>
          <Text style={[styles.cell, { color: textColor }]}>
            {item.completed ? "✓" : "✗"}
          </Text>
          <Pressable
            onPress={() => handlePress(item.id)}
            style={styles.actionCell}
          >
            <MaterialCommunityIcons name="pencil" size={24} color={textColor} />
          </Pressable>
          <Pressable
            onPress={() => removeShopItem(item.id)}
            style={styles.actionCell}
          >
            <MaterialCommunityIcons name="delete" size={24} color="red" />
          </Pressable>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colorScheme === "dark" ? "#222" : theme.background,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              item.completed && styles.completedText,
              { color: textColor },
            ]}
          >
            {item.title}
          </Text>
          <Text style={{ color: textColor }}>Amount: {item.amount ?? 0}</Text>
          <Text style={{ color: textColor }}>Unit: {item.unit ?? "unit"}</Text>
          <Text style={{ color: textColor }}>
            Status: {item.completed ? "Completed" : "Pending"}
          </Text>
          <View style={styles.cardActions}>
            <Pressable
              onPress={() => handlePress(item.id)}
              style={styles.cardButton}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => removeShopItem(item.id)}
              style={styles.cardButton}
            >
              <MaterialCommunityIcons name="delete" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#111" : theme.background },
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: colorScheme === "dark" ? "#555" : "gray",
            },
          ]}
          maxLength={30}
          placeholder="Add a new item"
          placeholderTextColor={colorScheme === "dark" ? "#aaa" : "gray"}
          value={text}
          onChangeText={setText}
        />
        <Pressable style={[styles.addButton]} onPress={addShopItem}>
          <Text style={[styles.addButtonText]}>Add</Text>
        </Pressable>
      </View>
      {renderHeader()}
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  inputContainer: { flexDirection: "row", marginBottom: 10, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  addButton: {
    borderRadius: 5,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee",
  },
  addButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 4,
    textAlign: "center",
  },
  actionCell: { justifyContent: "center", alignItems: "center", flex: 1 },
  headerCell: { fontWeight: "700", color: "#333" },
  completedText: { textDecorationLine: "line-through", color: "gray" },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 12,
  },
  cardButton: { padding: 6 },
});
