import { TimeSlot } from "../utils/TimeSlot";

/*WIP: Need to make sure algorithm never suggests a time that the group is already meeting
 *
 * need to pass the current groups list of events and check whether the current proposed event time is overlapping with a group event
 * if so we need to skip that possible time slot no matter what
 *
 */

export default function optimalTimeSlot(
  userEvents: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
): TimeSlot {
  let bestTimeSlot: TimeSlot = new TimeSlot(
    startDateTime,
    new Date(startDateTime.getTime() + 30 * 60 * 1000),
  );
  let minConflicts = Infinity;

  startTimeLoop: for (
    let currentStartTime = new Date(startDateTime);
    currentStartTime < endDateTime;
    currentStartTime.setMinutes(currentStartTime.getMinutes() + 30)
  ) {
    if (
      currentStartTime.getUTCHours() < 8 ||
      currentStartTime.getUTCHours() > 20
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
      );
      if (possibleTimeSlot.end.getUTCHours() > 22) {
        continue startTimeLoop;
      }
      userEvents.forEach((event) => {
        if (event.end <= currentStartTime) {
          userEvents.delete(event);
        }
        if (possibleTimeSlot.eventsOverlap(event)) {
          numConflicts += timeSlotMap.get(
            new TimeSlot(event.start, event.end).toString(),
          )!;
        }
        if (numConflicts > minConflicts) {
          return;
        }
      });

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
  return bestTimeSlot;
}
