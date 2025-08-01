import "../styles/PostList.css";
import Post from "./Post";
import { httpRequest } from "../utils/utils.js";
import { useEffect, useState } from "react";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";
import GroupTimer from "./GroupTimer.jsx";

export default function PostList({ group, posts, onOpen, openPost }) {
  const [prompt, setPrompt] = useState(group?.prompt ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (group?.prompt || group?.id) {
      setPrompt(group.prompt);
      const PROMPT_URL = `${import.meta.env.VITE_BASE_URL}/api/groups/${group.id}/prompt`;
      httpRequest(PROMPT_URL, "GET")
        .then((res) => {
          if (res.message) {
            setLoading(false);
            return;
          }
          setPrompt(res.prompt);
        })
        .finally(() => setLoading(false));
    }
  }, [group]);

  if (group == null || loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <BridgeTheGapLoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={
        "flex flex-col justify-center items-center space-x-4 max-w-3/4"
      }
    >
      <GroupTimer lastRefresh={new Date(group.promptLastUpdate)} />
      <div className="posts flex gap-6 max-w-full overflow-x-auto px-6 py-8 mx-4 my-6 rounded-xl border-l-6 border-l-blue-500 border border-gray-200 bg-white/70 backdrop-blur-md shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:shadow-lg">
        <div className="min-w-[200px] max-h-[30vh] w-[15em] overflow-y-auto rounded-lg border border-gray-300 bg-blue-50 p-4 text-sm text-gray-700 shadow-sm dark:border-gray-600 dark:bg-blue-900/40 dark:text-gray-100">
          <h3>Weekly Prompt:</h3>
          <p>{prompt}</p>
          <button className="add-post-button" onClick={onOpen}>
            +
          </button>
        </div>

        <div className="flex gap-4">
          {posts.map((post) => {
            return <Post post={post} openPost={openPost} key={post.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
