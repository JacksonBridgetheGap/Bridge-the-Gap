import { useContext } from "react";
import { userContext } from "../context/UserContext.jsx";

export default function useUser() {
  const { user, isLoading, setUser } = useContext(userContext);
  if (isLoading) {
    return { user: null, isLoading: true, setUser };
  } else {
    return { user, isLoading: false, setUser };
  }
}
