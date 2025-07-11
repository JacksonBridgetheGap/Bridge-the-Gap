import "../styles/GroupCard.css";
import { Link } from "react-router";
import MemberCard from "./MemberCard";
import { httpRequest } from "../utils/utils.js";
import { userGroupContext } from "../providers/UserGroupsProvider.jsx";
import { useContext } from "react";
import useUser from "../hooks/useUser.js";

export default function GroupCard({ group, members, joinedGroup, home }) {
  const { groups, setGroups } = useContext(userGroupContext);
  const { user } = useUser();

  const handleJoin = () => {
    if (!joinedGroup) {
      const USER_GROUPS_URL = `/api/user/${user.id}/groups`;
      const memberIds = group.members.map((member) => member.id);
      httpRequest(USER_GROUPS_URL, "PUT", {
        groupId: group.id,
        members: memberIds,
      }).then(() => {
        setGroups([...groups, group]);
      });
    }
  };

  if (group !== null) {
    return (
      <div className="group-card">
        {home && <Link to={`/group/${group.id}`} className="group-link"></Link>}
        <div className="group-content">
          <h2 className="text-2xl font-bold dark:text-white">{group.name}</h2>
          <div className="group-info">
            <img src={group.img} alt="Group Image" className="group-img" />
            <div className="member-list">
              <p className="font-bold dark:text-white underline">
                Member List:
              </p>
              {members?.map((member) => {
                return <MemberCard member={member} key={member.id} />;
              })}
            </div>
          </div>
        </div>
        <button
          className={`${"join-group-button"} ${joinedGroup ? "joined-group" : "unjoined-group"}`}
          onClick={handleJoin}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>No group data</p>
    </div>
  );
}
