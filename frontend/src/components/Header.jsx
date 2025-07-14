import "../styles/Header.css";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../providers/UserProvider.jsx";
import { authContext } from "../providers/AuthProvider.jsx";
import { useContext } from "react";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";

const LOGOUT_URL = "/api/auth/logout";

export default function Header() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { setAuth } = useContext(authContext);

  const handleLogout = async () => {
    if (await httpRequest(LOGOUT_URL, "POST")) {
      setAuth(false);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <header>
      <div className="logo">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-blue-400 md:text-5xl lg:text-6xl dark:text-white">
          Bridge the Gap
        </h1>
      </div>
      <div className="relative top-4 left-10">
        <BridgeTheGapButton onClick={handleLogout} value={"Log Out"} />
      </div>
      <div className="profile-icon">
        <Link to="/profile" className="profile-link"></Link>
        <img
          src="/default_profile_pic.jpg"
          alt="Profile Phot"
          className="profile-photo"
        />
      </div>
    </header>
  );
}
