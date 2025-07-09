import { cosineSimilarity } from "../math/math";
import { PrismaClient } from "@prisma/client";

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

type RecordsType = Awaited<ReturnType<typeof prisma.group.findMany>>;
export default function contentBasedFilter(
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
  groups.forEach((group) => {
    //Construct group vector
    const groupVector = Array.from({ length: 10 }, () => 0);
    for (let i = 0; i < TAG_OPTIONS.length; i++) {
      groupVector[i] = groupMatrix.get(group.id)?.get(TAG_OPTIONS[i]) || 0;
    }
    //Compare vectors using cosine similarity
    const similarity = cosineSimilarity(userVector, groupVector);
    relationshipStrengths.set(group.id, similarity);
  });

  const ret = groups.sort((a, b) => {
    return relationshipStrengths.get(b.id) - relationshipStrengths.get(a.id);
  });

  return ret;
}
