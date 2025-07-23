import contentBasedFilter from "../algorithim/contentBasedFilter";
import { createGroupMatrix } from "../utils/dataUtils";
import { groupsSmall } from "./test.data/testGroups";
import { simpleUser, userWithCircle } from "./test.data/testUsers";

test("contentBasedFilter: small", () => {
  const userMap = new Map();

  userMap.set("hobbies", 10);
  userMap.set("business", 10);
  //@ts-ignore
  const groupMap = createGroupMatrix(groupsSmall);

  expect(
    //@ts-ignore
    contentBasedFilter(simpleUser, userMap, groupMap, groupsSmall)[0],
  ).toEqual({
    id: 5,
    name: "Group5",
    img: "/default_group_pic.png",
    tags: ["business", "hobbies", "gaming"],
    postFrequency: 0,
    members: [{ id: 1 }, { id: 5 }],
  });
});

test("contentBasedFilter: circle", () => {
  const userMap = new Map();
  userMap.set("hobbies", 10);
  userMap.set("business", 10);

  userMap.set("education", 10);
  //@ts-ignore
  const groupMap = createGroupMatrix(groupsSmall);

  expect(
    // @ts-ignore
    contentBasedFilter(userWithCircle, userMap, groupMap, groupsSmall)[0],
  ).toEqual({
    id: 2,
    name: "Group2",
    img: "/default_group_pic.png",
    tags: ["education"],
    postFrequency: 0,
    members: [{ id: 2 }, { id: 4 }, { id: 6 }],
  });
});

//These two test are just repeats for now until I go add member data to each of the groups in sample data
test("contentBasedFilter: diff 1", () => {
  const userMap = new Map();

  userMap.set("education", 10);
  userMap.set("health", 4);
  userMap.set("pets", 3);
  //@ts-ignore
  const groupMap = createGroupMatrix(groupsSmall);

  console.log("diff");
  expect(
    //@ts-ignore
    contentBasedFilter(simpleUser, userMap, groupMap, groupsSmall)[0],
  ).toEqual({
    id: 2,
    name: "Group2",
    img: "/default_group_pic.png",
    tags: ["education"],
    postFrequency: 0,
    members: [{ id: 2 }, { id: 4 }, { id: 6 }],
  });
});

test("contentBasedFilter: tie", () => {
  const userMap = new Map();

  userMap.set("education", 10);
  //@ts-ignore
  const groupMap = createGroupMatrix(groupsSmall);

  expect(
    //@ts-ignore
    contentBasedFilter(simpleUser, userMap, groupMap, groupsSmall)[0],
  ).toEqual({
    id: 2,
    name: "Group2",
    img: "/default_group_pic.png",
    tags: ["education"],
    postFrequency: 0,
    members: [{ id: 2 }, { id: 4 }, { id: 6 }],
  });
});
