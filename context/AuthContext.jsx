import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState, countState, tagsState, unitsState } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginApi,
  logoutApi,
  getStoredUser,
  updateUserRoleApi,
} from "@/api/auth";

const AuthContext = createContext(null);

/**
 * Must be rendered inside <RecoilRoot>.
 * Hydrates userState from AsyncStorage on mount, then exposes
 * user / loading / login / logout / upgradeToAdvanced.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  const resetShopItems = useResetRecoilState(countState);
  const resetTags = useResetRecoilState(tagsState);
  const resetUnits = useResetRecoilState(unitsState);

  // Restore session from cache on cold start
  useEffect(() => {
    getStoredUser()
      .then((stored) => {
        if (stored) setUser(stored);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const u = await loginApi(email, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    // 1. Remove auth session from AsyncStorage
    await logoutApi();
    // 2. Remove all app data from AsyncStorage
    await AsyncStorage.removeItem("ShopItemApp");
    // 3. Reset all Recoil atoms back to their defaults
    resetShopItems();
    resetTags();
    resetUnits();
    // 4. Clear the user from state last so redirect fires cleanly
    setUser(null);
  };

  const upgradeToAdvanced = async () => {
    if (!user || user.role === "advancedUser") return;
    const updated = await updateUserRoleApi(user.id, "advancedUser");
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, upgradeToAdvanced }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
