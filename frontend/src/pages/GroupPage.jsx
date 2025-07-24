import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { httpRequest } from "../utils/utils";
import Header from "../components/Header";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";
import PostView from "../components/PostView.jsx";
import MembersList from "../components/MembersList";
import Footer from "../components/Footer";
import "./GroupPage.css";
import GroupCalendar from "../components/GroupCalendar.jsx";
import { DateTime } from "luxon";
import BackButton from "../components/BackButtons.jsx";
import GroupTimer from "../components/GroupTimer.jsx";
import BridgeTheGapLoadingSpinner from "../components/BridgeTheGapLoadingSpinner.jsx";

function GroupPage() {
  const params = useParams();

  const [group, setGroup] = useState(null);
  const [modalDisplay, setModalDisplay] = useState("modal-hidden");
  const [inPostView, setInPostView] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const GROUP_URL = `${import.meta.env.VITE_BASE_URL}/api/groups/${params.id}`;
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
    const POST_URL = `${import.meta.env.VITE_BASE_URL}/api/groups/${params.id}/posts`;

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

  const viewPost = (post) => {
    setPost(post);
    setInPostView(true);
  };

  const closePostView = () => {
    setInPostView(false);
    setPost(null);
  };

  const nextPost = () => {
    const postIndex = group.posts.findIndex((p) => p.id === post.id);
    if (postIndex === group.posts.length - 1) {
      setPost(group.posts[0]);
    }
    setPost(group.posts[postIndex + 1]);
  };

  const prevPost = () => {
    const postIndex = group.posts.findIndex((p) => p.id === post.id);
    if (postIndex === 0) {
      setPost(group.posts[group.posts.length - 1]);
    }
    setPost(group.posts[postIndex - 1]);
  };

  return (
    <main>
      <Header />
      <BackButton />
      <div className="flex flex-col items-center justify-center space-y-4 p-4 gap-4 w-full">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 p-2 border-b-4">
          {group ? group.name : "Loading Data..."}
        </h2>
        {group ? (
          <GroupTimer lastRefresh={new Date(group.promptLastUpdate)} />
        ) : (
          <BridgeTheGapLoadingSpinner />
        )}
        <div className="posts flex flex-row justify-center items-center space-x-4 max-w-3/4">
          <PostList
            posts={group?.posts ?? []}
            onOpen={openModal}
            group={group ? group : null}
            openPost={viewPost}
          />
        </div>
        <div className="group-calendar flex flex-row justify-center items-center space-x-4 max-w-4/5">
          <GroupCalendar group={group} setGroup={setGroup} />
        </div>
        <MembersList members={group ? group.members : []} />
      </div>
      <Footer />
      <PostModal
        onPost={createPost}
        displayMode={modalDisplay}
        onClose={closeModal}
      />
      <PostView
        isOpen={inPostView}
        post={post}
        onClose={closePostView}
        nextPost={nextPost}
        prevPost={prevPost}
      />
    </main>
  );
}

export default GroupPage;
