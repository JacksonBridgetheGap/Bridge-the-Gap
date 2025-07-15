import { TimeSlot } from "../utils/TimeSlot";

export default function optimalTimeSlot(
  timeSlots: Set<TimeSlot>,
  timeSlotMap: Map<string, number>,
  desiredLength: number,
  startDateTime: Date,
  endDateTime: Date,
): TimeSlot {
  //Algorithm

  //Optimize to reduce the number of conflicts while trying to get as close to the desired length as possible
  //Should be between the given start and end times

  //Could be solved using Dynamic Programming or Greedy Algorithm

  //If proposed event is outside of good hours ( start < 8am || start > 10pm) move on to next start time

  //Loop through possible start times, start with event being at shortest possible length of 30 min,
  // If num conflicts is less than the min number seen so far extend event time by 30 min and perform check again
  // If num conflicts ever higher than min seen so far move on to next start time

  //Need a fast way to check how many conflicts exist within a given time slot, trying to use map but this doesn't seem best
  // We could pass all user events and then check if the current time slot overlaps with the provided event and then use the map the check how many of these events exist to reduce
  // looping over duplicate events
  return new TimeSlot(new Date(), new Date());
}
