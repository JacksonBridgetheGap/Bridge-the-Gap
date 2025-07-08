import { user_parse, create_group_matrix } from "../utils/dataUtils";
import pre_filter from "./pre_filter";
import { PrismaClient } from "@prisma/client";
import { UserWithGroups } from "../types/types";
const prisma = new PrismaClient();

//Return the top 4 recommended groups based off a content-based filter
// 1. Get Groups data with tags
// 2. Get user classifications using user_parse
// 3. Pre-Filter the data to remove unecessary groups
// 4. Perform cosine similarity to determine strength of recommendation and sort list of recommendations
export default async function recommendations(user: UserWithGroups | null) {
  //1.
  const groups = await prisma.group.findMany({
    include: { members: true },
  });
  const groupMatrix = create_group_matrix(groups);

  //2.
  const userClassifications = user_parse(user);

  //3.
  const filteredGroups = pre_filter(user, groups);

  return filteredGroups.splice(0, 4);
}
