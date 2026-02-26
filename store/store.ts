import { atom } from "recoil";
import type { User } from "@/api/auth";

// ─── Auth ──────────────────────────────────────────────────────────────────
export const userState = atom<User | null>({
  key: "userState",
  default: null,
});

// ─── Tags ──────────────────────────────────────────────────────────────────
export interface Tag {
  id: number;
  name: string;
  color: string;
}

export const tagsState = atom<Tag[]>({
  key: "tagsState",
  default: [
    { id: 1, name: "Breakfast", color: "#FF9800" },
    { id: 2, name: "Sweets", color: "#E91E63" },
    { id: 3, name: "Healthy", color: "#4CAF50" },
    { id: 4, name: "Drinks", color: "#2196F3" },
    { id: 5, name: "Dairy", color: "#9C27B0" },
    { id: 6, name: "Snacks", color: "#FF5722" },
  ],
});

// ─── Shop items ────────────────────────────────────────────────────────────
export const countState = atom({
  key: "countState",
  default: [
    { id: 1, title: "Fish", completed: false, amount: 0, unit: "unit" },
    { id: 2, title: "Yogurt", completed: true, amount: 1000, unit: "ml" },
    { id: 3, title: "Carrots", completed: false, amount: 0, unit: "unit" },
    { id: 4, title: "Bread", completed: false, amount: 0, unit: "unit" },
    { id: 5, title: "Chicken legs", completed: true, amount: 0, unit: "unit" },
    { id: 6, title: "Cucumbers", completed: false, amount: 0, unit: "unit" },
    { id: 7, title: "Shrimps", completed: false, amount: 0, unit: "unit" },
    { id: 8, title: "Honey", completed: false, amount: 0, unit: "unit" },
  ],
});

// ─── Units ─────────────────────────────────────────────────────────────────
export const unitsState = atom({
  key: "unitsState",
  default: ["unit", "grams", "ml", "kg", "pcs"],
});
