import "./LoginPage.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import GoogleAuth from "../components/GoogleAuth.jsx";
import BridgeTheGapButton from "../components/BridgeTheGapButton.jsx";
import { Link } from "react-router";
import { userContext } from "../context/UserContext.jsx";
import { authContext } from "../context/AuthContext.jsx";
import BridgeTheGapTitle from "../components/BridgeTheGapTitle.jsx";
const LOGIN_URL = `${import.meta.env.VITE_BASE_URL}/api/auth/login`;

function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const { auth, setAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && auth) {
      navigate("/");
    }
  }, [user, auth, navigate]);

  const handleInputChange = (evt) => {
    setLoginData({
      ...loginData,
      [evt.target.name]: evt.target.value,
    });
    setErrorMessage(null);
  };

  const handleLogin = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const { token } = await response.json();
        document.cookie = `token=${token}`;
        setIsLoading(false);
        setAuth(true);
      } else {
        const json = await response.json();
        setIsLoading(false);
        setErrorMessage(json.message);
        setLoginData({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <BridgeTheGapTitle />
        <form className="bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col items-center mt-4">
          <h2 className="text-4xl font-extrabold dark:text-white">Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={loginData.username}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
            />
            <br />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={loginData.password}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
            />
            <br />
          </div>
          <BridgeTheGapButton
            onClick={handleLogin}
            value={"Login"}
            loading={isLoading}
          />
          <br />
          <GoogleAuth />
          <Link
            to="/"
            className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
          >
            Don't Have an account yet?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
