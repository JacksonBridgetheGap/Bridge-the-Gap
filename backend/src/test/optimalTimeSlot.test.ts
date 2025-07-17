import optimalTimeSlot from "../algorithim/optimalTimeSlot";
import { createTimeSlotMap } from "../utils/dataUtils";
import {
  userWithOneOpeningEvents,
  userWithTwoOpeningEvents,
  userWithTwoOpeningsTimezone,
} from "./test.data/testUsers";

test("optimalTimeSlot: basic", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithOneOpeningEvents]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T17:00:00Z"),
    10,
    0,
  );

  expect(slot).toEqual({
    start: new Date("2025-07-20T12:00:00Z"),
    end: new Date("2025-07-20T12:30:00Z"),
    groupID: 10,
  });
  expect(conflicts).toEqual(0);
});

test("optimalTimeSlot: two-opening - long opening", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningEvents]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T17:00:00Z"),
    10,
    0,
  );

  //Chooses middle time to allow for buffer between events :)
  expect(slot).toEqual({
    start: new Date("2025-07-20T12:00:00Z"),
    end: new Date("2025-07-20T13:00:00Z"),
    groupID: 10,
  });
  expect(conflicts).toEqual(0);
});

test("optimalTimeSlot: two-opening - small opening", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningEvents]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    30,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T16:30:00Z"),
    10,
    0,
  );

  //Even though theres another slot this one allows for buffer
  expect(slot).toEqual({
    start: new Date("2025-07-20T12:00:00Z"),
    end: new Date("2025-07-20T12:30:00Z"),
    groupID: 10,
  });
  expect(conflicts).toEqual(0);
});

test("optimalTimeSlot: timezone - behind", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningsTimezone]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T23:00:00Z"),
    10,
    3,
  );
  expect(slot).toEqual({
    start: new Date("2025-07-20T20:30:00Z"),
    end: new Date("2025-07-20T21:30:00Z"),
    groupID: 10,
  });
  expect(conflicts).toEqual(0);
});

test("optimalTimeSlot: timezone - ahead", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningsTimezone]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T23:00:00Z"),
    10,
    -3,
  );
  expect(slot).toEqual({
    start: new Date("2025-07-20T06:00:00Z"),
    end: new Date("2025-07-20T07:00:00Z"),
    groupID: 10,
  });
  expect(conflicts).toEqual(0);
});
