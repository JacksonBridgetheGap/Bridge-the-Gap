import preFilter from "../algorithim/preFilter";
import { groupsSmall } from "./test.data/testGroups";

test("preFilter: basic", () => {
  const user = {
    id: 1,
    groups: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  };

  // @ts-ignore
  expect(preFilter(user, groupsSmall)).toEqual(groupsSmall.slice(2, 10));
});

test("preFilter: filter none", () => {
  const user = {
    id: 1,
    groups: [],
  };

  // @ts-ignore
  expect(preFilter(user, groupsSmall)).toEqual(groupsSmall);
});

test("preFilter: filter all", () => {
  const user = {
    id: 1,
    groups: groupsSmall,
  };

  // @ts-ignore
  expect(preFilter(user, groupsSmall)).toEqual([]);
});
