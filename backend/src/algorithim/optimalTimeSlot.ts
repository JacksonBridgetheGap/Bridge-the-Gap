import { TimeSlot } from "../utils/TimeSlot";

const TIME_IN_MINUTES = 60 * 1000;
const SLOT_DURATION_MINUTES = 30;
const BUFFER_MINUTES = 10;
const BUFFER_PENALTY = 0.25;
const SAME_DAY_PENALTY = 0.5;
const DURATION_BONUS = 0.25;

export default function optimalTimeSlot(
  userEvents: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
  groupID: number,
  groupTimezoneOffset: number,
): { slot: TimeSlot; conflicts: number } {
  let bestTimeSlot: TimeSlot = new TimeSlot(
    startDateTime,
    new Date(startDateTime.getTime() + SLOT_DURATION_MINUTES * TIME_IN_MINUTES),
    groupID,
  );
  let minConflicts = Infinity;
  let minScore = Infinity;
  startTimeLoop: for (
    let currentStartTime = new Date(startDateTime);
    currentStartTime < endDateTime;
    currentStartTime.setMinutes(
      currentStartTime.getMinutes() + SLOT_DURATION_MINUTES,
    )
  ) {
    if (
      currentStartTime.getUTCHours() - groupTimezoneOffset <= 8 ||
      currentStartTime.getUTCHours() - groupTimezoneOffset >= 20
    ) {
      continue startTimeLoop;
    }
    durationLoop: for (
      let currentDuration = SLOT_DURATION_MINUTES, durationIterations = 0;
      currentDuration <= desiredLength;
      currentDuration += SLOT_DURATION_MINUTES, ++durationIterations
    ) {
      let numConflicts: number = 0;
      let score: number = 0;
      let possibleTimeSlot = new TimeSlot(
        new Date(currentStartTime.getTime()),
        new Date(
          currentStartTime.getTime() + currentDuration * TIME_IN_MINUTES,
        ),
        groupID,
      );
      if (possibleTimeSlot.end.getUTCHours() - groupTimezoneOffset > 22) {
        continue startTimeLoop;
      }
      for (const event of userEvents) {
        const bufferedEvent = new TimeSlot(
          new Date(event.start.getTime() - BUFFER_MINUTES * TIME_IN_MINUTES),
          new Date(event.end.getTime() + BUFFER_MINUTES * TIME_IN_MINUTES),
          event.groupID,
        );
        if (possibleTimeSlot.eventsOverlap(event)) {
          if (event.groupID === groupID) {
            continue startTimeLoop;
          }
          let number = timeSlotMap.get(
            new TimeSlot(event.start, event.end, event.groupID).toString(),
          )!;
          numConflicts += number;
          score += number;
        } else if (possibleTimeSlot.eventsOverlap(bufferedEvent)) {
          score += BUFFER_PENALTY;
        }

        if (
          event.groupID === groupID &&
          event.day() === possibleTimeSlot.day()
        ) {
          score += SAME_DAY_PENALTY;
        }
        if (numConflicts > minConflicts) {
          continue startTimeLoop;
        }
      }

      score -= durationIterations * DURATION_BONUS;

      console.log(possibleTimeSlot);
      console.log(score);

      if (score < minScore) {
        minConflicts = numConflicts;
        minScore = score;
        bestTimeSlot = possibleTimeSlot;
      }
    }
  }
  return { slot: bestTimeSlot, conflicts: minConflicts };
}
