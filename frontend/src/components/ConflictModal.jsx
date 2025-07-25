import ConflictCard from "./ConflictCard.jsx";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import { useState } from "react";

export default function ConflictModal({ display, conflicts, confirm, cancel }) {
  const [confirmedConflicts, setConfirmedConflicts] = useState([]);

  const handleToggle = (id) => {
    setConfirmedConflicts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((conflictId) => conflictId !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <div
      className={`${display ? "block" : "hidden"} fixed inset-0 z-50 flex items-center justify-center bg-black/40`}
    >
      <div className="bg-white rounded-lg shadow-xl p-4">
        <h2 className="text-2xl font-bold">Conflict</h2>

        <p>
          There was a conflict with the data you entered. Please review
          conflicts.
        </p>

        <div className="flex flex-col gap-4 p-4">
          {conflicts.map((conflict) => {
            return (
              <div>
                <div className="bg-red-400 rounded-lg p-2 m-2 border border-red-500">
                  <ConflictCard conflict={conflict} />
                </div>
                <div className={"flex flex-row gap-4 justify-center"}>
                  <p>Ignore Conflict</p>
                  <input
                    type="checkbox"
                    id={conflict.id}
                    checked={confirmedConflicts.includes(conflict.id)}
                    onChange={() => handleToggle(conflict.id)}
                    className={"rounded-md"}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className={"text-gray-500"}>Ignore all conflicts to confirm</p>
        <div
          className="flex justify-center gap-4 p-2"
          style={{ width: "100%" }}
        >
          <BridgeTheGapButton
            value={"Add anyway"}
            onClick={confirm}
            disabled={confirmedConflicts.length !== conflicts.length}
          />
          <BridgeTheGapButton value={"Cancel"} onClick={cancel} />
        </div>
      </div>
    </div>
  );
}
