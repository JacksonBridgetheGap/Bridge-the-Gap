import { cosineSimilarity } from "../math/math";
import { PrismaClient } from "@prisma/client";
import { UserWithGroups } from "../types/types";

const prisma = new PrismaClient();

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

//This is just to change the strength of how much we value people in your circle being in groups
const FRIEND_CONSTANT = 0.1;

type GroupWithMembers = {
  members: any[];
} & Awaited<ReturnType<typeof prisma.group.findMany>>[number];
type RecordsType = GroupWithMembers[];
export default function contentBasedFilter(
  user: UserWithGroups | null,
  userClassificatoins: Map<string, number>,
  groupMatrix: Map<number, Map<string, number>>,
  groups: RecordsType,
) {
  //Construct User vector from classifications
  const userVector = Array.from({ length: 10 }, () => 0);
  for (let i = 0; i < TAG_OPTIONS.length; i++) {
    userVector[i] = userClassificatoins.get(TAG_OPTIONS[i]) || 0;
  }

  //Loop through groups
  const relationshipStrengths = new Map();

  //Get users circle as a list of ids
  const idSet = new Set(user?.circle);
  groups.forEach((group) => {
    //Construct group vector
    const groupVector = Array.from({ length: 10 }, () => 0);
    for (let i = 0; i < TAG_OPTIONS.length; i++) {
      groupVector[i] = groupMatrix.get(group.id)?.get(TAG_OPTIONS[i]) || 0;
    }
    //Compare vectors using cosine similarity
    const similarity = cosineSimilarity(userVector, groupVector);

    //Get set difference between user circle and group members
    const sharedCircle = group.members.filter((member) =>
      idSet.has(Number(member.id)),
    );

    relationshipStrengths.set(
      group.id,
      similarity + sharedCircle.length * FRIEND_CONSTANT,
    );
  });

  const ret = groups.sort((a, b) => {
    return relationshipStrengths.get(b.id) - relationshipStrengths.get(a.id);
  });

  return ret;
}
