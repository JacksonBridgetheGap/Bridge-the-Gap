import "./RegisterPage.css";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { userContext } from "../context/UserContext.jsx";
import { authContext } from "../context/AuthContext.jsx";
import BridgeTheGapButton from "../components/BridgeTheGapButton.jsx";
import BridgeTheGapTitle from "../components/BridgeTheGapTitle.jsx";

const REGISTER_URL = `${import.meta.env.VITE_BASE_URL}/api/auth/register`;

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    location: "",
    photo: "/default_profile_pic.jpg",
  });
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { setAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (evt) => {
    setNewUser({
      ...newUser,
      [evt.target.name]: evt.target.value,
    });
    setErrorMessage(null);
  };

  const handleRegister = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const { newUser } = await response.json();
        setIsLoading(false);
        setAuth(true);
        setUser(newUser);
        navigate("/");
      } else {
        const json = await response.json();
        setIsLoading(false);
        setErrorMessage(json.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <BridgeTheGapTitle />
        <form className="bg-white p-8 rounded-xl shadow-lg w-100 flex flex-col items-center mt-4">
          <h1 className="text-4xl font-extrabold dark:text-white">
            Create New Account
          </h1>
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
              name="username"
              placeholder="John Doe"
              value={newUser.username}
              onChange={handleInputChange}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
              required
            />
            <br />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="johndoe@email.com"
              value={newUser.email}
              onChange={handleInputChange}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
              required
            />
            <br />
          </div>
          <div className="mb-6">
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="location"
              placeholder="Menlo Park, CA"
              value={newUser.location}
              onChange={handleInputChange}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
              required
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
              name="password"
              placeholder="Enter Password"
              value={newUser.password}
              onChange={handleInputChange}
              className={
                errorMessage
                  ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
              required
            />
            <br />
          </div>
          <BridgeTheGapButton
            onClick={handleRegister}
            value={"Register"}
            loading={isLoading}
          />
          <br />
          <Link
            to="/login"
            className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
          >
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}
