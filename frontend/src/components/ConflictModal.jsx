import ConflictCard from "./ConflictCard.jsx";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";

export default function ConflictModal({ display, conflicts, confirm, cancel }) {
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

        <div className="flex flex-col gap-4 p-2">
          {conflicts.map((conflict) => {
            return (
              <div className="bg-red-400 rounded-lg p-2 m-2 border border-red-500">
                <ConflictCard conflict={conflict} />
              </div>
            );
          })}
        </div>
        <div
          className="flex justify-center gap-4 p-2"
          style={{ width: "100%" }}
        >
          <BridgeTheGapButton value={"Add anyway"} onClick={confirm} />
          <BridgeTheGapButton value={"Cancel"} onClick={cancel} />
        </div>
      </div>
    </div>
  );
}
