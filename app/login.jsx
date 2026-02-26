import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password.trim());
      router.replace("/");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillMock = (mockEmail) => {
    setEmail(mockEmail);
    setPassword("123");
    setError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <MaterialCommunityIcons name="cart-outline" size={56} color="#58a6ff" />
        <Text style={styles.title}>Shop Reminder</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#8b949e"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(""); }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor="#8b949e"
            value={password}
            onChangeText={(v) => { setPassword(v); setError(""); }}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>
        </View>

        {/* Mock credential hints */}
        <View style={styles.hints}>
          <Text style={styles.hintsTitle}>Demo accounts</Text>
          <Pressable style={styles.hintRow} onPress={() => fillMock("john@example.com")}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>basicUser</Text>
            </View>
            <Text style={styles.hintText}>john@example.com · 123</Text>
          </Pressable>
          <Pressable style={styles.hintRow} onPress={() => fillMock("jane@example.com")}>
            <View style={[styles.roleBadge, styles.roleBadgeAdvanced]}>
              <Text style={styles.roleBadgeText}>advancedUser</Text>
            </View>
            <Text style={styles.hintText}>jane@example.com · 123</Text>
          </Pressable>
          <Text style={styles.hintsNote}>Tap a row to autofill</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  title: { fontSize: 30, fontWeight: "700", color: "white", marginTop: 8 },
  subtitle: { fontSize: 15, color: "#8b949e", marginBottom: 8 },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#161b22",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#30363d",
    marginTop: 8,
    gap: 4,
  },
  label: { fontSize: 13, color: "#8b949e", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#30363d",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "white",
    backgroundColor: "#0d1117",
  },
  error: { color: "#f85149", fontSize: 13, marginTop: 4 },
  button: {
    backgroundColor: "#238636",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "white", fontSize: 15, fontWeight: "600" },
  hints: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#161b22",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#30363d",
    gap: 10,
    marginTop: 8,
  },
  hintsTitle: { fontSize: 12, color: "#8b949e", textTransform: "uppercase", letterSpacing: 0.8 },
  hintRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  roleBadge: {
    backgroundColor: "#1f6feb33",
    borderWidth: 1,
    borderColor: "#1f6feb",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  roleBadgeAdvanced: {
    backgroundColor: "#23863633",
    borderColor: "#238636",
  },
  roleBadgeText: { color: "#58a6ff", fontSize: 11, fontWeight: "600" },
  hintText: { fontSize: 13, color: "#c9d1d9" },
  hintsNote: { fontSize: 11, color: "#8b949e", fontStyle: "italic" },
});
