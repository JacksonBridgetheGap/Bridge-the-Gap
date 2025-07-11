import { UserWithGroupsAndCircle } from "../../types/types";

export const simpleUser = {
  id: 0,
  username: "test",
  password: "<PASSWORD>",
  email: null,
  location: null,
  photo: null,
  groups: [
    {
      id: 1,
      name: "Group1",
      img: "/deafult_group_pic.png",
      tags: ["pets", "health", "education"],
    },
    {
      id: 2,
      name: "Group2",
      img: "/deafult_group_pic.png",
      tags: ["buissness", "travel"],
    },
  ],
  circle: [],
};

export const userWithCircle = {
  id: 0,
  username: "test",
  password: "<PASSWORD>",
  email: null,
  location: null,
  photo: null,
  groups: [
    {
      id: 1,
      name: "Group1",
      img: "/deafult_group_pic.png",
      tags: ["pets", "health", "education"],
    },
    {
      id: 2,
      name: "Group2",
      img: "/deafult_group_pic.png",
      tags: ["buissness", "travel"],
    },
  ],
  circle: [
    {
      id: 6,
    },
  ],
};
