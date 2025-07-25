import { cosineSimilarity } from "../math/math";
import { UserWithGroupsAndCircle } from "../types/types";
import { Groups } from "../types/types";
import groupQualityScore from "./groupQualityScore";

const TAG_OPTIONS = [
  "hobbies",
  "education",
  "gaming",
  "food",
  "health",
  "travel",
  "business",
  "pets",
  "miscellaneous",
];

const FRIEND_CONSTANT = 0.2;

export default function contentBasedFilter(
  user: UserWithGroupsAndCircle | null,
  userClassifications: Map<string, number>,
  groupMatrix: Map<number, Map<string, number>>,
  groups: Groups[],
) {
  const userVector = Array.from({ length: 10 }, () => 0);
  for (let i = 0; i < TAG_OPTIONS.length; i++) {
    userVector[i] = userClassifications.get(TAG_OPTIONS[i]) || 0;
  }

  const relationshipStrengths = new Map();

  const circleList: number[] | undefined = user?.circle.map((user) => user.id);
  const inCircleList: number[] = user?.inCircle.map((user) => user.id)!;
  const idList = circleList?.concat(inCircleList);
  const idSet = new Set(idList);
  groups.forEach((group) => {
    const groupVector = Array.from({ length: 10 }, () => 0);
    for (let i = 0; i < TAG_OPTIONS.length; i++) {
      groupVector[i] = groupMatrix.get(group.id)?.get(TAG_OPTIONS[i]) || 0;
    }
    const similarity = cosineSimilarity(userVector, groupVector);

    const sharedCircle = group.members.filter((member) =>
      idSet.has(Number(member.id)),
    );

    const qualityScore = groupQualityScore(group);

    relationshipStrengths.set(
      group.id,
      similarity + sharedCircle.length * FRIEND_CONSTANT + qualityScore,
    );
  });

  const ret = groups.sort((a, b) => {
    return relationshipStrengths.get(b.id) - relationshipStrengths.get(a.id);
  });

  return ret;
}
