import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { httpRequest } from "../utils/utils";
import Header from "../components/Header";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";
import MembersList from "../components/MembersList";
import Footer from "../components/Footer";

import "./GroupPage.css";

function GroupPage() {
  const params = useParams();

  const [group, setGroup] = useState({});
  const [modalDisplay, setModalDisplay] = useState("modal-hidden");

  useEffect(() => {
    const GROUP_URL = `/api/groups/${params.id}`;
    httpRequest(GROUP_URL, "GET").then((group) => {
      setGroup(group);
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
      <h2 className="group-title">{group ? group.name : "Loading Data..."}</h2>
      <Link to="/" className="back-button">
        {"<--"}
      </Link>
      <PostList
        posts={group?.posts ?? []}
        onOpen={openModal}
        group={group ? group : null}
      />
      <MembersList members={group ? group.members : []} />
      {
        //Calendar
      }
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
