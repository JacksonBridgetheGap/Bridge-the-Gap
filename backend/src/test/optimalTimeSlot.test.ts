import optimalTimeSlot from "../algorithim/optimalTimeSlot";
import { createTimeSlotMap } from "../utils/dataUtils";
import {
  userWithOneOpeningEvents,
  userWithTwoOpeningEvents,
} from "./test.data/testUsers";

test("optimalTimeSlot: basic", () => {
  const [SlotMap, SlotSet] = createTimeSlotMap([userWithOneOpeningEvents]);
  const { slot, conflicts } = optimalTimeSlot(
    SlotSet,
    SlotMap,
    60,
    new Date("2025-07-20T01:00:00Z"),
    new Date("2025-07-20T23:00:00Z"),
    1,
  );

  expect(slot).toEqual({
    start: new Date("2025-07-20T12:00:00Z"),
    end: new Date("2025-07-20T13:00:00Z"),
    groupID: 1,
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
    1,
  );

  expect(slot).toEqual({
    start: new Date("2025-07-20T12:30:00Z"),
    end: new Date("2025-07-20T13:30:00Z"),
    groupID: 1,
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
    new Date("2025-07-20T17:00:00Z"),
    1,
  );

  expect(slot).toEqual({
    start: new Date("2025-07-20T10:00:00Z"),
    end: new Date("2025-07-20T10:30:00Z"),
    groupID: 1,
  });
  expect(conflicts).toEqual(0);
});
