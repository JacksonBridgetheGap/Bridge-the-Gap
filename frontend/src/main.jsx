import { createRoot } from "react-dom/client";
import "./index.css";
import { GroupProvider } from "./providers/GroupProvider.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";
import { UserGroupProvider } from "./providers/UserGroupsProvider.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { SearchResultsProvider } from "./providers/SearchResultsProvider.jsx";
import AppRoutes from "./AppRoutes.jsx";

createRoot(document.getElementById("root")).render(
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
  </AuthProvider>,
);
