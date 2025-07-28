import "../styles/MemberSearch.css";
import { useState, useEffect } from "react";
import { httpRequest } from "../utils/utils";
import AddMemberTile from "./AddMemberTile";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";
import useUser from "../hooks/useUser.js";

export default function MemberSearch({ onChange, displayMode }) {
  const [addedUsers, setAddedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    setIsLoading(true);
    setAddedUsers([user]);
    const USER_URL = `${import.meta.env.VITE_BASE_URL}/api/users`;
    httpRequest(USER_URL, "GET").then((userList) => {
      setUsers(userList.filter((member) => member.id !== user.id));
      setIsLoading(false);
    });
  }, [displayMode, user]);

  const addMember = async (member) => {
    setUsers(users.filter((user) => user.id !== member.id));
    setAddedUsers([...addedUsers, member]);
    onChange([...addedUsers, member]);
  };

  const removeMember = async (member) => {
    if (member.id === user.id) return;
    setAddedUsers(addedUsers.filter((user) => user.id !== member.id));
    setUsers([...users, member]);
    onChange(addedUsers.filter((user) => user.id !== member.id));
  };

  if (isLoading) {
    return (
      <div className={"flex flex-col items-center justify-center"}>
        <BridgeTheGapLoadingSpinner />
      </div>
    );
  }
  return (
    <div>
      <p>Add to Group:</p>
      <div className="added-members">
        {addedUsers.map((user) => {
          return (
            <AddMemberTile
              member={user}
              onClick={removeMember}
              className={"added-member"}
              key={user.id}
            />
          );
        })}
      </div>

      <p>Added Members:</p>
      <div className="unadded-members">
        {users.map((user) => {
          return (
            <AddMemberTile
              member={user}
              onClick={addMember}
              className={"unadded-member"}
              key={user.id}
            />
          );
        })}
      </div>
    </div>
  );
}
