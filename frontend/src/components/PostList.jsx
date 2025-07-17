import "../styles/PostList.css";
import Post from "./Post";
import { httpRequest } from "../utils/utils.js";
import { useEffect, useState } from "react";

export default function PostList({ group, posts, onOpen }) {
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
      <div className="post-container">
        <div className="prompt-box">
          <h3>Weekly Prompt:</h3>
          <p>{prompt}</p>
          <button className="add-post-button" onClick={onOpen}>
            +
          </button>
        </div>

        <div className="post-list">
          {posts.map((post) => {
            return <Post post={post} />;
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
