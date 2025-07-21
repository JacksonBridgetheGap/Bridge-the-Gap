import "../styles/MemberIcon.css";

export default function MemberIcon({ member }) {
  return (
    <div className="min-w-[80px] flex flex-col items-center text-center">
      <img
        src={member.photo}
        alt="Profile Picture"
        className="h-16 w-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
      />
      <h3 className="member-name">{member.username}</h3>
    </div>
  );
}
