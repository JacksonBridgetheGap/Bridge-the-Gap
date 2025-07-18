import "./ProfilePage.css";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileBanner from "../components/ProfileBanner";
import MemberIcon from "../components/MemberIcon";
import ProfileDetails from "../components/ProfileDetails";
import useUser from "../hooks/useUser.js";
import { userContext } from "../context/UserContext.jsx";
import { useCallback, useContext } from "react";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";
import { DateTime } from "luxon";

function useUpdateProfile() {
  const { user, setUser } = useContext(userContext);
  const update = useCallback(
    (userData) => {
      if (user.offsetUTC !== new Date().getTimezoneOffset()) {
        userData.offsetUTC = new Date().getTimezoneOffset();
      }
      const USER_URL = `/api/users/${user.id}`;
      httpRequest(USER_URL, "PUT", userData).then((updatedUser) => {
        setUser({
          ...updatedUser,
          events: convertEventsToLocal(updatedUser.events),
        });
      });
    },
    [setUser, user.id, user.offsetUTC],
  );
  return [update];
}

function ProfilePage() {
  const { user } = useUser();
  const [update] = useUpdateProfile();

  return (
    <main>
      <Header />
      <ProfileBanner />
      <Link to="/" className="back-button">
        {"<--"}
      </Link>
      <div className="profile-information">
        <MemberIcon member={user} className="member-icon" />
        <ProfileDetails onUpdate={update} />
      </div>
      <Footer />
    </main>
  );
}

export default ProfilePage;
