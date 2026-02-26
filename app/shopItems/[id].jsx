import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  Picker,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRecoilState } from "recoil";
import { countState, unitsState, tagsState } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import UserHeader from "@/components/UserHeader";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [shopItems, setShopItems] = useRecoilState(countState);
  const [shopItem, setShopItem] = useState(null);
  const [units] = useRecoilState(unitsState);
  const [tags] = useRecoilState(tagsState);
  const { colorScheme, theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [loaded] = useFonts({ Inter_500Medium });
  const isAdvanced = user?.role === "advancedUser";

  useEffect(() => {
    if (!id) return;
    const item = shopItems.find((i) => i.id.toString() === id);
    if (item) setShopItem({ ...item, tags: item.tags || [] });
  }, [id, shopItems]);

  if (!loaded || !shopItem) return null;

  const styles = createStyles(theme, colorScheme);
  const isDark = colorScheme === "dark";

  const handleSave = async () => {
    const updatedItems = shopItems.map((i) =>
      i.id === shopItem.id ? shopItem : i,
    );
    setShopItems(updatedItems);
    await AsyncStorage.setItem("ShopItemApp", JSON.stringify(updatedItems));
    router.replace("/");
  };

  const toggleTag = (tagId) => {
    const current = shopItem.tags || [];
    const next = current.includes(tagId)
      ? current.filter((t) => t !== tagId)
      : [...current, tagId];
    setShopItem({ ...shopItem, tags: next });
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader />
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Details</Text>
          <DetailRow label="Title">
            <TextInput
              value={shopItem.title}
              maxLength={30}
              onChangeText={(text) => setShopItem({ ...shopItem, title: text })}
              style={styles.input}
              placeholder="Item name"
              placeholderTextColor="#999"
            />
          </DetailRow>
          <DetailRow label="Amount">
            <View style={styles.amountContainer}>
              <TextInput
                value={shopItem.amount?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setShopItem({
                    ...shopItem,
                    amount: parseFloat(text) || 0,
                  })
                }
                style={[styles.input, { flex: 1, marginLeft: "5px" }]}
                placeholder="0"
                placeholderTextColor="#999"
              />
              <Picker
                selectedValue={shopItem.unit || "unit"}
                onValueChange={(val) => setShopItem({ ...shopItem, unit: val })}
                style={[styles.input, { color: theme.text }]}
              >
                {units.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
            </View>
          </DetailRow>
          <DetailRow label="Completed">
            <Switch
              value={shopItem.completed}
              onValueChange={(val) =>
                setShopItem({ ...shopItem, completed: val })
              }
            />
          </DetailRow>
          <DetailRow label="Status">
            <StatusBadge completed={shopItem.completed} />
          </DetailRow>
        </View>

        {isAdvanced && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tags</Text>
            <Text style={styles.tagsHint}>
              Tap a tag to toggle it on this item
            </Text>
            {tags.length === 0 ? (
              <Text style={styles.tagsEmpty}>
                No tags yet — create some in the Tags tab.
              </Text>
            ) : (
              <View style={styles.tagsGrid}>
                {tags.map((tag) => {
                  const active = (shopItem.tags || []).includes(tag.id);
                  return (
                    <Pressable
                      key={tag.id}
                      onPress={() => toggleTag(tag.id)}
                      style={[
                        styles.tagChip,
                        {
                          backgroundColor: active
                            ? tag.color + "40"
                            : tag.color + "12",
                          borderColor: tag.color,
                          borderWidth: active ? 2 : 1,
                        },
                      ]}
                    >
                      {active && (
                        <Text style={{ fontSize: 11, marginRight: 3 }}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.tagChipText,
                          {
                            color: tag.color,
                            fontWeight: active ? "700" : "500",
                          },
                        ]}
                      >
                        {tag.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.primaryText}>Save</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryText}>Cancel</Text>
          </Pressable>
        </View>
      </View>

      <StatusBar style={isDark ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function DetailRow({ label, value, children }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      {value ? <Text style={rowStyles.value}>{value}</Text> : children}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});

function StatusBadge({ completed }) {
  return (
    <View
      style={[
        badgeStyles.badge,
        completed ? badgeStyles.completed : badgeStyles.pending,
      ]}
    >
      <Text style={badgeStyles.text}>
        {completed ? "Completed" : "Not completed"}
      </Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completed: {
    backgroundColor: "#4CAF50",
  },
  pending: {
    backgroundColor: "#FF9800",
  },
  text: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});

function createStyles(theme, colorScheme) {
  const isDark = colorScheme === "dark";
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
      padding: 16,
      gap: 24,
    },
    card: {
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      borderRadius: 18,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
    },
    cardTitle: {
      fontSize: 20,
      marginBottom: 16,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    tagsHint: {
      fontSize: 12,
      color: isDark ? "#8b949e" : "#888",
      marginBottom: 12,
      marginTop: -10,
    },
    tagsEmpty: {
      fontSize: 13,
      color: isDark ? "#8b949e" : "#888",
      fontStyle: "italic",
    },
    tagsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tagChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    tagChipText: {
      fontSize: 13,
    },
    input: {
      minWidth: 60,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ccc",
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    primaryText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: "#E53935",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    secondaryText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    saveButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: "#6200ee",
    },
  });
}
