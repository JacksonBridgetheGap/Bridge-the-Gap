//Quick filter of user groups to exclude filters we know shouldn't be included like already joined groups
import { UserWithGroupsAndCircle } from "../types/types";
import { Groups } from "../types/types";

//Basic Filtering to cut down on groups to recommend for now only removing groups user is already a member in
export default function preFilter(
  user: UserWithGroupsAndCircle | null,
  groups: Groups[],
) {
  const userGroupIds = user?.groups.map((group) => group.id);
  const idSet = new Set(userGroupIds);
  return groups.filter((group) => {
    return !idSet.has(Number(group.id));
  });
}
