import "../styles/MemberSearch.css";
import { useState, useEffect } from "react";
import { httpRequest } from "../utils/utils";
import AddMemberTile from "./AddMemberTile";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";

export default function MemberSearch({ onChange, displayMode }) {
  const [addedUsers, setAddedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setAddedUsers([]);
    const USER_URL = `${import.meta.env.VITE_BASE_URL}/api/users`;
    httpRequest(USER_URL, "GET").then((userList) => {
      setUsers(userList);
      setIsLoading(false);
    });
  }, [displayMode]);

  const addMember = async (member) => {
    setUsers(users.filter((user) => user.id !== member.id));
    setAddedUsers([...addedUsers, member]);
    onChange([...addedUsers, member]);
  };

  const removeMember = async (member) => {
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
