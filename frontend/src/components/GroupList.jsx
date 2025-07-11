import "../styles/GroupList.css";
import GroupCard from "./GroupCard";
import useUserGroups from "../hooks/useUserGroups.js";

export default function GroupList({ onOpen }) {
  const { groups, isLoading } = useUserGroups();
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="group-list">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 px-6 font-medium  transition-all [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
        onClick={onOpen}
      >
        Create
      </button>
      {groups?.map((group) => {
        return (
          <GroupCard
            group={group}
            key={group.id}
            members={group.members}
            joinedGroup={true}
            home={true}
          />
        );
      })}
    </section>
  );
}
