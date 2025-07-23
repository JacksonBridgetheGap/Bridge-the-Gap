import { createRoot } from "react-dom/client";
import "./index.css";
import { GroupProvider } from "./providers/GroupProvider.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";
import { UserGroupProvider } from "./providers/UserGroupsProvider.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { SearchResultsProvider } from "./providers/SearchResultsProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./AppRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT}>
    <AuthProvider>
      <UserProvider>
        <UserGroupProvider>
          <SearchResultsProvider>
            <GroupProvider>
              <AppRoutes />
            </GroupProvider>
          </SearchResultsProvider>
        </UserGroupProvider>
      </UserProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
);
