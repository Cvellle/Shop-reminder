import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Animated, { LinearTransition } from "react-native-reanimated";
import { data } from "@/data/shopItems";
import { useRecoilState } from "recoil";
import { countState } from "@/store/store";

export default function Index() {
  const [shopItems, setShopItems] = useRecoilState(countState);
  const [text, setText] = useState("");
  const { colorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

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

  const styles = createStyles(theme, colorScheme);

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

  const renderHeader = () => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Title</Text>
      <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
      <Text style={[styles.cell, styles.headerCell]}>Unit</Text>
      <Text style={[styles.cell, styles.headerCell]}>Completed</Text>
      <Text style={[styles.cell, styles.headerCell]}>Edit</Text>
      <Text style={[styles.cell, styles.headerCell]}>Remove</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Pressable
        onLongPress={() => toggleShopItem(item.id)}
        style={{ flex: 1 }}
      >
        <Text
          style={[styles.cell, item.completed && styles.completedText]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </Pressable>
      <Text style={styles.cell}>{item.amount ?? 0}</Text>
      <Text style={styles.cell}>{item.unit ?? "unit"}</Text>
      <Text style={styles.cell}>{item.completed ? "✓" : "✗"}</Text>
      <Pressable
        onPress={() => handlePress(item.id)}
        style={[styles.cell, styles.actionCell]}
      >
        <MaterialCommunityIcons name="pencil" size={24} color={theme.text} />
      </Pressable>
      <Pressable
        onPress={() => removeShopItem(item.id)}
        style={[styles.cell, styles.actionCell]}
      >
        <MaterialCommunityIcons name="delete" size={24} color="red" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Add a new item"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addShopItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <View style={styles.table}>
        {renderHeader()}
        <Animated.FlatList
          data={shopItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
        />
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      gap: 8,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      paddingHorizontal: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      color: colorScheme === "dark" ? "black" : "white",
      fontSize: 16,
      fontWeight: "600",
    },
    table: {
      flex: 1,
      width: "100%",
      maxWidth: 1024,
      alignSelf: "center",
      marginTop: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "gray",
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    cell: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: theme.text,
      paddingHorizontal: 4,
      textAlign: "center",
    },
    actionCell: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    headerCell: {
      fontWeight: "700",
      color: colorScheme === "dark" ? "#EEE" : "#333",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  });
}
