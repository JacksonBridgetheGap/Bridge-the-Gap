import HomePage from "../pages/HomePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";
import useUser from "../hooks/useUser.js";

export default function RootRoute() {
  const { user, isLoading } = useUser();

  if (isLoading)
    return (
      <div className={"flex flex-col items-center justify-center"}>
        <BridgeTheGapLoadingSpinner />
      </div>
    );

  return user ? <HomePage /> : <RegisterPage />;
}
