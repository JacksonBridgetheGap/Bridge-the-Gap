import { useContext } from "react";
import { userContext } from "../context/UserContext.jsx";
import HomePage from "../pages/HomePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

export default function RootRoute() {
  const { user } = useContext(userContext);

  console.log(user);

  return user ? <HomePage /> : <RegisterPage />;
}
