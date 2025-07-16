import { TimeSlot } from "../utils/TimeSlot";

export default function optimalTimeSlot(
  userEvents: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
  groupID: number,
): [TimeSlot, number] {
  let bestTimeSlot: TimeSlot = new TimeSlot(
    startDateTime,
    new Date(startDateTime.getTime() + 30 * 60 * 1000),
    groupID,
  );
  let minConflicts = Infinity;

  startTimeLoop: for (
    let currentStartTime = new Date(startDateTime);
    currentStartTime < endDateTime;
    currentStartTime.setMinutes(currentStartTime.getMinutes() + 30)
  ) {
    if (
      currentStartTime.getUTCHours() <= 8 ||
      currentStartTime.getUTCHours() >= 20
    ) {
      continue startTimeLoop;
    }
    let numConflicts: number = 0;
    durationLoop: for (
      let currentDuration = 30;
      currentDuration <= desiredLength;
      currentDuration += 30
    ) {
      let possibleTimeSlot = new TimeSlot(
        new Date(currentStartTime.getTime()),
        new Date(currentStartTime.getTime() + currentDuration * 60 * 1000),
        groupID,
      );
      if (possibleTimeSlot.end.getUTCHours() > 22) {
        continue startTimeLoop;
      }
      for (const event of userEvents) {
        if (event.end <= currentStartTime) {
          userEvents.delete(event);
          continue;
        } else if (possibleTimeSlot.eventsOverlap(event)) {
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
  return [bestTimeSlot, minConflicts];
}
