import "../styles/MembersList.css";
import MemberIcon from "./MemberIcon";

export default function MembersList({ members }) {
  if (members) {
    return (
      <div>
        <h2 className="text-3xl font-bold dark:text-white">Members</h2>
        <div className="members-list">
          {members.map((user) => {
            return <MemberIcon member={user} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>No member data</p>
    </div>
  );
}
