import {
  testEventsOneOpening,
  testEventsTwoOpenings,
  testEventsTwoOpeningsTimezone,
} from "./testEvents";

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
  inCircle: [],
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
  inCircle: [],
};

export const userWithOneOpeningEvents = {
  id: 0,
  username: "test",
  password: "<PASSWORD>",
  email: null,
  location: null,
  photo: null,
  events: testEventsOneOpening,
  offsetUTC: 0,
};

export const userWithTwoOpeningEvents = {
  id: 0,
  username: "test",
  password: "<PASSWORD>",
  email: null,
  location: null,
  photo: null,
  events: testEventsTwoOpenings,
  offsetUTC: 0,
};

export const userWithTwoOpeningsTimezone = {
  id: 0,
  username: "test",
  password: "<PASSWORD>",
  email: null,
  location: null,
  photo: null,
  events: testEventsTwoOpeningsTimezone,
  offsetUTC: 0,
};
