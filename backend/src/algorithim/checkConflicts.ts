import { Events, UserWithEvents } from "../types/types";
import { TimeSlot } from "../utils/TimeSlot";

function findConflict(
  user: UserWithEvents,
  newEvent: TimeSlot,
): Events | undefined {
  return user.events.find((event) => {
    const eventSlot = new TimeSlot(event.start, event.end, event.groupID);
    return newEvent.eventsOverlap(eventSlot);
  });
}

export default function checkConflicts(
  members: UserWithEvents[],
  newEvent: TimeSlot,
) {
  const userConflicts = members.flatMap((member) => {
    const conflict = findConflict(member, newEvent);
    return conflict ? { event: conflict } : [];
  });

  return userConflicts;
}
