import "../styles/ProfileDetails.css";
import useUser from "../hooks/useUser.js";
import { useState } from "react";

export default function ProfileDetails({ onUpdate }) {
  const { user } = useUser();
  const [newUser, setNewUser] = useState({
    username: user.username,
    photo: null,
    location: user.location,
    email: user.email,
  });

  const handleInputChange = (evt) => {
    setNewUser({
      ...newUser,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setNewUser({
        ...newUser,
        photo: "/" + event.target.files[0].name,
      });
    }
  };

  return (
    <div className="profile-details">
      <h3>User Information</h3>
      <h5>Name</h5>
      <input
        type="text"
        name="username"
        value={newUser.username}
        placeholder="Enter Name..."
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />{" "}
      <br />
      {
        //If I get some time I want to use react-dropzone to make a better file upload process for users
      }
      <h5>Profile Image</h5>
      <input
        type="file"
        name="photo"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      />
      {newUser.photo && (
        <img
          src={newUser.photo}
          alt="Profile Pic"
          className={"uploaded-preview"}
        />
      )}{" "}
      <br />
      <h5>Location</h5>
      <input
        type="text"
        name="location"
        value={newUser.location}
        placeholder="Enter Location..."
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />{" "}
      <br />
      <h5>Email</h5>
      <input
        type="text"
        name="email"
        value={newUser.email}
        placeholder="Enter Email..."
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />{" "}
      <br />
      <button
        onClick={() => onUpdate(newUser)}
        className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Save Changes
      </button>
    </div>
  );
}
