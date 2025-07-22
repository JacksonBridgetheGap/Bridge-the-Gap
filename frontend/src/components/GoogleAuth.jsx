import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { userContext } from "../context/UserContext.jsx";
import { authContext } from "../context/AuthContext.jsx";

export default function GoogleAuth() {
  const { setUser } = useContext(userContext);
  const { setAuth } = useContext(authContext);
  const navigate = useNavigate();

  const login = async (profileData) => {
    const idToken = profileData.credential;
    try {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((response) => {
            setUser(response.user);
            setAuth(true);
            navigate("/");
          });
        } else {
          console.log("Error");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => login(credentialResponse)}
      />
    </div>
  );
}
