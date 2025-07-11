import "../styles/Header.css";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../providers/UserProvider.jsx";
import { authContext } from "../providers/AuthProvider.jsx";
import { useContext } from "react";

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
        <button
          className="text-white mr-auto cursor-pointer h-1/2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center"
          onClick={handleLogout}
        >
          Log Out
        </button>
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
