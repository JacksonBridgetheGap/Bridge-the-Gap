import { userParse, createGroupMatrix } from "../utils/dataUtils";
import preFilter from "./preFilter";
import contentBasedFilter from "./contentBasedFilter";
import { PrismaClient } from "@prisma/client";
import { GroupWithMembers, UserWithGroupsAndCircle } from "../types/types";
const prisma = new PrismaClient();

export default async function recommendations(
  user: UserWithGroupsAndCircle | null,
): Promise<GroupWithMembers[]> {
  const groups: GroupWithMembers = await prisma.group.findMany({
    include: { members: true },
  });

  const userClassifications = userParse(user);

  const filteredGroups: GroupWithMembers = preFilter(user, groups);

  const groupMatrix = createGroupMatrix(filteredGroups);

  const recommendations = contentBasedFilter(
    user,
    userClassifications,
    groupMatrix,
    filteredGroups,
  );

  return recommendations.splice(0, 3);
}
