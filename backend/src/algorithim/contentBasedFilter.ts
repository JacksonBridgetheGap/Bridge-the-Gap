import { cosineSimilarity } from "../math/math";
import { PrismaClient } from "@prisma/client";
import { UserWithGroupsAndCircle } from "../types/types";

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
const FRIEND_CONSTANT = 0.2;

type GroupWithMembers = {
  members: any[];
} & Awaited<ReturnType<typeof prisma.group.findMany>>[number];
type RecordsType = GroupWithMembers[];
export default function contentBasedFilter(
  user: UserWithGroupsAndCircle | null,
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
  //@ts-ignore TODO: This user.id and inCircle.map is throwing a type error in the ts linter but it's fine will fix later
  const circleList: number[] = user?.circle.map((user) => user.id);
  //@ts-ignore
  const inCircleList: number[] = user?.inCircle.map((user) => user.id)!;
  const idList = circleList?.concat(inCircleList);
  const idSet = new Set(idList);
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
