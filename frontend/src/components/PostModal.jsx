import "../styles/PostModal.css";
import { useState } from "react";
import BridgeTheGapTextInput from "./BridgeTheGapTextInput.jsx";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";

const emptyPost = {
  title: "",
  img: "/default_post_pic.png",
  description: "",
};

export default function PostModal({ displayMode, onPost, onClose }) {
  const [newPost, setNewPost] = useState(emptyPost);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setNewPost({
        ...newPost,
        img: `/${event.target.files[0].name}`,
      });
    }
  };

  const handleInputChange = (evt) => {
    setNewPost({
      ...newPost,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleClose = () => {
    setNewPost(emptyPost);
    onClose();
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onPost(newPost);
    onClose();
    setNewPost(emptyPost);
  };

  return (
    <section className={displayMode} onSubmit={handleSubmit}>
      <form className="modal-content">
        <span className="close" onClick={handleClose}>
          X
        </span>
        <h2>New Post</h2>
        <h4>Name Post:</h4>
        <BridgeTheGapTextInput
          type="text"
          name="title"
          onChange={handleInputChange}
          value={newPost.title}
          placeholder="New post..."
        />
        <h4>Add Image:</h4>
        <input type="file" className="img-input" onChange={handleFileChange} />
        <h4>Add a description:</h4>
        <textarea
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="description"
          onChange={handleInputChange}
          value={newPost.description}
          placeholder="How did i get here..."
        />
        <br />
        <BridgeTheGapButton value="Post It!" onClick={handleSubmit} />
      </form>
    </section>
  );
}
