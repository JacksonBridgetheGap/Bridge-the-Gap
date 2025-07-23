import "../styles/Header.css";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../context/UserContext.jsx";
import { authContext } from "../context/AuthContext.jsx";
import { useContext } from "react";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import BridgeTheGapTitle from "./BridgeTheGapTitle.jsx";

const LOGOUT_URL = `${import.meta.env.VITE_BASE_URL}/api/auth/logout`;

export default function Header() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { setAuth } = useContext(authContext);

  const handleLogout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    httpRequest(LOGOUT_URL, "POST").then(() => {
      setAuth(false);
      setUser(null);
      navigate("/");
    });
  };

  return (
    <header className="flex justify-between items-center py-4 px-8">
      <div className="logo">
        <BridgeTheGapTitle />
      </div>
      <div className="flex items-center gap-4">
        <BridgeTheGapButton onClick={handleLogout} value={"Log Out"} />
        <div className="profile-icon">
          <Link to="/profile" className="profile-link"></Link>
          <img
            src="/default_profile_pic.jpg"
            alt="Profile Phot"
            className="profile-photo"
          />
        </div>
      </div>
    </header>
  );
}
