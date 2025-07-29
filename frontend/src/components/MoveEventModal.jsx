import "../styles/ToolTip.css";
import { useEffect, useState } from "react";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import useUser from "../hooks/useUser.js";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";

export default function MoveEventModal({ display, event, remove, close }) {
  const [newTime, setNewTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const OPTIMAL_TIME_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/optimalEvent`;
    const currentEventLength =
      (new Date(event.end) - new Date(event.start)) / (1000 * 60);
    setIsLoading(true);
    httpRequest(OPTIMAL_TIME_URL, "POST", { currentEventLength })
      .then((response) => {
        const localSuggested = convertEventsToLocal([response.slot]);
        setNewTime(localSuggested[0]);
      })
      .finally(() => setIsLoading(false));
  }, [event.end, event.start, user.id, display]);

  const moveEvent = async () => {
    const MOVE_EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/events/${event.id}`;
    setIsLoading(true);
    httpRequest(MOVE_EVENT_URL, "PUT", {
      start: newTime.start,
      end: newTime.end,
    })
      .then((response) => {
        remove(response.event.id);
        close();
      })
      .finally(() => setIsLoading(false));
  };

  if (display) {
    return (
      <div
        className={
          "absolute z-10 mt-2 w-60 h-50 p-3 bg-white rounded shadow-xl border text-sm right-60 m-4"
        }
      >
        <span className={"close"} onClick={close}>
          X
        </span>
        <div className="flex flex-col items-center justify-center">
          <p className={"text-2xl"}>Move Event</p>
          {isLoading ? (
            <BridgeTheGapLoadingSpinner />
          ) : (
            <div className={"p-3"}>
              <p>{`Next Best Start: ${new Date(newTime.start).toLocaleString()}`}</p>
              <p>{`Next Best End: ${new Date(newTime.end).toLocaleString()}`}</p>
            </div>
          )}
          <BridgeTheGapButton
            value={"Confirm"}
            onClick={moveEvent}
            loading={isLoading}
          />
        </div>
      </div>
    );
  }
}
