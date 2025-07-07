//Return the users classification tags and scores as a dictionary with tags as keys
// and values as the number of times those tags appear
import { UserWithGroups } from "../types/types";

export function user_parse(user: UserWithGroups | null) {
  const classification: string[] = [];
  //Need to merge data-model updates before we can pull tags from the users groups
  console.log(classification);
  return classification;
}

//Creates a user data matrix based on tag data
export function create_user_matrix() {}

//Creates a group data matrix based on tag data
export function create_group_matrix() {}
