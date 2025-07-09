import contentBasedFilter from "../algorithim/contentBasedFilter";
import { createGroupMatrix } from "../utils/dataUtils";
import { groupsMedium, groupsSmall, groupsLarge } from "./test.data/testGroups";

test("contentBasedFilter: small", () => {
  const userMap = new Map();

  userMap.set("hobbies", 10);
  userMap.set("business", 10);
  const groupMap = createGroupMatrix(groupsSmall);

  expect(contentBasedFilter(userMap, groupMap, groupsSmall)[0]).toEqual({
    id: 5,
    name: "Group5",
    img: "/default_group_pic.png",
    tags: ["business", "hobbies", "gaming"],
  });
});

test("contentBasedFilter: medium", () => {
  const userMap = new Map();

  userMap.set("hobbies", 10);
  userMap.set("education", 10);
  userMap.set("gaming", 10);
  const groupMap = createGroupMatrix(groupsMedium);

  expect(contentBasedFilter(userMap, groupMap, groupsMedium)[0]).toEqual({
    id: 1,
    name: "Group1",
    img: "/default_group_pic.png",
    tags: ["hobbies", "education", "gaming"],
  });
});

test("contentBasedFilter: large", () => {
  const userMap = new Map();

  userMap.set("health", 10);
  userMap.set("gaming", 20);
  const groupMap = createGroupMatrix(groupsLarge);

  expect(contentBasedFilter(userMap, groupMap, groupsLarge)[0]).toEqual({
    id: 49,
    name: "Group49",
    img: "/default_group_pic.png",
    tags: ["gaming", "health"],
  });
});
