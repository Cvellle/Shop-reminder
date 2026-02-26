import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRecoilState } from "recoil";
import { tagsState } from "@/store/store";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PRESET_COLORS = [
  "#FF9800",
  "#E91E63",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#FF5722",
  "#00BCD4",
  "#8BC34A",
  "#F44336",
  "#795548",
];

export default function TagsScreen() {
  const { user } = useAuth();
  const { colorScheme, theme } = useContext(ThemeContext);
  const [tags, setTags] = useRecoilState(tagsState);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const isDark = colorScheme === "dark";
  const bg = isDark ? "#0d1117" : "#f5f5f5";
  const cardBg = isDark ? "#161b22" : "#ffffff";
  const textColor = isDark ? "white" : theme.text;
  const subColor = isDark ? "#8b949e" : "#666";
  const borderColor = isDark ? "#30363d" : "#ddd";

  if (user?.role !== "advancedUser") {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.locked}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={52}
            color="#8b949e"
          />
          <Text style={[styles.lockedTitle, { color: textColor }]}>
            Tags locked
          </Text>
          <Text style={[styles.lockedSub, { color: subColor }]}>
            Add your first product to the list to unlock tag management.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const addTag = () => {
    const trimmed = newTagName.trim();
    if (
      !trimmed ||
      tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())
    )
      return;
    const newId = tags.length ? Math.max(...tags.map((t) => t.id)) + 1 : 1;
    setTags([...tags, { id: newId, name: trimmed, color: selectedColor }]);
    setNewTagName("");
  };

  const removeTag = (id) => setTags(tags.filter((t) => t.id !== id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.heading, { color: textColor }]}>Tags</Text>
          <Text style={[styles.subheading, { color: subColor }]}>
            Organize products with tags
          </Text>

          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              New tag
            </Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              placeholder="Tag name (e.g. Breakfast)"
              placeholderTextColor={subColor}
              value={newTagName}
              onChangeText={setNewTagName}
              onSubmitEditing={addTag}
              returnKeyType="done"
              maxLength={24}
            />

            <Text style={[styles.colorLabel, { color: subColor }]}>Color</Text>
            <View style={styles.colorRow}>
              {PRESET_COLORS.map((c) => (
                <Pressable
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    selectedColor === c && styles.colorDotSelected,
                  ]}
                  onPress={() => setSelectedColor(c)}
                />
              ))}
            </View>

            {newTagName.trim().length > 0 && (
              <View style={styles.previewRow}>
                <Text style={[styles.colorLabel, { color: subColor }]}>
                  Preview:
                </Text>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: selectedColor + "28",
                      borderColor: selectedColor,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: selectedColor }]}>
                    {newTagName.trim()}
                  </Text>
                </View>
              </View>
            )}

            <Pressable style={styles.addButton} onPress={addTag}>
              <Text style={styles.addButtonText}>Add tag</Text>
            </Pressable>
          </View>

          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              All tags ({tags.length})
            </Text>
            {tags.length === 0 ? (
              <Text style={[styles.emptyText, { color: subColor }]}>
                No tags yet — add one above.
              </Text>
            ) : (
              tags.map((item) => (
                <View
                  key={item.id.toString()}
                  style={[styles.tagRow, { borderBottomColor: borderColor }]}
                >
                  <View
                    style={[
                      styles.tagBadge,
                      {
                        backgroundColor: item.color + "28",
                        borderColor: item.color,
                      },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: item.color }]}>
                      {item.name}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeTag(item.id)} hitSlop={8}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={22}
                      color="#f85149"
                    />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 2 },
  subheading: { fontSize: 14, marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
  },
  colorLabel: { fontSize: 13 },
  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: "white",
    transform: [{ scale: 1.15 }],
  },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  tagText: { fontSize: 13, fontWeight: "600" },
  addButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "600", fontSize: 15 },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  emptyText: { fontSize: 14, fontStyle: "italic" },
  locked: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 32,
  },
  lockedTitle: { fontSize: 20, fontWeight: "700" },
  lockedSub: { fontSize: 14, textAlign: "center", lineHeight: 22 },
});
