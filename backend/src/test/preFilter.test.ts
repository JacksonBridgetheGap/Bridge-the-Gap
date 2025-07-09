import preFilter from "../algorithim/preFilter";

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
  const groups = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  // @ts-ignore
  expect(preFilter(user, groups)).toEqual([
    {
      id: 3,
    },
  ]);
});

test("preFilter: filter none", () => {
  const user = {
    id: 1,
    groups: [],
  };
  const groups = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  // @ts-ignore
  expect(preFilter(user, groups)).toEqual(groups);
});

test("preFilter: filter all", () => {
  const user = {
    id: 1,
    groups: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
  };
  const groups = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  // @ts-ignore
  expect(preFilter(user, groups)).toEqual([]);
});
