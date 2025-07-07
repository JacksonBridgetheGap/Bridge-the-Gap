import {
  user_parse,
  create_user_matrix,
  create_group_matrix,
} from "../utils/dataUtils";
import pre_filter from "./pre_filter";
import { PrismaClient } from "@prisma/client";
import { UserWithGroups } from "../types/types";

const prisma = new PrismaClient();

//Return the top 4 recommended groups based off a content-based filter
// 1. Get Groups data with tags
// 2. Get user classifications using user_parse
// 3. Pre-Filter the data to remove unecessary groups
// 4. Create Group and User matrices to be used in filtering
// 5. Perform cosine similarity to determine strength of recommendation
export default async function recommendations(user: UserWithGroups | null) {
  const userClassifications = user_parse(user);
  const groups = await prisma.group.findMany();
  return groups.splice(0, 4);
}
