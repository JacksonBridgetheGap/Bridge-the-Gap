import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/group/:id",
    element: <GroupPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={routes} />,
);
