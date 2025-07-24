import { Groups } from "../types/types";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const WEEK_IN_MS = DAY_IN_MS * 7;
const WEEK_IN_DAYS = 7;
const EARLY_POST_THRESHOLD = 3;
const EARLY_POST_BONUS = 0.6;
const LATE_POST_BONUS = 0.4;
const MAX_GROUP_SIZE = 100;

export default function groupQualityScore(group: Groups): number {
  const responsiveness =
    (group.promptLastUpdate.getTime() - new Date().getTime()) / DAY_IN_MS <
    EARLY_POST_THRESHOLD
      ? group.postFrequency * EARLY_POST_BONUS
      : group.postFrequency * LATE_POST_BONUS;

  const recentEvents = group.events.filter((event) => {
    return event.end.getTime() > new Date().getTime() - 2 * WEEK_IN_MS;
  });
  const recentEventFrequency = recentEvents.length / (2 * WEEK_IN_DAYS);

  const normalizedGroupSize =
    Math.log(group.members.length + 1) / Math.log(MAX_GROUP_SIZE + 1);

  return responsiveness + recentEventFrequency + normalizedGroupSize;
}
