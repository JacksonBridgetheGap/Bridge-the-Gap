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
import { userGroupContext } from "../providers/UserGroupsProvider.jsx";

const GROUP_URL = "/api/groups";

function useCreateGroup() {
  const [isLoading, setIsLoading] = useState(true);

  const { groups, setGroups } = useContext(userGroupContext);
  const create = useCallback(
    (groupData) => {
      httpRequest(GROUP_URL, "POST", groupData)
        .then((group) => {
          setGroups([...groups, group]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [groups, setGroups],
  );

  return [create, isLoading];
}

function HomePage() {
  const [modalDisplay, setModalDisplay] = useState("modal-hidden");
  const [searching, setSearching] = useState(false);
  const [createGroup] = useCreateGroup();

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
      <div className="search-form">
        <Navagation onSearch={startSearch} onClear={endSearch} />
      </div>
      {searching ? (
        <SearchResults />
      ) : (
        <div className="home-content">
          <UserCalendar />
          <GroupList onOpen={openModal} />
          <GroupModal
            displayMode={modalDisplay}
            onClose={closeModal}
            onCreate={createGroup}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}

export default HomePage;
