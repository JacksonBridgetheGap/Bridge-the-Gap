import GrouopCard from "./GroupCard";
import "../styles/SearchResults.css";
import useSearch from "../hooks/useSearch.js";
import useUserGroups from "../hooks/useUserGroups.js";
import { useEffect, useState } from "react";
import { httpRequest } from "../utils/utils.js";

const RECOMMENDATIONS_URL = "/api/groups/recommendations";

export function SearchResults() {
  const { groups } = useSearch();
  const [recommendations, setRecommendation] = useState([]);
  const { groups: userGroups, isLoading } = useUserGroups();

  useEffect(() => {
    httpRequest(RECOMMENDATIONS_URL, "GET").then((recommendations) => {
      setRecommendation(recommendations);
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h3>Recommend Groups For You...</h3>
      <div className={"recommendations"}>
        {recommendations.map((group) => (
          <GrouopCard
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
      <div className={"search-results"}>
        {groups?.map((group) => (
          <GrouopCard
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
