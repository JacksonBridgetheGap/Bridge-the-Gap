import GroupCard from "./GroupCard";
import "../styles/SearchResults.css";
import useSearch from "../hooks/useSearch.js";
import useUserGroups from "../hooks/useUserGroups.js";
import { useEffect, useState } from "react";
import { httpRequest } from "../utils/utils.js";
import useUser from "../hooks/useUser.js";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";

export function SearchResults() {
  const { groups } = useSearch();
  const { user } = useUser();
  const [recommendations, setRecommendation] = useState([]);
  const { groups: userGroups, isLoading } = useUserGroups();

  useEffect(() => {
    const RECOMMENDATIONS_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/recommendations`;
    httpRequest(RECOMMENDATIONS_URL, "GET").then((recommendations) => {
      setRecommendation(recommendations);
    });
  }, [user.id]);

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: "100vh" }}
      >
        <BridgeTheGapLoadingSpinner />
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-5 shadow-md dark:border-blue-400 dark:bg-blue-900/30">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-200 mb-3">
          Recommend Groups For You...
        </h3>
        <div className={"grid gap-3 sm:grid-cols-2 md:grid-cols-3"}>
          {recommendations.map((group) => (
            <GroupCard
              group={group}
              members={group.members}
              key={group.id}
              joinedGroup={userGroups.some(
                (userGroup) => userGroup.id === group.id,
              )}
              home={false}
            />
          ))}
        </div>
      </div>
      <p className="p-4 text-sm text-gray-600 dark:text-gray-300">
        {groups ? `${groups.length} results found...` : "Loading results..."}
      </p>
      <div className={"grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
        {groups?.map((group) => (
          <GroupCard
            group={group}
            members={group.members}
            key={group.id}
            joinedGroup={userGroups.some(
              (userGroup) => userGroup.id === group.id,
            )}
            home={false}
          />
        ))}
      </div>
    </div>
  );
}
