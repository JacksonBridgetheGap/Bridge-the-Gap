import "../styles/GroupModal.css";
import { useState } from "react";
import MemberSearch from "./MemberSearch";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const defaultGroup = {
  name: "",
  img: "/deafult_group_pic.png",
  tags: [],
  members: [],
};

const GROUP_TAG_OPTIONS = [
  { value: "hobbies", label: "Hobbies" },
  { value: "education", label: "Education" },
  { value: "gaming", label: "Gaming" },
  { value: "food", label: "Food" },
  { value: "health", label: "Health and Wellness" },
  { value: "travel", label: "Travel" },
  { value: "business", label: "Business" },
  { value: "pets", label: "Pets and Animals" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

export default function GroupModal({ displayMode, onClose, onCreate }) {
  const [newGroup, setNewGroup] = useState(defaultGroup);
  const animatedComponents = makeAnimated();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setNewGroup({
        ...newGroup,
        img: `/${event.target.files[0].name}`,
      });
    }
  };

  const handleInputChange = (evt) => {
    setNewGroup({
      ...newGroup,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleMemberChange = (members) => {
    setNewGroup({
      ...newGroup,
      members: members,
    });
  };

  const handleTagChange = (selectedTags) => {
    const values = selectedTags.map((tag) => tag.value);

    setNewGroup({
      ...newGroup,
      tags: values,
    });
  };

  const handleClose = () => {
    setNewGroup(defaultGroup);
    onClose();
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    onCreate(newGroup);
    onClose();
    setNewGroup(defaultGroup);
  };

  return (
    <section className={displayMode} onSubmit={handleSubmit}>
      <form className="modal-content">
        <span className="close" onClick={handleClose}>
          X
        </span>
        <h2>Create New Group:</h2>
        <h4>Name:</h4>
        <input
          type="text"
          name="name"
          onChange={handleInputChange}
          value={newGroup.name}
          placeholder="New Group..."
          required
        />
        <h4>Group Image:</h4>
        <input type="file" onChange={handleFileChange} />
        <h4>Add Tags (1 minimum):</h4>
        <Select
          options={GROUP_TAG_OPTIONS}
          isMulti
          components={animatedComponents}
          name={"tags"}
          onChange={handleTagChange}
        />
        <h4>Add Members to Groups:</h4>
        <MemberSearch onChange={handleMemberChange} displayMode={displayMode} />
        <input
          type="submit"
          value="Create New Group"
          className="submit-button"
        />
      </form>
    </section>
  );
}
