export const testEventsOneOpening = [
  {
    id: 1,
    text: "Team Meeting",
    start: new Date("2025-07-20T08:00:00Z"),
    end: new Date("2025-07-20T09:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    text: "Project Kickoff",
    start: new Date("2025-07-20T09:00:00Z"),
    end: new Date("2025-07-20T10:00:00Z"),
    groupID: 2,
    participants: [{ id: 2 }, { id: 3 }],
  },
  {
    id: 3,
    text: "Design Review",
    start: new Date("2025-07-20T10:00:00Z"),
    end: new Date("2025-07-20T11:00:00Z"),
    groupID: null,
    participants: [{ id: 1 }],
  },
  {
    id: 4,
    text: "Marketing Sync",
    start: new Date("2025-07-20T11:00:00Z"),
    end: new Date("2025-07-20T12:00:00Z"),
    groupID: 1,
    participants: [{ id: 3 }],
  },
  // 1-hour break here
  {
    id: 5,
    text: "Planning Session",
    start: new Date("2025-07-20T13:00:00Z"),
    end: new Date("2025-07-20T14:00:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 3 }],
  },
  {
    id: 6,
    text: "Client Call",
    start: new Date("2025-07-20T14:00:00Z"),
    end: new Date("2025-07-20T15:00:00Z"),
    groupID: 2,
    participants: [{ id: 2 }],
  },
  {
    id: 7,
    text: "Engineering Sync",
    start: new Date("2025-07-20T15:00:00Z"),
    end: new Date("2025-07-20T16:00:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 8,
    text: "Product Standup",
    start: new Date("2025-07-20T16:00:00Z"),
    end: new Date("2025-07-20T17:00:00Z"),
    groupID: 2,
    participants: [{ id: 3 }],
  },
  {
    id: 9,
    text: "UI Review",
    start: new Date("2025-07-20T17:00:00Z"),
    end: new Date("2025-07-20T18:00:00Z"),
    groupID: 1,
    participants: [{ id: 2 }, { id: 3 }],
  },
  {
    id: 10,
    text: "Wrap-up Sync",
    start: new Date("2025-07-20T18:00:00Z"),
    end: new Date("2025-07-20T19:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
];

export const testGroupEvents = [
  {
    text: "Wrap-up Sync",
    start: new Date("2025-07-20T18:00:00Z"),
    end: new Date("2025-07-20T19:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    text: "Marketing Sync",
    start: new Date("2025-07-20T11:00:00Z"),
    end: new Date("2025-07-20T12:00:00Z"),
    groupID: 1,
    participants: [{ id: 3 }],
  },
  {
    text: "Team Meeting",
    start: new Date("2025-07-20T08:00:00Z"),
    end: new Date("2025-07-20T09:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }],
  },
];

export const testEventsTwoOpenings = [
  {
    id: 1,
    text: "Morning Standup",
    start: new Date("2025-07-20T08:00:00Z"),
    end: new Date("2025-07-20T09:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    text: "Design Sync",
    start: new Date("2025-07-20T09:00:00Z"),
    end: new Date("2025-07-20T10:00:00Z"),
    groupID: 2,
    participants: [{ id: 2 }, { id: 3 }],
  },
  // 30-minute gap from 10:00 to 10:30
  {
    id: 3,
    text: "Client Meeting",
    start: new Date("2025-07-20T10:30:00Z"),
    end: new Date("2025-07-20T11:30:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 3 }],
  },
  // 2-hour gap from 11:30 to 13:30
  {
    id: 5,
    text: "Product Planning",
    start: new Date("2025-07-20T13:30:00Z"),
    end: new Date("2025-07-20T14:30:00Z"),
    groupID: 2,
    participants: [{ id: 2 }],
  },
  {
    id: 6,
    text: "Engineering Sync",
    start: new Date("2025-07-20T14:30:00Z"),
    end: new Date("2025-07-20T15:30:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 7,
    text: "Wrap-up Meeting",
    start: new Date("2025-07-20T15:30:00Z"),
    end: new Date("2025-07-20T20:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
];

export const testEventsTwoOpeningsTimezone = [
  //Before 8am UTC but if given timezone UTC+n there should be a time selected here
  {
    id: 0,
    text: "Morning",
    start: new Date("2025-07-20T07:30:00Z"),
    end: new Date("2025-07-20T08:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 1,
    text: "Morning Standup",
    start: new Date("2025-07-20T08:00:00Z"),
    end: new Date("2025-07-20T09:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    text: "Design Sync",
    start: new Date("2025-07-20T09:00:00Z"),
    end: new Date("2025-07-20T10:30:00Z"),
    groupID: 2,
    participants: [{ id: 2 }, { id: 3 }],
  },
  {
    id: 3,
    text: "Client Meeting",
    start: new Date("2025-07-20T10:30:00Z"),
    end: new Date("2025-07-20T13:30:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 3 }],
  },
  {
    id: 5,
    text: "Product Planning",
    start: new Date("2025-07-20T13:30:00Z"),
    end: new Date("2025-07-20T14:30:00Z"),
    groupID: 2,
    participants: [{ id: 2 }],
  },
  {
    id: 6,
    text: "Engineering Sync",
    start: new Date("2025-07-20T14:30:00Z"),
    end: new Date("2025-07-20T15:30:00Z"),
    groupID: 3,
    participants: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 7,
    text: "Wrap-up Meeting",
    start: new Date("2025-07-20T15:30:00Z"),
    end: new Date("2025-07-20T20:00:00Z"),
    groupID: 1,
    participants: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  //This is after 8pm UTC but if given a timezone with UTC-n this should be a valid selection
];
//20:30
//21:30
