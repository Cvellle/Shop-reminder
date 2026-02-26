import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "basicUser" | "advancedUser";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

type MockUser = User & { password: string };

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "123",
    role: "basicUser",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "123",
    role: "advancedUser",
  },
];

const AUTH_KEY = "auth_user";

export const loginApi = async (
  email: string,
  password: string,
): Promise<User> => {
  // Simulate network
  await new Promise((r) => setTimeout(r, 350));

  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!found) throw new Error("Invalid email or password");

  const { password: _pw, ...user } = found;
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

export const logoutApi = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

export const getStoredUser = async (): Promise<User | null> => {
  const json = await AsyncStorage.getItem(AUTH_KEY);
  return json ? (JSON.parse(json) as User) : null;
};

export const updateUserRoleApi = async (
  userId: number,
  role: UserRole,
): Promise<User> => {
  // simulate PATCH /users/:id
  const json = await AsyncStorage.getItem(AUTH_KEY);
  if (!json) throw new Error("No user in cache");
  const updated: User = { ...JSON.parse(json), role };
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  return updated;
};
