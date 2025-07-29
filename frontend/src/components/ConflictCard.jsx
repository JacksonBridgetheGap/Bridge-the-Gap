import "../styles/ToolTip.css";
import useUser from "../hooks/useUser.js";
import { useEffect, useState } from "react";
import MoveEventModal from "./MoveEventModal.jsx";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";

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
      <p>
        <em>{`${new Date(conflict.start).toLocaleTimeString()} - ${new Date(conflict.end).toLocaleTimeString()}`}</em>
      </p>
      <div className="flex flex-row gap-2">
        <div className={"tooltip"}>
          <button
            className={
              "flex items-center px-3 py-0.3 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
            }
          >
            Attendees
          </button>
          <div className="tooltiptext">
            {conflict.participants.map((participant) => {
              return <p>{participant.username}</p>;
            })}
          </div>
        </div>
        {userConflict && conflict.groupID === null && (
          <div>
            <button
              onClick={openModal}
              className={
                "flex items-center px-3 py-0.3 text-sm rounded-md bg-blue-700 text-white hover:bg-blue-800"
              }
            >
              Resolve
            </button>
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
