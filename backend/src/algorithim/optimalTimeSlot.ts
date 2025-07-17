import { TimeSlot } from "../utils/TimeSlot";

const TIME_IN_MINUTES = 60 * 1000;
const SLOT_DURATION_MINUTES = 30;

export default function optimalTimeSlot(
  userEvents: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
  groupID: number,
): { slot: TimeSlot; conflicts: number } {
  let bestTimeSlot: TimeSlot = new TimeSlot(
    startDateTime,
    new Date(startDateTime.getTime() + SLOT_DURATION_MINUTES * TIME_IN_MINUTES),
    groupID,
  );
  let minConflicts = Infinity;
  startTimeLoop: for (
    let currentStartTime = new Date(startDateTime);
    currentStartTime < endDateTime;
    currentStartTime.setMinutes(
      currentStartTime.getMinutes() + SLOT_DURATION_MINUTES,
    )
  ) {
    if (
      currentStartTime.getUTCHours() <= 8 ||
      currentStartTime.getUTCHours() >= 20
    ) {
      continue startTimeLoop;
    }
    durationLoop: for (
      let currentDuration = SLOT_DURATION_MINUTES;
      currentDuration <= desiredLength;
      currentDuration += SLOT_DURATION_MINUTES
    ) {
      let numConflicts: number = 0;
      let possibleTimeSlot = new TimeSlot(
        new Date(currentStartTime.getTime()),
        new Date(
          currentStartTime.getTime() + currentDuration * TIME_IN_MINUTES,
        ),
        groupID,
      );
      if (possibleTimeSlot.end.getUTCHours() > 22) {
        continue startTimeLoop;
      }
      for (const event of userEvents) {
        if (possibleTimeSlot.eventsOverlap(event)) {
          if (event.groupID === groupID) {
            continue startTimeLoop;
          }
          numConflicts += timeSlotMap.get(
            new TimeSlot(event.start, event.end, event.groupID).toString(),
          )!;
        }
        if (numConflicts > minConflicts) {
          continue startTimeLoop;
        }
      }

      if (numConflicts <= minConflicts) {
        if (
          numConflicts < minConflicts ||
          possibleTimeSlot.duration() > bestTimeSlot.duration()
        ) {
          minConflicts = numConflicts;
          bestTimeSlot = possibleTimeSlot;
        }
      }
    }
  }
  return { slot: bestTimeSlot, conflicts: minConflicts };
}
