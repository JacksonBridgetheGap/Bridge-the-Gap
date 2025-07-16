import { TimeSlot } from "../utils/TimeSlot";

export default function optimalTimeSlot(
  userEvents: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
): TimeSlot {
  //Optimize to reduce the number of conflicts while trying to get as close to the desired length as possible
  //Should be between the given start and end times

  // If num conflicts is less than the min number seen so far extend event time by 30 min and perform check again

  //O(all start times * userEvents
  //Loop over all possible start times for the next event
  let bestTimeSlot: TimeSlot = new TimeSlot(
    startDateTime,
    new Date(startDateTime.getTime() + 30 * 60 * 1000),
  );
  let minConflicts = Infinity;
  for (
    let currentStartTime = new Date(startDateTime);
    currentStartTime < endDateTime;
    currentStartTime.setMinutes(currentStartTime.getMinutes() + 30)
  ) {
    if (
      currentStartTime.getUTCHours() < 8 ||
      currentStartTime.getUTCHours() > 20
    ) {
      continue;
    }
    let numConflicts: number = 0;
    let possibleTimeSlot = new TimeSlot(
      new Date(currentStartTime.getTime()),
      new Date(currentStartTime.getTime() + 30 * 60 * 1000),
    );
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

    if (numConflicts < minConflicts) {
      minConflicts = numConflicts;
      bestTimeSlot.start = possibleTimeSlot.start;
      bestTimeSlot.end = possibleTimeSlot.end;
    }
    if (numConflicts === minConflicts) {
      continue;
    }
  }
  return bestTimeSlot;
}
