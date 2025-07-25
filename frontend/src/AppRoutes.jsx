import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RootRoute from "./components/RootRoute.jsx";

export default function AppRoutes() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootRoute />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/group/:id",
          element: <GroupPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
