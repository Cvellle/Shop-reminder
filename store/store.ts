import { atom } from "recoil";

export const countState = atom({
  key: "countState",
  default: [
    {
      id: 1,
      title: "Fish",
      completed: false,
      amount: 0,
      unit: "unit",
    },
    {
      id: 2,
      title: "Yougurt",
      completed: true,
      amount: 1000,
      unit: "ml",
    },
    {
      id: 3,
      title: "Carrots",
      completed: false,
      amount: 0,
      unit: "unit",
    },
    {
      id: 4,
      title: "Bread",
      completed: false,
      amount: 0,
      unit: "unit",
    },
    {
      id: 5,
      title: "Chicken legs",
      completed: true,
    },
    {
      id: 6,
      title: "Cucumbers",
      completed: false,
      amount: 0,
      unit: "unit",
    },
    {
      id: 2,
      title: "Shrimps",
      completed: false,
      amount: 0,
      unit: "unit",
    },
    {
      id: 8,
      title: "Honey",
      completed: false,
      amount: 0,
      unit: "unit",
    },
  ],
});

export const unitsState = atom({
  key: "unitsState",
  default: ["unit", "grams", "ml", "kg", "pcs"],
});
