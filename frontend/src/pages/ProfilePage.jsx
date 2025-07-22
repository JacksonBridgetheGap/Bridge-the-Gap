import "./ProfilePage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileBanner from "../components/ProfileBanner";
import MemberIcon from "../components/MemberIcon";
import ProfileDetails from "../components/ProfileDetails";
import useUser from "../hooks/useUser.js";
import { userContext } from "../context/UserContext.jsx";
import { useCallback, useContext, useState } from "react";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";
import BackButton from "../components/BackButtons.jsx";

function ProfilePage() {
  const { user } = useUser();

  function useUpdateProfile() {
    const { user, setUser } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(false);

    const update = useCallback(
      async (userData) => {
        setIsLoading(true);
        if (user.offsetUTC !== new Date().getTimezoneOffset()) {
          userData.offsetUTC = new Date().getTimezoneOffset();
        }
        const USER_URL = `${import.meta.env.VITE_BASE_URL}/api/users/${user.id}`;
        httpRequest(USER_URL, "PUT", userData)
          .then((updatedUser) => {
            setUser({
              ...updatedUser,
              events: convertEventsToLocal(updatedUser.events),
            });
          })
          .finally(() => setIsLoading(false));
      },
      [setUser, user.id, user.offsetUTC],
    );
    return [update, isLoading];
  }

  const [update, isLoading] = useUpdateProfile();

  return (
    <main>
      <Header />
      <BackButton />
      <ProfileBanner />
      <div className="profile-information">
        <img
          className={"w-48 h-48 rounded-full object-cover shadow-lg"}
          src={user ? user.photo : "/default_profile_pic.jpg"}
          alt="Profile Image"
        />
        <ProfileDetails onUpdate={update} loading={isLoading} />
      </div>
      <Footer />
    </main>
  );
}

export default ProfilePage;
