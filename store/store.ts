import { atom } from "recoil";

export const countState = atom({
  key: "countState",
  default: [
    {
      id: 1,
      title: "Fish",
      completed: false,
    },
    {
      id: 2,
      title: "Shrimps",
      completed: false,
    },
    {
      id: 3,
      title: "Carrots",
      completed: false,
    },
    {
      id: 4,
      title: "Bread",
      completed: false,
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
    },
    {
      id: 7,
      title: "Yougurt",
      completed: true,
    },
    {
      id: 8,
      title: "Honey",
      completed: false,
    },
  ],
});
