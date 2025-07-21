import "../styles/PostList.css";
import Post from "./Post";
import { httpRequest } from "../utils/utils.js";
import { useEffect, useState } from "react";

export default function PostList({ group, posts, onOpen, openPost }) {
  const [prompt, setPrompt] = useState(group?.prompt ?? "");

  useEffect(() => {
    if (group?.prompt) {
      setPrompt(group.prompt);
      const PROMPT_URL = `/api/groups/${group.id}/prompt`;
      httpRequest(PROMPT_URL, "GET").then((res) => {
        if (res.message) {
          return;
        }
        setPrompt(res.prompt);
      });
    }
  }, [group]);

  if (posts) {
    return (
      <div className="flex gap-6 max-w-3/4 overflow-x-auto px-6 py-8 mx-4 my-6 rounded-xl border-l-6 border-l-blue-500 border border-gray-200 bg-white/70 backdrop-blur-md shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:shadow-lg">
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
    );
  }

  return (
    <div>
      <p>No post data</p>
    </div>
  );
}
