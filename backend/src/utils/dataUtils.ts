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

//WIP: I have to convert to strings so that I can acutally map the TimeSlot objects (there might be a better way to represent the TimeSlots)
// might be a way to have some form of deterministic function that I can put a time slot into and get a better key representation
export function createTimeSlotMap(
  users: UserWithEvents[],
): [Map<string, number>, Set<TimeSlot>] {
  const timeSlotMap = new Map<string, number>();
  const timeSlotSet = new Set<TimeSlot>();

  users.forEach((user) => {
    user.events.forEach((event) => {
      timeSlotSet.add(new TimeSlot(event.start, event.end));
      const eventTimeSlot: string = event.start
        .toString()
        .concat(event.end.toString());
      if (timeSlotMap.has(eventTimeSlot)) {
        const currentValue = timeSlotMap.get(eventTimeSlot)!;
        timeSlotMap.set(eventTimeSlot, currentValue + 1);
      } else {
        timeSlotMap.set(eventTimeSlot, 1);
      }
    });
  });

  return [timeSlotMap, timeSlotSet];
}
