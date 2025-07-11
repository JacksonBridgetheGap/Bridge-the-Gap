import "../styles/ProfileBanner.css";
import useUser from "../hooks/useUser.js";

export default function ProfileBanner() {
  const { user } = useUser();

  return (
    <div className="profile-banner">
      <h2 className="text-5xl font-extrabold dark:text-white">{`Hello ${user.username}!`}</h2>
    </div>
  );
}
