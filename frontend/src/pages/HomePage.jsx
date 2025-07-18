import "./HomePage.css";
import { useState, useCallback, useContext } from "react";
import { httpRequest } from "../utils/utils";
import Header from "../components/Header";
import { Navagation } from "../components/Navagation";
import UserCalendar from "../components/UserCalendar.jsx";
import GroupModal from "../components/GroupModal";
import GroupList from "../components/GroupList";
import { SearchResults } from "../components/SearchResults.jsx";
import Footer from "../components/Footer";
import { userGroupsContext } from "../context/UserGroupsContext.jsx";

const GROUP_URL = "/api/groups";

function HomePage() {
  const [modalDisplay, setModalDisplay] = useState("modal-hidden");
  const [searching, setSearching] = useState(false);

  function useCreateGroup() {
    const [isLoading, setIsLoading] = useState(false);

    const { groups, setGroups } = useContext(userGroupsContext);
    const create = useCallback(
      async (groupData) => {
        setIsLoading(true);
        httpRequest(GROUP_URL, "POST", groupData)
          .then((group) => {
            setGroups([...groups, group]);
            closeModal();
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      [groups, setGroups],
    );

    return [create, isLoading];
  }

  const [createGroup, isLoading] = useCreateGroup();

  const openModal = () => {
    setModalDisplay("modal-display");
  };

  const closeModal = () => {
    setModalDisplay("modal-hidden");
  };

  const startSearch = () => {
    setSearching(true);
  };

  const endSearch = () => {
    setSearching(false);
  };

  return (
    <main>
      <Header />
      <div className="flex flex-row justify-center max-w mx-auto p-2 m-auto">
        <Navagation onSearch={startSearch} onClear={endSearch} />
      </div>
      {searching ? (
        <SearchResults />
      ) : (
        <div className="flex flex-row items-center justify-center space-y-4 w-full">
          <UserCalendar />
          <GroupList onOpen={openModal} />
          <GroupModal
            displayMode={modalDisplay}
            onClose={closeModal}
            onCreate={createGroup}
            loading={isLoading}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}

export default HomePage;
