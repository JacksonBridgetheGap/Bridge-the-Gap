import { useContext } from "react";
import { userGroupsContext } from "../context/userGroupsContext.jsx";

export default function useUserGroups() {
  const { groups, isLoading } = useContext(userGroupsContext);
  if (isLoading) {
    return { groups: null, isLoading: true };
  } else {
    return { groups, isLoading: false };
  }
}
