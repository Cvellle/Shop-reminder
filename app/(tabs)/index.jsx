import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
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
import { countState, tagsState } from "@/store/store";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const [shopItems, setShopItems] = useRecoilState(countState);
  const [tags] = useRecoilState(tagsState);
  const [text, setText] = useState("");
  const { colorScheme, theme } = useContext(ThemeContext);
  const { user, upgradeToAdvanced } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const textColor = colorScheme === "dark" ? "white" : theme.text;
  const [loaded] = useFonts({ Inter_500Medium });

  // Info modal: shown once per session for basicUser
  const [showInfoModal, setShowInfoModal] = useState(false);
  // Upgrade modal: shown when basicUser just becomes advancedUser
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user?.role === "basicUser") {
      setShowInfoModal(true);
    }
  }, []); // only on mount

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

  const isDark = colorScheme === "dark";

  const addShopItem = async () => {
    if (!text.trim()) return;
    const newId = shopItems.length ? shopItems[0].id + 1 : 1;
    setShopItems([
      { id: newId, title: text, completed: false, amount: 0, unit: "unit" },
      ...shopItems,
    ]);
    setText("");
    if (user?.role === "basicUser") {
      await upgradeToAdvanced();
      setShowUpgradeModal(true);
    }
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

  const getItemTags = (item) =>
    (item.tags || [])
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter(Boolean);

  const renderTagChips = (item) => {
    const itemTags = getItemTags(item);
    if (!itemTags.length) return null;
    return (
      <View style={styles.tagRow}>
        {itemTags.map((tag) => (
          <View
            key={tag.id}
            style={[
              styles.tagChip,
              { backgroundColor: tag.color + "28", borderColor: tag.color },
            ]}
          >
            <Text style={[styles.tagChipText, { color: tag.color }]}>
              {tag.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    if (!isDesktop) return null;
    return (
      <View style={[styles.row]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Title</Text>
        <Text style={[styles.cell, styles.headerCell]}>Tags</Text>
        <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
        <Text style={[styles.cell, styles.headerCell]}>Unit</Text>
        <Text style={[styles.cell, styles.headerCell]}>Completed</Text>
        <Text style={[styles.cell, styles.headerCell]}>Edit</Text>
        <Text style={[styles.cell, styles.headerCell]}>Remove</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const itemTextColor = colorScheme === "dark" ? "white" : theme.text;
    const itemTags = getItemTags(item);

    if (isDesktop) {
      return (
        <View style={[styles.row]}>
          <Pressable
            onLongPress={() => toggleShopItem(item.id)}
            style={{ flex: 2 }}
          >
            <Text
              style={[
                styles.cell,
                item.completed && styles.completedText,
                { color: itemTextColor },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </Pressable>
          <View style={[styles.cell, styles.tagsCell]}>
            {itemTags.length > 0 ? (
              itemTags.map((tag) => (
                <View
                  key={tag.id}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: tag.color + "28",
                      borderColor: tag.color,
                    },
                  ]}
                >
                  <Text style={[styles.tagChipText, { color: tag.color }]}>
                    {tag.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                style={[
                  styles.emptyTagsText,
                  { color: isDark ? "#555" : "#ccc" },
                ]}
              >
                —
              </Text>
            )}
          </View>
          <Text style={[styles.cell, { color: itemTextColor }]}>
            {item.amount ?? 0}
          </Text>
          <Text style={[styles.cell, { color: itemTextColor }]}>
            {item.unit ?? "unit"}
          </Text>
          <Text style={[styles.cell, { color: itemTextColor }]}>
            {item.completed ? "✓" : "✗"}
          </Text>
          <Pressable
            onPress={() => handlePress(item.id)}
            style={styles.actionCell}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={itemTextColor}
            />
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
            { backgroundColor: isDark ? "#222" : theme.background },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              item.completed && styles.completedText,
              { color: itemTextColor },
            ]}
          >
            {item.title}
          </Text>
          <Text style={{ color: itemTextColor }}>
            Amount: {item.amount ?? 0}
          </Text>
          <Text style={{ color: itemTextColor }}>
            Unit: {item.unit ?? "unit"}
          </Text>
          <Text style={{ color: itemTextColor }}>
            Status: {item.completed ? "Completed" : "Pending"}
          </Text>
          {renderTagChips(item)}
          <View style={styles.cardActions}>
            <Pressable
              onPress={() => handlePress(item.id)}
              style={styles.cardButton}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={itemTextColor}
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
        { backgroundColor: isDark ? "#111" : theme.background },
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: isDark ? "#555" : "gray",
            },
          ]}
          maxLength={30}
          placeholder="Add a new item"
          placeholderTextColor={isDark ? "#aaa" : "gray"}
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
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Info modal: shown once to basicUser on mount ── */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDark ? "#161b22" : "#fff" },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={44}
              color="#58a6ff"
            />
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#e6edf3" : "#111" },
              ]}
            >
              Getting started
            </Text>
            <Text
              style={[styles.modalBody, { color: isDark ? "#8b949e" : "#555" }]}
            >
              Add your first item to the shopping list to unlock the{" "}
              <Text style={{ color: "#58a6ff", fontWeight: "600" }}>Tags</Text>{" "}
              feature.{"\n\n"}Tags let you organise products into categories
              like <Text style={{ fontStyle: "italic" }}>Breakfast</Text>,{" "}
              <Text style={{ fontStyle: "italic" }}>Sweets</Text>,{" "}
              <Text style={{ fontStyle: "italic" }}>Healthy</Text> and more.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Upgrade modal: shown when basicUser → advancedUser ── */}
      <Modal
        visible={showUpgradeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDark ? "#161b22" : "#fff" },
            ]}
          >
            <MaterialCommunityIcons
              name="star-circle"
              size={52}
              color="#f0c940"
            />
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#e6edf3" : "#111" },
              ]}
            >
              Advanced User unlocked!
            </Text>
            <Text
              style={[styles.modalBody, { color: isDark ? "#8b949e" : "#555" }]}
            >
              You've added your first item.{"\n\n"}The{" "}
              <Text style={{ color: "#58a6ff", fontWeight: "600" }}>Tags</Text>{" "}
              tab is now available — use it to create categories and organise
              your shopping list.
            </Text>
            <View style={[styles.rolePill, styles.rolePillAdvanced]}>
              <Text style={styles.rolePillText}>advancedUser</Text>
            </View>
            <Pressable
              style={[styles.modalButton, { backgroundColor: "#238636" }]}
              onPress={() => {
                setShowUpgradeModal(false);
                router.push("/(tabs)/tags");
              }}
            >
              <Text style={styles.modalButtonText}>Explore Tags →</Text>
            </Pressable>
            <Pressable onPress={() => setShowUpgradeModal(false)}>
              <Text
                style={[
                  styles.modalDismiss,
                  { color: isDark ? "#8b949e" : "#999" },
                ]}
              >
                Maybe later
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  tagsCell: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    alignItems: "center",
  },
  emptyTagsText: { fontSize: 14 },
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
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagChipText: { fontSize: 11, fontWeight: "600" },
  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  modalBody: { fontSize: 14, lineHeight: 22, textAlign: "center" },
  modalButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 4,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: { color: "white", fontWeight: "600", fontSize: 15 },
  modalDismiss: { fontSize: 13, marginTop: 4 },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  rolePillAdvanced: {
    backgroundColor: "#23863618",
    borderColor: "#238636",
  },
  rolePillText: { fontSize: 12, fontWeight: "600", color: "#3fb950" },
});
