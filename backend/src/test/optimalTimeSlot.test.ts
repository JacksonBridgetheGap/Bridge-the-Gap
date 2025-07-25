import optimalTimeSlot from "../algorithim/optimalTimeSlot";
import { createTimeSlotMap } from "../utils/dataUtils";
import {
  userWithOneOpeningEvents,
  userWithTwoOpeningEvents,
  userWithTwoOpeningsTimezone,
} from "./test.data/testUsers";

test("optimalTimeSlot: basic", () => {
  //@ts-ignore
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithOneOpeningEvents]);
  optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T17:00:00Z"),
    10,
    0,
  ).then((data) => {
    const slot = data.slot;
    const conflicts = data.conflicts;
    expect(slot).toEqual({
      start: new Date("2025-07-20T12:00:00Z"),
      end: new Date("2025-07-20T12:30:00Z"),
      groupID: 10,
    });
    expect(conflicts).toEqual(0);
  });
});

test("optimalTimeSlot: two-opening - long opening", () => {
  //@ts-ignore
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningEvents]);
  optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T17:00:00Z"),
    10,
    0,
  ).then((data) => {
    const slot = data.slot;
    const conflicts = data.conflicts;
    //Chooses middle time to allow for buffer between events :)
    expect(slot).toEqual({
      start: new Date("2025-07-20T12:00:00Z"),
      end: new Date("2025-07-20T13:00:00Z"),
      groupID: 10,
    });
    expect(conflicts).toEqual(0);
  });
});

test("optimalTimeSlot: two-opening - small opening", () => {
  //@ts-ignore
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningEvents]);
  optimalTimeSlot(
    SlotSet,
    SlotMap,
    30,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T16:30:00Z"),
    10,
    0,
  ).then((data) => {
    const slot = data.slot;
    const conflicts = data.conflicts;
    //Even though theres another slot this one allows for buffer
    expect(slot).toEqual({
      start: new Date("2025-07-20T12:00:00Z"),
      end: new Date("2025-07-20T12:30:00Z"),
      groupID: 10,
    });
    expect(conflicts).toEqual(0);
  });
});

test("optimalTimeSlot: timezone - behind", () => {
  //@ts-ignore
  //@ts-ignore
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningsTimezone]);
  optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T23:00:00Z"),
    10,
    3,
  ).then((data) => {
    const slot = data.slot;
    const conflicts = data.conflicts;
    expect(slot).toEqual({
      start: new Date("2025-07-20T20:30:00Z"),
      end: new Date("2025-07-20T21:30:00Z"),
      groupID: 10,
    });
    expect(conflicts).toEqual(0);
  });
});

test("optimalTimeSlot: timezone - ahead", () => {
  //@ts-ignore
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithTwoOpeningsTimezone]);
  optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T23:00:00Z"),
    10,
    -3,
  ).then((data) => {
    const slot = data.slot;
    const conflicts = data.conflicts;
    expect(slot).toEqual({
      start: new Date("2025-07-20T06:00:00Z"),
      end: new Date("2025-07-20T07:00:00Z"),
      groupID: 10,
    });
    expect(conflicts).toEqual(0);
  });
});
