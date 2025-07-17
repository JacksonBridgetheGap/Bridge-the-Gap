//Return the users classification tags and scores as a dictionary with tags as keys
// and values as the number of times those tags appear
import { UserWithGroupsAndCircle } from "../types/types";
import { UserWithEvents } from "../types/types";
import { TimeSlot } from "./TimeSlot";
import { prisma } from "../algorithim/prisma";

//Create a user classification map to describe the users relationship strength with each tag
export function userParse(user: UserWithGroupsAndCircle | null) {
  const classification = new Map();

  //If user isn't apart of any group return an empty map
  // let user of function handle error detection
  if (user?.groups == null) {
    return classification;
  }
  //Need to merge data-model updates before we can pull tags from the users groups
  for (let i = 0; i < user?.groups.length; i++) {
    for (let j = 0; j < user.groups[i].tags.length; j++) {
      let tag = user.groups[i].tags[j];
      if (classification.has(tag)) {
        let currentValue = classification.get(tag);
        classification.set(tag, currentValue + 1);
      } else {
        classification.set(tag, 1);
      }
    }
  }

  return classification;
}

//Creates a group data matrix based on tag data
type RecordsType = Awaited<ReturnType<typeof prisma.group.findMany>>;
export function createGroupMatrix(groups: RecordsType) {
  return groups.reduce((map, group) => {
    const groupMap = group.tags.reduce((accum, tag) => {
      accum.set(tag, 1);
      return accum;
    }, new Map());
    map.set(group.id, groupMap);
    return map;
  }, new Map());
}

export function createTimeSlotMap(
  users: UserWithEvents[],
): [Map<string, number>, Set<TimeSlot>] {
  /*
  This function takes in a list of user events and outputs a set of all non-duplicate events
  as well as a map of the events to the number of times they appeared, this map uses the TimeSlots .toString()
  method to give each timeslot a unique key.

  Args:
    users: This is a list of prisma users that each have their own list of events as a member varible

  Returns:
    Map<string, number>: A map structure with key value pairs of TimeSlot.toString() ---> # of appearances of event in all users
    Set<TimeSlot>: A set of all user events with no repeating events
  */
  const timeSlotMap = new Map<string, number>();
  const timeSlotSet = new Set<TimeSlot>();

  users.forEach((user) => {
    user.events.forEach((event) => {
      const eventTimeSlot: string = new TimeSlot(
        event.start,
        event.end,
        event.groupID,
      ).toString();
      if (timeSlotMap.has(eventTimeSlot)) {
        const currentValue = timeSlotMap.get(eventTimeSlot)!;
        timeSlotMap.set(eventTimeSlot, currentValue + 1);
      } else {
        timeSlotMap.set(eventTimeSlot, 1);
        timeSlotSet.add(new TimeSlot(event.start, event.end, event.groupID));
      }
    });
  });

  return [timeSlotMap, timeSlotSet];
}
