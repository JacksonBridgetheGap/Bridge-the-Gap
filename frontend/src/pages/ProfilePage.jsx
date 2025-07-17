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
import { httpRequest } from "../utils/utils.js";

function useUpdateProfile() {
  const { user, setUser } = useContext(userContext);
  const update = useCallback(
    (userData) => {
      const USER_URL = `/api/users/${user.id}`;
      httpRequest(USER_URL, "PUT", userData).then((updatedUser) => {
        setUser(updatedUser);
      });
    },
    [setUser, user.id],
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
