import { TimeSlot } from "../utils/TimeSlot";

export default function optimalTimeSlot(
  userEvents: TimeSlot[],
  desiredLength: number,
): TimeSlot {
  return new TimeSlot(new Date(), new Date());
}
