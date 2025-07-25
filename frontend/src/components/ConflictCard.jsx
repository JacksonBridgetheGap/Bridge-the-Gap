import "../styles/ToolTip.css";
import useUser from "../hooks/useUser.js";
import { useEffect, useState } from "react";
import MoveEventModal from "./MoveEventModal.jsx";

export default function ConflictCard({ conflict, remove }) {
  const [userConflict, setUserConflict] = useState(false);
  const [editEventDisplay, setEditEventDisplay] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (
      conflict.participants
        .map((participant) => participant.id)
        .includes(user.id)
    ) {
      setUserConflict(true);
    }
  }, [conflict, user]);

  const openModal = () => {
    setEditEventDisplay(true);
  };

  const closeModal = () => {
    setEditEventDisplay(false);
  };

  return (
    <div className={"flex flex-row justify-between"}>
      <h4>{conflict.text}</h4>
      <p>{`${new Date(conflict.start).toLocaleTimeString()} - ${new Date(conflict.end).toLocaleTimeString()}`}</p>
      <div className="flex flex-row gap-2">
        <div className={"tooltip"}>
          <div
            className={`${userConflict ? "bg-blue-600 border border-blue-700" : "bg-gray-600 border border-gray-700"} w-6 h-6 border-2 rounded-full cursor-pointer`}
          >
            O
          </div>
          <div className="tooltiptext">
            {conflict.participants.map((participant) => {
              return <p>{participant.username}</p>;
            })}
          </div>
        </div>
        {userConflict && (
          <div>
            <div
              className={
                "bg-blue-600 border border-blue-700 w-6 h-6 cursor-pointer"
              }
              onClick={openModal}
            >
              {`>`}
            </div>
            <MoveEventModal
              display={editEventDisplay}
              event={conflict}
              remove={remove}
              close={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
