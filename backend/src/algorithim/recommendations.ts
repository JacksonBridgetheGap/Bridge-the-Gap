import { user_parse, create_group_matrix } from "../utils/dataUtils";
import pre_filter from "./pre_filter";
import content_based_filter from "./content_based_filter";
import { PrismaClient } from "@prisma/client";
import { UserWithGroups } from "../types/types";
const prisma = new PrismaClient();

//Return the top 4 recommended groups based off a content-based filter
// 1. Get Groups data with tags
// 2. Get user classifications using user_parse
// 3. Pre-Filter the data to remove unecessary groups
// 4. Create group matrix to pass into recommandation algorithim
// 5. Perform cosine similarity to determine strength of recommendation and sort list of recommendations
export default async function recommendations(user: UserWithGroups | null) {
  //1.
  const groups = await prisma.group.findMany({
    include: { members: true },
  });

  //2.
  const userClassifications = user_parse(user);

  //3.
  const filteredGroups = pre_filter(user, groups);

  //4.
  const groupMatrix = create_group_matrix(filteredGroups);

  //5.
  const recommendations = content_based_filter(
    userClassifications,
    groupMatrix,
    filteredGroups,
  );

  return recommendations.splice(0, 4);
}
