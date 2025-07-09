//Quick filter of user groups to exclude filters we know shouldn't be included like already joined groups
import { UserWithGroups } from "../types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type RecordsType = Awaited<ReturnType<typeof prisma.group.findMany>>;

//Basic Filtering to cut down on groups to recommend for now only removing groups user is already a member in
export default function preFilter(
  user: UserWithGroups | null,
  groups: RecordsType,
) {
  const filtered_groups = groups.filter((group) => {
    return user?.groups.every((user_group) => {
      return user_group.id !== group.id;
    });
  });
  return filtered_groups;
}
