import "./LoginPage.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { userContext } from "../providers/UserProvider";
import { authContext } from "../providers/AuthProvider";

const LOGIN_URL = "/api/auth/login";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { setAuth } = useContext(authContext);

  const handleInputChange = (evt) => {
    setLoginData({
      ...loginData,
      [evt.target.name]: evt.target.value,
    });
    setErrorMessage(null);
  };

  const handleLogin = async (evt) => {
    evt.preventDefault();
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
        setAuth(true);
        navigate("/");
      } else {
        const json = await response.json();
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
    <div>
      <form className="flex flex-col min-h-screen justify-center items-center">
        <h1 className="text-4xl font-extrabold dark:text-white">Login</h1>
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
        <button
          onClick={handleLogin}
          className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
        <br />
        <Link
          to="/"
          className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
        >
          Don't Have an account yet?
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
