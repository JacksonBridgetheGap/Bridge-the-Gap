import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { httpRequest } from "../utils/utils";
import Header from "../components/Header";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";
import MembersList from "../components/MembersList";
import Footer from "../components/Footer";
import "./GroupPage.css";
import GroupCalendar from "../components/GroupCalendar.jsx";
import { DateTime } from "luxon";

function GroupPage() {
  const params = useParams();

  const [group, setGroup] = useState(null);
  const [modalDisplay, setModalDisplay] = useState("modal-hidden");

  useEffect(() => {
    const GROUP_URL = `/api/groups/${params.id}`;
    httpRequest(GROUP_URL, "GET").then((group) => {
      setGroup({
        ...group,
        events: group.events.map((event) => {
          event.start = DateTime.fromISO(event.start, { zone: "utc" })
            .toLocal()
            .toISO({ suppressMilliseconds: true, includeOffset: false });
          event.end = DateTime.fromISO(event.end, { zone: "utc" })
            .toLocal()
            .toISO({ suppressMilliseconds: true, includeOffset: false });
          return event;
        }),
      });
    });
  }, [params.id]);

  const createPost = async (postData) => {
    const POST_URL = `/api/groups/${params.id}/posts`;

    const newPost = await httpRequest(POST_URL, "POST", postData);
    setGroup({
      ...group,
      posts: [...group.posts, newPost],
    });
  };

  const openModal = () => {
    setModalDisplay("modal-display");
  };

  const closeModal = () => {
    setModalDisplay("modal-hidden");
  };

  return (
    <main>
      <Header />
      <h2 className="text-5xl font-bold dark:text-white">
        {group ? group.name : "Loading Data..."}
      </h2>
      <Link to="/" className="back-button">
        {"<--"}
      </Link>
      <PostList
        posts={group?.posts ?? []}
        onOpen={openModal}
        group={group ? group : null}
      />
      <GroupCalendar group={group} setGroup={setGroup} />
      <MembersList members={group ? group.members : []} />
      <Footer />
      <PostModal
        onPost={createPost}
        displayMode={modalDisplay}
        onClose={closeModal}
      />
    </main>
  );
}

export default GroupPage;
