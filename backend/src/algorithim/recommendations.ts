import { userParse, createGroupMatrix } from "../utils/dataUtils";
import preFilter from "./preFilter";
import contentBasedFilter from "./contentBasedFilter";
import { PrismaClient } from "@prisma/client";
import { GroupWithMembers, UserWithGroupsAndCircle } from "../types/types";
const prisma = new PrismaClient();

//Return the top 4 recommended groups based off a content-based filter
// 1. Get Groups data with tags
// 2. Get user classifications using user_parse
// 3. Pre-Filter the data to remove unecessary groups
// 4. Create group matrix to pass into recommandation algorithim
// 5. Perform cosine similarity to determine strength of recommendation and sort list of recommendations
export default async function recommendations(
  user: UserWithGroupsAndCircle | null,
) {
  //1.
  const groups: GroupWithMembers = await prisma.group.findMany({
    include: { members: true },
  });

  //2.
  const userClassifications = userParse(user);

  //3.
  const filteredGroups: GroupWithMembers = preFilter(user, groups);

  //4.
  const groupMatrix = createGroupMatrix(filteredGroups);

  //5.
  const recommendations = contentBasedFilter(
    user,
    userClassifications,
    groupMatrix,
    filteredGroups,
  );

  return recommendations.splice(0, 3);
}
